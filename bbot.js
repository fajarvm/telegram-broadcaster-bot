const Configs = require('./configs');
const Constants = require('./constants');
const fs = require('fs');
const jsonfile = require('jsonfile');
jsonfile.spaces = 2;
const NO_FILE_DIR_CODE = 'ENOENT'; // Error code: no such file or directory

// Telegram bot setup
const TeleBot = require('telebot');
const bot = new TeleBot({
  token: Configs.TELEGRAM_BOT_API_TOKEN,
  polling: {
    interval: Configs.TELEGRAM_BOT_POLLING_INTERVAL_MS,
    timeout: Configs.TELEGRAM_BOT_POLLING_TIMEOUT,
    limit: Configs.TELEGRAM_BOT_POLLING_LIMIT,          // Limits the number of updates to be retrieved.
    retryTimeout: Configs.TELEGRAM_BOT_RETRY_TIMEOUT_MS // Reconnecting timeout (in ms).
  },
  allowedUpdates: [],
  usePlugins: ['askUser', 'floodProtection', 'shortReply'],
  pluginFolder: Configs.TELEBOT_PLUGINS_DIR,
  pluginConfig: {
    floodProtection: {
      interval: Configs.TELEBOT_ANTI_FLOOD_INTERVAL,
      message: Constants.ANTI_FLOOD_MESSAGE
    }
  }
});

bot.on('/start', msg => msg.reply.text(Constants.HELP));

bot.on(/^\/help$/, msg => msg.reply.text(Constants.HELP));

bot.on(/^\/help publisher$/, msg => msg.reply.text(Constants.HELP_PUBLISHER));

bot.on(/^\/subscribe$/, msg => msg.reply.text(Constants.SUBSCRIBE_NO_PUBLISHER));

bot.on(/^\/unsubscribe$/, msg => msg.reply.text(Constants.UNSUBSCRIBE_NO_PUBLISHER));

// Note: wrap the text between grave accents (this symbol ->`) to allow using variables
bot.on('/register', msg => {
  const userId = msg.from.id;
  const userName = msg.from.username;

  if (isNullOrEmpty(userName)) {
    return bot.sendMessage(userId, Constants.REGISTER_NO_USERNAME);
  }

  // publisher's data file
  let fileName = Configs.FILE_PREFIX + userId + Configs.FILE_EXT;
  let file = Configs.DATABASE_DIR + fileName;
  let userIdString = `${ userId }`;
  let publisherData = {
    publisher: {
      id: userIdString,
      username: userName
    },
    subscribers: []
  };

  try {
    jsonfile.readFile(file, (err, readObj) => {
      createPublisherFile(err, readObj, publisherData, file, userIdString);
    });
  } catch (err) {
    // return bot.sendMessage(userId, Constants.REGISTER_FAILED + `\nError: ${ err }`); // For debugging purposes only
    return bot.sendMessage(userId, Constants.REGISTER_FAILED);
  }
});

bot.on('/unregister', msg => msg.reply.text(Constants.DEREGISTER_CONFIRM, {ask: 'unregister'}));

// Event handler: unregister
bot.on('ask.unregister', msg => {
  const userId = msg.from.id;
  const unregisterText = msg.text;

  if (Constants.DEREGISTER_CONFIRMATION_CODE === unregisterText) {
    if (isNull(userId) || userId === 0) {
      return;
    }

    // publisher's data file
    let fileName = Configs.FILE_PREFIX + userId + Configs.FILE_EXT;
    let file = Configs.DATABASE_DIR + fileName;

    // delete file
    try {
      fs.unlink(file, (err) => {
        if (err) throw err;
      });
    } catch (err) {
      // return bot.sendMessage(userId, Constants.DEREGISTER_FAILED + `\nError: ${ err }`); // For debugging purposes only
      return bot.sendMessage(userId, Constants.DEREGISTER_FAILED);
    }
    return bot.sendMessage(userId, Constants.DEREGISTER_SUCCESSFUL);
  } else {
    return bot.sendMessage(userId, Constants.DEREGISTER_CANCELLED);
  }
});

// handle input: /subscribe <username>
bot.on(/^\/subscribe ([a-zA-Z0-9_]+)$/, (msg, props) => {
  const userId = msg.from.id;
  const publisherId = props.match[1];

  // Uncomment if username is mandatory for subscriptions
  // if (isNullOrEmpty(userName)) {
  //   return bot.sendMessage(userId, Constants.SUBSCRIBE_NO_USERNAME);
  // }

  if (isNull(publisherId)) {
    return bot.sendMessage(userId, Constants.SUBSCRIBE_NO_PUBLISHER);
  }

  // publisher's data file
  let fileName = Configs.FILE_PREFIX + publisherId + Configs.FILE_EXT;
  let file = Configs.DATABASE_DIR + fileName;

  try {
    jsonfile.readFile(file, (err, readObj) => {
      addSubscriberToPublisher(err, readObj, file, userId, publisherId);
    });
  } catch (err) {
    // return bot.sendMessage(userId, Constants.SUBSCRIBE_FAILED + `\nError: ${ err }`); // For debugging purposes only
    return bot.sendMessage(userId, Constants.SUBSCRIBE_FAILED);
  }
});

// handle input: /unsubscribe <username>
bot.on(/^\/unsubscribe ([a-zA-Z0-9_]+)$/, (msg, props) => {
  const userId = msg.from.id;
  const publisherId = props.match[1];

  // Uncomment if username is mandatory for subscriptions
  // if (isNullOrEmpty(userName)) {
  //   return bot.sendMessage(userId, Constants.UNSUBSCRIBE_NO_USERNAME);
  // }

  if (isNull(publisherId)) {
    return bot.sendMessage(userId, Constants.UNSUBSCRIBE_NO_PUBLISHER);
  }

  // publisher's data file
  let fileName = Configs.FILE_PREFIX + publisherId + Configs.FILE_EXT;
  let file = Configs.DATABASE_DIR + fileName;

  try {
    jsonfile.readFile(file, (err, readObj) => {
      removeSubscriberToPublisher(err, readObj, file, userId, publisherId);
    });
  } catch (err) {
    // return bot.sendMessage(userId, Constants.UNSUBSCRIBE_FAILED + `\nError: ${ err }`); // Debugging
    return bot.sendMessage(userId, Constants.UNSUBSCRIBE_FAILED);
  }
});

bot.on('/post', msg => {
  const userId = msg.from.id;

  // publisher's data file
  let fileName = Configs.FILE_PREFIX + userId + Configs.FILE_EXT;
  let file = Configs.DATABASE_DIR + fileName;

  try {
    jsonfile.readFile(file, (err, obj) => {
      if (err && err.code !== NO_FILE_DIR_CODE) {
        throw err;
      }

      if ((err && err.code === NO_FILE_DIR_CODE) || isNull(obj) || isNull(obj.publisher)) {
        return bot.sendMessage(userId, Constants.PUBLISHER_POST_UNAUTHORISED);
      }

      if (isNull(obj.subscribers) || obj.subscribers.length < 1) {
        return bot.sendMessage(userId, Constants.PUBLISHER_POST_NO_SUBSCRIBERS);
      }

      return bot.sendMessage(userId, Constants.PUBLISHER_POST, {ask: 'post'});
    });
  } catch (err) {
    return bot.sendMessage(userId, Constants.PUBLISHER_POST_FAILED);
  }
});

// Event handler: post
bot.on('ask.post', (msg) => {
  const userId = msg.from.id;
  const postText = msg.text;

  if (isNullOrEmpty(postText) || postText.length > Configs.BROADCAST_CHARACTER_LIMIT) {
    return bot.sendMessage(userId, Constants.PUBLISHER_POST_RETRY, {ask: 'post'});
  } else {
    try {
      // publisher's data file
      let fileName = Configs.FILE_PREFIX + userId + Configs.FILE_EXT;
      let file = Configs.DATABASE_DIR + fileName;

      jsonfile.readFile(file, (err, obj) => {
        sendPostToSubscribers(err, obj, userId, postText);
      });
    } catch (err) {
      return bot.sendMessage(userId, Constants.PUBLISHER_POST_FAILED);
    }
  }
});


bot.start();

// --------------------------------------------- helper methods -----------------------------------------------------//

function createPublisherFile(err, readObj, writeObj, file, userId) {
  if (err && err.code !== NO_FILE_DIR_CODE) {
    throw err;
  }

  if (!isNull(readObj) && !isNull(readObj.publisher) && (readObj.publisher.id === userId)) {
    // publisher already registered
    return bot.sendMessage(userId, Constants.REGISTER_ALREADY_EXIST);
  }

  // file not found, create one
  if (err && err.code === NO_FILE_DIR_CODE) {
    try {
      jsonfile.writeFileSync(file, writeObj);

      return bot.sendMessage(userId, Constants.REGISTER_SUCCESSFUL + `${ userId }`);
    } catch (e) {
      throw e;
    }
  }
}

function addSubscriberToPublisher(err, readObj, file, userId, publisherId) {
  if (err && err.code !== NO_FILE_DIR_CODE) {
    // return bot.sendMessage(userId, Constants.SUBSCRIBE_FAILED + `\nError: ${ err }`); // Debugging
    return bot.sendMessage(userId, Constants.SUBSCRIBE_FAILED);
  }

  if ((err && err.code === NO_FILE_DIR_CODE) || isNull(readObj) || isNull(readObj.publisher)) {
    return bot.sendMessage(userId, Constants.SUBSCRIBE_FAILED + `\nError: publisher data is not found`);
  }

  let userIdString = `${ userId }`;
  if (isNull(readObj.subscribers) || readObj.subscribers.length < 1) {
    readObj.subscribers = [userIdString];
  } else {
    for (let sub of readObj.subscribers) {
      if (userIdString === sub) {
        return bot.sendMessage(userId, Constants.SUBSCRIBE_ALREADY_EXIST);
      }
    }

    readObj.subscribers.push(userIdString);
  }

  try {
    jsonfile.writeFileSync(file, readObj);
  } catch (e) {
    throw e;
  }

  return bot.sendMessage(userId, Constants.SUBSCRIBE_SUCCESSFUL + `${ publisherId }`);
}

function removeSubscriberToPublisher(err, readObj, file, userId, publisherId) {
  if (err && err.code !== NO_FILE_DIR_CODE) {
    // return bot.sendMessage(userId, Constants.UNSUBSCRIBE_FAILED + `\nError: ${ err }`); // Debugging
    return bot.sendMessage(userId, Constants.UNSUBSCRIBE_FAILED);
  }

  if ((err && err.code === NO_FILE_DIR_CODE) || isNull(readObj) || isNull(readObj.publisher)) {
    return bot.sendMessage(userId, Constants.UNSUBSCRIBE_FAILED + '\nError: publisher data is not found');
  }

  if (isNull(readObj.subscribers) || (readObj.subscribers.length < 1)) {
    return bot.sendMessage(userId, Constants.UNSUBSCRIBE_SUCCESSFUL + `${ publisherId }`);
  }

  let idx = 0;
  let userIdString = `${ userId }`;
  for (let sub of readObj.subscribers) {
    if (userIdString === sub) {
      readObj.subscribers.splice(idx, 1);

      try {
        jsonfile.writeFileSync(file, readObj);
      } catch (e) {
        throw e;
      }

      return bot.sendMessage(userId, Constants.UNSUBSCRIBE_SUCCESSFUL + `${ publisherId }`);
    }
    idx++;
  }
}

function sendPostToSubscribers(err, obj, userId, message) {
  if (err && err.code !== NO_FILE_DIR_CODE) {
    throw err;
  }

  if ((err && err.code === NO_FILE_DIR_CODE) || isNull(obj) || isNull(obj.publisher)) {
    return bot.sendMessage(userId, Constants.PUBLISHER_POST_UNAUTHORISED);
  }

  if (isNull(obj.subscribers) || obj.subscribers.length < 1) {
    return bot.sendMessage(userId, Constants.PUBLISHER_POST_NO_SUBSCRIBERS);
  }

  // send messages
  let postMessage = 'From @' + obj.publisher.username + ': ' + message;
  let totalSub = obj.subscribers.length;
  let lastIndex = totalSub - 1;
  for (let i = 0; i <= lastIndex; i++) {
    setTimeout(function() {
      sendMessageToUser(userId, obj.subscribers[i], postMessage, (i === lastIndex));
    }, (i * Configs.BROADCAST_INTERVAL_MS));
  }
  return bot.sendMessage(userId, Constants.PUBLISHER_POST_IN_QUEUE + totalSub);
}

function sendMessageToUser(publisherId, subscriberId, message, last) {
  bot.sendMessage(subscriberId, message);

  if (last) {
    bot.sendMessage(publisherId, Constants.PUBLISHER_POST_COMPLETED);
  }
}

function isNull(val) {
  return val === undefined || val === null;
}

function isEmptyString(val) {
  return val.trim() === "";
}

function isNullOrEmpty(val) {
  return isNull(val) || isEmptyString(val);
}
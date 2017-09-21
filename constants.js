module.exports = Object.freeze({
  ANTI_FLOOD_MESSAGE: 'Too many messages in a short period of time. Please try again later.',

  HELP: 'Use /subscribe <publisherID> to start receiving notification messages from that publisher. ' +
  '\nUse /unsubscribe <publisherID> to stop receiving any future notification messages. ' +
  '\nType /help to show this message again.',

  HELP_PUBLISHER: 'Use /register to register yourself as a publisher. You can then use /post to send a message to your subscribers. ' +
  '\nUse /unregister to deregister yourself as a publisher. ' +
  '\nType /help publisher to show this message again.',

  // Subscribe operations
  SUBSCRIBE_NOT_FOUND: 'No publisher found with that user name. Please make sure that the username is correct and has no @ symbol infront of it. Example: /subscribe 1234567',
  SUBSCRIBE_NO_PUBLISHER: 'Please provide the publisherID. Example: /subscribe 1234567',
  SUBSCRIBE_NO_USERNAME: 'You need to have a username to subscribe. Create a username first and try again later.',
  SUBSCRIBE_SUCCESSFUL: 'You are now subscribed to the publisher: ',
  SUBSCRIBE_ALREADY_EXIST: 'You are already subscribed to this publisher.',
  SUBSCRIBE_FAILED: 'There was an error.',

  // Unsubscribe operations
  UNSUBSCRIBE_NOT_FOUND: 'No publisher found with that user name. Please make sure that the username is correct and has no @ symbol infront of it. Example: /unsubscribe 1234567',
  UNSUBSCRIBE_NO_PUBLISHER: 'Please provide the publisherID. Example: /unsubscribe 1234567',
  UNSUBSCRIBE_NO_USERNAME: 'You need to have a username. Create a username first and try again later.',
  UNSUBSCRIBE_SUCCESSFUL: 'You are no longer subscribed to the publisher: ',
  UNSUBSCRIBE_FAILED: 'There was an error.',

  // Register operations
  REGISTER_SUCCESSFUL: 'You are now a publisher. Let other users subscribe to you by using the command: /subscribe ',
  REGISTER_FAILED: 'There was an error registering. Please try again later or contact the author.',
  REGISTER_ALREADY_EXIST: 'You are already registered as a publisher.',
  REGISTER_NO_USERNAME: 'You need to have a username to register yourself as a publisher. Create a username first and try again later.',

  // Deregister operations
  DEREGISTER_CONFIRM: 'You are about to deregister yourself as a publisher. Your subscribers list will be removed. This action is irreversible. Are you sure you want to do this? Type \'YES, I AM\' to proceed.',
  DEREGISTER_SUCCESSFUL: 'Deregistration successful. You are no longer registered as a publisher and your subscribers list has been removed.',
  DEREGISTER_FAILED: 'There was an error deregistering. Please try again later or contact the author.',
  DEREGISTER_CANCELLED: 'Could not process. Deregistration cancelled.',
  DEREGISTER_CONFIRMATION_CODE: 'YES, I AM',

  PUBLISHER_POST: 'Type in the message you want to sent to your subscribers. It may not exceed 3000 characters.',
  PUBLISHER_POST_NO_SUBSCRIBERS: 'You cannot post. You don\'t have any subscribers.',
  PUBLISHER_POST_UNAUTHORISED: 'You cannot post. You are not a publisher.',
  PUBLISHER_POST_FAILED: 'There was an error.',
  PUBLISHER_POST_RETRY: 'The message to be posted may not be empty or contains more than 3000 character. Please type the text again.',
  PUBLISHER_POST_IN_QUEUE: 'Your message is queued and will be posted to all of your subscribers soon. Your total subscribers: ',
  PUBLISHER_POST_COMPLETED: 'Your message has been posted to all of your subscribers.'
});

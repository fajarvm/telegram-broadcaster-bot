## Introduction
A Node.js bot for Telegram (https://telegram.org) that allows users to broadcast private messages through publish-subscribe system.
The Telegram Bot API (https://core.telegram.org/bits/api) currently does not provide a way to do this. This bot facilitates users in that regard.

IMPORTANT: Please keep in mind that Telegram limits the frequency of messages a bot can send to (multiple) users. Read more about this limitation: https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this

### Available commands
**For subscribers:**  
`/help` Show help text for subscribers.  
`/subscribe <publisherId>` Subscribe yourself to a publisher to start receiving private messages broadcast.  
`/unsubscribe <publisherId>` Unsubscribe yourself from a publisher.

**For publishers:**  
`/help publisher` Show help text for publishers.  
`/register` Register yourself as a publisher.  
`/unregister` Deregister yourself as a publisher. Will also delete subscribers list. Note: this action is irreversible.  
`/post` Write and post a message (of maximum 3500 characters) to all subscribers. The bot will notify the publisher when the message has been sent to all subscribers.

## Installation
Checkout the source code, locate the project root directory and do an npm package install and run the app normally:
```npm
npm install
npm start
```

Or, run the app as a daemon using pm2:
```npm
pm2 start bbot.js
```

## License
The MIT or GPL-3.0 license

**MIT License (MIT)**  
TL;DR quick summary: https://tldrlegal.com/license/mit-license  
Full-text: https://opensource.org/licenses/MIT

**GNU General Public License version 3.0 (GPL-3.0)**  
TL;DR quick summary: https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)
Full-text: https://opensource.org/licenses/GPL-3.0
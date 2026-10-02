# YT Tracker Trimmer

A lightweight Discord bot that detects YouTube links containing the `si` sharing/tracking parameter and replies with a cleaned version of the URL.

Rather than deleting or modifying users' messages, YT Tracker Trimmer leaves the original message intact and provides a cleaned link in a reply, along with a polite reminder to remove unnecessary tracking/share parameters when possible.

## Example

When a user posts:

```text
https://youtu.be/dQw4w9WgXcQ?si=ExampleTrackingParameter
```

YT Tracker Trimmer replies with:

```text
🧹 Cleaned YouTube link:
https://youtu.be/dQw4w9WgXcQ

Please remove unnecessary tracking/share parameters from links when possible.
```

Other useful YouTube query parameters are preserved. For example:

```text
https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&si=ExampleTrackingParameter
```

is cleaned to:

```text
https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
```

Links that do not contain an `si` parameter are ignored.

## Features

- Detects YouTube and `youtu.be` links in ordinary Discord messages.
- Removes the `si` query parameter.
- Preserves other URL parameters, such as timestamps and playlist information.
- Supports multiple tracked YouTube links in a single message.
- Replies directly to the original message without pinging its author.
- Does not delete, edit, or otherwise modify user messages.
- Ignores messages from bots.
- Requires no database or persistent storage.
- Requires no moderation or administrative permissions.

## Requirements

- Node.js 18 or newer
- A Discord application with a bot user
- `discord.js`
- `dotenv`

The Discord bot requires the following Gateway intents:

- Guilds
- Guild Messages
- Message Content

**Message Content Intent must also be enabled under Privileged Gateway Intents in the Discord Developer Portal.**

The bot requires the following server/channel permissions:

- View Channels
- Send Messages
- Read Message History

Additional moderation or administrative permissions are not required.

## Installation

Clone the repository and install its dependencies:

```bash
git clone <repository-url>
cd yt-tracker-trimmer
npm install
```

Copy `.env.example` to `.env` and populate the appropriate values:

```text
APP_ID=
DISCORD_TOKEN=
PUBLIC_KEY=
```

`DISCORD_TOKEN` is required for the current bot functionality.

`APP_ID` and `PUBLIC_KEY` are retained in the configuration structure for potential future Discord application functionality but are not currently required by the link-trimming bot.

**Never commit your populated `.env` file or Discord bot token to source control.**

Start the bot with:

```bash
npm start
```

A successful connection will produce a console message similar to:

```text
YT Tracker Trimmer is online as YT Tracker Trimmer#1234
```

## How It Works

YT Tracker Trimmer maintains a connection to the Discord Gateway and listens for new messages.

For each non-bot message, it:

1. Searches the message for HTTP/HTTPS URLs.
2. Parses candidate URLs using JavaScript's `URL` API.
3. Determines whether each URL belongs to a recognized YouTube domain.
4. Checks for an `si` query parameter.
5. Removes only the `si` parameter.
6. Replies to the original Discord message with the cleaned URL.

URL parsing and query-string modification are intentionally handled with the standard `URL`/`URLSearchParams` APIs rather than relying entirely on regular expressions.

## Project Origins

YT Tracker Trimmer was originally bootstrapped from Discord's **Getting Started** example application.

The original example application's interaction-based demo functionality has been replaced by a `discord.js` Gateway bot designed specifically for YouTube link cleanup. The original `/test` and Rock-Paper-Scissors `/challenge` functionality are not part of YT Tracker Trimmer.

Some superfluous remnants of the original Getting Started project may remain in the repository. These are retained either because they are harmless or have not yet warranted removal as the project continues to develop.

The Git history for YT Tracker Trimmer begins with the standalone project rather than preserving the upstream example application's development history.

## Security

The Discord bot token should be treated as a password.

The repository's `.gitignore` excludes:

```text
.env
node_modules/
```

Secrets should be supplied through environment variables or the secret-management system of the deployment platform.

YT Tracker Trimmer intentionally requests only the Discord permissions necessary for its operation. It does not require permission to delete messages, manage users, manage roles, or administer a server.

## Author

**Paladin045**

## License

MIT
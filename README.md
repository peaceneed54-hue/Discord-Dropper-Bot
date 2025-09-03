# Discord Giveaway Bot

A Discord bot that creates reaction-based giveaways with automatic drop messages when target reactions are reached.

## Features

### 🎁 Interactive Giveaways
- Create giveaways that trigger automatically when a certain number of reactions are reached
- Real-time reaction tracking with live updates every 3 seconds
- Beautiful embeds with visual progress indicators

### ⚡ Slash Commands
- Modern Discord slash command interface (`/drop`)
- Easy-to-use command with intuitive parameters
- Built-in validation for inputs

### 🖼️ Image Support
- Optional image display in giveaway messages
- Supports any valid image URL
- Images appear in the initial giveaway message for maximum visibility

### 📊 Real-Time Updates
- Live reaction count updates every 3 seconds
- Status indicators (Active/Completed)
- Progress tracking with target vs current reactions

### 🎉 Automatic Drop Messages
- Clean, simple drop messages when target is reached
- Customizable giveaway details
- Bold formatting for important information

## How It Works

1. **Create a Giveaway**: Use `/drop` command with your parameters
2. **Users React**: Participants react with the specified emoji
3. **Live Tracking**: Bot updates reaction counts every 3 seconds
4. **Automatic Drop**: When target is reached, bot sends the drop message
5. **Clean Results**: Simple, bold message with your giveaway details

## Command Usage

```
/drop reaction:🎁 emoji_count:10 drop:Steam Account giveaway:Premium account with 100+ games image:https://example.com/image.png
```

### Parameters

| Parameter | Description | Required | Example |
|-----------|-------------|----------|---------|
| `reaction` | Emoji users need to react with | Yes | `🎁` |
| `emoji_count` | Number of reactions needed to trigger drop | Yes | `10` |
| `drop` | Main drop message/title | Yes | `Steam Account` |
| `giveaway` | Detailed giveaway description | Yes | `Premium account with 100+ games` |
| `image` | Image URL to display (optional) | No | `https://imgur.com/image.png` |

## Installation & Setup

### Prerequisites
- Node.js (v16.11.0 or higher)
- A Discord Bot Token

### Step 1: Clone/Download Files
Download or clone this repository to your local machine.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Bot Token
Create a `.env` file in the root directory:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
```

**Important**: Replace `your_bot_token_here` with your actual Discord bot token.

### Step 4: Get Discord Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select existing one
3. Go to "Bot" section
4. Copy the token from "Token" section
5. Paste it in your `.env` file

### Step 5: Bot Permissions
Your bot needs these permissions:
- Send Messages
- Use Slash Commands
- Add Reactions
- Read Message History
- Embed Links

### Step 6: Run the Bot
```bash
node index.js
```

You should see:
```
✅ Bot is ready! Logged in as YourBotName#1234
🤖 Bot is in X servers
✅ Successfully registered slash commands!
```

## Changing Bot Token

To change your Discord bot token:

1. **Edit the `.env` file**:
   ```env
   DISCORD_BOT_TOKEN=your_new_token_here
   ```

2. **Restart the bot**:
   ```bash
   node index.js
   ```

**Security Note**: Never share your `.env` file or commit it to version control. Keep your bot token private!

## File Structure

```
discord-giveaway-bot/
├── index.js          # Main bot file
├── package.json      # Dependencies and scripts
├── .env             # Environment variables (create this)
├── README.md        # This file
└── node_modules/    # Installed packages (auto-generated)
```

## Example Usage

### Basic Giveaway
```
/drop reaction:🎉 emoji_count:5 drop:Free Nitro giveaway:Discord Nitro Classic for 1 month
```

### Giveaway with Image
```
/drop reaction:💎 emoji_count:20 drop:Gaming Setup giveaway:RTX 4090 + i9-13900K setup image:https://i.imgur.com/setup.png
```

## Hosting Options

### Local Hosting
- Run on your computer with `node index.js`
- Requires computer to stay online

### VPS/Cloud Hosting
- Upload files to your server
- Install Node.js and dependencies
- Set up environment variables
- Run with process manager like PM2

### Pterodactyl Panel
- Create Node.js server
- Upload files via file manager
- Set `DISCORD_BOT_TOKEN` in environment variables
- Start with `npm start`

## Troubleshooting

### "Invalid Token" Error
- Check your `.env` file format
- Ensure no spaces around the `=` sign
- Verify token is correct from Discord Developer Portal
- Don't use quotes around the token

### Bot Not Responding
- Ensure bot is invited to your server
- Check bot has required permissions
- Verify bot is online (green status)

### Commands Not Appearing
- Wait up to 1 hour for global commands to sync
- Try kicking and re-inviting the bot
- Check bot has "Use Slash Commands" permission

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify your bot token and permissions
3. Ensure all dependencies are installed
4. Check Discord's API status

## License

This project is open source and available under the MIT License.
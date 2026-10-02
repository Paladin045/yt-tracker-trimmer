import 'dotenv/config';
import {
    Client,
    Events,
    GatewayIntentBits
} from 'discord.js';

// Make sure a token was actually loaded from .env.
if (!process.env.DISCORD_TOKEN) {
    console.error('ERROR: DISCORD_TOKEN is not set in .env');
    process.exit(1);
}

// Create the Discord client.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Used only to FIND URLs in messages.
// Actual URL parsing and modification are handled by the URL API.
const urlRegex = /https?:\/\/[^\s<]+/gi;

/**
 * If urlString is a YouTube URL containing an "si" parameter,
 * return the same URL with "si" removed.
 *
 * Otherwise, return null.
 */
function cleanYouTubeUrl(urlString) {
    // Remove punctuation that commonly appears immediately after a URL
    // in normal prose.
    const candidate = urlString.replace(/[),.!?:;>\]}]+$/, '');

    let url;

    try {
        url = new URL(candidate);
    } catch {
        return null;
    }

    const hostname = url.hostname.toLowerCase();

    const isYouTube =
        hostname === 'youtube.com' ||
        hostname === 'www.youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'youtu.be' ||
        hostname === 'www.youtu.be';

    if (!isYouTube) {
        return null;
    }

    // Nothing to clean.
    if (!url.searchParams.has('si')) {
        return null;
    }

    // Remove only the YouTube share/tracking identifier.
    url.searchParams.delete('si');

    return url.toString();
}

// Report successful connection.
client.once(Events.ClientReady, readyClient => {
    console.log(`YT Tracker Trimmer is online as ${readyClient.user.tag}`);
});

// Examine new messages.
client.on(Events.MessageCreate, async message => {
    // Don't respond to ourselves or other bots.
    if (message.author.bot) return;

    const matches = message.content.match(urlRegex);

    if (!matches) return;

    const cleanedUrls = [];

    for (const match of matches) {
        const cleaned = cleanYouTubeUrl(match);

        if (cleaned) {
            cleanedUrls.push(cleaned);
        }
    }

    // Message contained no YouTube URLs requiring cleanup.
    if (cleanedUrls.length === 0) return;

    // Don't post the same cleaned URL multiple times.
    const uniqueUrls = [...new Set(cleanedUrls)];

    let replyText;

    if (uniqueUrls.length === 1) {
        replyText =
            `🧹 **Cleaned YouTube link:**\n${uniqueUrls[0]}\n\n` +
            `*Please remove unnecessary tracking/share parameters from links when possible.*`;
    } else {
        replyText =
            `🧹 **Cleaned YouTube links:**\n` +
            uniqueUrls.map(url => `• ${url}`).join('\n') +
            `\n\n*Please remove unnecessary tracking/share parameters from links when possible.*`;
    }

    try {
        await message.reply({
            content: replyText,

            // Reply visually without pinging the original poster.
            allowedMentions: {
                repliedUser: false
            }
        });
    } catch (error) {
        console.error('Failed to reply with cleaned YouTube link:', error);
    }
});

// Connect to Discord.
client.login(process.env.DISCORD_TOKEN);
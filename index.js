require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Store active drops
const activeDrops = new Map();

// Function to check reactions periodically
async function checkReactions() {
    for (const [messageId, dropData] of activeDrops.entries()) {
        try {
            const channel = await client.channels.fetch(dropData.channelId);
            const message = await channel.messages.fetch(messageId);
            
            // Find the specific emoji reaction
            const targetReaction = message.reactions.cache.find(reaction => 
                reaction.emoji.toString() === dropData.emoji
            );
            
            if (targetReaction) {
                const currentCount = targetReaction.count - 1; // Subtract bot's reaction
                
                // Only update if count changed
                if (currentCount !== dropData.currentCount) {
                    dropData.currentCount = currentCount;
                    
                    // Update embed
                    const embed = new EmbedBuilder()
                        .setColor(currentCount >= dropData.targetCount ? '#00FF00' : '#FFD700')
                        .setTitle(currentCount >= dropData.targetCount ? '🎉 Drop Started! 🎉' : '🎁 Giveaway Started 🎁')
                        .setDescription(`**${dropData.dropMessage}**`)
                        .addFields(
                            { name: '🎯 Target Reactions', value: `${dropData.targetCount} ${dropData.emoji}`, inline: true },
                            { name: '📊 Current Reactions', value: `${currentCount} ${dropData.emoji}`, inline: true },
                            { name: '⏰ Status', value: currentCount >= dropData.targetCount ? '🔴 Completed' : '🟢 Active', inline: true }
                        )
                        .setFooter({ text: currentCount >= dropData.targetCount ? 'Giveaway completed!' : `React with ${dropData.emoji} to participate!` })
                        .setTimestamp();

                    // Add image if provided
                    if (dropData.imageUrl) {
                        embed.setImage(dropData.imageUrl);
                    }

                    await message.edit({ embeds: [embed] });
                    
                    // If target reached, send drop message
                    if (currentCount >= dropData.targetCount) {
                        const dropEmbed = new EmbedBuilder()
                            .setColor('#FF6B6B')
                            .setTitle('🎁 DROP! 🎁')
                            .setDescription(`**${dropData.dropMessage}**\n\n**${dropData.giveawayMessage}**`)
                            .setTimestamp();

                        await channel.send({ embeds: [dropEmbed] });
                        
                        // Remove from active drops
                        activeDrops.delete(messageId);
                        console.log(`✅ Drop completed for message ${messageId}`);
                    }
                }
            }
        } catch (error) {
            console.error(`Error checking reactions for message ${messageId}:`, error);
            // If message no longer exists, remove from active drops
            activeDrops.delete(messageId);
        }
    }
}

// Start periodic checking every 3 seconds
setInterval(checkReactions, 3000);

client.once('ready', () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`🤖 Bot is in ${client.guilds.cache.size} servers`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'drop') {
        const emoji = interaction.options.getString('reaction');
        const count = interaction.options.getInteger('emoji_count');
        const dropMessage = interaction.options.getString('drop');
        const giveawayMessage = interaction.options.getString('giveaway');
        const imageUrl = interaction.options.getString('image');

        // Validate emoji (basic check)
        if (!emoji) {
            return interaction.reply({ content: '❌ Please provide a valid emoji!', ephemeral: true });
        }

        if (count <= 0) {
            return interaction.reply({ content: '❌ Emoji count must be greater than 0!', ephemeral: true });
        }

        // Create embed
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎁 Giveaway Started 🎁')
            .setDescription(dropMessage)
            .addFields(
                { name: '🎯 Target Reactions', value: `${count} ${emoji}`, inline: true },
                { name: '📊 Current Reactions', value: `0 ${emoji}`, inline: true },
                { name: '⏰ Status', value: '🟢 Active', inline: true }
            )
            .setFooter({ text: `React with ${emoji} to participate!` })
            .setTimestamp();

        // Add image if provided
        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        try {
            const response = await interaction.reply({
                embeds: [embed]
            });
            const message = await interaction.fetchReply();

            // Add reaction
            await message.react(emoji);

            // Store drop data
            activeDrops.set(message.id, {
                emoji: emoji,
                targetCount: count,
                dropMessage: dropMessage,
                giveawayMessage: giveawayMessage,
                imageUrl: imageUrl,
                currentCount: 0,
                channelId: interaction.channelId,
                messageId: message.id,
                guildId: interaction.guildId
            });

        } catch (error) {
            console.error('Error creating drop:', error);
            return interaction.reply({ content: '❌ Failed to create drop. Make sure the emoji is valid!', ephemeral: true });
        }
    }
});

// Removed old reaction handlers - using periodic checking instead

// Register slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('drop')
        .setDescription('Create a reaction-based giveaway drop')
        .addStringOption(option =>
            option.setName('reaction')
                .setDescription('The emoji users need to react with')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('emoji_count')
                .setDescription('Number of reactions needed to trigger the drop')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('drop')
                .setDescription('The drop message/prize description')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('giveaway')
                .setDescription('The giveaway details message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Image URL to display in the drop message')
                .setRequired(false))
];

client.once('ready', async () => {
    try {
        console.log('🔄 Registering slash commands...');
        
        // Register commands globally (takes up to 1 hour to propagate)
        await client.application.commands.set(commands);
        
        console.log('✅ Successfully registered slash commands!');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
});

// Login with bot token
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    console.error('❌ DISCORD_BOT_TOKEN environment variable is not set!');
    console.log('📝 Please add your Discord bot token to the secrets.');
    process.exit(1);
}

client.login(token);
const { EmbedBuilder } = require('discord.js');

function createSuccessEmbed(message) {
    return new EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`✅ ${message}`);
}

function createErrorEmbed(message) {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ ${message}`);
}

function createCustomEmojiEmbed(emoji, message) {
    return new EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`${emoji} ${message}`);
}

module.exports = {
    createSuccessEmbed,
    createErrorEmbed,
    createCustomEmojiEmbed,
};
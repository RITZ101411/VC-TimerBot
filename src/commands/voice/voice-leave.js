const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const connectionMap = require('../../utils/connectionMap');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../../utils/embed');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const { guildId } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('指定したボイスチャットから退出'),
    async execute(interaction) {
        const connection = connectionMap.get(interaction.guildId)

        if (!connection) {
            const errorEmbed = createErrorEmbed(`通話に参加していません`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        connection.destroy();
        connectionMap.delete(interaction.guildId);

        const successEmbed = createSuccessEmbed(`ボイスチャットから退出しました`);
        return interaction.reply({ embeds: [successEmbed] });
    },
};

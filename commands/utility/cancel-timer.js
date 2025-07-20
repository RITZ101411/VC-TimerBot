const { SlashCommandBuilder } = require('discord.js');
const timerMap = require('../../utils/timerMap');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-timer')
        .setDescription('現在のタイマーをキャンセルします'),
    async execute(interaction) {
        const user = interaction.user.id;

        if (!timerMap.has(user)) {
            const errorEmbed = createErrorEmbed('現在、設定されているタイマーはありません');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        clearTimeout(timerMap.get(user));
        timerMap.delete(user);

        const successEmbed = createSuccessEmbed('タイマーがキャンセルされました');
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
};

const { SlashCommandBuilder } = require('discord.js');
const timerMap = require('../../utils/timerMap');
const { createSuccessEmbed, createErrorEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-timer')
        .setDescription('指定したユーザーのタイマーを確認します')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('タイマーを確認するユーザーを指定')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!timerMap.has(user.id)) {
            const errorEmbed = createErrorEmbed(`${user.username} さんには現在、タイマーが設定されていません。`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const timerInfo = timerMap.get(user.id);

        const now = Date.now();
        const remaining = Math.max(0, timerInfo.expiresAt - now);
        const seconds = Math.floor(remaining / 1000);

        const replyEmbed = createSuccessEmbed(`${user.username} さんのタイマーは残り ${seconds} 秒です。`);
        await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
    }
};

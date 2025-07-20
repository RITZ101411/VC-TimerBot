const { SlashCommandBuilder } = require('discord.js');
const timerMap = require('../../utils/timerMap');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-timer')
        .setDescription('現在のタイマーをキャンセルします'),
    async execute(interaction) {
        const user = interaction.user.id;

        if (!timerMap.has(user)) {
            await interaction.reply('現在、設定されているタイマーはありません。');
            return;
        }

        clearTimeout(timerMap.get(user));
        timerMap.delete(user);

        await interaction.reply('タイマーがキャンセルされました。');
    }
};

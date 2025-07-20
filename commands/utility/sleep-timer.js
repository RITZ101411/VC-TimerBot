const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const timerMap = require('../../utils/timerMap');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sleep-timer')
        .setDescription('寝落ちタイマーをセットする')
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('タイマーをセットする時間（分）')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user.id;
        const member = await interaction.guild.members.fetch(user);
        const minutes = interaction.options.getInteger('minutes');
        const min = minutes * 60 * 1000;

        if (!member.voice.channel) {
            await interaction.reply(`${member.displayName}さんは通話に参加していません`);
            return;
        }

        if (minutes < 1) {
            await interaction.reply(`1分以上の有効な数字を入力してください`);
            return;
        }

        await interaction.reply(`${minutes}分後にお知らせします`);

        if (timerMap.has(user)) {
            clearTimeout(timerMap.get(user));
        }

        const timeoutId = setTimeout(async () => {
            try {
                await alert(interaction, member);
            } catch (e) {
                console.error('Alert error:', e);
            }
        }, min);

        timerMap.set(user, timeoutId);
    },
};

async function alert(interaction, member) {
    try {
        const displayName = member.displayName;

        if (member.voice.channel === null) {
            await interaction.followUp(`${displayName}さんはすでに通話にいないため、タイマーをリセットしました`);
            return;
        }

        try {
            await member.voice.disconnect();
            await interaction.followUp(`${displayName}さんを切断しました。💤`);
        } catch (error) {
            await interaction.followUp(`ユーザーを切断する際にエラーが発生しました。`);
            console.log("ユーザーを切断する際にエラーが発生しました。", error);
        }

        timerMap.delete(member.user.id);
    } catch (error) {
        await interaction.followUp(`タイマー終了時にエラーが発生しました。`);
        console.log("タイマー終了時にエラーが発生しました。", error);
    }
}

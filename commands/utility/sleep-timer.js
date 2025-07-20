const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const timerMap = require('../../utils/timerMap');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../../utils/embed');

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
            const errorEmbed = createErrorEmbed(`${member.displayName}さんは通話に参加していません`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        if (minutes < 1) {
            const errorEmbed = createErrorEmbed(`1分以上の有効な数字を入力してください`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const successEmbed = createSuccessEmbed(`${minutes}分後に切断します`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });

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
            const errorEmbed = createErrorEmbed(`${displayName}さんはすでに通話にいないため、タイマーをリセットしました`);
            await interaction.followUp({ embeds: [errorEmbed] });
            return;
        }

        try {
            await member.voice.disconnect();
            const successEmbed = createSuccessEmbed(`${displayName}さんを切断しました💤`);
            await interaction.followUp({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = createErrorEmbed(`ユーザーを切断する際にエラーが発生しました`);
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            console.log("ユーザーを切断する際にエラーが発生しました。", error);
        }

        timerMap.delete(member.user.id);
    } catch (error) {
        const errorEmbed = createErrorEmbed(`タイマー終了時にエラーが発生しました`);
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        console.log("タイマー終了時にエラーが発生しました。", error);
    }
}

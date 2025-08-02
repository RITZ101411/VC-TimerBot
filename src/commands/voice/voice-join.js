const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const connectionMap = require('../../utils/connectionMap');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../../utils/embed');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const { guildId } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('指定したボイスチャットに参加'),
    async execute(interaction) {
        const user = interaction.user.id;
        const member = await interaction.guild.members.fetch(user);
        const channel = interaction.member?.voice?.channel;

        if(connectionMap.get(interaction.guildId)){
            const errorEmbed = createErrorEmbed(`既に通話に参加しています`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!channel) {
            const errorEmbed = createErrorEmbed(`${member.displayName}さんは通話に参加していません`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guildId,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        connectionMap.set(interaction.guildId, connection);

        const successEmbed = createSuccessEmbed(`${channel}に参加しました`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: false });
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { connectionMap, connectionCreate} = require('../../voice/connection');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../../utils/embed');
const { SetReceiver } = require('../../voice/receiver');
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

        const connection = connectionCreate(interaction);
        SetReceiver(connection);

        const successEmbed = createSuccessEmbed(`${channel}に参加しました`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: false });
    },
};

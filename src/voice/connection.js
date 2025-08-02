const connectionMap = new Map();
const { joinVoiceChannel } = require('@discordjs/voice');
const { createSuccessEmbed, createErrorEmbed, createCustomEmojiEmbed } = require('../utils/embed');

function connectionCreate(interaction){
    const channel = interaction.member?.voice?.channel;
    const guildId = interaction.guildId;

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guildId,
        adapterCreator: channel.guild.voiceAdapterCreator
    });

    connectionMap.set(guildId, connection);

    connection.on("stateChange", (oldState, newState) => {
        console.log(oldState.status + " => " + newState.status);

        if(newState.status === 'disconnected'){
            connection.destroy();
            connectionMap.delete(interaction.guildId);
            const errorEmbed =  createCustomEmojiEmbed(`😂`, `強制的に切断されました`);
            return interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
        }
    });
    
    return connection;
}

module.exports = {
    connectionMap,
    connectionCreate
};
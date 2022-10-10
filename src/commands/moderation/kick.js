const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick the member provided")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("The reason for kicking the member provided")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString('reason');
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error());
    if (!reason) reason = "No reason provided.";

    // Kick member and send a direct message
    /*
    await user.send({
        content: `You have been kicked from: ${interaction.guild.name}\nReason: ${reason}`
    }).catch(console.log('user\'s DM\'s are off.')); 
    */ 

    await member.kick(reason).catch(console.error);

    await interaction.reply({
        content: `Kicked ${user.tag} successfully!`,
    });
  },
};

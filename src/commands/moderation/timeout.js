const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout the member provided")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of minutes to timeout a memeber for.")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking the member provided")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    let time = interaction.options.getInteger("time");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error());
    if (!reason) reason = "No reason provided.";
    if (!time) time = null;
    // Kick member and send a direct message
    /*
    await user.send({
        content: `You have been kicked from: ${interaction.guild.name}\nReason: ${reason}`
    }).catch(console.log('user\'s DM\'s are off.')); 
    */

    await member.timeout(time == null ? null : time * 60 * 1000, reason).catch(console.error);

    await interaction.reply({
      content: `Timed out ${user.tag} (for ${time} minute(s)) successfully!`,
    });
  },
};

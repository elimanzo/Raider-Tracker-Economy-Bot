const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-all-raiders")
    .setDescription(
      "Creates Raider's Info for users that already have the raider tags"
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.LEADER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }

    let contentList = [];
    interaction.guild.members.fetch();
    let allRaiders = await interaction.guild.roles.cache.get(
      process.env.RAIDER_ID
    ).members;
  
    for await (const raider of allRaiders) {
      let raiderProfile = await client.createRaider(
        interaction.member,
        raider[1].user,
        raider[1].joinedTimestamp
      );
      if (raiderProfile) {
        contentList.push(
          `\n<@${raiderProfile.userId}> was created - Use \`/show-raider user discord_id:<@${raiderProfile.userId}>\` to show raider information`
        );
      }
    }

    if (contentList.length === 0) {
      await interaction.reply({
        content: `No new Raiders to create w/ the Raider Tags`,
      });
    } else {
      await interaction.reply({
        content: contentList.join(""),
      });
    }
  },
};

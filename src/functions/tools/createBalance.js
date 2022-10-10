const Balance = require("../../schemas/balance");
const mongoose = require("mongoose");

module.exports = (client) => {
  client.createBalance = async (member) => {
    let balanceProfile = await Balance.findOne({
      guildId: member.guild.id,
      guildMemberName: member.displayName,
      guildMemberId: member.id,
    });
    if (balanceProfile) {
      return balanceProfile;
    } else {
      balanceProfile = await new Balance({
        _id: mongoose.Types.ObjectId(),
        guildId: member.guild.id,
        guildMemberName: member.displayName,
        guildMemberId: member.id,
        lastEdited: Date.now(),
      });
      balanceProfile.save().catch((err) => consolelog(err));
      return balanceProfile;
    }
  };
};

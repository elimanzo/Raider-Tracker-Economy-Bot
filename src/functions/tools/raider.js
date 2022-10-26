const Raider = require("../../schemas/raider");
const RaiderSale = require("../../schemas/raiderSale");
const mongoose = require("mongoose");

module.exports = (client) => {
  client.createRaider = async (member, user, joinedTimestamp) => {
    let raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: user.id,
    });
    if (raiderProfile) {
      return null;
    }
    raiderProfile = await new Raider({
      _id: mongoose.Types.ObjectId(),
      guildId: member.guild.id,
      userName: user.username,
      userId: user.id,
      joinedDate: new Date(joinedTimestamp),
      lastSale: Date.now(),
      houseAddress: `No address, please use \`/update-housing discord-user <@${user.id}>\``,
      server: `No server, please use \`/update-housing discord-user <@${user.id}>\``,
    });
    raiderProfile.save().catch((err) => consolelog(err));
    return raiderProfile;
  };
  client.findRaider = async (member, discordUserId) => {
    const raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    if (!raiderProfile) {
      return null;
    }
    return raiderProfile;
  };
  client.findRaiderSale = async (sale_id) => {
    try {
      const saleProfile = await RaiderSale.findById(sale_id);
      return saleProfile;
    } catch (err) {
      return null;
    }
  };
  client.changeFunds = async (member, discordUserId, gilAmount, sale_id) => {
    let raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    if (!raiderProfile) {
      return null;
    }
    if (gilAmount < 0) {
      raiderProfile.sales = raiderProfile.sales.filter((e) => e !== sale_id);
    } else {
      raiderProfile.sales.push(sale_id);
    }

    raiderProfile = await Raider.findOneAndUpdate(
      {
        guildId: member.guild.id,
        userId: discordUserId,
      },
      {
        sales: raiderProfile.sales,
        gilProfit: (raiderProfile.gilProfit += gilAmount),
        lastSale: Date.now(),
      }
    );
    raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    return raiderProfile;
  };
  client.createSale = async (
    member,
    content,
    dateOfSale,
    saleCost,
    raiderIds,
    gilAmounts,
    discordClientId
  ) => {
    raiderSale = await new RaiderSale({
      _id: mongoose.Types.ObjectId(),
      guildId: member.guild.id,
      saleType: content,
      saleDate: dateOfSale,
      scheduler: member.user.id,
      clientId: discordClientId,
      dateSubmitted: Date.now(),
      raiders: {
        raiderIds: raiderIds,
        raiderPayout: gilAmounts,
        totalRaiders: raiderIds.length,
      },
      gilProfit: saleCost,
    });
    raiderSale.save().catch((err) => consolelog(err));
    return raiderSale;
  };
  client.updateRaiderAddress = async (
    member,
    discordUserId,
    address,
    raiderServer
  ) => {
    let raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    if (!raiderProfile) {
      return null;
    }
    raiderProfile = await Raider.findOneAndUpdate(
      {
        guildId: member.guild.id,
        userId: discordUserId,
      },
      { houseAddress: address, server: raiderServer }
    );

    return raiderProfile;
  };
  client.updateRaider = async (
    member,
    discordUserId,
    newUsername,
    lastSaleDate,
    gil,
    saleIds
  ) => {
    let raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    if (!raiderProfile) {
      return null;
    }
    raiderProfile = await Raider.findOneAndUpdate(
      {
        guildId: member.guild.id,
        userId: discordUserId,
      },
      {
        userName: newUsername,
        lastSale: lastSaleDate,
        gilProfit: gil,
        sales: saleIds,
      }
    );

    return raiderProfile;
  };
  client.updateRaiderSale = async (
    sale_id,
    saleContent,
    dateOfSale,
    saleCost,
    raiderIds,
    gilAmounts
  ) => {
    const saleProfile = RaiderSale.findByIdAndUpdate(sale_id, {
      saleType: saleContent,
      saleDate: dateOfSale,
      raiders: {
        raiderIds: raiderIds,
        raiderPayout: gilAmounts,
        totalRaiders: raiderIds.length,
      },
      gilProfit: saleCost,
    });
    return saleProfile;
  };
  client.updateRaiderSaleClientScheduler = async (sale_id, newClientId, newSchedulerId) => {
    const saleProfile = RaiderSale.findByIdAndUpdate(sale_id, {
      clientId: newClientId,
      scheduler: newSchedulerId
    });
    return saleProfile;
  };

  client.retireRaider = async (member, discordUserId, newRetirement) => {
    raiderProfile = await Raider.findOneAndUpdate(
      {
        guildId: member.guild.id,
        userId: discordUserId,
      },
      {
        isRetired: !newRetirement,
      }
    );
  };
  client.deleteRaider = async (member, discordUserId) => {
    await Raider.findOneAndDelete({
      guildId: member.guild.id,
      userId: discordUserId,
    });
  };
  client.deleteRaiderSale = async (saleId) => {
    await RaiderSale.findByIdAndDelete(saleId);
  };
  client.getRaidersActivity = async () => {
    const raidersProfile = await Raider.find({ isRetired: false }).sort({ lastSale: -1 });
    return raidersProfile;
  };
  client.getMonthlySales = async () => {
    const saleProfile = await RaiderSale.find({
      saleDate: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    }).sort({ saleDate: -1 });
    return saleProfile;
  };
};

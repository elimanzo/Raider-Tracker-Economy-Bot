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
      lastSignup: Date.now(),
      houseAddress: `No address, use \`/update-housing discord-user <@${user.id}>\``,
      server: `No server, use \`/update-housing discord-user <@${user.id}>\``,
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
      console.log("Sale ID Did not exist");
      return null;
    }
  };
  client.findRaiderSaleByThread = async (member, threadId) => {
    const saleProfile = await RaiderSale.findOne({
      guildId: member.guild.id,
      saleThread: threadId,
    });
    if (!saleProfile) {
      return null;
    }
    return saleProfile;
  };
  client.changeFunds = async (
    member,
    discordUserId,
    gilAmount,
    sale_id,
    isGilRemoved
  ) => {
    let raiderProfile = await Raider.findOne({
      guildId: member.guild.id,
      userId: discordUserId,
    });
    if (!raiderProfile) {
      return null;
    }
    let updatedSaleDate = Date.now();
    if (gilAmount < 0 || isGilRemoved) {
      raiderProfile.sales.splice(raiderProfile.sales.indexOf(sale_id), 1);
      if (raiderProfile.sales.length === 0) {
        updatedSaleDate = raiderProfile.joinedDate;
        signupSaleDate = raiderProfile.joinedDate;
      } else {
        const lastSaleProfile = await client.findRaiderSale(
          raiderProfile.sales[raiderProfile.sales.length - 1]
        );
        updatedSaleDate = lastSaleProfile.saleDate;
      }
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
        lastSale: updatedSaleDate,
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
  client.updateRaiderSaleClientScheduler = async (
    sale_id,
    newClientId,
    newSchedulerId
  ) => {
    const saleProfile = await RaiderSale.findByIdAndUpdate(sale_id, {
      clientId: newClientId,
      scheduler: newSchedulerId,
    });
    return saleProfile;
  };
  client.updateSaleTotalProfit = async (saleProfile, profit) => {
    await RaiderSale.findByIdAndUpdate(saleProfile._id, {
      gilProfit: profit,
    });
  };
  client.updateRaiderLastSignups = async (discordUserId) => {
    await Raider.findOneAndUpdate(
      {
        userId: discordUserId,
      },
      {
        lastSignup: Date.now(),
      }
    );
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
    const raidersProfile = await Raider.find({ isRetired: false }).sort({
      lastSale: -1,
    });
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
  client.getSaleAddresses = async (saleProfile) => {
    const raidersProfile = await Raider.find({
      sales: saleProfile._id,
    }).sort({ server: 1 });
    return raidersProfile;
  };
  client.createThreadSale = async (
    member,
    content,
    dateOfSale,
    saleCost,
    discordClientId,
    thread,
    threadUrl
  ) => {
    const raiderSale = await new RaiderSale({
      _id: mongoose.Types.ObjectId(),
      guildId: member.guild.id,
      saleType: content,
      saleDate: dateOfSale,
      scheduler: member.user.id,
      clientId: discordClientId,
      dateSubmitted: Date.now(),
      raiders: {
        raiderIds: [],
        raiderPayout: [],
        totalRaiders: 0,
      },
      gilProfit: saleCost,
      saleThread: thread,
      saleThreadUrl: threadUrl,
    });
    raiderSale.save().catch((err) => consolelog(err));
    return raiderSale;
  };
  client.addCurrentRosterToSale = async (member, id, roster) => {
    try {
      let saleProfile = await RaiderSale.findById(id);
      const combinedRoster = [
        ...roster.tanks,
        ...roster.healers,
        ...roster.dps,
      ];
      const signedUpSubs = roster.subs;
      for (let raider of combinedRoster) {
        if (saleProfile.raiders.raiderIds.indexOf(raider[0]) <= -1) {
          await client.changeFunds(
            member,
            raider[0],
            0,
            saleProfile._id,
            false
          );
          saleProfile.raiders.raiderIds.push(raider[0]);
          saleProfile.raiders.raiderPayout.push(0);
          await client.updateRaiderLastSignups(raider[0]);
        }
      }

      for (let raider of signedUpSubs) {
        await client.updateRaiderLastSignups(raider[0]);
      }

      saleProfile.raiders.totalRaiders = saleProfile.raiders.raiderIds.length;

      await RaiderSale.findByIdAndUpdate(id, {
        raiders: {
          raiderIds: saleProfile.raiders.raiderIds,
          raiderPayout: saleProfile.raiders.raiderPayout,
          totalRaiders: saleProfile.raiders.totalRaiders,
        },
      });
    } catch (err) {
      console.log("Sale ID did not exist");
    }
  };
  client.addRaiderToThreadSale = async (member, raider, gil, threadId) => {
    let saleProfile = await RaiderSale.findOne({ saleThread: threadId });
    await client.updateRaiderLastSignups(raider.id);
    if (saleProfile) {
      const raiderIndex = saleProfile.raiders.raiderIds.indexOf(raider.id);
      if (raiderIndex > -1) {
        saleProfile.raiders.raiderIds[raiderIndex] = raider.id;
        await client.changeFunds(
          member,
          raider.id,
          -saleProfile.raiders.raiderPayout[raiderIndex],
          saleProfile._id,
          true
        );
        await client.changeFunds(
          member,
          raider.id,
          gil,
          saleProfile._id,
          false
        );
        saleProfile.raiders.raiderPayout[raiderIndex] = gil;
      } else {
        saleProfile.raiders.raiderIds.push(raider.id);
        saleProfile.raiders.raiderPayout.push(gil);
        await client.changeFunds(
          member,
          raider.id,
          gil,
          saleProfile._id,
          false
        );
      }
      saleProfile.raiders.totalRaiders = saleProfile.raiders.raiderIds.length;
      await RaiderSale.findByIdAndUpdate(saleProfile._id, {
        raiders: {
          raiderIds: saleProfile.raiders.raiderIds,
          raiderPayout: saleProfile.raiders.raiderPayout,
          totalRaiders: saleProfile.raiders.totalRaiders,
        },
      });
    }
    return saleProfile;
  };
  client.removeRaiderFromThreadSale = async (member, raider, threadId) => {
    let saleProfile = await RaiderSale.findOne({ saleThread: threadId });
    if (saleProfile) {
      const raiderIndex = saleProfile.raiders.raiderIds.indexOf(raider.id);
      if (raiderIndex <= -1) {
        return null;
      }
      await client.changeFunds(
        member,
        raider.id,
        -saleProfile.raiders.raiderPayout[raiderIndex],
        saleProfile._id,
        true
      );
      saleProfile.raiders.raiderIds.splice(raiderIndex, 1);
      saleProfile.raiders.raiderPayout.splice(raiderIndex, 1);
      saleProfile.raiders.totalRaiders = saleProfile.raiders.raiderIds.length;
      await RaiderSale.findByIdAndUpdate(saleProfile._id, {
        raiders: {
          raiderIds: saleProfile.raiders.raiderIds,
          raiderPayout: saleProfile.raiders.raiderPayout,
          totalRaiders: saleProfile.raiders.totalRaiders,
        },
      });
    }
    return saleProfile;
  };
  client.deleteRaiderSaleThread = async (threadId) => {
    const saleProfile = await RaiderSale.findOneAndDelete({
      saleThread: threadId,
    });
    return saleProfile;
  };
};

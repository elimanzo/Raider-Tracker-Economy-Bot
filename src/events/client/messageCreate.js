const Balance = require('../../schemas/balance');

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        const balanceProfile = await client.createBalance(message.member);
        const amount = Math.floor(Math.random() * 29) + 1;
        try {
            await Balance.findOneAndUpdate({ _id: balanceProfile._id }, { amount: balanceProfile.amount += amount });
        } catch (err) {
            console.log(err);
        }

    },
  };
  
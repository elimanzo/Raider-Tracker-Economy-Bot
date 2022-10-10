const { Schema, model } = require('mongoose');
const balanceSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildMemberName: String,
    guildMemberId: String,
    lastEdited: String,
    amount: { type: Number, default: 0 }
});

module.exports = new model("Balance", balanceSchema, "balances");
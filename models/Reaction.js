const { Schema, Types, model } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss') 
    },
    body: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = ReactionSchema;
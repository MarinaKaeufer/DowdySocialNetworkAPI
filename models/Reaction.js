const { Schema, Types } = require('mongoose');
const moment = require('moment');

const Reaction = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (time) => moment(time).format('MMM DD, YYYY [at] hh:mm a') // TODO Find a better format
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

module.exports = Reaction;
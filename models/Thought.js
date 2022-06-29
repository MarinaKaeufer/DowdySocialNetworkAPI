const { Schema } = require('mongoose');
const Reaction = require('./Reaction');
const moment = require('moment');

const Thought = new Schema({
  text: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (time) => moment(time).format('MMM DD, YYYY [at] hh:mm a')
  },
  username: {
    type: String,
    required: true
  },
  reactions: [Reaction]
});


module.exports = Thought;

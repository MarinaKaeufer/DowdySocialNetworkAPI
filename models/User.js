const { Schema } = require('mongoose');
// const Thought = require('./Thought');

const User = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/]
  },
  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = User;

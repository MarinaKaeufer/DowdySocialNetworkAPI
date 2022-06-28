const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ]
});

const User = model('User', UserSchema);

module.exports = User;

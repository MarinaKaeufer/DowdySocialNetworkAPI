const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema({
  title: String,
  body: String
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;

const mongoose = require('mongoose');
const _ = require('underscore');

const setText = (text) => _.escape(text).trim();

const TwiddleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    set: setText,
  },
  image: {
    type: Number,
    min: 0,
    required: true,
  },
  imageID: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    ref: 'Account',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date,
  },
});

TwiddleSchema.statics.toAPI = (doc) => ({
  text: doc.text,
  image: doc.image,
});

const TwiddleModel = mongoose.model('Twiddle', TwiddleSchema);
module.exports = TwiddleModel;

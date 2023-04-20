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
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TwiddleSchema.statics.toAPI = (doc) => ({
  text: doc.text,
  image: doc.image,
});

const TwiddleModel = mongoose.model('Twiddle', TwiddleSchema);
module.exports = TwiddleModel;

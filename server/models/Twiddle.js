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
  imageName: {
    type: String,
    required: false,
  },
  imageData: {
    type: Buffer,
    required: false,
  },
  imageSize: {
    type: Number,
    required: false,
  },
  imageMimetype: {
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
  imageName: doc.imageName,
});

const TwiddleModel = mongoose.model('Twiddle', TwiddleSchema);
module.exports = TwiddleModel;

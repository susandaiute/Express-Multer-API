'use strict';

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
location: {
  type: String,
  required: true,
  },
},
 {
  timestamps: true,
  toJSON: { virtuals: true },
});

uploadSchema.virtual('length').get(function length() {
  return this.text.length;
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

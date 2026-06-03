const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '💰',
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
    description: {
      type: String,
      default: '',
    },
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);
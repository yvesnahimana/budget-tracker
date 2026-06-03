const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDay: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: 'Other',
    },
    icon: {
      type: String,
      default: '📄',
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    recurring: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Bill', BillSchema);
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    limitAmount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', BudgetSchema);
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
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
    deadline: {
      type: Date,
      required: true,
    },
    icon: {
      type: String,
      default: '🎯',
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
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

module.exports = mongoose.model('Goal', GoalSchema);
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const budgets = await Budget.find({ month, year, user: req.user._id });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const transactions = await Transaction.find({
          type: 'expense',
          category: budget.category,
          user: req.user._id,
          date: { $gte: start, $lt: end },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget.toObject(),
          spent,
          remaining: budget.limitAmount - spent,
          percentage: Math.min(Math.round((spent / budget.limitAmount) * 100), 100),
        };
      })
    );

    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const budget = new Budget({ ...req.body, user: req.user._id });
    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
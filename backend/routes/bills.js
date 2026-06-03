const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user._id }).sort({ dueDay: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const bill = new Bill({ ...req.body, user: req.user._id });
    const saved = await bill.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
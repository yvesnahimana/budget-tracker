const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const collection = new Collection({ ...req.body, user: req.user._id });
    const saved = await collection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(
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
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
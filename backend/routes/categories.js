const express = require('express');
const router = express.Router();

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Housing', 'Healthcare', 'Business', 'Entertainment', 'Clothing', 'Education', 'Other'],
};

router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;
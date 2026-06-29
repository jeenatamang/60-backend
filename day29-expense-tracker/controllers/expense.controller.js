const fs = require('fs');
const path = require('path');
const expenses = require('../data/expense.data');
const AppError = require('../utils/AppError');

exports.getAll = (req, res, next) => {
  try {
    let result = [...expenses];
    const { category, sort } = req.query;
    if (category) {
      result = result.filter(e => e.category === category);
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sort === 'desc') {
      result.sort((a, b) => b.amount - a.amount);
    }

    const total = result.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      message: 'Expenses fetched successfully',
      count: result.length,
      total: `Rs. ${total}`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = (req, res, next) => {
  try {
    const expense = expenses.find(e => e.id === parseInt(req.params.id));
    if (!expense) throw new AppError('Expense not found', 404);
    res.status(200).json({
      success: true,
      message: 'Expense fetched successfully',
      data: expense
    });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const newExpense = {
      id: expenses.length + 1,
      title,
      amount: parseFloat(amount),
      category,
      date,
      note: note || ''
    };
    expenses.push(newExpense);
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense
    });
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const expense = expenses.find(e => e.id === parseInt(req.params.id));
    if (!expense) throw new AppError('Expense not found', 404);
    const { title, amount, category, date, note } = req.body;
    if (title) expense.title = title;
    if (amount) expense.amount = parseFloat(amount);
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (note !== undefined) expense.note = note;
    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res, next) => {
  try {
    const index = expenses.findIndex(e => e.id === parseInt(req.params.id));
    if (index === -1) throw new AppError('Expense not found', 404);
    expenses.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
exports.summary = (req, res, next) => {
  try {
    const summary = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { count: 0, total: 0 };
      }
      acc[expense.category].count++;
      acc[expense.category].total += expense.amount;
      return acc;
    }, {});

    const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      message: 'Summary fetched successfully',
      data: {
        grandTotal: `Rs. ${grandTotal}`,
        byCategory: summary
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.exportCSV = (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../exports/expenses.csv');

    const header = 'ID,Title,Amount,Category,Date,Note\n';
    const rows = expenses.map(e =>
      `${e.id},"${e.title}",${e.amount},${e.category},${e.date},"${e.note}"`
    ).join('\n');

    const csvContent = header + rows;

    fs.writeFileSync(filePath, csvContent);
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.setHeader('Content-Type', 'text/csv');

    const readStream = require('fs').createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
};
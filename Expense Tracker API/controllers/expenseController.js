import Expense from '../models/expenseModel.js';

const parseFilterQuery = (queryObj) => {
  const parsed = {};
  for (let key in queryObj) {
    const value = queryObj[key];

    if (key.includes('[') && key.includes(']')) {
      const field = key.split('[')[0];
      const operator = key.split('[')[1].replace(']', '');
      if (!parsed[field]) parsed[field] = {};

      parsed[field][`$${operator}`] =
        operator === 'in' ? value.split(',') : isNaN(value) ? value : +value;
    } else {
      parsed[key] = isNaN(value) ? value : +value;
    }
  }
  return parsed;
};

export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const queryobj = { ...req.query };
    const excludeFields = ['page', 'limit', 'sort', 'search'];
    excludeFields.forEach((el) => delete queryobj[el]);

    const parsedQuery = parseFilterQuery(queryobj);

    // sorting and pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || '-date';

    if (req.query.search) {
      parsedQuery.$or = [
        { category: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const expenses = await Expense.find(parsedQuery)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select('-__v');

    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: {
        expenses,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'expense not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const newExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!newExpense) {
      return res.status(404).json({
        status: 'fail',
        message: 'expense not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        expense: newExpense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'expense not found!',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          numExpenses: { $sum: 1 },
          avgSpent: { $avg: '$amount' },
          minSpent: { $min: '$amount' },
          maxSpent: { $max: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: { $round: ['$total', 2] },
          numExpenses: 1,
          minSpent: 1,
          maxSpent: 1,
          avgSpent: { $round: ['$avgSpent', 2] },
        },
      },
      {
        $sort: { total: 1 },
      },
    ]);

    let totalSpent = stats.reduce((sum, acc) => sum + acc.total, 0);
    totalSpent = +totalSpent.toFixed(2);

    res.status(200).json({
      status: 'success',
      data: {
        totalSpent,
        byCategory: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const monthlyStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        byMonth: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

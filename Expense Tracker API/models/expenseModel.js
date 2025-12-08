import mongoose from 'mongoose';

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'An expense must have an amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit-card', 'online'],
      default: 'cash',
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('expense', expenseSchema);

export default Expense;

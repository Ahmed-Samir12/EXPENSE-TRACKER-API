import fs from 'fs';
import mongoose from 'mongoose';
import Expense from '../models/expenseModel.js';
process.loadEnvFile();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Data base connected'));

const data = JSON.parse(fs.readFileSync('./data/expense-data.json', 'utf-8'));

const importData = async () => {
  try {
    await Expense.create(data);
    console.log('data imported');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Expense.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--import') {
  importData();
}

import mongoose from 'mongoose';
import app from './app.js';

process.loadEnvFile();

const connection = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    console.log('Data base connected successfully');
  } catch (err) {
    console.log('Data base faild to connect');
  }
};

connection();

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});

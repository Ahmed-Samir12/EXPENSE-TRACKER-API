import fs from 'fs';

const categories = [
  'food',
  'transport',
  'bills',
  'entertainment',
  'shopping',
  'health',
  'other',
];

const descriptions = {
  food: [
    'Grocery shopping',
    'Restaurant',
    'Fast food',
    'Coffee shop',
    'Breakfast',
    'Lunch',
    'Dinner',
  ],
  transport: ['Uber', 'Bus', 'Train', 'Parking', 'Gas', 'Taxi'],
  bills: ['Rent', 'Electricity', 'Water', 'Internet', 'Phone', 'Insurance'],
  entertainment: ['Movies', 'Concert', 'Gaming', 'Gym', 'Sports', 'Netflix'],
  shopping: ['Clothes', 'Electronics', 'Books', 'Shoes', 'Accessories'],
  health: ['Doctor', 'Pharmacy', 'Vitamins', 'Dental', 'Gym'],
  other: ['Gifts', 'Donations', 'Pet supplies', 'Haircut'],
};

const paymentMethods = ['cash', 'credit-card', 'online'];

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomAmount = (min, max) => {
  const random = Math.random() * (max - min) + min;
  return +random.toFixed(2);
};

const generateExpense = (count) => {
  const expenses = [];
  const startDate = new Date('2024-10-1');
  const endDate = new Date('2025-12-30');

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const discList = descriptions[category];
    const description = discList[Math.floor(Math.random() * discList.length)];

    expenses.push({
      description,
      amount: randomAmount(5, 300),
      category,
      date: randomDate(startDate, endDate).toISOString(),
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    });
  }

  return expenses;
};

const expenses = generateExpense(60);

fs.writeFileSync('./data/expense-data.json', JSON.stringify(expenses, null, 2));

console.log('generated 50 expenses');

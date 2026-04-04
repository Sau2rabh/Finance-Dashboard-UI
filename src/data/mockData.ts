import type { Transaction } from '../types';

const today = new Date();
const d = (daysAgo: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // ── Income ──────────────────────────────────────────────
  { id: '1',  date: d(0),  amount: 85000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: '2',  date: d(12), amount: 15000, category: 'Salary',        type: 'income',  description: 'Freelance Project' },
  { id: '3',  date: d(20), amount: 4200,  category: 'Others',        type: 'income',  description: 'Stock Dividends' },

  // ── Expenses (current month, realistic totals) ───────────
  { id: '4',  date: d(1),  amount: 20000, category: 'Rent',          type: 'expense', description: 'Monthly Rent' },
  { id: '5',  date: d(0),  amount: 1200,  category: 'Food',          type: 'expense', description: 'Grocery Shopping' },
  { id: '6',  date: d(2),  amount: 650,   category: 'Food',          type: 'expense', description: 'Zomato Order' },
  { id: '7',  date: d(4),  amount: 900,   category: 'Food',          type: 'expense', description: 'Quick Bites' },
  { id: '8',  date: d(6),  amount: 800,   category: 'Food',          type: 'expense', description: 'Weekly Groceries' },
  { id: '9',  date: d(3),  amount: 1800,  category: 'Transport',     type: 'expense', description: 'Uber Cabs' },
  { id: '10', date: d(8),  amount: 1100,  category: 'Transport',     type: 'expense', description: 'Petrol Fill-up' },
  { id: '11', date: d(5),  amount: 3500,  category: 'Utilities',     type: 'expense', description: 'Electricity Bill' },
  { id: '12', date: d(13), amount: 1200,  category: 'Utilities',     type: 'expense', description: 'Internet & Mobile' },
  { id: '13', date: d(4),  amount: 5000,  category: 'Entertainment', type: 'expense', description: 'Dinner with Friends' },
  { id: '14', date: d(10), amount: 800,   category: 'Entertainment', type: 'expense', description: 'Netflix + Spotify' },
  { id: '15', date: d(9),  amount: 3000,  category: 'Shopping',      type: 'expense', description: 'New Shoes' },
  { id: '16', date: d(14), amount: 2200,  category: 'Shopping',      type: 'expense', description: 'Clothes & Accessories' },
  { id: '17', date: d(7),  amount: 1500,  category: 'Health',        type: 'expense', description: 'Gym Membership' },
  { id: '18', date: d(12), amount: 1800,  category: 'Health',        type: 'expense', description: 'Pharmacy' },

  // ── Older transactions (for chart history) ───────────────
  { id: '19', date: d(15), amount: 80000, category: 'Salary',        type: 'income',  description: 'Last Month Salary' },
  { id: '20', date: d(16), amount: 20000, category: 'Rent',          type: 'expense', description: 'Last Month Rent' },
  { id: '21', date: d(17), amount: 3500,  category: 'Utilities',     type: 'expense', description: 'Water & Electricity' },
  { id: '22', date: d(18), amount: 4500,  category: 'Food',          type: 'expense', description: 'Restaurant Lunch' },
  { id: '23', date: d(19), amount: 2700,  category: 'Transport',     type: 'expense', description: 'Fuel for the Month' },
  { id: '24', date: d(21), amount: 5500,  category: 'Shopping',      type: 'expense', description: 'Home Decor' },
  { id: '25', date: d(23), amount: 3800,  category: 'Health',        type: 'expense', description: 'Medical Checkup' },
  { id: '26', date: d(25), amount: 2000,  category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '27', date: d(27), amount: 6000,  category: 'Shopping',      type: 'expense', description: 'Electronics Accessories' },
];

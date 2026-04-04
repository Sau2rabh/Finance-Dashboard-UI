export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Salary' 
  | 'Food' 
  | 'Rent' 
  | 'Shopping' 
  | 'Transport' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Health' 
  | 'Others';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export type Role = 'admin' | 'viewer';
export type Theme = 'light' | 'dark';

export interface FinanceState {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  searchQuery: string;
  filterType: TransactionType | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

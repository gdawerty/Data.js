interface Transaction {
  id: number;
  date: string;
  amount: string;
  is_expense: boolean;
  category: string;
  description: string;
  user_id: number;
}

export default Transaction;
import { create } from "zustand";

interface ExpenseStore {
  expenses: Expense[];
  categoryStatistics: {};
  totalAmountSpent: number;
  addExpense: (expense: Expense) => void;
  loadExpenses: (expenses: Expense[]) => void;
  removeExpense: (expenses: Expense) => void;
  calculateCategoryStatistics: () => void;
  removeAllExpenses: () => void;
}

export interface Expense {
  amount: number;
  category: string;
  date: string;
}

const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  categoryStatistics: {},
  totalAmountSpent: 0,
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),
  loadExpenses: (expenses) => set({ expenses }),
  removeExpense: (expense) =>
    set((state) => ({
      expenses: state.expenses.filter((item) => item !== expense),
    })),
  removeAllExpenses: () => set({ expenses: [] }),
  calculateCategoryStatistics: () => {
    const { expenses } = get();
    const categoryStatistics = {};
    let totalAmountSpent = 0;
    expenses.forEach((expense) => {
      const { category, amount } = expense;

      if (!categoryStatistics[category]) {
        categoryStatistics[category] = amount;
      } else {
        categoryStatistics[category] += amount;
      }

      totalAmountSpent += amount;
    });

    set({ categoryStatistics, totalAmountSpent });
  },
}));

export default useExpenseStore;

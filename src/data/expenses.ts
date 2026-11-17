import type { ComponentProps } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { getCurrencySymbol } from "@/constants/currencies";
import { STORAGE_KEYS } from "@/constants/storage";

// ----------------------------------
export type IconName = ComponentProps<typeof Ionicons>["name"];

export type CategoryKey =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Other";

export type CategoryFilter = CategoryKey | "All";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  icon: IconName;
  color: string;
  background: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: CategoryKey;
  date: string;
  note?: string;
}

export interface MonthOption {
  key: string;
  label: string;
  shortLabel: string;
  year: number;
  monthIndex: number;
}

export const DEFAULT_MONTHLY_BUDGET = 5000;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CATEGORIES: CategoryMeta[] = [
  { key: "Food", label: "Food", icon: "fast-food-outline", color: "#B45309", background: "#FEF3C7" },
  { key: "Transport", label: "Transport", icon: "car-outline", color: "#1D4ED8", background: "#DBEAFE" },
  { key: "Shopping", label: "Shopping", icon: "bag-handle-outline", color: "#BE185D", background: "#FCE7F3" },
  { key: "Bills", label: "Bills", icon: "receipt-outline", color: "#6D28D9", background: "#EDE9FE" },
  { key: "Health", label: "Health", icon: "medkit-outline", color: "#047857", background: "#D1FAE5" },
  {
    key: "Entertainment",
    label: "Fun",
    icon: "game-controller-outline",
    color: "#B91C1C",
    background: "#FEE2E2",
  },
  { key: "Other", label: "Other", icon: "pricetag-outline", color: "#374151", background: "#F3F4F6" },
];

export const getCategoryMeta = (key: CategoryKey): CategoryMeta =>
  CATEGORIES.find((category) => category.key === key) ?? CATEGORIES[CATEGORIES.length - 1];

const padNumber = (value: number): string => String(value).padStart(2, "0");

export const getMonthKey = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}`;

export const toDateInput = (date: Date): string =>
  `${getMonthKey(date)}-${padNumber(date.getDate())}`;

export const getTodayInput = (): string => toDateInput(new Date());

/**
 * Returns the current month plus `count - 1` previous months, newest first.
 */
// export const getMonthOptions = (count = 13): MonthOption[] => {
export const getMonthOptions = (count = 13): MonthOption[] => {
  const today = new Date();

  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const key = getMonthKey(date);
    const monthName = MONTH_NAMES[date.getMonth()];

    return {
      key,
      label: `${monthName} ${date.getFullYear()}`,
      shortLabel: `${monthName.slice(0, 3)} ${date.getFullYear()}`,
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    };
  });
};

// --- For dynamic number of months
export const buildDynamicMonthOptions = (expenses: Expense[]): MonthOption[] => {
  const monthKeys = new Set<string>([getMonthKey()]);

  expenses.forEach((expense) => {
    if (/^\d{4}-\d{2}/.test(expense.date)) {
      monthKeys.add(expense.date.slice(0, 7));
    }
  });

  // Sort newest month first (e.g., "2026-11", "2026-10", "2024-03"...)
  return Array.from(monthKeys)
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [yearStr, monthStr] = key.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monthStr) - 1;
      const monthName = MONTH_NAMES[monthIndex] ?? monthStr;

      return {
        key,
        label: `${monthName} ${year}`,
        shortLabel: `${monthName.slice(0, 3)} ${year}`,
        year,
        monthIndex,
      };
    });
};


export const getDaysInMonth = (monthKey: string): number => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

export const getDefaultDateForMonth = (month: MonthOption): string => {
  const today = new Date();
  const daysInMonth = getDaysInMonth(month.key);
  const day = month.key === getMonthKey(today) ? today.getDate() : Math.min(today.getDate(), daysInMonth);

  return `${month.key}-${padNumber(Math.max(day, 1))}`;
};

export const formatDateLabel = (isoDate: string): string => {
  if (isoDate === getTodayInput()) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isoDate === toDateInput(yesterday)) return "Yesterday";

  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;

  return `${MONTH_NAMES[month - 1].slice(0, 3)} ${day}`;
};

export const formatLongDate = (value: string): string => {
  if (!value) return "—";

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;

  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatAmount = (amount: number): string => {
  const [whole, decimals] = Math.abs(amount).toFixed(2).split(".");
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimals}`;
};

export const formatCompactAmount = (amount: number): string =>
  Math.round(Math.abs(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ----------------------------------
// Expense ID & Storage Helpers
// ----------------------------------

/**
 * Returns the next sequential integer ID (1 if the list is empty, or max(id) + 1).
 */
export const getNextExpenseId = (expenses: Expense[]): number => {
  if (expenses.length === 0) return 1;
  const maxId = expenses.reduce((max, item) => (item.id > max ? item.id : max), 0);
  return maxId + 1;
};

/**
 * Re-indexes all expenses sequentially starting from 1 in ascending order.
 */
export const normalizeSequentialIds = (expenses: Expense[]): Expense[] =>
  expenses.map((expense, index) => ({
    ...expense,
    id: index + 1,
  }));

const parseExpenses = (value: string | null): Expense[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    // Ensure every expense has a valid sequential numeric ID
    return parsed.map((item, index) => ({
      ...item,
      id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : index + 1,
    })) as Expense[];
  } catch {
    return [];
  }
};

/**
 * Loads expenses from AsyncStorage without injecting any dummy/seed data.
 */
export const loadExpensesWithHistory = async (): Promise<Expense[]> => {
  const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.expenses);
  return parseExpenses(storedExpenses);
};

export const persistExpenses = async (expenses: Expense[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
};

export const loadMonthlyBudget = async (): Promise<number> => {
  const storedBudget = await AsyncStorage.getItem(STORAGE_KEYS.monthlyBudget);
  const parsedBudget = Number(storedBudget);

  return Number.isFinite(parsedBudget) && parsedBudget > 0
    ? parsedBudget
    : DEFAULT_MONTHLY_BUDGET;
};

export const loadCurrencySymbol = async (): Promise<string> => {
  const storedCurrency = await AsyncStorage.getItem(STORAGE_KEYS.currency);
  return getCurrencySymbol(storedCurrency);
};


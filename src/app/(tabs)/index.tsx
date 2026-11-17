import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import {
  CATEGORIES,
  CategoryFilter,
  CategoryKey,
  DEFAULT_MONTHLY_BUDGET,
  Expense,
  formatAmount,
  formatCompactAmount,
  formatDateLabel,
  getCategoryMeta,
  getNextExpenseId,
  getTodayInput,
  loadCurrencySymbol,
  loadExpensesWithHistory,
  loadMonthlyBudget,
  normalizeSequentialIds,
  persistExpenses as saveExpensesToStorage,
} from "@/data/expenses";
import { STORAGE_KEYS } from "@/constants/storage";
import { stylesIndex as styles } from "@/styles/index.styles";

export default function ExpensesView() {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(DEFAULT_MONTHLY_BUDGET);
  const [currencySymbol, setCurrencySymbol] = useState<string>("R");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [newCategory, setNewCategory] = useState<CategoryKey>("Food");
  const [newDate, setNewDate] = useState<string>(getTodayInput());
  const [newNote, setNewNote] = useState<string>("");

  const [budgetModalVisible, setBudgetModalVisible] = useState<boolean>(false);
  const [budgetInput, setBudgetInput] = useState<string>(String(DEFAULT_MONTHLY_BUDGET));

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadData = async () => {
        try {
          const [loadedExpenses, loadedBudget, loadedCurrency] = await Promise.all([
            loadExpensesWithHistory(),
            loadMonthlyBudget(),
            loadCurrencySymbol(),
          ]);

          if (!mounted) return;

          setExpenses(loadedExpenses);
          setMonthlyBudget(loadedBudget);
          setBudgetInput(String(loadedBudget));
          setCurrencySymbol(loadedCurrency);
        } catch (error) {
          console.error("Failed to load expense data", error);
        }
      };

      loadData();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const notify = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const persistExpenses = async (nextExpenses: Expense[]) => {
    setExpenses(nextExpenses);
    try {
      await saveExpensesToStorage(nextExpenses);
    } catch (error) {
      console.error("Failed to save expenses", error);
    }
  };

  const totalSpent = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const today = getTodayInput();

    const ytdExpenses = expenses.filter(
      (expense) => expense.date >= yearStart && expense.date <= today
    );

    const total = ytdExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      total,
    };
  }, [expenses]);

  const currentMonthKey = getTodayInput().slice(0, 7);
  const monthSpent = useMemo(
    () =>
      expenses
        .filter((expense) => expense.date.startsWith(currentMonthKey))
        .reduce((sum, expense) => sum + expense.amount, 0),
    [expenses, currentMonthKey]
  );

  const budgetPercent = monthlyBudget > 0 ? Math.round((monthSpent / monthlyBudget) * 100) : 0;
  const isOverBudget = monthSpent > monthlyBudget;
  const remainingBudget = Math.max(monthlyBudget - monthSpent, 0);

  const categoryTotals = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        total: expenses
          .filter((expense) => expense.category === category.key)
          .reduce((sum, expense) => sum + expense.amount, 0),
      }))
        .filter((category) => category.total > 0)
        .sort((a, b) => b.total - a.total),
    [expenses]
  );

  const visibleExpenses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return expenses
      .filter((expense) => activeCategory === "All" || expense.category === activeCategory)
      .filter((expense) => {
        if (!query) return true;
        return (
          expense.title.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query) ||
          (expense.note ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [expenses, searchQuery, activeCategory]);

  const openAddModal = () => {
    setNewTitle("");
    setNewAmount("");
    setNewCategory("Food");
    setNewDate(getTodayInput());
    setNewNote("");
    setAddModalVisible(true);
  };

  const handleAddExpense = () => {
    const title = newTitle.trim();
    const parsedAmount = Number(newAmount.replace(",", ".").trim());
    const date = newDate.trim();

    if (!title) {
      notify("Missing details", "Please enter what you spent on.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      notify("Invalid amount", "Please enter an amount greater than zero.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      notify("Invalid date", "Please use the YYYY-MM-DD format, for example 2026-10-29.");
      return;
    }

    const newExpense: Expense = {
      id: getNextExpenseId(expenses),
      title,
      amount: parsedAmount,
      category: newCategory,
      date,
      note: newNote.trim() || undefined,
    };

    persistExpenses([newExpense, ...expenses]);
    setAddModalVisible(false);
  };

  const handleDeleteExpense = (expense: Expense) => {
    const removeExpense = () => {
      const remaining = expenses.filter((item) => item.id !== expense.id);
      persistExpenses(normalizeSequentialIds(remaining));
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${expense.title}"?`)) {
        removeExpense();
      }
      return;
    }

    Alert.alert("Delete expense", `Remove "${expense.title}" from your expenses?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: removeExpense },
    ]);
  };

  const openBudgetModal = () => {
    setBudgetInput(String(monthlyBudget));
    setBudgetModalVisible(true);
  };

  const handleSaveBudget = async () => {
    const parsedBudget = Number(budgetInput.replace(",", ".").trim());

    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      notify("Invalid budget", "Please enter a monthly budget greater than zero.");
      return;
    }

    setMonthlyBudget(parsedBudget);
    setBudgetModalVisible(false);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.monthlyBudget, String(parsedBudget));
    } catch (error) {
      console.error("Failed to save budget", error);
    }
  };

  const renderCategoryIcon = (category: CategoryKey, size = 20) => {
    const meta = getCategoryMeta(category);
    return (
      <View style={[styles.categoryIconWrap, { backgroundColor: meta.background }]}>
        <Ionicons name={meta.icon} size={size} color={meta.color} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Summary</Text>
              <Text style={styles.headerSubtitle}>
                Track where your money goes, one expense at a time.
              </Text>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
              <Pressable style={styles.budgetEditButton} onPress={openBudgetModal}>
                <Ionicons name="options-outline" size={14} color="#D1FAE5" />
                <Text style={styles.budgetEditText}>Budget</Text>
              </Pressable>
            </View>

            <Text style={styles.summaryAmount}>
              {currencySymbol} {formatAmount(totalSpent.total)}
            </Text>

            <View style={styles.summaryStatsRow}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>
                  {currencySymbol} {formatCompactAmount(monthSpent)}
                </Text>
                <Text style={styles.summaryStatLabel}>This month</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>{expenses.length}</Text>
                <Text style={styles.summaryStatLabel}>Transactions</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>
                  {currencySymbol} {formatCompactAmount(monthlyBudget)}
                </Text>
                <Text style={styles.summaryStatLabel}>Budget</Text>
              </View>
            </View>

            <View style={styles.budgetRow}>
              <Text style={styles.budgetText}>{budgetPercent}% of monthly budget used</Text>
              <Text style={styles.budgetText}>
                {isOverBudget
                  ? `${currencySymbol} ${formatAmount(monthSpent - monthlyBudget)} over`
                  : `${currencySymbol} ${formatAmount(remainingBudget)} left`}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(Math.max(budgetPercent, 0), 100)}%` as `${number}%`,
                    backgroundColor: isOverBudget ? "#EF4444" : "#95F376",
                  },
                ]}
              />
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          {/* Category filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsRow}
          >
            <Pressable
              style={[styles.chip, activeCategory === "All" && styles.chipActive]}
              onPress={() => setActiveCategory("All")}
            >
              <Text style={[styles.chipText, activeCategory === "All" && styles.chipTextActive]}>
                All
              </Text>
            </Pressable>

            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.key;
              return (
                <Pressable
                  key={category.key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setActiveCategory(category.key)}
                >
                  <Ionicons
                    name={category.icon}
                    size={15}
                    color={isActive ? "#FFFFFF" : category.color}
                  />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Spending by category */}
          {categoryTotals.length > 0 && (
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownHeaderRow}>
                <Text style={styles.sectionTitle}>Spending by category</Text>
                <Text style={styles.sectionHint}>All time</Text>
              </View>

              {categoryTotals.map((category) => {
                const maxTotal = categoryTotals[0]?.total || 1;
                const barWidth = Math.max((category.total / maxTotal) * 100, 4);

                return (
                  <View key={category.key} style={styles.breakdownRow}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={styles.breakdownLabel}>{category.label}</Text>
                      <Text style={styles.breakdownValue}>
                        {currencySymbol} {formatAmount(category.total)}
                      </Text>
                    </View>
                    <View style={styles.breakdownTrack}>
                      <View
                        style={[
                          styles.breakdownFill,
                          {
                            width: `${barWidth}%` as `${number}%`,
                            backgroundColor: category.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Expense list */}
          <View style={styles.listSection}>
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              <Text style={styles.sectionCount}>{visibleExpenses.length} shown</Text>
            </View>

            {visibleExpenses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>
                  {expenses.length === 0 ? "No expenses yet" : "No matching expenses"}
                </Text>
                <Text style={styles.emptyText}>
                  {expenses.length === 0
                    ? "Add an expense from the Monthly tab to get started."
                    : "Try a different search term or category."}
                </Text>
              </View>
            ) : (
              visibleExpenses.map((expense) => {
                const meta = getCategoryMeta(expense.category);

                return (
                  <View key={expense.id} style={styles.expenseCard}>
                    {renderCategoryIcon(expense.category)}

                    <View style={styles.expenseDetails}>
                      <Text style={styles.expenseTitle} numberOfLines={1}>
                        {expense.title}
                      </Text>
                      <Text style={styles.expenseMeta}>
                        {meta.label} · {formatDateLabel(expense.date)}
                      </Text>
                      {expense.note ? (
                        <Text style={styles.expenseNote} numberOfLines={1}>
                          {expense.note}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.expenseRight}>
                      <Text style={styles.expenseAmount}>
                        -{currencySymbol} {formatAmount(expense.amount)}
                      </Text>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDeleteExpense(expense)}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add expense modal */}
      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Expense</Text>
              <Pressable onPress={() => setAddModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>What did you spend on?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Weekly groceries"
                placeholderTextColor="#9CA3AF"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Amount ({currencySymbol})</Text>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={newAmount}
                onChangeText={setNewAmount}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryPicker}>
                {CATEGORIES.map((category) => {
                  const isActive = newCategory === category.key;

                  return (
                    <Pressable
                      key={category.key}
                      style={[styles.categoryOption, isActive && styles.categoryOptionActive]}
                      onPress={() => setNewCategory(category.key)}
                    >
                      <Ionicons
                        name={category.icon}
                        size={16}
                        color={isActive ? "#B45309" : category.color}
                      />
                      <Text
                        style={[
                          styles.categoryOptionText,
                          isActive && styles.categoryOptionTextActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={newDate}
                onChangeText={setNewDate}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Note (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Paid by card"
                placeholderTextColor="#9CA3AF"
                value={newNote}
                onChangeText={setNewNote}
              />

              <View style={styles.modalActions}>
                <Pressable style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable style={styles.saveButton} onPress={handleAddExpense}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Expense</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Monthly budget modal */}
      <Modal
        animationType="fade"
        transparent
        visible={budgetModalVisible}
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.budgetModalOverlay}>
          <View style={styles.budgetModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Monthly Budget</Text>
              <Pressable onPress={() => setBudgetModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>

            <Text style={styles.budgetHelpText}>
              Set how much you plan to spend each month. Your progress is shown on the summary
              card.
            </Text>

            <Text style={styles.inputLabel}>Budget amount ({currencySymbol})</Text>
            <TextInput
              style={[styles.textInput, styles.amountInput]}
              placeholder="5000"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={budgetInput}
              onChangeText={setBudgetInput}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setBudgetModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={handleSaveBudget}>
                <Text style={styles.saveButtonText}>Save Budget</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}


// import React, { useCallback, useMemo, useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "expo-router";

// import {
//   CATEGORIES,
//   CategoryFilter,
//   CategoryKey,
//   DEFAULT_MONTHLY_BUDGET,
//   Expense,
//   formatAmount,
//   formatCompactAmount,
//   formatDateLabel,
//   getCategoryMeta,
//   getNextExpenseId,
//   getTodayInput,
//   loadCurrencySymbol,
//   loadExpensesWithHistory,
//   loadMonthlyBudget,
//   normalizeSequentialIds,
//   persistExpenses as saveExpensesToStorage,
// } from "@/data/expenses";
// import { STORAGE_KEYS } from "@/constants/storage";
// import { stylesIndex as styles } from "@/styles/index.styles";

// export default function ExpensesView() {
//   const { width } = useWindowDimensions();
//   const horizontalPadding = width >= 768 ? 40 : 20;

//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [monthlyBudget, setMonthlyBudget] = useState<number>(DEFAULT_MONTHLY_BUDGET);
//   const [currencySymbol, setCurrencySymbol] = useState<string>("R");

//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

//   const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
//   const [newTitle, setNewTitle] = useState<string>("");
//   const [newAmount, setNewAmount] = useState<string>("");
//   const [newCategory, setNewCategory] = useState<CategoryKey>("Food");
//   const [newDate, setNewDate] = useState<string>(getTodayInput());
//   const [newNote, setNewNote] = useState<string>("");

//   const [budgetModalVisible, setBudgetModalVisible] = useState<boolean>(false);
//   const [budgetInput, setBudgetInput] = useState<string>(String(DEFAULT_MONTHLY_BUDGET));

//   useFocusEffect(
//     useCallback(() => {
//       let mounted = true;

//       const loadData = async () => {
//         try {
//           const [loadedExpenses, loadedBudget, loadedCurrency] = await Promise.all([
//             loadExpensesWithHistory(),
//             loadMonthlyBudget(),
//             loadCurrencySymbol(),
//           ]);

//           if (!mounted) return;

//           setExpenses(loadedExpenses);
//           setMonthlyBudget(loadedBudget);
//           setBudgetInput(String(loadedBudget));
//           setCurrencySymbol(loadedCurrency);
//         } catch (error) {
//           console.error("Failed to load expense data", error);
//         }
//       };

//       loadData();

//       return () => {
//         mounted = false;
//       };
//     }, [])
//   );

//   const notify = (title: string, message: string) => {
//     if (Platform.OS === "web") {
//       window.alert(`${title}\n\n${message}`);
//     } else {
//       Alert.alert(title, message);
//     }
//   };

//   const persistExpenses = async (nextExpenses: Expense[]) => {
//     setExpenses(nextExpenses);
//     try {
//       await saveExpensesToStorage(nextExpenses);
//     } catch (error) {
//       console.error("Failed to save expenses", error);
//     }
//   };

//   const totalSpent = useMemo(() => {
//     const currentYear = new Date().getFullYear();
//     const yearStart = `${currentYear}-01-01`;
//     const today = getTodayInput();

//     const ytdExpenses = expenses.filter(
//       (expense) => expense.date >= yearStart && expense.date <= today
//     );

//     const total = ytdExpenses.reduce((sum, expense) => sum + expense.amount, 0);

//     return {
//       total,
//     };
//   }, [expenses]);

//   const currentMonthKey = getTodayInput().slice(0, 7);
//   const monthSpent = useMemo(
//     () =>
//       expenses
//         .filter((expense) => expense.date.startsWith(currentMonthKey))
//         .reduce((sum, expense) => sum + expense.amount, 0),
//     [expenses, currentMonthKey]
//   );

//   const budgetPercent = monthlyBudget > 0 ? Math.round((monthSpent / monthlyBudget) * 100) : 0;
//   const isOverBudget = monthSpent > monthlyBudget;
//   const remainingBudget = Math.max(monthlyBudget - monthSpent, 0);

//   const categoryTotals = useMemo(
//     () =>
//       CATEGORIES.map((category) => ({
//         ...category,
//         total: expenses
//           .filter((expense) => expense.category === category.key)
//           .reduce((sum, expense) => sum + expense.amount, 0),
//       }))
//         .filter((category) => category.total > 0)
//         .sort((a, b) => b.total - a.total),
//     [expenses]
//   );

//   const visibleExpenses = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     return expenses
//       .filter((expense) => activeCategory === "All" || expense.category === activeCategory)
//       .filter((expense) => {
//         if (!query) return true;
//         return (
//           expense.title.toLowerCase().includes(query) ||
//           expense.category.toLowerCase().includes(query) ||
//           (expense.note ?? "").toLowerCase().includes(query)
//         );
//       })
//       .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
//   }, [expenses, searchQuery, activeCategory]);

//   const openAddModal = () => {
//     setNewTitle("");
//     setNewAmount("");
//     setNewCategory("Food");
//     setNewDate(getTodayInput());
//     setNewNote("");
//     setAddModalVisible(true);
//   };

//   const handleAddExpense = () => {
//     const title = newTitle.trim();
//     const parsedAmount = Number(newAmount.replace(",", ".").trim());
//     const date = newDate.trim();

//     if (!title) {
//       notify("Missing details", "Please enter what you spent on.");
//       return;
//     }

//     if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
//       notify("Invalid amount", "Please enter an amount greater than zero.");
//       return;
//     }

//     if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//       notify("Invalid date", "Please use the YYYY-MM-DD format, for example 2026-10-29.");
//       return;
//     }

//     const newExpense: Expense = {
//       id: getNextExpenseId(expenses),
//       title,
//       amount: parsedAmount,
//       category: newCategory,
//       date,
//       note: newNote.trim() || undefined,
//     };

//     persistExpenses([newExpense, ...expenses]);
//     setAddModalVisible(false);
//   };

//   const handleDeleteExpense = (expense: Expense) => {
//     const removeExpense = () => {
//       const remaining = expenses.filter((item) => item.id !== expense.id);
//       persistExpenses(normalizeSequentialIds(remaining));
//     };

//     if (Platform.OS === "web") {
//       if (window.confirm(`Delete "${expense.title}"?`)) {
//         removeExpense();
//       }
//       return;
//     }

//     Alert.alert("Delete expense", `Remove "${expense.title}" from your expenses?`, [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: removeExpense },
//     ]);
//   };

//   const openBudgetModal = () => {
//     setBudgetInput(String(monthlyBudget));
//     setBudgetModalVisible(true);
//   };

//   const handleSaveBudget = async () => {
//     const parsedBudget = Number(budgetInput.replace(",", ".").trim());

//     if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
//       notify("Invalid budget", "Please enter a monthly budget greater than zero.");
//       return;
//     }

//     setMonthlyBudget(parsedBudget);
//     setBudgetModalVisible(false);

//     try {
//       await AsyncStorage.setItem(STORAGE_KEYS.monthlyBudget, String(parsedBudget));
//     } catch (error) {
//       console.error("Failed to save budget", error);
//     }
//   };

//   const renderCategoryIcon = (category: CategoryKey, size = 20) => {
//     const meta = getCategoryMeta(category);
//     return (
//       <View style={[styles.categoryIconWrap, { backgroundColor: meta.background }]}>
//         <Ionicons name={meta.icon} size={size} color={meta.color} />
//       </View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.contentWrapper}>
//           {/* Header */}
//           <View style={styles.headerContainer}>
//             <View style={styles.headerTextGroup}>
//               <Text style={styles.headerTitle}>Summary</Text>
//               <Text style={styles.headerSubtitle}>
//                 Track where your money goes, one expense at a time.
//               </Text>
//             </View>
//           </View>

//           {/* Summary */}
//           <View style={styles.summaryCard}>
//             <View style={styles.summaryTopRow}>
//               <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
//               <Pressable style={styles.budgetEditButton} onPress={openBudgetModal}>
//                 <Ionicons name="options-outline" size={14} color="#D1FAE5" />
//                 <Text style={styles.budgetEditText}>Budget</Text>
//               </Pressable>
//             </View>

//             <Text style={styles.summaryAmount}>
//               {currencySymbol} {formatAmount(totalSpent.total)}
//             </Text>

//             <View style={styles.summaryStatsRow}>
//               <View style={styles.summaryStat}>
//                 <Text style={styles.summaryStatValue}>
//                   {currencySymbol} {formatCompactAmount(monthSpent)}
//                 </Text>
//                 <Text style={styles.summaryStatLabel}>This month</Text>
//               </View>

//               <View style={styles.summaryDivider} />

//               <View style={styles.summaryStat}>
//                 <Text style={styles.summaryStatValue}>{expenses.length}</Text>
//                 <Text style={styles.summaryStatLabel}>Transactions</Text>
//               </View>

//               <View style={styles.summaryDivider} />

//               <View style={styles.summaryStat}>
//                 <Text style={styles.summaryStatValue}>
//                   {currencySymbol} {formatCompactAmount(monthlyBudget)}
//                 </Text>
//                 <Text style={styles.summaryStatLabel}>Budget</Text>
//               </View>
//             </View>

//             <View style={styles.budgetRow}>
//               <Text style={styles.budgetText}>{budgetPercent}% of monthly budget used</Text>
//               <Text style={styles.budgetText}>
//                 {isOverBudget
//                   ? `${currencySymbol} ${formatAmount(monthSpent - monthlyBudget)} over`
//                   : `${currencySymbol} ${formatAmount(remainingBudget)} left`}
//               </Text>
//             </View>

//             <View style={styles.progressTrack}>
//               <View
//                 style={[
//                   styles.progressFill,
//                   {
//                     width: `${Math.min(Math.max(budgetPercent, 0), 100)}%` as `${number}%`,
//                     backgroundColor: isOverBudget ? "#EF4444" : "#95F376",
//                   },
//                 ]}
//               />
//             </View>
//           </View>

//           {/* Search */}
//           <View style={styles.searchContainer}>
//             <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search expenses..."
//               placeholderTextColor="#9CA3AF"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
//                 <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//               </Pressable>
//             )}
//           </View>

//           {/* Category filters */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.chipsScroll}
//             contentContainerStyle={styles.chipsRow}
//           >
//             <Pressable
//               style={[styles.chip, activeCategory === "All" && styles.chipActive]}
//               onPress={() => setActiveCategory("All")}
//             >
//               <Text style={[styles.chipText, activeCategory === "All" && styles.chipTextActive]}>
//                 All
//               </Text>
//             </Pressable>

//             {CATEGORIES.map((category) => {
//               const isActive = activeCategory === category.key;
//               return (
//                 <Pressable
//                   key={category.key}
//                   style={[styles.chip, isActive && styles.chipActive]}
//                   onPress={() => setActiveCategory(category.key)}
//                 >
//                   <Ionicons
//                     name={category.icon}
//                     size={15}
//                     color={isActive ? "#FFFFFF" : category.color}
//                   />
//                   <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
//                     {category.label}
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </ScrollView>

//           {/* Spending by category */}
//           {categoryTotals.length > 0 && (
//             <View style={styles.breakdownCard}>
//               <View style={styles.breakdownHeaderRow}>
//                 <Text style={styles.sectionTitle}>Spending by category</Text>
//                 <Text style={styles.sectionHint}>All time</Text>
//               </View>

//               {categoryTotals.map((category) => {
//                 const maxTotal = categoryTotals[0]?.total || 1;
//                 const barWidth = Math.max((category.total / maxTotal) * 100, 4);

//                 return (
//                   <View key={category.key} style={styles.breakdownRow}>
//                     <View style={styles.breakdownLabelRow}>
//                       <Text style={styles.breakdownLabel}>{category.label}</Text>
//                       <Text style={styles.breakdownValue}>
//                         {currencySymbol} {formatAmount(category.total)}
//                       </Text>
//                     </View>
//                     <View style={styles.breakdownTrack}>
//                       <View
//                         style={[
//                           styles.breakdownFill,
//                           {
//                             width: `${barWidth}%` as `${number}%`,
//                             backgroundColor: category.color,
//                           },
//                         ]}
//                       />
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           )}

//           {/* Expense list */}
//           <View style={styles.listSection}>
//             <View style={styles.listHeaderRow}>
//               <Text style={styles.sectionTitle}>Recent Expenses</Text>
//               <Text style={styles.sectionCount}>{visibleExpenses.length} shown</Text>
//             </View>

//             {visibleExpenses.length === 0 ? (
//               <View style={styles.emptyCard}>
//                 <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
//                 <Text style={styles.emptyTitle}>
//                   {expenses.length === 0 ? "No expenses yet" : "No matching expenses"}
//                 </Text>
//                 <Text style={styles.emptyText}>
//                   {expenses.length === 0
//                     ? "Add an expense from the Monthly tab to get started."
//                     : "Try a different search term or category."}
//                 </Text>
//               </View>
//             ) : (
//               visibleExpenses.map((expense) => {
//                 const meta = getCategoryMeta(expense.category);

//                 return (
//                   <View key={expense.id} style={styles.expenseCard}>
//                     {renderCategoryIcon(expense.category)}

//                     <View style={styles.expenseDetails}>
//                       <Text style={styles.expenseTitle} numberOfLines={1}>
//                         {expense.title}
//                       </Text>
//                       <Text style={styles.expenseMeta}>
//                         {meta.label} · {formatDateLabel(expense.date)}
//                       </Text>
//                       {expense.note ? (
//                         <Text style={styles.expenseNote} numberOfLines={1}>
//                           {expense.note}
//                         </Text>
//                       ) : null}
//                     </View>

//                     <View style={styles.expenseRight}>
//                       <Text style={styles.expenseAmount}>
//                         -{currencySymbol} {formatAmount(expense.amount)}
//                       </Text>
//                       <Pressable
//                         style={styles.deleteButton}
//                         onPress={() => handleDeleteExpense(expense)}
//                         hitSlop={8}
//                       >
//                         <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
//                       </Pressable>
//                     </View>
//                   </View>
//                 );
//               })
//             )}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Add expense modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={addModalVisible}
//         onRequestClose={() => setAddModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>New Expense</Text>
//               <Pressable onPress={() => setAddModalVisible(false)} hitSlop={8}>
//                 <Ionicons name="close" size={24} color="#111827" />
//               </Pressable>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <Text style={styles.inputLabel}>What did you spend on?</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="e.g. Weekly groceries"
//                 placeholderTextColor="#9CA3AF"
//                 value={newTitle}
//                 onChangeText={setNewTitle}
//               />

//               <Text style={styles.inputLabel}>Amount ({currencySymbol})</Text>
//               <TextInput
//                 style={[styles.textInput, styles.amountInput]}
//                 placeholder="0.00"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="decimal-pad"
//                 value={newAmount}
//                 onChangeText={setNewAmount}
//               />

//               <Text style={styles.inputLabel}>Category</Text>
//               <View style={styles.categoryPicker}>
//                 {CATEGORIES.map((category) => {
//                   const isActive = newCategory === category.key;

//                   return (
//                     <Pressable
//                       key={category.key}
//                       style={[styles.categoryOption, isActive && styles.categoryOptionActive]}
//                       onPress={() => setNewCategory(category.key)}
//                     >
//                       <Ionicons
//                         name={category.icon}
//                         size={16}
//                         color={isActive ? "#B45309" : category.color}
//                       />
//                       <Text
//                         style={[
//                           styles.categoryOptionText,
//                           isActive && styles.categoryOptionTextActive,
//                         ]}
//                       >
//                         {category.label}
//                       </Text>
//                     </Pressable>
//                   );
//                 })}
//               </View>

//               <Text style={styles.inputLabel}>Date</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="YYYY-MM-DD"
//                 placeholderTextColor="#9CA3AF"
//                 value={newDate}
//                 onChangeText={setNewDate}
//                 autoCapitalize="none"
//               />

//               <Text style={styles.inputLabel}>Note (optional)</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="e.g. Paid by card"
//                 placeholderTextColor="#9CA3AF"
//                 value={newNote}
//                 onChangeText={setNewNote}
//               />

//               <View style={styles.modalActions}>
//                 <Pressable style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </Pressable>

//                 <Pressable style={styles.saveButton} onPress={handleAddExpense}>
//                   <Ionicons name="checkmark" size={18} color="#FFFFFF" />
//                   <Text style={styles.saveButtonText}>Save Expense</Text>
//                 </Pressable>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* Monthly budget modal */}
//       <Modal
//         animationType="fade"
//         transparent
//         visible={budgetModalVisible}
//         onRequestClose={() => setBudgetModalVisible(false)}
//       >
//         <View style={styles.budgetModalOverlay}>
//           <View style={styles.budgetModalCard}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Monthly Budget</Text>
//               <Pressable onPress={() => setBudgetModalVisible(false)} hitSlop={8}>
//                 <Ionicons name="close" size={24} color="#111827" />
//               </Pressable>
//             </View>

//             <Text style={styles.budgetHelpText}>
//               Set how much you plan to spend each month. Your progress is shown on the summary
//               card.
//             </Text>

//             <Text style={styles.inputLabel}>Budget amount ({currencySymbol})</Text>
//             <TextInput
//               style={[styles.textInput, styles.amountInput]}
//               placeholder="5000"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="decimal-pad"
//               value={budgetInput}
//               onChangeText={setBudgetInput}
//             />

//             <View style={styles.modalActions}>
//               <Pressable style={styles.cancelButton} onPress={() => setBudgetModalVisible(false)}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </Pressable>

//               <Pressable style={styles.saveButton} onPress={handleSaveBudget}>
//                 <Text style={styles.saveButtonText}>Save Budget</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }




// new

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Head from 'expo-router/head';

const STORAGE_KEY = '@notes_app_data';
const FOLDERS_STORAGE_KEY = '@notes_app_folders';

// Theme Palette
const COLORS = {
  bg: '#0F1115',
  surface: '#1A1D24',
  surfaceElevated: '#242832',
  border: '#2E3340',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  accent: '#F59E0B', // Yellow-Orange
  accentText: '#111827',
  danger: '#EF4444',
};

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  folderId?: string | null;
}

interface Folder {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  isPredefined?: boolean;
}

const PREDEFINED_FOLDERS: Folder[] = [
  { id: 'favorites', name: 'Favorites', icon: 'star', isPredefined: true },
  { id: 'ideas', name: 'Ideas', icon: 'bulb', isPredefined: true },
];

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>(PREDEFINED_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [noteFolderId, setNoteFolderId] = useState<string | null>(null);

  // Folder Create/Edit Modal State
  const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState<string>('');

  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedNotes, storedFolders] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(FOLDERS_STORAGE_KEY),
      ]);

      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes) as Note[]);
      }

      if (storedFolders !== null) {
        const customFolders = JSON.parse(storedFolders) as Folder[];
        setFolders([...PREDEFINED_FOLDERS, ...customFolders]);
      }
    } catch (error) {
      console.error('Failed to load notes or folders.', error);
    }
  };

  const saveNotesToStorage = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to save notes.', error);
    }
  };

  const saveCustomFoldersToStorage = async (allFolders: Folder[]) => {
    try {
      const customOnly = allFolders.filter((f) => !f.isPredefined);
      await AsyncStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(customOnly));
      setFolders(allFolders);
    } catch (error) {
      console.error('Failed to save folders.', error);
    }
  };

  // ----------------------------------
  // Folder CRUD Handlers
  // ----------------------------------
  const openCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderNameInput('');
    setFolderModalVisible(true);
  };

  const openEditFolderModal = (folder: Folder) => {
    if (folder.isPredefined) return;
    setEditingFolder(folder);
    setFolderNameInput(folder.name);
    setFolderModalVisible(true);
  };

  const closeFolderModal = () => {
    setFolderModalVisible(false);
    setEditingFolder(null);
    setFolderNameInput('');
  };

  const handleSaveFolder = async () => {
    const trimmed = folderNameInput.trim();
    if (!trimmed) {
      if (Platform.OS === 'web') {
        window.alert('Folder name cannot be empty.');
      } else {
        Alert.alert('Validation', 'Folder name cannot be empty.');
      }
      return;
    }

    const duplicate = folders.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase() && f.id !== editingFolder?.id
    );
    if (duplicate) {
      if (Platform.OS === 'web') {
        window.alert('A folder with this name already exists.');
      } else {
        Alert.alert('Duplicate', 'A folder with this name already exists.');
      }
      return;
    }

    if (editingFolder) {
      const updatedFolders = folders.map((f) =>
        f.id === editingFolder.id ? { ...f, name: trimmed } : f
      );
      await saveCustomFoldersToStorage(updatedFolders);
    } else {
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: trimmed,
        icon: 'folder',
        isPredefined: false,
      };
      await saveCustomFoldersToStorage([...folders, newFolder]);
      setSelectedFolderId(newFolder.id);
    }

    closeFolderModal();
  };

  const handleDeleteFolder = (folder: Folder) => {
    if (folder.isPredefined) return;

    const performDelete = async () => {
      const updatedFolders = folders.filter((f) => f.id !== folder.id);
      await saveCustomFoldersToStorage(updatedFolders);

      // Unassign notes in this folder rather than deleting them
      const updatedNotes = notes.map((n) =>
        n.folderId === folder.id ? { ...n, folderId: null } : n
      );
      await saveNotesToStorage(updatedNotes);

      if (selectedFolderId === folder.id) {
        setSelectedFolderId('all');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Delete folder "${folder.name}"? Notes inside will remain in All Notes.`
      );
      if (confirmed) performDelete();
    } else {
      Alert.alert(
        'Delete Folder',
        `Delete "${folder.name}"? Notes inside will remain in All Notes.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: performDelete },
        ]
      );
    }
  };

  // ----------------------------------
  // Note CRUD Handlers
  // ----------------------------------
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Note cannot be empty.');
      } else {
        Alert.alert('Validation', 'Note cannot be empty.');
      }
      return;
    }

    const timestamp = new Date().toLocaleString();

    if (currentNoteId) {
      const updatedNotes: Note[] = notes.map((note) =>
        note.id === currentNoteId
          ? {
              ...note,
              title: title.trim() || 'Untitled Note',
              content: content.trim(),
              updatedAt: timestamp,
              folderId: noteFolderId,
            }
          : note
      );
      saveNotesToStorage(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        updatedAt: timestamp,
        folderId: noteFolderId,
      };
      saveNotesToStorage([newNote, ...notes]);
    }

    closeModal();
  };

  const handleDeleteNote = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this note?');
      if (confirmed) {
        const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
        saveNotesToStorage(updatedNotes);
      }
    } else {
      Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
            saveNotesToStorage(updatedNotes);
          },
        },
      ]);
    }
  };

  const openModalForEdit = (note: Note) => {
    setCurrentNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setNoteFolderId(note.folderId ?? null);
    setModalVisible(true);
  };

  const openModalForCreate = () => {
    setCurrentNoteId(null);
    setTitle('');
    setContent('');
    setNoteFolderId(selectedFolderId === 'all' ? null : selectedFolderId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentNoteId(null);
    setTitle('');
    setContent('');
    setNoteFolderId(null);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesFolder =
      selectedFolderId === 'all' || note.folderId === selectedFolderId;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFolderById = (id?: string | null) =>
    folders.find((f) => f.id === id);

  const activeFolderObj = folders.find((f) => f.id === selectedFolderId);

  return (
    <>
      <Head>
        <title>My Notes | Money Manager</title>
      </Head>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>My Notes</Text>
                <Text style={styles.headerSubtitle}>
                  Organize your budget notes, favorites, and ideas.
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.noteCount}>
                  {filteredNotes.length}{' '}
                  {filteredNotes.length === 1 ? 'note' : 'notes'}
                </Text>
              </View>
            </View>

            {/* Folders Horizontal Bar */}
            <View style={styles.foldersSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.foldersScrollContent}
              >
                {/* All Notes Tab */}
                <TouchableOpacity
                  style={[
                    styles.folderChip,
                    selectedFolderId === 'all' && styles.folderChipActive,
                  ]}
                  onPress={() => setSelectedFolderId('all')}
                >
                  <Ionicons
                    name="layers-outline"
                    size={16}
                    color={
                      selectedFolderId === 'all'
                        ? COLORS.accentText
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.folderChipText,
                      selectedFolderId === 'all' && styles.folderChipTextActive,
                    ]}
                  >
                    All ({notes.length})
                  </Text>
                </TouchableOpacity>

                {/* Predefined & Custom Folders */}
                {folders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id;
                  const count = notes.filter((n) => n.folderId === folder.id).length;

                  return (
                    <TouchableOpacity
                      key={folder.id}
                      style={[
                        styles.folderChip,
                        isSelected && styles.folderChipActive,
                      ]}
                      onPress={() => setSelectedFolderId(folder.id)}
                    >
                      <Ionicons
                        name={folder.icon}
                        size={15}
                        color={isSelected ? COLORS.accentText : COLORS.accent}
                      />
                      <Text
                        style={[
                          styles.folderChipText,
                          isSelected && styles.folderChipTextActive,
                        ]}
                      >
                        {folder.name} ({count})
                      </Text>

                      {/* Edit/Delete controls for custom folders */}
                      {!folder.isPredefined && (
                        <View style={styles.folderChipActions}>
                          <TouchableOpacity
                            onPress={() => openEditFolderModal(folder)}
                            hitSlop={6}
                            style={styles.folderMiniAction}
                          >
                            <Ionicons
                              name="pencil"
                              size={13}
                              color={
                                isSelected ? COLORS.accentText : COLORS.textSecondary
                              }
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteFolder(folder)}
                            hitSlop={6}
                            style={styles.folderMiniAction}
                          >
                            <Ionicons
                              name="trash"
                              size={13}
                              color={isSelected ? COLORS.accentText : COLORS.danger}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Add Folder Button */}
                <TouchableOpacity
                  style={styles.addFolderChip}
                  onPress={openCreateFolderModal}
                >
                  <Ionicons name="add" size={16} color={COLORS.accent} />
                  <Text style={styles.addFolderChipText}>New Folder</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={COLORS.accent}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  activeFolderObj
                    ? `Search in ${activeFolderObj.name}...`
                    : 'Search all notes...'
                }
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={64}
                  color={COLORS.border}
                />
                <Text style={styles.emptyText}>
                  {activeFolderObj
                    ? `No notes in "${activeFolderObj.name}"`
                    : 'No notes found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to create a note here.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredNotes.map((item) => {
                  const assignedFolder = getFolderById(item.folderId);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.noteCard}
                      activeOpacity={0.75}
                      onPress={() => openModalForEdit(item)}
                    >
                      <View style={styles.noteAccentBar} />
                      <View style={styles.noteContentContainer}>
                        <View style={styles.noteTopMetaRow}>
                          <Text style={styles.noteTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          {assignedFolder && (
                            <View style={styles.noteFolderBadge}>
                              <Ionicons
                                name={assignedFolder.icon}
                                size={11}
                                color={COLORS.accent}
                              />
                              <Text style={styles.noteFolderBadgeText}>
                                {assignedFolder.name}
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.noteSnippet} numberOfLines={2}>
                          {item.content}
                        </Text>
                        <Text style={styles.noteDate}>{item.updatedAt}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteNote(item.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={openModalForCreate}
        >
          <Ionicons name="add" size={28} color={COLORS.accentText} />
        </TouchableOpacity>

        {/* Add/Edit Note Bottom Sheet Overlay */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeModal} />

            <View style={styles.modalContent}>
              <View style={styles.sheetHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {currentNoteId ? 'Edit Note' : 'New Note'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Folder Selector inside Note Sheet */}
              <View style={styles.noteFolderSelectorWrapper}>
                <Text style={styles.folderSelectorLabel}>Folder:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.noteFolderPillsRow}
                >
                  <TouchableOpacity
                    style={[
                      styles.noteFolderPill,
                      noteFolderId === null && styles.noteFolderPillActive,
                    ]}
                    onPress={() => setNoteFolderId(null)}
                  >
                    <Text
                      style={[
                        styles.noteFolderPillText,
                        noteFolderId === null && styles.noteFolderPillTextActive,
                      ]}
                    >
                      None
                    </Text>
                  </TouchableOpacity>

                  {folders.map((folder) => {
                    const active = noteFolderId === folder.id;
                    return (
                      <TouchableOpacity
                        key={folder.id}
                        style={[
                          styles.noteFolderPill,
                          active && styles.noteFolderPillActive,
                        ]}
                        onPress={() => setNoteFolderId(folder.id)}
                      >
                        <Ionicons
                          name={folder.icon}
                          size={13}
                          color={active ? COLORS.accentText : COLORS.accent}
                        />
                        <Text
                          style={[
                            styles.noteFolderPillText,
                            active && styles.noteFolderPillTextActive,
                          ]}
                        >
                          {folder.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <TextInput
                style={styles.inputTitle}
                placeholder="Title"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={styles.inputBody}
                placeholder="Start typing your note here..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                  <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Create / Edit Folder Bottom Sheet Overlay */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={folderModalVisible}
          onRequestClose={closeFolderModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeFolderModal} />

            <View style={styles.modalContent}>
              <View style={styles.sheetHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {editingFolder ? 'Rename Folder' : 'Create Folder'}
                </Text>
                <TouchableOpacity onPress={closeFolderModal}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.inputTitle}
                placeholder="Folder name (e.g. Bills, Savings Goals)"
                placeholderTextColor={COLORS.textMuted}
                value={folderNameInput}
                onChangeText={setFolderNameInput}
                autoFocus
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeFolderModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveFolder}
                >
                  <Text style={styles.saveButtonText}>
                    {editingFolder ? 'Update Folder' : 'Create Folder'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  noteCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },

  // Folders Bar
  foldersSection: {
    marginBottom: 16,
  },
  foldersScrollContent: {
    gap: 8,
    paddingVertical: 2,
    alignItems: 'center',
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  folderChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  folderChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  folderChipTextActive: {
    color: COLORS.accentText,
  },
  folderChipActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.18)',
    gap: 6,
  },
  folderMiniAction: {
    padding: 2,
  },
  addFolderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addFolderChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },

  // Empty & Notes List
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 14,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  listContainer: {
    gap: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    overflow: 'hidden',
  },
  noteAccentBar: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginRight: 14,
  },
  noteContentContainer: {
    flex: 1,
    paddingRight: 12,
  },
  noteTopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  noteTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noteFolderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  noteFolderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  noteSnippet: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  // Bottom Sheet Overlays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  // Folder selector inside Note modal
  noteFolderSelectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  folderSelectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  noteFolderPillsRow: {
    gap: 8,
    alignItems: 'center',
  },
  noteFolderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  noteFolderPillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  noteFolderPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  noteFolderPillTextActive: {
    color: COLORS.accentText,
  },

  inputTitle: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  inputBody: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    minHeight: 150,
    marginBottom: 20,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 15,
  },
});



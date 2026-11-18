// // // import type { Expense } from "../data/expenses";


// // // /** 
// // //  * EXPORT FEATURE
// // //  * ==============
// // // */
// // // export type ExportFormat = "json" | "csv" | "xls";

// // // export interface BackupData {
// // //   expenses: Expense[];
// // //   monthlyBudget: number | null;
// // //   currency: string | null;
// // //   profile: Record<string, unknown> | null;
// // //   firstUsed: string | null;
// // //   monthlyDummySeeded: boolean;
// // //   notes: unknown[];
// // // }

// // // export interface BackupFile {
// // //   app: "Money Manager";
// // //   version: "1.1";
// // //   exportDate: string;
// // //   data: Record<string, unknown>;
// // // }

// // // export interface ImportData {
// // //   expenses?: Expense[];
// // //   monthlyBudget?: number;
// // //   currency?: string;
// // //   profile?: Record<string, unknown>;
// // //   firstUsed?: string;
// // //   monthlyDummySeeded?: boolean;
// // //   notes?: unknown[];
// // // }

// // // export const isRecord = (value: unknown): value is Record<string, unknown> =>
// // //   typeof value === "object" && value !== null && !Array.isArray(value);

// // // export const isExpense = (value: unknown): value is Expense => {
// // //   if (!isRecord(value)) return false;

// // //   return (
// // //     typeof value.id === "number" &&
// // //     Number.isFinite(value.id) &&
// // //     typeof value.title === "string" &&
// // //     typeof value.amount === "number" &&
// // //     Number.isFinite(value.amount) &&
// // //     typeof value.category === "string" &&
// // //     typeof value.date === "string" &&
// // //     /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
// // //     (value.note === undefined || typeof value.note === "string")
// // //   );
// // // };

// // // export const escapeCsv = (value: unknown): string => {
// // //   const text = value === null || value === undefined ? "" : String(value);
// // //   return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
// // // };

// // // export const escapeXml = (value: string): string =>
// // //   value
// // //     .replace(/&/g, "&amp;")
// // //     .replace(/</g, "&lt;")
// // //     .replace(/>/g, "&gt;")
// // //     .replace(/"/g, "&quot;")
// // //     .replace(/'/g, "&apos;");

// // // /**
// // //  * Builds the JSON backup file. Empty/unknown values are omitted so a fresh
// // //  * install does not export `null` fields that look like invalid data on import.
// // //  */
// // // export const createBackupFile = (data: BackupData): BackupFile => {
// // //   const payload: Record<string, unknown> = {
// // //     expenses: data.expenses,
// // //     monthlyDummySeeded: data.monthlyDummySeeded,
// // //     notes: data.notes,
// // //   };

// // //   if (data.monthlyBudget !== null) payload.monthlyBudget = data.monthlyBudget;
// // //   if (data.currency !== null) payload.currency = data.currency;
// // //   if (data.profile !== null) payload.profile = data.profile;
// // //   if (data.firstUsed !== null) payload.firstUsed = data.firstUsed;

// // //   return {
// // //     app: "Money Manager",
// // //     version: "1.1",
// // //     exportDate: new Date().toISOString(),
// // //     data: payload,
// // //   };
// // // };

// // // export const buildCsv = (expenses: Expense[], currency: string | null): string => {
// // //   const header = ["Date", "Title", "Category", "Amount", "Currency", "Note"];
// // //   const rows = [...expenses]
// // //     .sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id)
// // //     .map((expense) => [
// // //       expense.date,
// // //       expense.title,
// // //       expense.category,
// // //       expense.amount.toFixed(2),
// // //       currency ?? "",
// // //       expense.note ?? "",
// // //     ]);

// // //   const csv = [header, ...rows]
// // //     .map((row) => row.map(escapeCsv).join(","))
// // //     .join("\r\n");

// // //   // BOM helps Excel detect UTF-8 correctly.
// // //   return `\uFEFF${csv}\r\n`;
// // // };

// // // export const buildXls = (backup: BackupData): string => {
// // //   const expenses = [...backup.expenses].sort(
// // //     (a, b) => a.date.localeCompare(b.date) || a.id - b.id
// // //   );

// // //   const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
// // //   const months = new Set(expenses.map((expense) => expense.date.slice(0, 7))).size;
// // //   const profile = backup.profile;

// // //   const cell = (value: string | number, style?: string): string => {
// // //     const isNumber = typeof value === "number" && Number.isFinite(value);
// // //     const styleAttr = style ? ` ss:StyleID="${style}"` : "";

// // //     return `<Cell${styleAttr}><Data ss:Type="${isNumber ? "Number" : "String"}">${escapeXml(
// // //       String(value)
// // //     )}</Data></Cell>`;
// // //   };

// // //   const row = (...cells: string[]): string => `<Row>${cells.join("")}</Row>`;
// // //   const worksheet = (name: string, width: number, rows: string[]): string =>
// // //     `<Worksheet ss:Name="${escapeXml(name)}"><Table><Column ss:Width="${width}"/>${rows.join(
// // //       ""
// // //     )}</Table></Worksheet>`;

// // //   const expenseRows = [
// // //     row(
// // //       cell("Date", "Header"),
// // //       cell("Title", "Header"),
// // //       cell("Category", "Header"),
// // //       cell("Amount", "Header"),
// // //       cell("Currency", "Header"),
// // //       cell("Note", "Header")
// // //     ),
// // //     ...expenses.map((expense) =>
// // //       row(
// // //         cell(expense.date),
// // //         cell(expense.title),
// // //         cell(expense.category),
// // //         cell(expense.amount),
// // //         cell(backup.currency ?? ""),
// // //         cell(expense.note ?? "")
// // //       )
// // //     ),
// // //   ];

// // //   const summaryRows = [
// // //     row(cell("Money Manager export", "Title")),
// // //     row(cell("Exported", "Header"), cell(new Date().toLocaleString())),
// // //     row(cell("Total expenses", "Header"), cell(Number(total.toFixed(2)))),
// // //     row(cell("Transactions", "Header"), cell(expenses.length)),
// // //     row(cell("Months tracked", "Header"), cell(months)),
// // //     row(
// // //       cell("Average per month", "Header"),
// // //       cell(months > 0 ? Number((total / months).toFixed(2)) : 0)
// // //     ),
// // //     row(
// // //       cell("Monthly budget", "Header"),
// // //       cell(backup.monthlyBudget !== null ? backup.monthlyBudget : "")
// // //     ),
// // //     row(cell("Currency", "Header"), cell(backup.currency ?? "")),
// // //   ];

// // //   const profileRows = [
// // //     row(cell("Profile", "Title")),
// // //     row(cell("Username", "Header"), cell(String(profile?.username ?? "Guest User"))),
// // //     row(cell("User ID", "Header"), cell(String(profile?.userId ?? ""))),
// // //     row(cell("First used", "Header"), cell(backup.firstUsed ?? "")),
// // //     row(
// // //       cell("Profile photo", "Header"),
// // //       cell(profile?.imageUri ? "Saved in app backup (JSON)" : "None")
// // //     ),
// // //   ];

// // //   return `<?xml version="1.0"?>
// // // <?mso-application progid="Excel.Sheet"?>
// // // <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
// // //  xmlns:o="urn:schemas-microsoft-com:office:office"
// // //  xmlns:x="urn:schemas-microsoft-com:office:excel"
// // //  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
// // //  <Styles>
// // //   <Style ss:ID="Header">
// // //    <Font ss:Bold="1" ss:Color="#14532D"/>
// // //    <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
// // //   </Style>
// // //   <Style ss:ID="Title">
// // //    <Font ss:Bold="1" ss:Size="14" ss:Color="#111827"/>
// // //   </Style>
// // //  </Styles>
// // //  ${worksheet("Expenses", 180, expenseRows)}
// // //  ${worksheet("Summary", 220, summaryRows)}
// // //  ${worksheet("Profile", 220, profileRows)}
// // // </Workbook>`;
// // // };



// // // /**
// // //  * IMPORT FEATURE 
// // //  * ==============
// // //  * Accepts the current Money Manager backup format and the older flat format
// // //  * (notes / currency at the top level). Coerces legacy string IDs into sequential numbers.
// // //  */
// // // export const normalizeImport = (parsed: unknown): ImportData => {
// // //   if (!isRecord(parsed)) {
// // //     throw new Error("The selected file does not contain a JSON object.");
// // //   }

// // //   const source = isRecord(parsed.data) ? parsed.data : parsed;
// // //   const knownKeys = [
// // //     "expenses",
// // //     "monthlyBudget",
// // //     "currency",
// // //     "profile",
// // //     "firstUsed",
// // //     "monthlyDummySeeded",
// // //     "notes",
// // //   ];

// // //   if (!knownKeys.some((key) => key in source)) {
// // //     throw new Error("This does not look like a Money Manager backup.");
// // //   }

// // //   const data: ImportData = {};

// // //   if ("expenses" in source && source.expenses !== null) {
// // //     if (!Array.isArray(source.expenses)) {
// // //       throw new Error("The backup contains invalid expense entries.");
// // //     }

// // //     const normalizedExpenses = source.expenses.map((item, index) => {
// // //       if (!isRecord(item)) return item;

// // //       const numericId =
// // //         typeof item.id === "number" && Number.isFinite(item.id)
// // //           ? item.id
// // //           : typeof item.id === "string" && /^\d+$/.test(item.id.trim())
// // //           ? Number(item.id.trim())
// // //           : index + 1;

// // //       return {
// // //         ...item,
// // //         id: numericId,
// // //       };
// // //     });

// // //     if (!normalizedExpenses.every(isExpense)) {
// // //       throw new Error("The backup contains invalid expense entries.");
// // //     }

// // //     data.expenses = normalizedExpenses;
// // //   }

// // //   if ("monthlyBudget" in source && source.monthlyBudget !== null) {
// // //     if (
// // //       typeof source.monthlyBudget !== "number" ||
// // //       !Number.isFinite(source.monthlyBudget) ||
// // //       source.monthlyBudget <= 0
// // //     ) {
// // //       throw new Error("The backup contains an invalid monthly budget.");
// // //     }
// // //     data.monthlyBudget = source.monthlyBudget;
// // //   }

// // //   if ("currency" in source && source.currency !== null) {
// // //     if (typeof source.currency !== "string" || !source.currency.trim()) {
// // //       throw new Error("The backup contains an invalid currency setting.");
// // //     }
// // //     data.currency = source.currency;
// // //   }

// // //   if ("profile" in source && source.profile !== null) {
// // //     if (!isRecord(source.profile)) {
// // //       throw new Error("The backup contains an invalid profile.");
// // //     }
// // //     data.profile = source.profile;
// // //   }

// // //   if ("firstUsed" in source && source.firstUsed !== null) {
// // //     if (typeof source.firstUsed !== "string") {
// // //       throw new Error("The backup contains an invalid first-use date.");
// // //     }
// // //     data.firstUsed = source.firstUsed;
// // //   }

// // //   if ("monthlyDummySeeded" in source) {
// // //     data.monthlyDummySeeded = source.monthlyDummySeeded === true;
// // //   }

// // //   if ("notes" in source && source.notes !== null) {
// // //     if (!Array.isArray(source.notes)) {
// // //       throw new Error("The backup contains invalid notes data.");
// // //     }
// // //     data.notes = source.notes;
// // //   }

// // //   if (Object.keys(data).length === 0) {
// // //     throw new Error("The backup does not contain anything to import.");
// // //   }

// // //   return data;
// // // };


// // // newer
// // import type { Expense } from "../data/expenses";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { Alert, Platform } from "react-native";

// // /**
// // - EXPORT & IMPORT FEATURE (JSON ONLY)
// // - ====================================
// // */

// // export interface BackupData {
// //   expenses: Expense[];
// //   monthlyBudget: number | null;
// //   currency: string | null;
// //   profile: Record<string, unknown> | null;
// //   firstUsed: string | null;
// //   monthlyDummySeeded: boolean;
// //   notes: unknown[];
// //   tasks: unknown[];
// //   links: unknown[];
// //   noteFolders: unknown[];
// //   taskFolders: unknown[];
// //   linkFolders: unknown[];
// // }

// // export interface BackupFile {
// //   app: "Money Manager";
// //   version: "1.2";
// //   exportDate: string;
// //   data: Record<string, unknown>;
// // }

// // export interface ImportData {
// //   expenses?: Expense[];
// //   monthlyBudget?: number;
// //   currency?: string;
// //   profile?: Record<string, unknown>;
// //   firstUsed?: string;
// //   monthlyDummySeeded?: boolean;
// //   notes?: unknown[];
// //   tasks?: unknown[];
// //   links?: unknown[];
// //   noteFolders?: unknown[];
// //   taskFolders?: unknown[];
// //   linkFolders?: unknown[];
// // }

// // export const isRecord = (value: unknown): value is Record<string, unknown> =>
// //   typeof value === "object" && value !== null && !Array.isArray(value);

// // export const isExpense = (value: unknown): value is Expense => {
// //   if (!isRecord(value)) return false;

// //   return (
// //     typeof value.id === "number" &&
// //     Number.isFinite(value.id) &&
// //     typeof value.title === "string" &&
// //     typeof value.amount === "number" &&
// //     Number.isFinite(value.amount) &&
// //     typeof value.category === "string" &&
// //     typeof value.date === "string" &&
// //     /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
// //     (value.note === undefined || typeof value.note === "string")
// //   );
// // };

// // /**
// // - Builds the comprehensive JSON backup file containing expenses, notes, tasks,
// // - links, folders, and profile/username settings.
// //  */
// // export const createBackupFile = (data: BackupData): BackupFile => {
// //   const payload: Record<string, unknown> = {
// //     expenses: data.expenses,
// //     monthlyDummySeeded: data.monthlyDummySeeded,
// //     notes: data.notes,
// //     tasks: data.tasks,
// //     links: data.links,
// //     noteFolders: data.noteFolders,
// //     taskFolders: data.taskFolders,
// //     linkFolders: data.linkFolders,
// //   };

// //   if (data.monthlyBudget !== null) payload.monthlyBudget = data.monthlyBudget;
// //   if (data.currency !== null) payload.currency = data.currency;
// //   if (data.profile !== null) payload.profile = data.profile;
// //   if (data.firstUsed !== null) payload.firstUsed = data.firstUsed;

// //   return {
// //     app: "Money Manager",
// //     version: "1.2",
// //     exportDate: new Date().toISOString(),
// //     data: payload,
// //   };
// // };

// // /**
// // - IMPORT FEATURE (JSON)
// // - =====================
// // - Normalizes and validates the incoming JSON backup file across all app modules.
// //  */
// // export const normalizeImport = (parsed: unknown): ImportData => {
// //   if (!isRecord(parsed)) {
// //     throw new Error("The selected file does not contain a JSON object.");
// //   }

// //   const source = isRecord(parsed.data) ? parsed.data : parsed;
// //   const knownKeys = [
// //     "expenses",
// //     "monthlyBudget",
// //     "currency",
// //     "profile",
// //     "firstUsed",
// //     "monthlyDummySeeded",
// //     "notes",
// //     "tasks",
// //     "links",
// //     "noteFolders",
// //     "taskFolders",
// //     "linkFolders",
// //   ];

// //   if (!knownKeys.some((key) => key in source)) {
// //     throw new Error("This does not look like a Money Manager backup.");
// //   }

// //   const data: ImportData = {};

// //   if ("expenses" in source && source.expenses !== null) {
// //     if (!Array.isArray(source.expenses)) {
// //       throw new Error("The backup contains invalid expense entries.");
// //     }

// //     const normalizedExpenses = source.expenses.map((item, index) => {
// //       if (!isRecord(item)) return item;

// //       const numericId =
// //         typeof item.id === "number" && Number.isFinite(item.id)
// //           ? item.id
// //           : typeof item.id === "string" && /^\d+$/.test(item.id.trim())
// //           ? Number(item.id.trim())
// //           : index + 1;

// //       return {
// //         ...item,
// //         id: numericId,
// //       };
// //     });

// //     if (!normalizedExpenses.every(isExpense)) {
// //       throw new Error("The backup contains invalid expense entries.");
// //     }

// //     data.expenses = normalizedExpenses;
// //   }

// //   if ("monthlyBudget" in source && source.monthlyBudget !== null) {
// //     if (
// //       typeof source.monthlyBudget !== "number" ||
// //       !Number.isFinite(source.monthlyBudget) ||
// //       source.monthlyBudget <= 0
// //     ) {
// //       throw new Error("The backup contains an invalid monthly budget.");
// //     }
// //     data.monthlyBudget = source.monthlyBudget;
// //   }

// //   if ("currency" in source && source.currency !== null) {
// //     if (typeof source.currency !== "string" || !source.currency.trim()) {
// //       throw new Error("The backup contains an invalid currency setting.");
// //     }
// //     data.currency = source.currency;
// //   }

// //   if ("profile" in source && source.profile !== null) {
// //     if (!isRecord(source.profile)) {
// //       throw new Error("The backup contains an invalid profile.");
// //     }
// //     data.profile = source.profile;
// //   }

// //   if ("firstUsed" in source && source.firstUsed !== null) {
// //     if (typeof source.firstUsed !== "string") {
// //       throw new Error("The backup contains an invalid first-use date.");
// //     }
// //     data.firstUsed = source.firstUsed;
// //   }

// //   if ("monthlyDummySeeded" in source) {
// //     data.monthlyDummySeeded = source.monthlyDummySeeded === true;
// //   }

// //   if ("notes" in source && source.notes !== null) {
// //     if (!Array.isArray(source.notes)) {
// //       throw new Error("The backup contains invalid notes data.");
// //     }
// //     data.notes = source.notes;
// //   }

// //   if ("tasks" in source && source.tasks !== null) {
// //     if (!Array.isArray(source.tasks)) {
// //       throw new Error("The backup contains invalid tasks data.");
// //     }
// //     data.tasks = source.tasks;
// //   }

// //   if ("links" in source && source.links !== null) {
// //     if (!Array.isArray(source.links)) {
// //       throw new Error("The backup contains invalid links data.");
// //     }
// //     data.links = source.links;
// //   }

// //   if ("noteFolders" in source && source.noteFolders !== null) {
// //     if (!Array.isArray(source.noteFolders)) {
// //       throw new Error("The backup contains invalid note folders data.");
// //     }
// //     data.noteFolders = source.noteFolders;
// //   }

// //   if ("taskFolders" in source && source.taskFolders !== null) {
// //     if (!Array.isArray(source.taskFolders)) {
// //       throw new Error("The backup contains invalid task folders data.");
// //     }
// //     data.taskFolders = source.taskFolders;
// //   }

// //   if ("linkFolders" in source && source.linkFolders !== null) {
// //     if (!Array.isArray(source.linkFolders)) {
// //       throw new Error("The backup contains invalid link folders data.");
// //     }
// //     data.linkFolders = source.linkFolders;
// //   }

// //   if (Object.keys(data).length === 0) {
// //     throw new Error("The backup does not contain anything to import.");
// //   }

// //   return data;
// // };

// // /**
// // - WEEKLY BACKUP REMINDER UTILITY
// // - ==============================
// //  */
// // const LAST_BACKUP_KEY = "@money_manager_last_backup_timestamp";
// // const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// // // Test duration if needed: const ONE_WEEK_MS = 6 * 1000;

// // export const checkAndPromptWeeklyBackup = async (triggerEmailBackup: () => void) => {
// //   try {
// //     const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
// //     const now = Date.now();

// //     if (!lastBackupStr || now - Number(lastBackupStr) > ONE_WEEK_MS) {
// //       if (Platform.OS === "web") {
// //         if (
// //           window.confirm(
// //             "It's been a week since your last backup. Would you like to email yourself a fresh JSON backup?"
// //           )
// //         ) {
// //           triggerEmailBackup();
// //           await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
// //         }
// //       } else {
// //         Alert.alert(
// //           "Weekly Backup Reminder",
// //           "It's been over a week since your last backup. Would you like to email your secure JSON backup now?",
// //           [
// //             { text: "Later", style: "cancel" },
// //             {
// //               text: "Backup Now",
// //               onPress: async () => {
// //                 triggerEmailBackup();
// //                 await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
// //               },
// //             },
// //           ]
// //         );
// //       }
// //     }
// //   } catch (error) {
// //     console.error("Failed to check weekly backup status", error);
// //   }
// // };



// // newer2
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert, Platform } from "react-native";

// /**
// - NOTES & PRODUCTIVITY EXPORT & IMPORT (JSON ONLY)
// - =================================================
// */

// export interface BackupData {
//   username: string | null;
//   notes: unknown[];
//   tasks: unknown[];
//   links: unknown[];
//   noteFolders: unknown[];
//   taskFolders: unknown[];
//   linkFolders: unknown[];
// }

// export interface BackupFile {
//   app: "Money Manager - Productivity";
//   version: "2.0";
//   exportDate: string;
//   data: Record<string, unknown>;
// }

// export interface ImportData {
//   username?: string;
//   notes?: unknown[];
//   tasks?: unknown[];
//   links?: unknown[];
//   noteFolders?: unknown[];
//   taskFolders?: unknown[];
//   linkFolders?: unknown[];
// }

// export const isRecord = (value: unknown): value is Record<string, unknown> =>
//   typeof value === "object" && value !== null && !Array.isArray(value);

// /**
// - Builds the JSON backup file containing only notes, tasks, links, folders, and username.
//  */
// const stamp = new Date().toISOString().slice(0, 10);
// export const EXPORT_FILE_NAME = `notes_${stamp}.json`;

// export const createBackupFile = (data: BackupData): BackupFile => {
//   const payload: Record<string, unknown> = {
//     notes: data.notes,
//     tasks: data.tasks,
//     links: data.links,
//     noteFolders: data.noteFolders,
//     taskFolders: data.taskFolders,
//     linkFolders: data.linkFolders,
//   };

//   if (data.username !== null) payload.username = data.username;

//   return {
//     app: "Money Manager - Productivity",
//     version: "2.0",
//     exportDate: new Date().toISOString(),
//     data: payload,
//   };
// };

// /**
// - IMPORT FEATURE (JSON)
// - =====================
// - Normalizes and validates the incoming productivity JSON backup file.
//  */
// export const normalizeImport = (parsed: unknown): ImportData => {
//   if (!isRecord(parsed)) {
//     throw new Error("The selected file does not contain a JSON object.");
//   }

//   const source = isRecord(parsed.data) ? parsed.data : parsed;
//   const knownKeys = [
//     "username",
//     "notes",
//     "tasks",
//     "links",
//     "noteFolders",
//     "taskFolders",
//     "linkFolders",
//   ];

//   if (!knownKeys.some((key) => key in source)) {
//     throw new Error("This does not look like a valid productivity backup file.");
//   }

//   const data: ImportData = {};

//   if ("username" in source && source.username !== null) {
//     if (typeof source.username !== "string") {
//       throw new Error("The backup contains an invalid username.");
//     }
//     data.username = source.username;
//   }

//   if ("notes" in source && source.notes !== null) {
//     if (!Array.isArray(source.notes)) {
//       throw new Error("The backup contains invalid notes data.");
//     }
//     data.notes = source.notes;
//   }

//   if ("tasks" in source && source.tasks !== null) {
//     if (!Array.isArray(source.tasks)) {
//       throw new Error("The backup contains invalid tasks data.");
//     }
//     data.tasks = source.tasks;
//   }

//   if ("links" in source && source.links !== null) {
//     if (!Array.isArray(source.links)) {
//       throw new Error("The backup contains invalid links data.");
//     }
//     data.links = source.links;
//   }

//   if ("noteFolders" in source && source.noteFolders !== null) {
//     if (!Array.isArray(source.noteFolders)) {
//       throw new Error("The backup contains invalid note folders data.");
//     }
//     data.noteFolders = source.noteFolders;
//   }

//   if ("taskFolders" in source && source.taskFolders !== null) {
//     if (!Array.isArray(source.taskFolders)) {
//       throw new Error("The backup contains invalid task folders data.");
//     }
//     data.taskFolders = source.taskFolders;
//   }

//   if ("linkFolders" in source && source.linkFolders !== null) {
//     if (!Array.isArray(source.linkFolders)) {
//       throw new Error("The backup contains invalid link folders data.");
//     }
//     data.linkFolders = source.linkFolders;
//   }

//   if (Object.keys(data).length === 0) {
//     throw new Error("The backup does not contain anything to import.");
//   }

//   return data;
// };

// /**
// - WEEKLY BACKUP REMINDER UTILITY
// - ==============================
//  */
// const LAST_BACKUP_KEY = "@productivity_last_backup_timestamp";
// const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// export const checkAndPromptWeeklyBackup = async (triggerEmailBackup: () => void) => {
//   try {
//     const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
//     const now = Date.now();

//     if (!lastBackupStr || now - Number(lastBackupStr) > ONE_WEEK_MS) {
//       if (Platform.OS === "web") {
//         if (
//           window.confirm(
//             "It's been a week since your last productivity backup. Would you like to email yourself a fresh notes backup?"
//           )
//         ) {
//           triggerEmailBackup();
//           await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
//         }
//       } else {
//         Alert.alert(
//           "Weekly Backup Reminder",
//           "It's been over a week since your last productivity backup. Would you like to email your secure notes backup now?",
//           [
//             { text: "Later", style: "cancel" },
//             {
//               text: "Backup Now",
//               onPress: async () => {
//                 triggerEmailBackup();
//                 await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
//               },
//             },
//           ]
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Failed to check weekly backup status", error);
//   }
// };



// newer4
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

/**
- NOTES & PRODUCTIVITY EXPORT & IMPORT (JSON)
- ===========================================
- App: "notes"
- Version: "1.0.0"
- ID Normalization: Converts all string/timestamp IDs into sequential integers starting at 1.
 */

export interface BackupData {
  username: string | null;
  notes: unknown[];
  tasks: unknown[];
  links: unknown[];
  noteFolders: unknown[];
  taskFolders: unknown[];
  linkFolders: unknown[];
}

export interface BackupFile {
  app: "notes";
  version: "1.0.0";
  exportDate: string;
  data: Record<string, unknown>;
}

export interface ImportData {
  username?: string | null;
  notes?: unknown[];
  tasks?: unknown[];
  links?: unknown[];
  noteFolders?: unknown[];
  taskFolders?: unknown[];
  linkFolders?: unknown[];
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stamp = new Date().toISOString().slice(0, 10);
export const EXPORT_FILE_NAME = `notes_${stamp}.json`;

/**
- Helper to normalize any list of items so their IDs are sequential integers starting at 1.
- Also preserves folderId mapping (converting string folder references or keeping them intact).
 */
const normalizeItemIds = <T extends Record<string, unknown>>(items: unknown[]): T[] => {
  return items.map((item, index) => {
    if (!isRecord(item)) return item as T;
    return {
      ...item,
      id: index + 1,
    };
  }) as T[];
};

/**
- Builds the JSON backup file with app="notes", version="1.0.0", integer IDs, and username.
- 
- NOTE ON EMPTY FOLDERS:
- The folder arrays (`noteFolders`, `taskFolders`, `linkFolders`) will appear empty (`[]`)
- if you are currently using only built-in/predefined folders (e.g., "ideas", "day", "favourites") 
- or have not explicitly created new custom folders. These arrays store user-created custom folders 
- that have their own metadata (such as custom IDs, titles, and creation timestamps). Items assigned 
- to predefined folders store their category identifier in `folderId`, so your notes/tasks/links 
- remain fully organized even when custom folder arrays are empty.
 */
export const createBackupFile = (data: BackupData): BackupFile => {
  return {
    app: "notes",
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    data: {
      username: data.username ?? null,
      notes: normalizeItemIds(data.notes),
      tasks: normalizeItemIds(data.tasks),
      links: normalizeItemIds(data.links),
      noteFolders: normalizeItemIds(data.noteFolders),
      taskFolders: normalizeItemIds(data.taskFolders),
      linkFolders: normalizeItemIds(data.linkFolders),
    },
  };
};

/**
- IMPORT FEATURE (JSON)
- =====================
- Normalizes and validates the incoming productivity JSON backup file.
 */
export const normalizeImport = (parsed: unknown): ImportData => {
  if (!isRecord(parsed)) {
    throw new Error("The selected file does not contain a JSON object.");
  }

  const source = isRecord(parsed.data) ? parsed.data : parsed;
  const knownKeys = [
    "username",
    "notes",
    "tasks",
    "links",
    "noteFolders",
    "taskFolders",
    "linkFolders",
  ];

  if (!knownKeys.some((key) => key in source)) {
    throw new Error("This does not look like a valid notes backup file.");
  }

  const data: ImportData = {};

  if ("username" in source) {
    data.username = typeof source.username === "string" ? source.username : null;
  } else {
    data.username = null;
  }

  if ("notes" in source && source.notes !== null) {
    if (!Array.isArray(source.notes)) {
      throw new Error("The backup contains invalid notes data.");
    }
    data.notes = normalizeItemIds(source.notes);
  }

  if ("tasks" in source && source.tasks !== null) {
    if (!Array.isArray(source.tasks)) {
      throw new Error("The backup contains invalid tasks data.");
    }
    data.tasks = normalizeItemIds(source.tasks);
  }

  if ("links" in source && source.links !== null) {
    if (!Array.isArray(source.links)) {
      throw new Error("The backup contains invalid links data.");
    }
    data.links = normalizeItemIds(source.links);
  }

  if ("noteFolders" in source && source.noteFolders !== null) {
    if (!Array.isArray(source.noteFolders)) {
      throw new Error("The backup contains invalid note folders data.");
    }
    data.noteFolders = normalizeItemIds(source.noteFolders);
  }

  if ("taskFolders" in source && source.taskFolders !== null) {
    if (!Array.isArray(source.taskFolders)) {
      throw new Error("The backup contains invalid task folders data.");
    }
    data.taskFolders = normalizeItemIds(source.taskFolders);
  }

  if ("linkFolders" in source && source.linkFolders !== null) {
    if (!Array.isArray(source.linkFolders)) {
      throw new Error("The backup contains invalid link folders data.");
    }
    data.linkFolders = normalizeItemIds(source.linkFolders);
  }

  return data;
};

/**
- WEEKLY BACKUP REMINDER UTILITY
- ==============================
 */
const LAST_BACKUP_KEY = "@notes_app_last_backup_timestamp";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const checkAndPromptWeeklyBackup = async (triggerEmailBackup: () => void) => {
  try {
    const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
    const now = Date.now();

    if (!lastBackupStr || now - Number(lastBackupStr) > ONE_WEEK_MS) {
      if (Platform.OS === "web") {
        if (
          window.confirm(
            "It's been a week since your last notes backup. Would you like to email yourself a fresh JSON backup?"
          )
        ) {
          triggerEmailBackup();
          await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
        }
      } else {
        Alert.alert(
          "Weekly Backup Reminder",
          "It's been over a week since your last notes backup. Would you like to email your secure JSON backup now?",
          [
            { text: "Later", style: "cancel" },
            {
              text: "Backup Now",
              onPress: async () => {
                triggerEmailBackup();
                await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
              },
            },
          ]
        );
      }
    }
  } catch (error) {
    console.error("Failed to check weekly backup status", error);
  }
};


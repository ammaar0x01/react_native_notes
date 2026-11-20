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
// const LAST_BACKUP_KEY = "@notes_app_last_backup_timestamp";
// const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// export const checkAndPromptWeeklyBackup = async (triggerEmailBackup: () => void) => {
//   try {
//     const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
//     const now = Date.now();

//     if (!lastBackupStr || now - Number(lastBackupStr) > ONE_WEEK_MS) {
//       if (Platform.OS === "web") {
//         if (
//           window.confirm(
//             "It's been a week since your last notes backup. Would you like to email yourself a fresh JSON backup?"
//           )
//         ) {
//           triggerEmailBackup();
//           await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
//         }
//       } else {
//         Alert.alert(
//           "Weekly Backup Reminder",
//           "It's been over a week since your last notes backup. Would you like to email your secure JSON backup now?",
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



//  timwer 
// export const LAST_BACKUP_KEY = "@notes_app_last_backup_timestamp";
// const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// // const ONE_WEEK_MS = 60 * 1000;


// export const recordBackupTimestamp = async (): Promise<void> => {
//   try {
//     await AsyncStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
//   } catch (error) {
//     console.error("Failed to record backup timestamp", error);
//   }
// };

// export const checkAndPromptWeeklyBackup = async (onConfirmBackup: () => void) => {
//   try {
//     const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
//     const now = Date.now();

//     // Skip prompting on the very first launch if desired, or seed the initial timestamp
//     if (!lastBackupStr) {
//       await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
//       return;
//     }

//     if (now - Number(lastBackupStr) > ONE_WEEK_MS) {
//       if (Platform.OS === "web") {
//         if (
//           window.confirm(
//             "Weekly Backup Reminder: It has been over 7 days since your last backup. Would you like to export a fresh JSON backup now?"
//           )
//         ) {
//           onConfirmBackup();
//           await recordBackupTimestamp();
//         }
//       } else {
//         Alert.alert(
//           "Weekly Backup Reminder",
//           "It has been over 7 days since your last backup. Would you like to back up your notes, tasks, and links now?",
//           [
//             { text: "Later", style: "cancel" },
//             {
//               text: "Backup Now",
//               onPress: async () => {
//                 onConfirmBackup();
//                 await recordBackupTimestamp();
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


// newer
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const LAST_BACKUP_KEY = '@notes_app_last_backup_timestamp';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// const ONE_WEEK_MS = 60 * 1000; 

export const recordBackupTimestamp = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
  } catch (error) {
    console.error('Failed to record backup timestamp', error);
  }
};

export const shouldPromptWeeklyBackup = async (): Promise<boolean> => {
  try {
    const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
    const now = Date.now();

    // Seed timestamp on very first launch without interrupting the user
    if (!lastBackupStr) {
      await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
      return false;
    }

    return now - Number(lastBackupStr) > ONE_WEEK_MS;
  } catch (error) {
    console.error('Failed to check weekly backup status', error);
    return false;
  }
};

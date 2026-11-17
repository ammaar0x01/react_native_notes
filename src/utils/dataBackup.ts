import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

const LAST_BACKUP_KEY = "@money_manager_last_backup_timestamp";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// test
// const ONE_WEEK_MS = 6 * 1000;

export const checkAndPromptWeeklyBackup = async (triggerEmailBackup: () => void) => {
  try {
    const lastBackupStr = await AsyncStorage.getItem(LAST_BACKUP_KEY);
    const now = Date.now();

    if (!lastBackupStr || now - Number(lastBackupStr) > ONE_WEEK_MS) {
      if (Platform.OS === "web") {
        if (window.confirm("It's been a week since your last backup. Would you like to email yourself a fresh JSON backup?")) {
          triggerEmailBackup();
          await AsyncStorage.setItem(LAST_BACKUP_KEY, String(now));
        }
      } else {
        Alert.alert(
          "Weekly Backup Reminder",
          "It's been over a week since your last backup. Would you like to email your secure JSON backup now?",
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

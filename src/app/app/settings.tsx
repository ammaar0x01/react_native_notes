import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as MailComposer from 'expo-mail-composer';
import Head from 'expo-router/head';

import { STORAGE_KEYS } from '@/constants/storage';
import {
  EXPORT_FILE_NAME,
  createBackupFile,
  isRecord,
  normalizeImport,
  recordBackupTimestamp,
  type BackupData,
  type ImportData,
} from '@/utils/dataExport';
import { router } from 'expo-router';

// Theme Palette (Matches Notes, Tasks, and Links)
const COLORS = {
  bg: '#0F1115',
  surface: '#1A1D24',
  surfaceElevated: '#242832',
  border: '#2E3340',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  accent: '#F59E0B',
  accentText: '#111827',
  success: '#10B981',
  danger: '#EF4444',
};

const parseStoredJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const notify = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

interface ExportSummaryStats {
  notes: number;
  tasks: number;
  links: number;
  folders: number;
}

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [isSavingUsername, setIsSavingUsername] = useState<boolean>(false);

  const [exporting, setExporting] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [cloudActionLoading, setCloudActionLoading] = useState<boolean>(false);

  // Success Summary Modal State
  const [summaryModalVisible, setSummaryModalVisible] = useState<boolean>(false);
  const [exportStats, setExportStats] = useState<ExportSummaryStats>({
    notes: 0,
    tasks: 0,
    links: 0,
    folders: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedProfileRaw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
      const parsedProfile = parseStoredJson(savedProfileRaw);
      if (isRecord(parsedProfile) && typeof parsedProfile.name === 'string') {
        setUsernameInput(parsedProfile.name);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const handleSaveUsername = async () => {
    const trimmedName = usernameInput.trim();
    if (!trimmedName) {
      notify('Validation', 'Username cannot be empty.');
      return;
    }

    setIsSavingUsername(true);
    try {
      const savedProfileRaw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
      const parsedProfile = isRecord(parseStoredJson(savedProfileRaw))
        ? (parseStoredJson(savedProfileRaw) as Record<string, unknown>)
        : {};

      const updatedProfile = { ...parsedProfile, name: trimmedName };
      await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedProfile));

      notify('Success', 'Username updated successfully.');
    } catch (error) {
      console.error('Failed to save username', error);
      notify('Error', 'Could not save username.');
    } finally {
      setIsSavingUsername(false);
    }
  };

  const readBackupData = async (): Promise<BackupData> => {
    const [
      profileRaw,
      notesRaw,
      tasksRaw,
      linksRaw,
      noteFoldersRaw,
      taskFoldersRaw,
      linkFoldersRaw,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.profile),
      AsyncStorage.getItem(STORAGE_KEYS.notes),
      AsyncStorage.getItem('@tasks_app_data'),
      AsyncStorage.getItem('@links_app_data'),
      AsyncStorage.getItem('@notes_app_folders'),
      AsyncStorage.getItem('@tasks_app_folders'),
      AsyncStorage.getItem('@links_app_folders'),
    ]);

    const parsedProfile = parseStoredJson(profileRaw);
    const username =
      isRecord(parsedProfile) && typeof parsedProfile.name === 'string'
        ? parsedProfile.name
        : null;

    const parsedNotes = parseStoredJson(notesRaw);
    const parsedTasks = parseStoredJson(tasksRaw);
    const parsedLinks = parseStoredJson(linksRaw);
    const parsedNoteFolders = parseStoredJson(noteFoldersRaw);
    const parsedTaskFolders = parseStoredJson(taskFoldersRaw);
    const parsedLinkFolders = parseStoredJson(linkFoldersRaw);

    return {
      username,
      notes: Array.isArray(parsedNotes) ? parsedNotes : [],
      tasks: Array.isArray(parsedTasks) ? parsedTasks : [],
      links: Array.isArray(parsedLinks) ? parsedLinks : [],
      noteFolders: Array.isArray(parsedNoteFolders) ? parsedNoteFolders : [],
      taskFolders: Array.isArray(parsedTaskFolders) ? parsedTaskFolders : [],
      linkFolders: Array.isArray(parsedLinkFolders) ? parsedLinkFolders : [],
    };
  };

  const saveFile = async (
    fileName: string,
    content: string,
    mimeType: string
  ): Promise<void> => {
    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    if (!directory) {
      throw new Error('No writable directory is available on this device.');
    }

    const fileUri = `${directory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: 'Export Productivity Backup',
      });
    } else {
      notify('Export saved', `The file was saved to ${fileUri}`);
    }
  };

  const handleExportJson = async () => {
    setExporting(true);

    try {
      const backup = await readBackupData();
      const file = createBackupFile(backup);

      await saveFile(
        EXPORT_FILE_NAME,
        JSON.stringify(file, null, 2),
        'application/json'
      );
      await recordBackupTimestamp();

      const totalFolders =
        backup.noteFolders.length +
        backup.taskFolders.length +
        backup.linkFolders.length;

      setExportStats({
        notes: backup.notes.length,
        tasks: backup.tasks.length,
        links: backup.links.length,
        folders: totalFolders,
      });
      setSummaryModalVisible(true);
    } catch (error) {
      console.error('Export failed', error);
      notify('Export failed', 'Could not create the export file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleUploadToCloud = async () => {
    setCloudActionLoading(true);
    try {
      const backup = await readBackupData();
      const content = JSON.stringify(createBackupFile(backup), null, 2);

      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = EXPORT_FILE_NAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        notify('Cloud Backup Saved', 'Your notes JSON backup file has been downloaded.');
      } else {
        const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
        if (!directory) throw new Error('No writable directory available.');
        const fileUri = `${directory}${EXPORT_FILE_NAME}`;
        await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Upload Backup to Cloud / Files',
          });
        }
      }
    } catch (error) {
      console.error('Cloud upload failed', error);
      notify('Error', 'Could not prepare backup for cloud upload.');
    } finally {
      setCloudActionLoading(false);
    }
  };

  const handleSendEmailBackup = async () => {
    setCloudActionLoading(true);
    try {
      const backup = await readBackupData();
      const content = JSON.stringify(createBackupFile(backup), null, 2);

      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = EXPORT_FILE_NAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const subject = encodeURIComponent('Money Manager - Productivity Backup');
        const body = encodeURIComponent('Please find your downloaded notes and productivity JSON backup file attached.');
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        notify('Email Ready', 'Your backup file has been downloaded. Please attach it to your email.');
      } else {
        const isAvailable = await MailComposer.isAvailableAsync();
        if (!isAvailable) {
          notify('Email Unavailable', 'This device is not configured to send emails.');
          return;
        }

        const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
        if (!directory) throw new Error('No writable directory available.');
        const fileUri = `${directory}${EXPORT_FILE_NAME}`;
        await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });

        await MailComposer.composeAsync({
          subject: 'Money Manager - Automated Productivity Backup',
          body: 'Attached is your latest notes and productivity JSON backup file.',
          attachments: [fileUri],
        });
      }
    } catch (error) {
      console.error('Email backup failed', error);
      notify('Error', 'Could not open email composer.');
    } finally {
      setCloudActionLoading(false);
    }
  };

  const confirmImport = (data: ImportData): Promise<boolean> => {
    const message = `This will replace your current notes, tasks, links, and folders with the imported backup. This cannot be undone.`;

    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        resolve(window.confirm(`Import backup?\n\n${message}`));
        return;
      }

      Alert.alert('Import backup?', message, [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Import', style: 'destructive', onPress: () => resolve(true) },
      ], {
        cancelable: true,
        onDismiss: () => resolve(false),
      });
    });
  };

  const handleImportData = async () => {
    setImporting(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "*/*"],
        copyToCacheDirectory: false,
      });

      if (result.canceled || !result.assets[0]) return;

      const fileAsset = result.assets[0];
      let fileUri = fileAsset.uri;

      if (Platform.OS === "android") {
        const fileName = fileAsset.name || EXPORT_FILE_NAME;
        const localDestination = `${FileSystem.documentDirectory}${fileName}`;

        const fileInfo = await FileSystem.getInfoAsync(localDestination);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(localDestination);
        }

        await FileSystem.copyAsync({
          from: fileUri,
          to: localDestination,
        });

        fileUri = localDestination;
      }

      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(fileContent);
      } catch {
        throw new Error("The selected file is not valid JSON.");
      }

      const data = normalizeImport(parsedData);

      if (!(await confirmImport(data))) return;

      const writes: [string, string][] = [];

      if (data.username !== undefined) {
        const existingProfile = parseStoredJson(await AsyncStorage.getItem(STORAGE_KEYS.profile));
        const updatedProfile = isRecord(existingProfile)
          ? { ...existingProfile, name: data.username }
          : { name: data.username };
        writes.push([STORAGE_KEYS.profile, JSON.stringify(updatedProfile)]);
      }
      if (data.notes !== undefined) writes.push([STORAGE_KEYS.notes, JSON.stringify(data.notes)]);
      if (data.tasks !== undefined) writes.push(['@tasks_app_data', JSON.stringify(data.tasks)]);
      if (data.links !== undefined) writes.push(['@links_app_data', JSON.stringify(data.links)]);
      if (data.noteFolders !== undefined) writes.push(['@notes_app_folders', JSON.stringify(data.noteFolders)]);
      if (data.taskFolders !== undefined) writes.push(['@tasks_app_folders', JSON.stringify(data.taskFolders)]);
      if (data.linkFolders !== undefined) writes.push(['@links_app_folders', JSON.stringify(data.linkFolders)]);

      if (writes.length === 0) {
        throw new Error("The backup does not contain anything to import.");
      }

      await AsyncStorage.multiSet(writes);

      // Update local state if username was imported
      if (data.username) {
        setUsernameInput(data.username);
      }

      notify(
        "Import complete",
        "Your productivity backup was restored successfully."
      );
    } catch (error) {
      console.error("Import failed:", error);
      notify(
        "Import failed",
        error instanceof Error ? error.message : "Unable to read or parse the selected file."
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <ScrollView
        style={[styles.container, { paddingHorizontal: horizontalPadding }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Settings</Text>
              <Text style={styles.headerSubtitle}>
                Manage your username, JSON backups, and productivity data.
              </Text>
            </View>
          </View>

          {/* Profile / Username Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Profile Username</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Set or update your display name used across your personal profile and notes.
            </Text>

            <View style={styles.usernameInputRow}>
              <TextInput
                style={styles.inputTitle}
                placeholder="Your username..."
                placeholderTextColor={COLORS.textMuted}
                value={usernameInput}
                onChangeText={setUsernameInput}
              />
              <Pressable
                style={[styles.saveUsernameButton, isSavingUsername && styles.buttonDisabled]}
                onPress={handleSaveUsername}
                disabled={isSavingUsername}
              >
                {isSavingUsername ? (
                  <ActivityIndicator color={COLORS.accentText} size="small" />
                ) : (
                  <Text style={styles.saveUsernameButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Backup & Restore Data Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Backup & Restore</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Export a complete JSON backup containing all your notes, tasks, links, and custom folders.
            </Text>

            <Pressable
              onPress={() => router.push('/?scrollTo=import' as any)}
              style={styles.guideButton}
            >
              <Text style={styles.guideButtonText}>JSON Import Guide</Text>
            </Pressable>

            <View style={styles.actionButtonsRow}>
              <Pressable
                style={[styles.exportButton, exporting && styles.buttonDisabled]}
                onPress={handleExportJson}
                disabled={exporting}
              >
                {exporting 
                ? (
                  <ActivityIndicator color={COLORS.accentText} size="small" />
                ) 
                : (
                  
                  // <Ionicons name="download-outline" size={18} color={COLORS.accentText} style={{ marginRight: 8 }} />
                
                     <Text style={styles.exportButtonText}>
                  {exporting ? 'Exporting…' : 'Export JSON'}
                </Text>
                )}
             
              </Pressable>

              <Pressable
                style={[styles.importButton, importing && styles.buttonDisabled]}
                onPress={handleImportData}
                disabled={importing}
              >
                {importing 
                ? (
                  <ActivityIndicator color={COLORS.textPrimary} size="small" />
                ) 
                : (
                  <>
                  {/* <Ionicons
                    name="cloud-upload-outline"
                    size={18}
                    color={COLORS.textPrimary}
                    style={{ marginRight: 8 }}
                  /> */}
                   <Text style={styles.importButtonText}>
                  {importing ? 'Importing…' : 'Import JSON'}
                </Text>

                </>
                )}

                {/* <Text style={styles.importButtonText}>
                  {importing ? 'Importing…' : 'Import JSON'}
                </Text> */}
              </Pressable>
            </View>

            {/* Cloud & Email Backup Integrations */}
            <View style={styles.cloudBackupContainer}>
              <Text style={styles.cloudSubheading}>Cloud & Remote Backup</Text>
              <View style={styles.cloudButtonsRow}>
                <Pressable
                  style={[styles.cloudOptionButton, cloudActionLoading && styles.buttonDisabled]}
                  onPress={handleUploadToCloud}
                  disabled={cloudActionLoading}
                >
                  <Ionicons name="globe" size={18} color={COLORS.accent} style={{ marginRight: 6 }} />
                  <Text style={styles.cloudButtonText}>Save to Cloud</Text>
                </Pressable>

                <Pressable
                  style={[styles.cloudOptionButton, cloudActionLoading && styles.buttonDisabled]}
                  onPress={handleSendEmailBackup}
                  disabled={cloudActionLoading}
                >
                  <Ionicons name="mail-outline" size={18} color={COLORS.accent} style={{ marginRight: 6 }} />
                  <Text style={styles.cloudButtonText}>Email Backup</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Export Success Summary Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={summaryModalVisible}
            onRequestClose={() => setSummaryModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <Pressable style={styles.modalBackdrop} onPress={() => setSummaryModalVisible(false)} />

              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>Export Successful</Text>
                  <Pressable onPress={() => setSummaryModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                  </Pressable>
                </View>

                <Text style={styles.exportModalSubtitle}>
                  Your notes and productivity JSON backup has been successfully generated and downloaded with the following contents:
                </Text>

                <View style={styles.summaryList}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Notes:</Text>
                    <Text style={styles.summaryValue}>{exportStats.notes}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tasks:</Text>
                    <Text style={styles.summaryValue}>{exportStats.tasks}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Links:</Text>
                    <Text style={styles.summaryValue}>{exportStats.links}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Custom Folders:</Text>
                    <Text style={styles.summaryValue}>{exportStats.folders}</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.summaryCloseButton}
                  onPress={() => setSummaryModalVisible(false)}
                >
                  <Text style={styles.summaryCloseButtonText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 110,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    // fontSize: 28,
    // fontWeight: '800',

    // ---
    // fontSize: 40,
    marginTop: 20, 
    fontWeight: '400',
    fontFamily: 'serif',
    fontSize: 50,
    // ---

    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 10, 
  },


  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: COLORS.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'serif', 
  },
  sectionDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  // usernameInputRow: {
  //   flexDirection: 'row',
  //   gap: 10,
  //   alignItems: 'center',
  // },
  // inputTitle: {
  //   flex: 1,
  //   backgroundColor: COLORS.surfaceElevated,
  //   borderWidth: 1,
  //   borderColor: COLORS.border,
  //   borderRadius: 10,
  //   paddingHorizontal: 14,
  //   paddingVertical: 12,
  //   fontSize: 15,
  //   // color: COLORS.textPrimary,

  //   // ...Platform.select({
  //   //   web: {
  //   // // fontSize: 20,

  //   //     outlineStyle: 'none',
  //   //   } as any,
  //   // }),
  // // },

  //   fontFamily: 'serif', 
  //   // fontWeight: '600',

  //   fontWeight: '400',
  //   // fontSize: 20, 
  //   color: '#ebfb08',
  // },

//---

  usernameInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  inputTitle: {
    flex: 1,
    minWidth: 0, // Allows the TextInput to shrink below its intrinsic width on small screens
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    // fontWeight: '600',
    // color: COLORS.textPrimary,

    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),

    fontFamily: 'serif', 
    fontWeight: '400',
    color: '#ebfb08',
  },
  saveUsernameButton: {
    flexShrink: 0, // Ensures the button never gets squished or pushed off-screen
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

//---


  // saveUsernameButton: {
  //   backgroundColor: COLORS.accent,
  //   paddingHorizontal: 20,
  //   paddingVertical: 12,
  //   borderRadius: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  saveUsernameButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 15,
  },
  guideButton: {
    // backgroundColor: COLORS.surfaceElevated,
    // borderWidth: 1,
    // borderColor: COLORS.border,

    // paddingHorizontal: 20,
    // paddingVertical: 12,

    // marginTop: 1, 
    marginBottom: 30,

    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  guideButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    textDecorationLine:'underline', 
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exportButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 15,
  },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  importButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cloudBackupContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cloudSubheading: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  cloudButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cloudOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cloudButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  exportModalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  summaryList: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  summaryCloseButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCloseButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 15,
  },
});


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

import { LinkifiedText, HorizontalScrollBar } from '@/components/text-helpers';
// -------------------------------------------

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
  { id: 'favourites', name: 'Favourites', icon: 'star', isPredefined: true },
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
        <title>My Notes</title>
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
                  Organize your notes and ideas
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

                {/* --- newer */}
{folders.map((folder) => {
         const isSelected = selectedFolderId === folder.id;
                  const count = notes.filter((n) => n.folderId === folder.id).length;

  // const isSelected = selectedFolderId === folder.id;
  // const count = tasks.filter((t) => t.folderId === folder.id).length;
  const isFavourites = folder.id === 'favourites';

  return (
    <TouchableOpacity
      key={folder.id}
      style={[
        styles.folderChip,
        isSelected && styles.folderChipActive,
      ]}
      onPress={() => setSelectedFolderId(folder.id)}
    >
      {/* Show ONLY the star icon for Favourites, no text */}
      {isFavourites ? (
        <Ionicons
          name="star"
          size={16}
          color={isSelected ? COLORS.accentText : COLORS.accent}
        />
      ) : (
        /* Show text only for all other folders */
        <Text
          style={[
            styles.folderChipText,
            isSelected && styles.folderChipTextActive,
          ]}
        >
          {folder.name} ({count})
        </Text>
      )}

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
                  name="pencil"
                  size={64}
                  color={COLORS.border}
                />
                <Text style={styles.emptyText}>
                  {activeFolderObj
                    ? `No notes in "${activeFolderObj.name}"`
                    : 'No notes found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to add a note.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {/* {filteredNotes.map((item) => {
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
                })} */}

                  {/* ---newer */}
            {filteredNotes.map((item) => {
  const assignedFolder = getFolderById(item.folderId);

  return (
    <TouchableOpacity
      key={item.id}
      style={styles.noteCard}
      activeOpacity={0.75}
      onPress={() => openModalForEdit(item)}
    >
      {/* <View style={styles.noteAccentBar} /> */}
      
      <View style={styles.noteContentContainer}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.noteSnippet} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.noteDate}>{item.updatedAt}</Text>
      </View>

      {/* Right Column: Folder Badge placed directly above the Delete Icon */}
      <View style={styles.noteRightActions}>
        {assignedFolder ? (
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
        ) : (
          <View style={styles.badgePlaceholder} />
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(item.id)}
          hitSlop={6}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
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
              {/* <View style={styles.noteFolderSelectorWrapper}>
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
              </View> */}

{/* newer--- */}
<View style={styles.folderSelectorWrapper}>
  <Text style={styles.folderSelectorLabel}>Folder:</Text>
  
  <View style={styles.folderScrollBounds}>
    <HorizontalScrollBar contentContainerStyle={styles.folderPillsRow}>
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
        const isFavourites = folder.id === 'favourites';

        return (
          <TouchableOpacity
            key={folder.id}
            style={[
              styles.noteFolderPill,
              active && styles.noteFolderPillActive,
            ]}
            onPress={() => setNoteFolderId(folder.id)}
          >
            {isFavourites ? (
              <Ionicons
                name="star"
                size={13}
                color={active ? COLORS.accentText : COLORS.accent}
              />
            ) : (
              <Text
                style={[
                  styles.noteFolderPillText,
                  active && styles.noteFolderPillTextActive,
                ]}
              >
                {folder.name}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </HorizontalScrollBar>
  </View>
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
  // newer ----
folderSelectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
    width: '100%',
  },
  folderSelectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  folderScrollBounds: {
    flex: 1,
    overflow: 'hidden',
  },
  folderPillsRow: {
    gap: 8,
    alignItems: 'center',
    paddingRight: 4,
  },
// ----

  // --- newer
noteCard: {
    flexDirection: 'row',
    alignItems: 'stretch', // Ensures vertical alignment across items
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',

    marginBottom: 20, 
    padding: 16,
  },
  noteContentContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
  // Right column aligning the folder badge directly above the delete icon
  noteRightActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
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
  badgePlaceholder: {
    height: 18,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =---


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
    // marginBottom: 16,
        marginTop: 12,
    marginBottom: 20,
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

    marginTop: 10, 
    marginBottom: 30,
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
    gap: 14,
  },


  // noteCard: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: COLORS.surface,
  //   borderRadius: 14,
  //   borderWidth: 1,
  //   borderColor: COLORS.border,
  //   padding: 16,
  //   overflow: 'hidden',
  // },
  noteAccentBar: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginRight: 14,
  },
  // noteContentContainer: {
  //   flex: 1,
  //   paddingRight: 12,
  // },
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
  // noteFolderBadge: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: COLORS.surfaceElevated,
  //   borderWidth: 1,
  //   borderColor: COLORS.border,
  //   paddingHorizontal: 8,
  //   paddingVertical: 3,
  //   borderRadius: 12,
  //   gap: 4,
  // },
  // noteFolderBadgeText: {
  //   fontSize: 11,
  //   fontWeight: '700',
  //   color: COLORS.accent,
  // },
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
  // deleteButton: {
  //   padding: 8,
  //   borderRadius: 10,
  //   backgroundColor: 'rgba(239, 68, 68, 0.12)',
  // },
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
  // folderSelectorLabel: {
  //   fontSize: 13,
  //   fontWeight: '700',
  //   color: COLORS.textSecondary,
  // },
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

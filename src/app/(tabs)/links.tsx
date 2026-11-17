
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Head from 'expo-router/head';

const STORAGE_KEY = '@notes_app_data';

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
}

export default function LinksScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 40 : 20;

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes) as Note[]);
      }
    } catch (error) {
      console.error('Failed to load notes.', error);
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
          ? { ...note, title: title.trim() || 'Untitled Note', content: content.trim(), updatedAt: timestamp }
          : note
      );
      saveNotesToStorage(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        updatedAt: timestamp,
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
    setModalVisible(true);
  };

  const openModalForCreate = () => {
    setCurrentNoteId(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentNoteId(null);
    setTitle('');
    setContent('');
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Links</title>
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
                <Text style={styles.headerTitle}>My Links</Text>
                <Text style={styles.headerSubtitle}>
                  Add notes related to your budget and spendings.
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.noteCount}>
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </Text>
              </View>
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
                placeholder="Search notes..."
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
                <Text style={styles.emptyText}>No notes found</Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to create a financial note.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredNotes.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.noteCard}
                    activeOpacity={0.75}
                    onPress={() => openModalForEdit(item)}
                  >
                    <View style={styles.noteAccentBar} />
                    <View style={styles.noteContentContainer}>
                      <Text style={styles.noteTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
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
                ))}
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

        {/* Add/Edit Modal */}
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
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {currentNoteId ? 'Edit Note' : 'New Note'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
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
    marginBottom: 20,
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
  },
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
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
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
    minHeight: 160,
    marginBottom: 20,
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


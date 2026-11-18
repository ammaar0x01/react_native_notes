
// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   useWindowDimensions,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Head from 'expo-router/head';

// const STORAGE_KEY = '@notes_app_data';

// // Theme Palette
// const COLORS = {
//   bg: '#0F1115',
//   surface: '#1A1D24',
//   surfaceElevated: '#242832',
//   border: '#2E3340',
//   textPrimary: '#FFFFFF',
//   textSecondary: '#9CA3AF',
//   textMuted: '#6B7280',
//   accent: '#F59E0B', // Yellow-Orange
//   accentText: '#111827',
//   danger: '#EF4444',
// };

// interface Note {
//   id: string;
//   title: string;
//   content: string;
//   updatedAt: string;
// }

// export default function LinksScreen() {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
//   const [title, setTitle] = useState<string>('');
//   const [content, setContent] = useState<string>('');

//   const { width } = useWindowDimensions();
//   const horizontalPadding = width >= 768 ? 40 : 20;

//   useEffect(() => {
//     loadNotes();
//   }, []);

//   const loadNotes = async () => {
//     try {
//       const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
//       if (storedNotes !== null) {
//         setNotes(JSON.parse(storedNotes) as Note[]);
//       }
//     } catch (error) {
//       console.error('Failed to load notes.', error);
//     }
//   };

//   const saveNotesToStorage = async (updatedNotes: Note[]) => {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
//       setNotes(updatedNotes);
//     } catch (error) {
//       console.error('Failed to save notes.', error);
//     }
//   };

//   const handleSaveNote = () => {
//     if (!title.trim() && !content.trim()) {
//       if (Platform.OS === 'web') {
//         window.alert('Note cannot be empty.');
//       } else {
//         Alert.alert('Validation', 'Note cannot be empty.');
//       }
//       return;
//     }

//     const timestamp = new Date().toLocaleString();

//     if (currentNoteId) {
//       const updatedNotes: Note[] = notes.map((note) =>
//         note.id === currentNoteId
//           ? { ...note, title: title.trim() || 'Untitled Note', content: content.trim(), updatedAt: timestamp }
//           : note
//       );
//       saveNotesToStorage(updatedNotes);
//     } else {
//       const newNote: Note = {
//         id: Date.now().toString(),
//         title: title.trim() || 'Untitled Note',
//         content: content.trim(),
//         updatedAt: timestamp,
//       };
//       saveNotesToStorage([newNote, ...notes]);
//     }

//     closeModal();
//   };

//   const handleDeleteNote = (id: string) => {
//     if (Platform.OS === 'web') {
//       const confirmed = window.confirm('Are you sure you want to delete this note?');
//       if (confirmed) {
//         const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
//         saveNotesToStorage(updatedNotes);
//       }
//     } else {
//       Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
//             saveNotesToStorage(updatedNotes);
//           },
//         },
//       ]);
//     }
//   };

//   const openModalForEdit = (note: Note) => {
//     setCurrentNoteId(note.id);
//     setTitle(note.title);
//     setContent(note.content);
//     setModalVisible(true);
//   };

//   const openModalForCreate = () => {
//     setCurrentNoteId(null);
//     setTitle('');
//     setContent('');
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setCurrentNoteId(null);
//     setTitle('');
//     setContent('');
//   };

//   const filteredNotes = notes.filter(
//     (note) =>
//       note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       note.content.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       <Head>
//         <title>Links</title>
//       </Head>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.contentWrapper}>
//             {/* Header */}
//             <View style={styles.headerContainer}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.headerTitle}>My Links</Text>
//                 <Text style={styles.headerSubtitle}>
//                   Add notes related to your budget and spendings.
//                 </Text>
//               </View>

//               <View style={styles.countBadge}>
//                 <Text style={styles.noteCount}>
//                   {notes.length} {notes.length === 1 ? 'note' : 'notes'}
//                 </Text>
//               </View>
//             </View>

//             {/* Search Bar */}
//             <View style={styles.searchContainer}>
//               <Ionicons
//                 name="search"
//                 size={20}
//                 color={COLORS.accent}
//                 style={styles.searchIcon}
//               />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search notes..."
//                 placeholderTextColor={COLORS.textMuted}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={() => setSearchQuery('')}>
//                   <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               )}
//             </View>

//             {/* Notes List */}
//             {filteredNotes.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Ionicons
//                   name="document-text-outline"
//                   size={64}
//                   color={COLORS.border}
//                 />
//                 <Text style={styles.emptyText}>No notes found</Text>
//                 <Text style={styles.emptySubtext}>
//                   Tap the + button below to create a financial note.
//                 </Text>
//               </View>
//             ) : (
//               <View style={styles.listContainer}>
//                 {filteredNotes.map((item) => (
//                   <TouchableOpacity
//                     key={item.id}
//                     style={styles.noteCard}
//                     activeOpacity={0.75}
//                     onPress={() => openModalForEdit(item)}
//                   >
//                     <View style={styles.noteAccentBar} />
//                     <View style={styles.noteContentContainer}>
//                       <Text style={styles.noteTitle} numberOfLines={1}>
//                         {item.title}
//                       </Text>
//                       <Text style={styles.noteSnippet} numberOfLines={2}>
//                         {item.content}
//                       </Text>
//                       <Text style={styles.noteDate}>{item.updatedAt}</Text>
//                     </View>
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => handleDeleteNote(item.id)}
//                     >
//                       <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
//                     </TouchableOpacity>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </ScrollView>

//         {/* Floating Action Button */}
//         <TouchableOpacity
//           style={styles.fab}
//           activeOpacity={0.85}
//           onPress={openModalForCreate}
//         >
//           <Ionicons name="add" size={28} color={COLORS.accentText} />
//         </TouchableOpacity>

//         {/* Add/Edit Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.modalOverlay}
//           >
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalHeaderTitle}>
//                   {currentNoteId ? 'Edit Note' : 'New Note'}
//                 </Text>
//                 <TouchableOpacity onPress={closeModal}>
//                   <Ionicons name="close" size={24} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>

//               <TextInput
//                 style={styles.inputTitle}
//                 placeholder="Title"
//                 placeholderTextColor={COLORS.textMuted}
//                 value={title}
//                 onChangeText={setTitle}
//               />

//               <TextInput
//                 style={styles.inputBody}
//                 placeholder="Start typing your note here..."
//                 placeholderTextColor={COLORS.textMuted}
//                 multiline
//                 textAlignVertical="top"
//                 value={content}
//                 onChangeText={setContent}
//               />

//               <View style={styles.modalFooter}>
//                 <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
//                   <Text style={styles.saveButtonText}>Save Note</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>
//       </KeyboardAvoidingView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     backgroundColor: COLORS.bg,
//   },
//   scrollContent: {
//     paddingTop: 24,
//     paddingBottom: 100,
//   },
//   contentWrapper: {
//     width: '100%',
//     maxWidth: 800,
//     alignSelf: 'center',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     gap: 12,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginTop: 4,
//   },
//   countBadge: {
//     backgroundColor: 'rgba(245, 158, 11, 0.15)',
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   noteCount: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.accent,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     marginBottom: 20,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: COLORS.textPrimary,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 64,
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginTop: 14,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginTop: 6,
//   },
//   listContainer: {
//     gap: 12,
//   },
//   noteCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 16,
//     overflow: 'hidden',
//   },
//   noteAccentBar: {
//     width: 4,
//     height: '100%',
//     backgroundColor: COLORS.accent,
//     borderRadius: 2,
//     marginRight: 14,
//   },
//   noteContentContainer: {
//     flex: 1,
//     paddingRight: 12,
//   },
//   noteTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: 4,
//   },
//   noteSnippet: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   noteDate: {
//     fontSize: 12,
//     color: COLORS.accent,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: 8,
//     borderRadius: 10,
//     backgroundColor: 'rgba(239, 68, 68, 0.12)',
//   },
//   fab: {
//     position: 'absolute',
//     right: 24,
//     bottom: 28,
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: COLORS.accent,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: COLORS.accent,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.35,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 22,
//     width: '100%',
//     maxWidth: 600,
//     alignSelf: 'center',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 18,
//   },
//   modalHeaderTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//   },
//   inputTitle: {
//     backgroundColor: COLORS.surfaceElevated,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: 14,
//   },
//   inputBody: {
//     backgroundColor: COLORS.surfaceElevated,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     minHeight: 160,
//     marginBottom: 20,
//   },
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 12,
//   },
//   cancelButton: {
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   cancelButtonText: {
//     color: COLORS.textSecondary,
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   saveButton: {
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 22,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   saveButtonText: {
//     color: COLORS.accentText,
//     fontWeight: '800',
//     fontSize: 15,
//   },
// });



// newer
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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Head from 'expo-router/head';
import { HorizontalScrollBar } from '@/components/text-helpers';

const LINKS_STORAGE_KEY = '@links_app_data';
const LINK_FOLDERS_STORAGE_KEY = '@links_app_folders';

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
  danger: '#EF4444',
};

interface LinkItem {
  id: string;
  title: string; // Display text
  url: string;   // Hyperlink
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
  { id: 'day', name: 'Day', icon: 'today', isPredefined: true },
  { id: 'week', name: 'Week', icon: 'calendar', isPredefined: true },
  { id: 'month', name: 'Month', icon: 'calendar-number', isPredefined: true },
];

export default function LinksScreen() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>(PREDEFINED_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [linkFolderId, setLinkFolderId] = useState<string | null>(null);

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
      const [storedLinks, storedFolders] = await Promise.all([
        AsyncStorage.getItem(LINKS_STORAGE_KEY),
        AsyncStorage.getItem(LINK_FOLDERS_STORAGE_KEY),
      ]);

      if (storedLinks !== null) {
        setLinks(JSON.parse(storedLinks) as LinkItem[]);
      }

      if (storedFolders !== null) {
        const customFolders = JSON.parse(storedFolders) as Folder[];
        setFolders([...PREDEFINED_FOLDERS, ...customFolders]);
      }
    } catch (error) {
      console.error('Failed to load links or folders.', error);
    }
  };

  const saveLinksToStorage = async (updatedLinks: LinkItem[]) => {
    try {
      await AsyncStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
      setLinks(updatedLinks);
    } catch (error) {
      console.error('Failed to save links.', error);
    }
  };

  const saveCustomFoldersToStorage = async (allFolders: Folder[]) => {
    try {
      const customOnly = allFolders.filter((f) => !f.isPredefined);
      await AsyncStorage.setItem(LINK_FOLDERS_STORAGE_KEY, JSON.stringify(customOnly));
      setFolders(allFolders);
    } catch (error) {
      console.error('Failed to save link folders.', error);
    }
  };

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
      if (Platform.OS === 'web') window.alert('Folder name cannot be empty.');
      else Alert.alert('Validation', 'Folder name cannot be empty.');
      return;
    }

    const duplicate = folders.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase() && f.id !== editingFolder?.id
    );
    if (duplicate) {
      if (Platform.OS === 'web') window.alert('A folder with this name already exists.');
      else Alert.alert('Duplicate', 'A folder with this name already exists.');
      return;
    }

    if (editingFolder) {
      const updatedFolders = folders.map((f) =>
        f.id === editingFolder.id ? { ...f, name: trimmed } : f
      );
      await saveCustomFoldersToStorage(updatedFolders);
    } else {
      const newFolder: Folder = {
        id: `link_folder_${Date.now()}`,
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

      const updatedLinks = links.map((l) =>
        l.folderId === folder.id ? { ...l, folderId: null } : l
      );
      await saveLinksToStorage(updatedLinks);

      if (selectedFolderId === folder.id) {
        setSelectedFolderId('all');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete folder "${folder.name}"? Links inside will remain in All.`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Folder',
        `Delete "${folder.name}"? Links inside will remain in All.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: performDelete },
        ]
      );
    }
  };

  const handleSaveLink = () => {
    if (!title.trim() || !url.trim()) {
      if (Platform.OS === 'web') window.alert('Both display text and URL are required.');
      else Alert.alert('Validation', 'Both display text and URL are required.');
      return;
    }

    const formattedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    if (currentLinkId) {
      const updatedLinks: LinkItem[] = links.map((item) =>
        item.id === currentLinkId
          ? {
              ...item,
              title: title.trim(),
              url: formattedUrl,
              folderId: linkFolderId,
            }
          : item
      );
      saveLinksToStorage(updatedLinks);
    } else {
      const newLink: LinkItem = {
        id: Date.now().toString(),
        title: title.trim(),
        url: formattedUrl,
        folderId: linkFolderId,
      };
      saveLinksToStorage([newLink, ...links]);
    }

    closeModal();
  };

  const handleDeleteLink = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this link?')) {
        saveLinksToStorage(links.filter((item) => item.id !== id));
      }
    } else {
      Alert.alert('Delete Link', 'Are you sure you want to delete this link?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => saveLinksToStorage(links.filter((item) => item.id !== id)),
        },
      ]);
    }
  };

  const handleOpenExternalUrl = (rawUrl: string) => {
    Linking.openURL(rawUrl).catch((err) => console.error('Failed to open link:', err));
  };

  const openModalForEdit = (item: LinkItem) => {
    setCurrentLinkId(item.id);
    setTitle(item.title);
    setUrl(item.url);
    setLinkFolderId(item.folderId ?? null);
    setModalVisible(true);
  };

  const openModalForCreate = () => {
    setCurrentLinkId(null);
    setTitle('');
    setUrl('');
    setLinkFolderId(selectedFolderId === 'all' ? 'day' : selectedFolderId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentLinkId(null);
    setTitle('');
    setUrl('');
    setLinkFolderId(null);
  };

  const filteredLinks = links.filter((item) => {
    const matchesFolder =
      selectedFolderId === 'all' || item.folderId === selectedFolderId;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFolderById = (id?: string | null) => folders.find((f) => f.id === id);
  const activeFolderObj = folders.find((f) => f.id === selectedFolderId);

  return (
    <>
      <Head>
        <title>My Links | Money Manager</title>
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
                  Save and organise your financial bookmarks and web resources.
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.linkCount}>
                  {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
                </Text>
              </View>
            </View>

            {/* Folders Horizontal Bar */}
            <View style={styles.foldersSection}>
              <HorizontalScrollBar contentContainerStyle={styles.foldersScrollContent}>
                <TouchableOpacity
                  style={[
                    styles.folderChip,
                    selectedFolderId === 'all' && styles.folderChipActive,
                  ]}
                  onPress={() => setSelectedFolderId('all')}
                >
                  <Text
                    style={[
                      styles.folderChipText,
                      selectedFolderId === 'all' && styles.folderChipTextActive,
                    ]}
                  >
                    All ({links.length})
                  </Text>
                </TouchableOpacity>

                {folders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id;
                  const count = links.filter((l) => l.folderId === folder.id).length;
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
                      {isFavourites ? (
                        <Ionicons
                          name="star"
                          size={16}
                          color={isSelected ? COLORS.accentText : COLORS.accent}
                        />
                      ) : (
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

                <TouchableOpacity
                  style={styles.addFolderChip}
                  onPress={openCreateFolderModal}
                >
                  <Ionicons name="add" size={16} color={COLORS.accent} />
                  <Text style={styles.addFolderChipText}>New Folder</Text>
                </TouchableOpacity>
              </HorizontalScrollBar>
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
                    : 'Search all links...'
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

            {/* Links List */}
            {filteredLinks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="globe-outline"
                  size={64}
                  color={COLORS.border}
                />
                <Text style={styles.emptyText}>
                  {activeFolderObj
                    ? `No links in "${activeFolderObj.name}"`
                    : 'No links found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to add a new link bookmark.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredLinks.map((item) => {
                  const assignedFolder = getFolderById(item.folderId);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.linkCard}
                      activeOpacity={0.75}
                      onPress={() => openModalForEdit(item)}
                    >
                      <View style={styles.linkContentContainer}>
                        <View style={styles.linkTopMetaRow}>
                          <Text style={styles.linkTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          {assignedFolder && (
                            <View style={styles.linkFolderBadge}>
                              {assignedFolder.id === 'favourites' ? (
                                <Ionicons name="star" size={11} color={COLORS.accent} />
                              ) : (
                                <Text style={styles.linkFolderBadgeText}>
                                  {assignedFolder.name}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                        <Text style={styles.linkUrl} numberOfLines={1}>
                          {item.url}
                        </Text>
                      </View>

                      {/* Right Action Icons: Delete on left, External Link Arrow on far right */}
                      <View style={styles.linkRightActions}>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteLink(item.id)}
                          hitSlop={6}
                        >
                          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.externalLinkButton}
                          onPress={() => handleOpenExternalUrl(item.url)}
                          hitSlop={6}
                        >
                          <Ionicons name="open-outline" size={18} color={COLORS.accent} />
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

        {/* Centered Add/Edit Link Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centeredModalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeModal} />

            <View style={styles.centeredModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {currentLinkId ? 'Edit Link' : 'New Link'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.folderSelectorWrapper}>
                <Text style={styles.folderSelectorLabel}>Folder:</Text>
                <HorizontalScrollBar contentContainerStyle={styles.folderPillsRow}>
                  <TouchableOpacity
                    style={[
                      styles.folderPill,
                      linkFolderId === null && styles.folderPillActive,
                    ]}
                    onPress={() => setLinkFolderId(null)}
                  >
                    <Text
                      style={[
                        styles.folderPillText,
                        linkFolderId === null && styles.folderPillTextActive,
                      ]}
                    >
                      None
                    </Text>
                  </TouchableOpacity>

                  {folders.map((folder) => {
                    const active = linkFolderId === folder.id;
                    return (
                      <TouchableOpacity
                        key={folder.id}
                        style={[
                          styles.folderPill,
                          active && styles.folderPillActive,
                        ]}
                        onPress={() => setLinkFolderId(folder.id)}
                      >
                        {folder.id === 'favourites' ? (
                          <Ionicons
                            name="star"
                            size={13}
                            color={active ? COLORS.accentText : COLORS.accent}
                          />
                        ) : (
                          <Text
                            style={[
                              styles.folderPillText,
                              active && styles.folderPillTextActive,
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

              <TextInput
                style={styles.inputTitle}
                placeholder="Display text (e.g. My Bank Portal)"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />

              <TextInput
                style={styles.inputTitle}
                placeholder="URL (e.g. https://bank.co.za)"
                placeholderTextColor={COLORS.textMuted}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveLink}>
                  <Text style={styles.saveButtonText}>
                    {currentLinkId ? 'Update Link' : 'Add Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Centered Create / Edit Folder Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={folderModalVisible}
          onRequestClose={closeFolderModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centeredModalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeFolderModal} />

            <View style={styles.centeredModalContent}>
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
                placeholder="Folder name (e.g. Invoices, Tools)"
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
    paddingBottom: 110,
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
  linkCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  foldersSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  foldersScrollContent: {
    gap: 8,
    paddingVertical: 4,
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
    gap: 10,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  linkContentContainer: {
    flex: 1,
    paddingRight: 12,
  },
  linkTopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  linkTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  linkFolderBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  linkFolderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },
  linkUrl: {
    fontSize: 13,
    color: COLORS.accent,
  },
  linkRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  externalLinkButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 84,
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
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  centeredModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    width: '100%',
    maxWidth: 540,
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
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  folderSelectorWrapper: {
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
  folderPillsRow: {
    gap: 8,
    alignItems: 'center',
  },
  folderPill: {
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
  folderPillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  folderPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  folderPillTextActive: {
    color: COLORS.accentText,
  },
  inputTitle: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 14,
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


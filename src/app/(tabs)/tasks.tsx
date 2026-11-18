// // import React, { useState, useEffect } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TextInput,
// //   TouchableOpacity,
// //   Modal,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Alert,
// //   useWindowDimensions,
// //   ScrollView,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Head from 'expo-router/head';

// // const STORAGE_KEY = '@notes_app_data';

// // // Theme Palette
// // const COLORS = {
// //   bg: '#0F1115',
// //   surface: '#1A1D24',
// //   surfaceElevated: '#242832',
// //   border: '#2E3340',
// //   textPrimary: '#FFFFFF',
// //   textSecondary: '#9CA3AF',
// //   textMuted: '#6B7280',
// //   accent: '#F59E0B', // Yellow-Orange
// //   accentText: '#111827',
// //   danger: '#EF4444',
// // };

// // interface Note {
// //   id: string;
// //   title: string;
// //   content: string;
// //   updatedAt: string;
// // }

// // export default function TasksScreen() {
// //   const [notes, setNotes] = useState<Note[]>([]);
// //   const [searchQuery, setSearchQuery] = useState<string>('');
// //   const [modalVisible, setModalVisible] = useState<boolean>(false);
// //   const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
// //   const [title, setTitle] = useState<string>('');
// //   const [content, setContent] = useState<string>('');

// //   const { width } = useWindowDimensions();
// //   const horizontalPadding = width >= 768 ? 40 : 20;

// //   useEffect(() => {
// //     loadNotes();
// //   }, []);

// //   const loadNotes = async () => {
// //     try {
// //       const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
// //       if (storedNotes !== null) {
// //         setNotes(JSON.parse(storedNotes) as Note[]);
// //       }
// //     } catch (error) {
// //       console.error('Failed to load notes.', error);
// //     }
// //   };

// //   const saveNotesToStorage = async (updatedNotes: Note[]) => {
// //     try {
// //       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
// //       setNotes(updatedNotes);
// //     } catch (error) {
// //       console.error('Failed to save notes.', error);
// //     }
// //   };

// //   const handleSaveNote = () => {
// //     if (!title.trim() && !content.trim()) {
// //       if (Platform.OS === 'web') {
// //         window.alert('Note cannot be empty.');
// //       } else {
// //         Alert.alert('Validation', 'Note cannot be empty.');
// //       }
// //       return;
// //     }

// //     const timestamp = new Date().toLocaleString();

// //     if (currentNoteId) {
// //       const updatedNotes: Note[] = notes.map((note) =>
// //         note.id === currentNoteId
// //           ? { ...note, title: title.trim() || 'Untitled Note', content: content.trim(), updatedAt: timestamp }
// //           : note
// //       );
// //       saveNotesToStorage(updatedNotes);
// //     } else {
// //       const newNote: Note = {
// //         id: Date.now().toString(),
// //         title: title.trim() || 'Untitled Note',
// //         content: content.trim(),
// //         updatedAt: timestamp,
// //       };
// //       saveNotesToStorage([newNote, ...notes]);
// //     }

// //     closeModal();
// //   };

// //   const handleDeleteNote = (id: string) => {
// //     if (Platform.OS === 'web') {
// //       const confirmed = window.confirm('Are you sure you want to delete this note?');
// //       if (confirmed) {
// //         const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
// //         saveNotesToStorage(updatedNotes);
// //       }
// //     } else {
// //       Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Delete',
// //           style: 'destructive',
// //           onPress: () => {
// //             const updatedNotes: Note[] = notes.filter((note) => note.id !== id);
// //             saveNotesToStorage(updatedNotes);
// //           },
// //         },
// //       ]);
// //     }
// //   };

// //   const openModalForEdit = (note: Note) => {
// //     setCurrentNoteId(note.id);
// //     setTitle(note.title);
// //     setContent(note.content);
// //     setModalVisible(true);
// //   };

// //   const openModalForCreate = () => {
// //     setCurrentNoteId(null);
// //     setTitle('');
// //     setContent('');
// //     setModalVisible(true);
// //   };

// //   const closeModal = () => {
// //     setModalVisible(false);
// //     setCurrentNoteId(null);
// //     setTitle('');
// //     setContent('');
// //   };

// //   const filteredNotes = notes.filter(
// //     (note) =>
// //       note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       note.content.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   return (
// //     <>
// //       <Head>
// //         <title>Tasks</title>
// //       </Head>

// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         style={[styles.outerContainer, { paddingHorizontal: horizontalPadding }]}
// //       >
// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <View style={styles.contentWrapper}>
// //             {/* Header */}
// //             <View style={styles.headerContainer}>
// //               <View style={{ flex: 1 }}>
// //                 <Text style={styles.headerTitle}>My Tasks</Text>
// //                 <Text style={styles.headerSubtitle}>
// //                   Add notes related to your budget and spendings.
// //                 </Text>
// //               </View>

// //               <View style={styles.countBadge}>
// //                 <Text style={styles.noteCount}>
// //                   {notes.length} {notes.length === 1 ? 'note' : 'notes'}
// //                 </Text>
// //               </View>
// //             </View>

// //             {/* Search Bar */}
// //             <View style={styles.searchContainer}>
// //               <Ionicons
// //                 name="search"
// //                 size={20}
// //                 color={COLORS.accent}
// //                 style={styles.searchIcon}
// //               />
// //               <TextInput
// //                 style={styles.searchInput}
// //                 placeholder="Search notes..."
// //                 placeholderTextColor={COLORS.textMuted}
// //                 value={searchQuery}
// //                 onChangeText={setSearchQuery}
// //               />
// //               {searchQuery.length > 0 && (
// //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// //                   <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// //                 </TouchableOpacity>
// //               )}
// //             </View>

// //             {/* Notes List */}
// //             {filteredNotes.length === 0 ? (
// //               <View style={styles.emptyContainer}>
// //                 <Ionicons
// //                   name="document-text-outline"
// //                   size={64}
// //                   color={COLORS.border}
// //                 />
// //                 <Text style={styles.emptyText}>No notes found</Text>
// //                 <Text style={styles.emptySubtext}>
// //                   Tap the + button below to create a financial note.
// //                 </Text>
// //               </View>
// //             ) : (
// //               <View style={styles.listContainer}>
// //                 {filteredNotes.map((item) => (
// //                   <TouchableOpacity
// //                     key={item.id}
// //                     style={styles.noteCard}
// //                     activeOpacity={0.75}
// //                     onPress={() => openModalForEdit(item)}
// //                   >
// //                     <View style={styles.noteAccentBar} />
// //                     <View style={styles.noteContentContainer}>
// //                       <Text style={styles.noteTitle} numberOfLines={1}>
// //                         {item.title}
// //                       </Text>
// //                       <Text style={styles.noteSnippet} numberOfLines={2}>
// //                         {item.content}
// //                       </Text>
// //                       <Text style={styles.noteDate}>{item.updatedAt}</Text>
// //                     </View>
// //                     <TouchableOpacity
// //                       style={styles.deleteButton}
// //                       onPress={() => handleDeleteNote(item.id)}
// //                     >
// //                       <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
// //                     </TouchableOpacity>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             )}
// //           </View>
// //         </ScrollView>

// //         {/* Floating Action Button */}
// //         <TouchableOpacity
// //           style={styles.fab}
// //           activeOpacity={0.85}
// //           onPress={openModalForCreate}
// //         >
// //           <Ionicons name="add" size={28} color={COLORS.accentText} />
// //         </TouchableOpacity>

// //         {/* Add/Edit Modal */}
// //         <Modal
// //           animationType="slide"
// //           transparent={true}
// //           visible={modalVisible}
// //           onRequestClose={closeModal}
// //         >
// //           <KeyboardAvoidingView
// //             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //             style={styles.modalOverlay}
// //           >
// //             <View style={styles.modalContent}>
// //               <View style={styles.modalHeader}>
// //                 <Text style={styles.modalHeaderTitle}>
// //                   {currentNoteId ? 'Edit Note' : 'New Note'}
// //                 </Text>
// //                 <TouchableOpacity onPress={closeModal}>
// //                   <Ionicons name="close" size={24} color={COLORS.textSecondary} />
// //                 </TouchableOpacity>
// //               </View>

// //               <TextInput
// //                 style={styles.inputTitle}
// //                 placeholder="Title"
// //                 placeholderTextColor={COLORS.textMuted}
// //                 value={title}
// //                 onChangeText={setTitle}
// //               />

// //               <TextInput
// //                 style={styles.inputBody}
// //                 placeholder="Start typing your note here..."
// //                 placeholderTextColor={COLORS.textMuted}
// //                 multiline
// //                 textAlignVertical="top"
// //                 value={content}
// //                 onChangeText={setContent}
// //               />

// //               <View style={styles.modalFooter}>
// //                 <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
// //                   <Text style={styles.cancelButtonText}>Cancel</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
// //                   <Text style={styles.saveButtonText}>Save Note</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </KeyboardAvoidingView>
// //         </Modal>
// //       </KeyboardAvoidingView>
// //     </>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     backgroundColor: COLORS.bg,
// //   },
// //   scrollContent: {
// //     paddingTop: 24,
// //     paddingBottom: 100,
// //   },
// //   contentWrapper: {
// //     width: '100%',
// //     maxWidth: 800,
// //     alignSelf: 'center',
// //   },
// //   headerContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     gap: 12,
// //   },
// //   headerTitle: {
// //     fontSize: 28,
// //     fontWeight: '800',
// //     color: COLORS.textPrimary,
// //   },
// //   headerSubtitle: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     marginTop: 4,
// //   },
// //   countBadge: {
// //     backgroundColor: 'rgba(245, 158, 11, 0.15)',
// //     borderWidth: 1,
// //     borderColor: COLORS.accent,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //   },
// //   noteCount: {
// //     fontSize: 13,
// //     fontWeight: '700',
// //     color: COLORS.accent,
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.surface,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     borderRadius: 12,
// //     paddingHorizontal: 14,
// //     height: 48,
// //     marginBottom: 20,
// //   },
// //   searchIcon: {
// //     marginRight: 10,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 64,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   emptyText: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: COLORS.textPrimary,
// //     marginTop: 14,
// //   },
// //   emptySubtext: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     marginTop: 6,
// //   },
// //   listContainer: {
// //     gap: 12,
// //   },
// //   noteCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     padding: 16,
// //     overflow: 'hidden',
// //   },
// //   noteAccentBar: {
// //     width: 4,
// //     height: '100%',
// //     backgroundColor: COLORS.accent,
// //     borderRadius: 2,
// //     marginRight: 14,
// //   },
// //   noteContentContainer: {
// //     flex: 1,
// //     paddingRight: 12,
// //   },
// //   noteTitle: {
// //     fontSize: 17,
// //     fontWeight: '700',
// //     color: COLORS.textPrimary,
// //     marginBottom: 4,
// //   },
// //   noteSnippet: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     lineHeight: 20,
// //     marginBottom: 8,
// //   },
// //   noteDate: {
// //     fontSize: 12,
// //     color: COLORS.accent,
// //     fontWeight: '600',
// //   },
// //   deleteButton: {
// //     padding: 8,
// //     borderRadius: 10,
// //     backgroundColor: 'rgba(239, 68, 68, 0.12)',
// //   },
// //   fab: {
// //     position: 'absolute',
// //     right: 24,
// //     bottom: 28,
// //     width: 58,
// //     height: 58,
// //     borderRadius: 29,
// //     backgroundColor: COLORS.accent,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     shadowColor: COLORS.accent,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.35,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.75)',
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   modalContent: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 18,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     padding: 22,
// //     width: '100%',
// //     maxWidth: 600,
// //     alignSelf: 'center',
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 18,
// //   },
// //   modalHeaderTitle: {
// //     fontSize: 20,
// //     fontWeight: '800',
// //     color: COLORS.textPrimary,
// //   },
// //   inputTitle: {
// //     backgroundColor: COLORS.surfaceElevated,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     borderRadius: 10,
// //     paddingHorizontal: 14,
// //     paddingVertical: 12,
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textPrimary,
// //     marginBottom: 14,
// //   },
// //   inputBody: {
// //     backgroundColor: COLORS.surfaceElevated,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     borderRadius: 10,
// //     paddingHorizontal: 14,
// //     paddingVertical: 12,
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //     minHeight: 160,
// //     marginBottom: 20,
// //   },
// //   modalFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-end',
// //     gap: 12,
// //   },
// //   cancelButton: {
// //     paddingHorizontal: 18,
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   cancelButtonText: {
// //     color: COLORS.textSecondary,
// //     fontWeight: '700',
// //     fontSize: 15,
// //   },
// //   saveButton: {
// //     backgroundColor: COLORS.accent,
// //     paddingHorizontal: 22,
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //   },
// //   saveButtonText: {
// //     color: COLORS.accentText,
// //     fontWeight: '800',
// //     fontSize: 15,
// //   },
// // });



// // newer1
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
//   Pressable,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Head from 'expo-router/head';

// const TASKS_STORAGE_KEY = '@tasks_app_data';
// const TASK_FOLDERS_STORAGE_KEY = '@tasks_app_folders';

// // Theme Palette (Matches Notes & Settings)
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
//   success: '#10B981',
//   danger: '#EF4444',
// };

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   updatedAt: string;
//   folderId?: string | null;
// }

// interface Folder {
//   id: string;
//   name: string;
//   icon: keyof typeof Ionicons.glyphMap;
//   isPredefined?: boolean;
// }

// const PREDEFINED_FOLDERS: Folder[] = [
//   { id: 'favourites', name: 'Favourites', icon: 'star', isPredefined: true },
//   { id: 'day', name: 'Day', icon: 'today', isPredefined: true },
//   { id: 'week', name: 'Week', icon: 'calendar', isPredefined: true },
//   { id: 'month', name: 'Month', icon: 'calendar-number', isPredefined: true },
// ];

// export default function TasksScreen() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [folders, setFolders] = useState<Folder[]>(PREDEFINED_FOLDERS);
//   const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [taskFolderId, setTaskFolderId] = useState<string | null>(null);

//   // Folder Create/Edit Modal State
//   const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
//   const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
//   const [folderNameInput, setFolderNameInput] = useState<string>('');

//   const { width } = useWindowDimensions();
//   const horizontalPadding = width >= 768 ? 40 : 20;

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [storedTasks, storedFolders] = await Promise.all([
//         AsyncStorage.getItem(TASKS_STORAGE_KEY),
//         AsyncStorage.getItem(TASK_FOLDERS_STORAGE_KEY),
//       ]);

//       if (storedTasks !== null) {
//         setTasks(JSON.parse(storedTasks) as Task[]);
//       }

//       if (storedFolders !== null) {
//         const customFolders = JSON.parse(storedFolders) as Folder[];
//         setFolders([...PREDEFINED_FOLDERS, ...customFolders]);
//       }
//     } catch (error) {
//       console.error('Failed to load tasks or folders.', error);
//     }
//   };

//   const saveTasksToStorage = async (updatedTasks: Task[]) => {
//     try {
//       await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
//       setTasks(updatedTasks);
//     } catch (error) {
//       console.error('Failed to save tasks.', error);
//     }
//   };

//   const saveCustomFoldersToStorage = async (allFolders: Folder[]) => {
//     try {
//       const customOnly = allFolders.filter((f) => !f.isPredefined);
//       await AsyncStorage.setItem(TASK_FOLDERS_STORAGE_KEY, JSON.stringify(customOnly));
//       setFolders(allFolders);
//     } catch (error) {
//       console.error('Failed to save task folders.', error);
//     }
//   };

//   // ----------------------------------
//   // Folder CRUD Handlers
//   // ----------------------------------
//   const openCreateFolderModal = () => {
//     setEditingFolder(null);
//     setFolderNameInput('');
//     setFolderModalVisible(true);
//   };

//   const openEditFolderModal = (folder: Folder) => {
//     if (folder.isPredefined) return;
//     setEditingFolder(folder);
//     setFolderNameInput(folder.name);
//     setFolderModalVisible(true);
//   };

//   const closeFolderModal = () => {
//     setFolderModalVisible(false);
//     setEditingFolder(null);
//     setFolderNameInput('');
//   };

//   const handleSaveFolder = async () => {
//     const trimmed = folderNameInput.trim();
//     if (!trimmed) {
//       if (Platform.OS === 'web') {
//         window.alert('Folder name cannot be empty.');
//       } else {
//         Alert.alert('Validation', 'Folder name cannot be empty.');
//       }
//       return;
//     }

//     const duplicate = folders.some(
//       (f) => f.name.toLowerCase() === trimmed.toLowerCase() && f.id !== editingFolder?.id
//     );
//     if (duplicate) {
//       if (Platform.OS === 'web') {
//         window.alert('A folder with this name already exists.');
//       } else {
//         Alert.alert('Duplicate', 'A folder with this name already exists.');
//       }
//       return;
//     }

//     if (editingFolder) {
//       const updatedFolders = folders.map((f) =>
//         f.id === editingFolder.id ? { ...f, name: trimmed } : f
//       );
//       await saveCustomFoldersToStorage(updatedFolders);
//     } else {
//       const newFolder: Folder = {
//         id: `task_folder_${Date.now()}`,
//         name: trimmed,
//         icon: 'folder',
//         isPredefined: false,
//       };
//       await saveCustomFoldersToStorage([...folders, newFolder]);
//       setSelectedFolderId(newFolder.id);
//     }

//     closeFolderModal();
//   };

//   const handleDeleteFolder = (folder: Folder) => {
//     if (folder.isPredefined) return;

//     const performDelete = async () => {
//       const updatedFolders = folders.filter((f) => f.id !== folder.id);
//       await saveCustomFoldersToStorage(updatedFolders);

//       // Unassign tasks in this folder rather than deleting them
//       const updatedTasks = tasks.map((t) =>
//         t.folderId === folder.id ? { ...t, folderId: null } : t
//       );
//       await saveTasksToStorage(updatedTasks);

//       if (selectedFolderId === folder.id) {
//         setSelectedFolderId('all');
//       }
//     };

//     if (Platform.OS === 'web') {
//       const confirmed = window.confirm(
//         `Delete folder "${folder.name}"? Tasks inside will remain in All.`
//       );
//       if (confirmed) performDelete();
//     } else {
//       Alert.alert(
//         'Delete Folder',
//         `Delete "${folder.name}"? Tasks inside will remain in All.`,
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Delete', style: 'destructive', onPress: performDelete },
//         ]
//       );
//     }
//   };

//   // ----------------------------------
//   // Task CRUD Handlers
//   // ----------------------------------
//   const handleSaveTask = () => {
//     if (!title.trim()) {
//       if (Platform.OS === 'web') {
//         window.alert('Task title cannot be empty.');
//       } else {
//         Alert.alert('Validation', 'Task title cannot be empty.');
//       }
//       return;
//     }

//     const timestamp = new Date().toLocaleString();

//     if (currentTaskId) {
//       const updatedTasks: Task[] = tasks.map((task) =>
//         task.id === currentTaskId
//           ? {
//               ...task,
//               title: title.trim(),
//               description: description.trim(),
//               updatedAt: timestamp,
//               folderId: taskFolderId,
//             }
//           : task
//       );
//       saveTasksToStorage(updatedTasks);
//     } else {
//       const newTask: Task = {
//         id: Date.now().toString(),
//         title: title.trim(),
//         description: description.trim(),
//         completed: false,
//         updatedAt: timestamp,
//         folderId: taskFolderId,
//       };
//       saveTasksToStorage([newTask, ...tasks]);
//     }

//     closeModal();
//   };

//   const handleToggleComplete = (id: string) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === id ? { ...task, completed: !task.completed } : task
//     );
//     saveTasksToStorage(updatedTasks);
//   };

//   const handleDeleteTask = (id: string) => {
//     if (Platform.OS === 'web') {
//       const confirmed = window.confirm('Are you sure you want to delete this task?');
//       if (confirmed) {
//         const updatedTasks: Task[] = tasks.filter((task) => task.id !== id);
//         saveTasksToStorage(updatedTasks);
//       }
//     } else {
//       Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             const updatedTasks: Task[] = tasks.filter((task) => task.id !== id);
//             saveTasksToStorage(updatedTasks);
//           },
//         },
//       ]);
//     }
//   };

//   const handleClearCompleted = () => {
//     const completedCount = filteredTasks.filter((t) => t.completed).length;
//     if (completedCount === 0) return;

//     const performClear = () => {
//       const remaining = tasks.filter((task) => {
//         const inCurrentView =
//           selectedFolderId === 'all' || task.folderId === selectedFolderId;
//         return !(inCurrentView && task.completed);
//       });
//       saveTasksToStorage(remaining);
//     };

//     if (Platform.OS === 'web') {
//       if (window.confirm(`Clear ${completedCount} completed task(s)?`)) {
//         performClear();
//       }
//     } else {
//       Alert.alert(
//         'Clear Completed',
//         `Remove ${completedCount} completed task(s)?`,
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Clear', style: 'destructive', onPress: performClear },
//         ]
//       );
//     }
//   };

//   const openModalForEdit = (task: Task) => {
//     setCurrentTaskId(task.id);
//     setTitle(task.title);
//     setDescription(task.description);
//     setTaskFolderId(task.folderId ?? null);
//     setModalVisible(true);
//   };

//   const openModalForCreate = () => {
//     setCurrentTaskId(null);
//     setTitle('');
//     setDescription('');
//     setTaskFolderId(selectedFolderId === 'all' ? 'day' : selectedFolderId);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setCurrentTaskId(null);
//     setTitle('');
//     setDescription('');
//     setTaskFolderId(null);
//   };

//   const filteredTasks = tasks
//     .filter((task) => {
//       const matchesFolder =
//         selectedFolderId === 'all' || task.folderId === selectedFolderId;
//       const matchesSearch =
//         task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         task.description.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesFolder && matchesSearch;
//     })
//     // Keep incomplete tasks above completed ones
//     .sort((a, b) => Number(a.completed) - Number(b.completed));

//   const completedInView = filteredTasks.filter((t) => t.completed).length;
//   const getFolderById = (id?: string | null) => folders.find((f) => f.id === id);
//   const activeFolderObj = folders.find((f) => f.id === selectedFolderId);

//   return (
//     <>
//       <Head>
//         <title>My Tasks | Money Manager</title>
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
//                 <Text style={styles.headerTitle}>My Tasks</Text>
//                 <Text style={styles.headerSubtitle}>
//                   Plan your daily, weekly, and monthly financial tasks.
//                 </Text>
//               </View>

//               <View style={styles.headerRightActions}>
//                 {completedInView > 0 && (
//                   <TouchableOpacity
//                     style={styles.clearCompletedBtn}
//                     onPress={handleClearCompleted}
//                   >
//                     <Ionicons name="checkmark-done" size={14} color={COLORS.textSecondary} />
//                     <Text style={styles.clearCompletedText}>Clear done</Text>
//                   </TouchableOpacity>
//                 )}

//                 <View style={styles.countBadge}>
//                   <Text style={styles.taskCount}>
//                     {completedInView}/{filteredTasks.length} done
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Folders Horizontal Bar */}
//             <View style={styles.foldersSection}>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.foldersScrollContent}
//               >
//                 {/* All Tasks Tab */}
//                 <TouchableOpacity
//                   style={[
//                     styles.folderChip,
//                     selectedFolderId === 'all' && styles.folderChipActive,
//                   ]}
//                   onPress={() => setSelectedFolderId('all')}
//                 >
//                   <Ionicons
//                     name="layers-outline"
//                     size={16}
//                     color={
//                       selectedFolderId === 'all'
//                         ? COLORS.accentText
//                         : COLORS.textSecondary
//                     }
//                   />
//                   <Text
//                     style={[
//                       styles.folderChipText,
//                       selectedFolderId === 'all' && styles.folderChipTextActive,
//                     ]}
//                   >
//                     All ({tasks.length})
//                   </Text>
//                 </TouchableOpacity>

//                 {/* Predefined (Favourites, Day, Week, Month) & Custom Folders */}
//                 {folders.map((folder) => {
//                   const isSelected = selectedFolderId === folder.id;
//                   const count = tasks.filter((t) => t.folderId === folder.id).length;

//                   return (
//                     <TouchableOpacity
//                       key={folder.id}
//                       style={[
//                         styles.folderChip,
//                         isSelected && styles.folderChipActive,
//                       ]}
//                       onPress={() => setSelectedFolderId(folder.id)}
//                     >
//                       <Ionicons
//                         name={folder.icon}
//                         size={15}
//                         color={isSelected ? COLORS.accentText : COLORS.accent}
//                       />
//                       <Text
//                         style={[
//                           styles.folderChipText,
//                           isSelected && styles.folderChipTextActive,
//                         ]}
//                       >
//                         {folder.name} ({count})
//                       </Text>

//                       {/* Edit/Delete controls for custom folders */}
//                       {!folder.isPredefined && (
//                         <View style={styles.folderChipActions}>
//                           <TouchableOpacity
//                             onPress={() => openEditFolderModal(folder)}
//                             hitSlop={6}
//                             style={styles.folderMiniAction}
//                           >
//                             <Ionicons
//                               name="pencil"
//                               size={13}
//                               color={
//                                 isSelected ? COLORS.accentText : COLORS.textSecondary
//                               }
//                             />
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             onPress={() => handleDeleteFolder(folder)}
//                             hitSlop={6}
//                             style={styles.folderMiniAction}
//                           >
//                             <Ionicons
//                               name="trash"
//                               size={13}
//                               color={isSelected ? COLORS.accentText : COLORS.danger}
//                             />
//                           </TouchableOpacity>
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}

//                 {/* Add Folder Button */}
//                 <TouchableOpacity
//                   style={styles.addFolderChip}
//                   onPress={openCreateFolderModal}
//                 >
//                   <Ionicons name="add" size={16} color={COLORS.accent} />
//                   <Text style={styles.addFolderChipText}>New Folder</Text>
//                 </TouchableOpacity>
//               </ScrollView>
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
//                 placeholder={
//                   activeFolderObj
//                     ? `Search in ${activeFolderObj.name}...`
//                     : 'Search all tasks...'
//                 }
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

//             {/* Tasks List */}
//             {filteredTasks.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Ionicons
//                   name="checkbox-outline"
//                   size={64}
//                   color={COLORS.border}
//                 />
//                 <Text style={styles.emptyText}>
//                   {activeFolderObj
//                     ? `No tasks in "${activeFolderObj.name}"`
//                     : 'No tasks found'}
//                 </Text>
//                 <Text style={styles.emptySubtext}>
//                   Tap the + button below to add a new task.
//                 </Text>
//               </View>
//             ) : (
//               <View style={styles.listContainer}>
//                 {filteredTasks.map((item) => {
//                   const assignedFolder = getFolderById(item.folderId);

//                   return (
//                     <View
//                       key={item.id}
//                       style={[
//                         styles.taskCard,
//                         item.completed && styles.taskCardCompleted,
//                       ]}
//                     >
//                       {/* Checkbox Button */}
//                       <TouchableOpacity
//                         style={[
//                           styles.checkbox,
//                           item.completed && styles.checkboxChecked,
//                         ]}
//                         onPress={() => handleToggleComplete(item.id)}
//                         activeOpacity={0.7}
//                       >
//                         {item.completed && (
//                           <Ionicons
//                             name="checkmark"
//                             size={16}
//                             color={COLORS.accentText}
//                           />
//                         )}
//                       </TouchableOpacity>

//                       {/* Task Details (Tap to Edit) */}
//                       <TouchableOpacity
//                         style={styles.taskContentContainer}
//                         activeOpacity={0.75}
//                         onPress={() => openModalForEdit(item)}
//                       >
//                         <View style={styles.taskTopMetaRow}>
//                           <Text
//                             style={[
//                               styles.taskTitle,
//                               item.completed && styles.taskTitleCompleted,
//                             ]}
//                             numberOfLines={1}
//                           >
//                             {item.title}
//                           </Text>
//                           {assignedFolder && (
//                             <View style={styles.taskFolderBadge}>
//                               <Ionicons
//                                 name={assignedFolder.icon}
//                                 size={11}
//                                 color={COLORS.accent}
//                               />
//                               <Text style={styles.taskFolderBadgeText}>
//                                 {assignedFolder.name}
//                               </Text>
//                             </View>
//                           )}
//                         </View>

//                         {item.description.length > 0 && (
//                           <Text
//                             style={[
//                               styles.taskSnippet,
//                               item.completed && styles.taskSnippetCompleted,
//                             ]}
//                             numberOfLines={2}
//                           >
//                             {item.description}
//                           </Text>
//                         )}

//                         <Text style={styles.taskDate}>{item.updatedAt}</Text>
//                       </TouchableOpacity>

//                       {/* Delete Button */}
//                       <TouchableOpacity
//                         style={styles.deleteButton}
//                         onPress={() => handleDeleteTask(item.id)}
//                       >
//                         <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
//                       </TouchableOpacity>
//                     </View>
//                   );
//                 })}
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

//         {/* Centered Add/Edit Task Modal */}
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.centeredModalOverlay}
//           >
//             <Pressable style={styles.modalBackdrop} onPress={closeModal} />

//             <View style={styles.centeredModalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalHeaderTitle}>
//                   {currentTaskId ? 'Edit Task' : 'New Task'}
//                 </Text>
//                 <TouchableOpacity onPress={closeModal}>
//                   <Ionicons name="close" size={24} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>

//               {/* Folder Selector inside Task Modal */}
//               <View style={styles.folderSelectorWrapper}>
//                 <Text style={styles.folderSelectorLabel}>Folder:</Text>
//                 <ScrollView
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.folderPillsRow}
//                 >
//                   <TouchableOpacity
//                     style={[
//                       styles.folderPill,
//                       taskFolderId === null && styles.folderPillActive,
//                     ]}
//                     onPress={() => setTaskFolderId(null)}
//                   >
//                     <Text
//                       style={[
//                         styles.folderPillText,
//                         taskFolderId === null && styles.folderPillTextActive,
//                       ]}
//                     >
//                       None
//                     </Text>
//                   </TouchableOpacity>

//                   {folders.map((folder) => {
//                     const active = taskFolderId === folder.id;
//                     return (
//                       <TouchableOpacity
//                         key={folder.id}
//                         style={[
//                           styles.folderPill,
//                           active && styles.folderPillActive,
//                         ]}
//                         onPress={() => setTaskFolderId(folder.id)}
//                       >
//                         <Ionicons
//                           name={folder.icon}
//                           size={13}
//                           color={active ? COLORS.accentText : COLORS.accent}
//                         />
//                         <Text
//                           style={[
//                             styles.folderPillText,
//                             active && styles.folderPillTextActive,
//                           ]}
//                         >
//                           {folder.name}
//                         </Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </ScrollView>
//               </View>

//               <TextInput
//                 style={styles.inputTitle}
//                 placeholder="Task title (e.g. Pay electricity bill)"
//                 placeholderTextColor={COLORS.textMuted}
//                 value={title}
//                 onChangeText={setTitle}
//                 autoFocus
//               />

//               <TextInput
//                 style={styles.inputBody}
//                 placeholder="Optional details or checklist notes..."
//                 placeholderTextColor={COLORS.textMuted}
//                 multiline
//                 textAlignVertical="top"
//                 value={description}
//                 onChangeText={setDescription}
//               />

//               <View style={styles.modalFooter}>
//                 <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
//                   <Text style={styles.saveButtonText}>
//                     {currentTaskId ? 'Update Task' : 'Add Task'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>

//         {/* Centered Create / Edit Folder Modal */}
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={folderModalVisible}
//           onRequestClose={closeFolderModal}
//         >
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.centeredModalOverlay}
//           >
//             <Pressable style={styles.modalBackdrop} onPress={closeFolderModal} />

//             <View style={styles.centeredModalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalHeaderTitle}>
//                   {editingFolder ? 'Rename Folder' : 'Create Folder'}
//                 </Text>
//                 <TouchableOpacity onPress={closeFolderModal}>
//                   <Ionicons name="close" size={24} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>

//               <TextInput
//                 style={styles.inputTitle}
//                 placeholder="Folder name (e.g. Work, Groceries)"
//                 placeholderTextColor={COLORS.textMuted}
//                 value={folderNameInput}
//                 onChangeText={setFolderNameInput}
//                 autoFocus
//               />

//               <View style={styles.modalFooter}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={closeFolderModal}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.saveButton}
//                   onPress={handleSaveFolder}
//                 >
//                   <Text style={styles.saveButtonText}>
//                     {editingFolder ? 'Update Folder' : 'Create Folder'}
//                   </Text>
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
//     paddingBottom: 110,
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
//     marginBottom: 18,
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
//   headerRightActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   clearCompletedBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//   },
//   clearCompletedText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: COLORS.textSecondary,
//   },
//   countBadge: {
//     backgroundColor: 'rgba(245, 158, 11, 0.15)',
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   taskCount: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.accent,
//   },

//   // Folders Bar
//   foldersSection: {
//     marginBottom: 16,
//   },
//   foldersScrollContent: {
//     gap: 8,
//     paddingVertical: 2,
//     alignItems: 'center',
//   },
//   folderChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 13,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 6,
//   },
//   folderChipActive: {
//     backgroundColor: COLORS.accent,
//     borderColor: COLORS.accent,
//   },
//   folderChipText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },
//   folderChipTextActive: {
//     color: COLORS.accentText,
//   },
//   folderChipActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 4,
//     paddingLeft: 6,
//     borderLeftWidth: 1,
//     borderLeftColor: 'rgba(255,255,255,0.18)',
//     gap: 6,
//   },
//   folderMiniAction: {
//     padding: 2,
//   },
//   addFolderChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(245, 158, 11, 0.1)',
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: COLORS.accent,
//     paddingHorizontal: 13,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 4,
//   },
//   addFolderChipText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.accent,
//   },

//   // Search Bar
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
//     ...Platform.select({
//       web: {
//         outlineStyle: 'none',
//       } as any,
//     }),
//   },

//   // Empty & Tasks List
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
//   taskCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 16,
//   },
//   taskCardCompleted: {
//     opacity: 0.65,
//     backgroundColor: '#14171D',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 7,
//     borderWidth: 2,
//     borderColor: COLORS.accent,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 14,
//     backgroundColor: 'transparent',
//   },
//   checkboxChecked: {
//     backgroundColor: COLORS.accent,
//     borderColor: COLORS.accent,
//   },
//   taskContentContainer: {
//     flex: 1,
//     paddingRight: 12,
//   },
//   taskTopMetaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 8,
//     marginBottom: 4,
//   },
//   taskTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },
//   taskTitleCompleted: {
//     textDecorationLine: 'line-through',
//     color: COLORS.textSecondary,
//   },
//   taskFolderBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surfaceElevated,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 12,
//     gap: 4,
//   },
//   taskFolderBadgeText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: COLORS.accent,
//   },
//   taskSnippet: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     lineHeight: 20,
//     marginBottom: 6,
//   },
//   taskSnippetCompleted: {
//     textDecorationLine: 'line-through',
//     color: COLORS.textMuted,
//   },
//   taskDate: {
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
//     bottom: 84,
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

//   // Centered Modals
//   centeredModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalBackdrop: {
//     ...StyleSheet.absoluteFill,
//   },
//   centeredModalContent: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 22,
//     width: '100%',
//     maxWidth: 540,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalHeaderTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//   },

//   // Folder selector inside Task modal
//   folderSelectorWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//     gap: 10,
//   },
//   folderSelectorLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.textSecondary,
//   },
//   folderPillsRow: {
//     gap: 8,
//     alignItems: 'center',
//   },
//   folderPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surfaceElevated,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//     gap: 5,
//   },
//   folderPillActive: {
//     backgroundColor: COLORS.accent,
//     borderColor: COLORS.accent,
//   },
//   folderPillText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: COLORS.textSecondary,
//   },
//   folderPillTextActive: {
//     color: COLORS.accentText,
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
//     ...Platform.select({
//       web: {
//         outlineStyle: 'none',
//       } as any,
//     }),
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
//     minHeight: 120,
//     marginBottom: 20,
//     ...Platform.select({
//       web: {
//         outlineStyle: 'none',
//       } as any,
//     }),
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



// newer3
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

const TASKS_STORAGE_KEY = '@tasks_app_data';
const TASK_FOLDERS_STORAGE_KEY = '@tasks_app_folders';

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

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
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
  { id: 'day', name: 'Day', icon: 'today', isPredefined: true },
  { id: 'week', name: 'Week', icon: 'calendar', isPredefined: true },
  { id: 'month', name: 'Month', icon: 'calendar-number', isPredefined: true },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>(PREDEFINED_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [taskFolderId, setTaskFolderId] = useState<string | null>(null);

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
      const [storedTasks, storedFolders] = await Promise.all([
        AsyncStorage.getItem(TASKS_STORAGE_KEY),
        AsyncStorage.getItem(TASK_FOLDERS_STORAGE_KEY),
      ]);

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks) as Task[]);
      }

      if (storedFolders !== null) {
        const customFolders = JSON.parse(storedFolders) as Folder[];
        setFolders([...PREDEFINED_FOLDERS, ...customFolders]);
      }
    } catch (error) {
      console.error('Failed to load tasks or folders.', error);
    }
  };

  const saveTasksToStorage = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to save tasks.', error);
    }
  };

  const saveCustomFoldersToStorage = async (allFolders: Folder[]) => {
    try {
      const customOnly = allFolders.filter((f) => !f.isPredefined);
      await AsyncStorage.setItem(TASK_FOLDERS_STORAGE_KEY, JSON.stringify(customOnly));
      setFolders(allFolders);
    } catch (error) {
      console.error('Failed to save task folders.', error);
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
        id: `task_folder_${Date.now()}`,
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

      const updatedTasks = tasks.map((t) =>
        t.folderId === folder.id ? { ...t, folderId: null } : t
      );
      await saveTasksToStorage(updatedTasks);

      if (selectedFolderId === folder.id) {
        setSelectedFolderId('all');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete folder "${folder.name}"? Tasks inside will remain in All.`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Folder',
        `Delete "${folder.name}"? Tasks inside will remain in All.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: performDelete },
        ]
      );
    }
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      if (Platform.OS === 'web') window.alert('Task title cannot be empty.');
      else Alert.alert('Validation', 'Task title cannot be empty.');
      return;
    }

    const timestamp = new Date().toLocaleString();

    if (currentTaskId) {
      const updatedTasks: Task[] = tasks.map((task) =>
        task.id === currentTaskId
          ? {
              ...task,
              title: title.trim(),
              description: description.trim(),
              updatedAt: timestamp,
              folderId: taskFolderId,
            }
          : task
      );
      saveTasksToStorage(updatedTasks);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        updatedAt: timestamp,
        folderId: taskFolderId,
      };
      saveTasksToStorage([newTask, ...tasks]);
    }

    closeModal();
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasksToStorage(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this task?')) {
        saveTasksToStorage(tasks.filter((task) => task.id !== id));
      }
    } else {
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => saveTasksToStorage(tasks.filter((task) => task.id !== id)),
        },
      ]);
    }
  };

  const handleClearCompleted = () => {
    const completedCount = filteredTasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;

    const performClear = () => {
      const remaining = tasks.filter((task) => {
        const inCurrentView =
          selectedFolderId === 'all' || task.folderId === selectedFolderId;
        return !(inCurrentView && task.completed);
      });
      saveTasksToStorage(remaining);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Clear ${completedCount} completed task(s)?`)) performClear();
    } else {
      Alert.alert('Clear Completed', `Remove ${completedCount} completed task(s)?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: performClear },
      ]);
    }
  };

  const openModalForEdit = (task: Task) => {
    setCurrentTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setTaskFolderId(task.folderId ?? null);
    setModalVisible(true);
  };

  const openModalForCreate = () => {
    setCurrentTaskId(null);
    setTitle('');
    setDescription('');
    setTaskFolderId(selectedFolderId === 'all' ? 'day' : selectedFolderId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentTaskId(null);
    setTitle('');
    setDescription('');
    setTaskFolderId(null);
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesFolder =
        selectedFolderId === 'all' || task.folderId === selectedFolderId;
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    })
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  const completedInView = filteredTasks.filter((t) => t.completed).length;
  const getFolderById = (id?: string | null) => folders.find((f) => f.id === id);
  const activeFolderObj = folders.find((f) => f.id === selectedFolderId);

  return (
    <>
      <Head>
        <title>My Tasks | Money Manager</title>
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
                <Text style={styles.headerTitle}>My Tasks</Text>
                <Text style={styles.headerSubtitle}>
                  Plan your daily, weekly, and monthly financial tasks.
                </Text>
              </View>

              <View style={styles.headerRightActions}>
                {completedInView > 0 && (
                  <TouchableOpacity
                    style={styles.clearCompletedBtn}
                    onPress={handleClearCompleted}
                  >
                    <Ionicons name="checkmark-done" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.clearCompletedText}>Clear done</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.countBadge}>
                  <Text style={styles.taskCount}>
                    {completedInView}/{filteredTasks.length} done
                  </Text>
                </View>
              </View>
            </View>

            {/* Folders Horizontal Bar (Supports mouse-wheel horizontal scroll on web) */}
            <View style={styles.foldersSection}>
              <HorizontalScrollBar contentContainerStyle={styles.foldersScrollContent}>
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
                    All ({tasks.length})
                  </Text>
                </TouchableOpacity>


                {/* {folders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id;
                  const count = tasks.filter((t) => t.folderId === folder.id).length;

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
                })} */}

{/* newer */}
{folders.map((folder) => {
  const isSelected = selectedFolderId === folder.id;
  const count = tasks.filter((t) => t.folderId === folder.id).length;
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
                    : 'Search all tasks...'
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

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="checkbox-outline"
                  size={64}
                  color={COLORS.border}
                />
                <Text style={styles.emptyText}>
                  {activeFolderObj
                    ? `No tasks in "${activeFolderObj.name}"`
                    : 'No tasks found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to add a new task.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredTasks.map((item) => {
                  const assignedFolder = getFolderById(item.folderId);

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.taskCard,
                        item.completed && styles.taskCardCompleted,
                      ]}
                    >
                      {/* Checkbox Button */}
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          item.completed && styles.checkboxChecked,
                        ]}
                        onPress={() => handleToggleComplete(item.id)}
                        activeOpacity={0.7}
                      >
                        {item.completed && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={COLORS.accentText}
                          />
                        )}
                      </TouchableOpacity>

                      {/* Task Details (Tap to Edit, Clickable URLs inside) */}
                      <TouchableOpacity
                        style={styles.taskContentContainer}
                        activeOpacity={0.75}
                        onPress={() => openModalForEdit(item)}
                      >
                        <Text
                          style={[
                            styles.taskTitle,
                            item.completed && styles.taskTitleCompleted,
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        {item.description.length > 0 && (
                          <LinkifiedText
                            text={item.description}
                            style={[
                              styles.taskSnippet,
                              item.completed && styles.taskSnippetCompleted,
                            ]}
                            linkColor={COLORS.accent}
                            numberOfLines={2}
                          />
                        )}

                        <Text style={styles.taskDate}>{item.updatedAt}</Text>
                      </TouchableOpacity>

                      {/* Right Column: Folder Badge aligned directly above Delete Icon */}
                      <View style={styles.taskRightActions}>
                        {assignedFolder ? (
                          <View style={styles.taskFolderBadge}>
                            <Ionicons
                              name={assignedFolder.icon}
                              size={11}
                              color={COLORS.accent}
                            />
                            <Text style={styles.taskFolderBadgeText}>
                              {assignedFolder.name}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.badgePlaceholder} />
                        )}

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteTask(item.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
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

        {/* Centered Add/Edit Task Modal */}
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
                  {currentTaskId ? 'Edit Task' : 'New Task'}
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
                      taskFolderId === null && styles.folderPillActive,
                    ]}
                    onPress={() => setTaskFolderId(null)}
                  >
                    <Text
                      style={[
                        styles.folderPillText,
                        taskFolderId === null && styles.folderPillTextActive,
                      ]}
                    >
                      None
                    </Text>
                  </TouchableOpacity>

                  {folders.map((folder) => {
                    const active = taskFolderId === folder.id;
                    return (
                      <TouchableOpacity
                        key={folder.id}
                        style={[
                          styles.folderPill,
                          active && styles.folderPillActive,
                        ]}
                        onPress={() => setTaskFolderId(folder.id)}
                      >
                        <Ionicons
                          name={folder.icon}
                          size={13}
                          color={active ? COLORS.accentText : COLORS.accent}
                        />
                        <Text
                          style={[
                            styles.folderPillText,
                            active && styles.folderPillTextActive,
                          ]}
                        >
                          {folder.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </HorizontalScrollBar>
              </View>

              <TextInput
                style={styles.inputTitle}
                placeholder="Task title (e.g. Pay electricity bill)"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />

              <TextInput
                style={styles.inputBody}
                placeholder="Optional details or links (https://...)..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                  <Text style={styles.saveButtonText}>
                    {currentTaskId ? 'Update Task' : 'Add Task'}
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
                placeholder="Folder name (e.g. Work, Groceries)"
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
  // --- newer
foldersSection: {
    marginTop: 12,
    marginBottom: 20,
  },

  // ---


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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearCompletedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  clearCompletedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  countBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  taskCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  // foldersSection: {
  //   marginBottom: 16,
  // },
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
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  taskCardCompleted: {
    opacity: 0.65,
    backgroundColor: '#14171D',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  taskContentContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  taskSnippet: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  taskSnippetCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  taskDate: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // Right column aligning folder badge directly above delete icon
  taskRightActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  taskFolderBadge: {
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
  taskFolderBadgeText: {
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
    minHeight: 120,
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


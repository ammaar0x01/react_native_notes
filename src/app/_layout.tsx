// import React, { useEffect, useState } from "react";
// import {
//   Tabs,
//   ThemeProvider,
//   DarkTheme,
//   DefaultTheme,
//   useRouter,
//   usePathname,
// } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import {
//   useColorScheme,
//   Platform,
//   useWindowDimensions,
//   View,
//   TouchableOpacity,
//   Text,
//   Pressable,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons, Octicons } from "@expo/vector-icons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// import "@/global";
// import { AnimatedSplashOverlay } from "@/components/animated-icon";
// import { Analytics } from "@/components/analytics";

// // import { checkAndPromptWeeklyBackup } from "@/utils/dataExport";
// // import { STORAGE_KEYS } from "@/constants/storage";
// // import { stylesLayout as styles } from "../_layout.styles";

// // import React, { useEffect, useState } from 'react';
// // import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import WeeklyBackupModal from '@/components/weekly-backup-modal';
// import { shouldPromptWeeklyBackup } from '@/utils/dataExport';
// // ----------------------------------


// if (Platform.OS !== "web") {
//   SplashScreen.preventAutoHideAsync().catch(() => {});
// }

// interface NavItemProps {
//   icon: React.ReactNode;
//   label: string;
//   path: string;
//   activePath: string;
//   onPress: () => void;
// }

// function SidebarIcon({ icon, label, path, activePath, onPress }: NavItemProps) {
//   const [hovered, setHovered] = useState(false);
//   const isActive = activePath === path;

//   return (
//     <View style={{ position: "relative", alignItems: "center" }}>
//       <Pressable
//         onPress={onPress}
//         onHoverIn={() => setHovered(true)}
//         onHoverOut={() => setHovered(false)}
//         style={({ pressed }) => [
//           {
//             padding: 10,
//             borderRadius: 12,
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: pressed
//               ? "rgba(255, 255, 255, 0.25)"
//               : hovered
//                 ? "rgba(255, 255, 255, 0.15)"
//                 : isActive
//                   ? "rgba(255, 255, 255, 0.1)"
//                   : "transparent",
//           },
//         ]}
//       >
//         {icon}
//       </Pressable>

//       {hovered && (
//         <View
//           style={{
//             position: "absolute",
//             left: 70,
//             top: "50%",
//             transform: [{ translateY: -14 }],
//             backgroundColor: "#1f2937",
//             paddingHorizontal: 8,
//             paddingVertical: 4,
//             borderRadius: 6,
//             zIndex: 100,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.2,
//             shadowRadius: 3,
//           }}
//         >
//           <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}>
//             {label}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// // === MAIN
// export default function Layout() {
//   const colorScheme = useColorScheme();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();
//   const router = useRouter();
//   const pathname = usePathname();

//   const isLandingPage = pathname === "/";
//   const isWeb = Platform.OS === "web";
//   const isDesktop = isWeb && width >= 768;
//   const isMobileApp = !isWeb; 
//   const showBottomBar = !isDesktop && !isLandingPage; 

//   const bottomPadding = isWeb ? 8 : Math.max(insets.bottom, 12);
//   const totalBarHeight = 62 + bottomPadding;

//   // --- for reminder
//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     checkAndPromptWeeklyBackup(() => {
//   //       router.push('/settings' as any);
//   //     });
//   //   }, 1500);

//   //   return () => clearTimeout(timer)
//   // }, [])



//   const [showBackupModal, setShowBackupModal] = useState(false);

// useEffect(() => {
//   const checkBackup = async () => {
//     const isDue = await shouldPromptWeeklyBackup();
//     if (isDue) {
//       setShowBackupModal(true);
//     }
//   };
//   checkBackup();
// }, []);

// // ----


// const handleDownloadBackupFile = async () => {
//   // Replace with your existing export helper if you already have one in a service/context
//   const [username, notes, tasks, links, noteFolders, taskFolders, linkFolders] =
//     await Promise.all([
//       AsyncStorage.getItem('username'),
//       AsyncStorage.getItem('notes'),
//       AsyncStorage.getItem('tasks'),
//       AsyncStorage.getItem('links'),
//       AsyncStorage.getItem('noteFolders'),
//       AsyncStorage.getItem('taskFolders'),
//       AsyncStorage.getItem('linkFolders'),
//     ]);

//   const backupPayload = {
//     app: 'notes',
//     version: '1.0.0',
//     exportDate: new Date().toISOString(),
//     data: {
//       username: username || '',
//       notes: notes ? JSON.parse(notes) : [],
//       tasks: tasks ? JSON.parse(tasks) : [],
//       links: links ? JSON.parse(links) : [],
//       noteFolders: noteFolders ? JSON.parse(noteFolders) : [],
//       taskFolders: taskFolders ? JSON.parse(taskFolders) : [],
//       linkFolders: linkFolders ? JSON.parse(linkFolders) : [],
//     },
//   };

//   const jsonString = JSON.stringify(backupPayload, null, 2);
//   const dateTag = new Date().toISOString().split('T')[0];
//   const fileName = `notes_${dateTag}.json`;

//   if (Platform.OS === 'web') {
//     const blob = new Blob([jsonString], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   } else {
//     const fileUri = `${FileSystem.documentDirectory}${fileName}`;
//     await FileSystem.writeAsStringAsync(fileUri, jsonString, {
//       encoding: FileSystem.EncodingType.UTF8,
//     });
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri, {
//         mimeType: 'application/json',
//         dialogTitle: 'Save Notes Backup',
//       });
//     }
//   }
// };

// // ---

  
//   // --- Sidebar items for desktop web navigation
//   const sidebarNavItems = [
//      {
//       label: "Notes",
//       path: "/app/notes",
//       icon: <Ionicons name="pencil" size={24} color="white" />,
//     },

//     {
//       label: "Tasks",
//       path: "/app/tasks",
//       icon: <Ionicons name="checkbox" size={24} color="white" />,
//     },
//     {
//       label: "Links",
//       path: "/app/links",
//       icon: <Ionicons name="link" size={24} color="white" />,
//     },
//     {
//       label: "Settings",
//       path: "/app/settings",
//       icon: <Ionicons name="settings-outline" size={24} color="white" />,
//     },
//   ];

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <Analytics />

//       <View
//         style={{
//           flex: 1,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "#000000",
//         }}
//       >
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "row",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           {/* Desktop Web Sidebar */}
//           {isDesktop && !isLandingPage && (
//             <View
//               style={{
//                 width: 76,
//                 backgroundColor: "#000000",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 paddingVertical: 28,
//                 paddingHorizontal: 8,
//                 zIndex: 50,
//                 height: "100%",
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: 18,
//                 }}
//               >
//                 {sidebarNavItems.map((item) => (
//                   <SidebarIcon
//                     key={item.path}
//                     icon={item.icon}
//                     label={item.label}
//                     path={item.path}
//                     activePath={pathname}
//                     onPress={() => router.push(item.path as any)}
//                   />
//                 ))}
//               </View>

//               <TouchableOpacity
//                 onPress={() => router.push("/" as any)}
//                 style={{ padding: 10, borderRadius: 12 }}
//               >
//                 <Octicons name="arrow-left" size={22} color="white" />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* MAIN CONTENT + BOTTOM NAVBAR (Native App & Small-Width Web) */}
//           <View
//             style={{
//               flex: 1,
//               width: "100%",
//               height: "100%",
//             }}
//           >
//             <Tabs
//               screenOptions={{
//                 headerShown: false,
//                 tabBarActiveTintColor: "#F59E0B",
//                 tabBarInactiveTintColor: "#9CA3AF",
//                 tabBarStyle: !showBottomBar
//                   ? { display: "none" }
//                   : {
//                       backgroundColor: "#0e0900",
//                       borderTopWidth: 1,
//                       borderTopColor: "#1f1a10",
//                       height: totalBarHeight,
//                       paddingBottom: bottomPadding,
//                       paddingTop: 8,
//                       position: "absolute",
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       elevation: 8,
//                       zIndex: 50,
//                     },
//                 tabBarLabelStyle: {
//                   fontSize: 11,
//                   fontWeight: "600",
//                   marginTop: 2,
//                 },
//                 sceneStyle: {
//                   backgroundColor: "#0c0800",
//                   paddingTop: isMobileApp ? 65 : 0,
//                   paddingBottom: showBottomBar ? totalBarHeight : 0,
//                 },
//               }}
//             >

//               <Tabs.Screen
//                 name="app/notes"
//                 options={{
//                   title: "Notes",
//                   tabBarIcon: ({ color }) => (
//                     <Ionicons name="pencil" size={22} color={color} />
//                   ),
//                 }}
//               />
//               <Tabs.Screen
//                 name="app/tasks"
//                 options={{
//                   title: "Tasks",
//                   tabBarIcon: ({ color }) => (
//                     <Ionicons name="checkbox" size={22} color={color} />
//                   ),
//                 }}
//               />

//               <Tabs.Screen
//                 name="app/links"
//                 options={{
//                   title: "Links",
//                   tabBarIcon: ({ color }) => (
//                     <Ionicons name="link" size={22} color={color} />
//                     // <Ionicons name="globe-outline" size={22} color={color} />
//                   ),
//                 }}
//               />

//               <Tabs.Screen
//                 name="app/settings"
//                 options={{
//                   title: "Settings",
//                   tabBarIcon: ({ color }) => (
//                     <Ionicons name="settings-outline" size={22} color={color} />
//                   ),
//                 }}
//               />

//               {/* === Hidden auxiliary screens so they don't generate bottom tab buttons */}
//               <Tabs.Screen name="index" options={{ href: null }} />
//               <Tabs.Screen name="app/index" options={{ href: null }} />
            
//             </Tabs>
//           </View>
//         </View>
//       </View>

//       <WeeklyBackupModal
//         visible={showBackupModal}
//         onClose={() => setShowBackupModal(false)}
//         onDownloadBackup={handleDownloadBackupFile}
//       />
//     </ThemeProvider>
//   );
// }



// newer
import React, { useEffect, useState } from "react";
import {
  Tabs,
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useRouter,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useColorScheme,
  Platform,
  useWindowDimensions,
  View,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import "@/global";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Analytics } from "@/components/analytics";
import WeeklyBackupModal from "@/components/weekly-backup-modal";
import { shouldPromptWeeklyBackup } from "@/utils/dataExport";
import { STORAGE_KEYS } from "@/constants/storage";

if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onPress: () => void;
}

function SidebarIcon({ icon, label, isActive, onPress }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <View style={{ position: "relative", alignItems: "center" }}>
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={({ pressed }) => [
          {
            padding: 10,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed
              ? "rgba(255, 255, 255, 0.25)"
              : hovered
                ? "rgba(255, 255, 255, 0.15)"
                : isActive
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
          },
        ]}
      >
        {icon}
      </Pressable>

      {hovered && (
        <View
          style={{
            position: "absolute",
            left: 70,
            top: "50%",
            transform: [{ translateY: -14 }],
            backgroundColor: "#1f2937",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            zIndex: 100,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function Layout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isWeb = Platform.OS === "web";
  const isDesktop = isWeb && width >= 768;
  const isMobileApp = !isWeb;
  const showBottomBar = !isDesktop && !isLandingPage;

  const bottomPadding = isWeb ? 8 : Math.max(insets.bottom, 12);
  const totalBarHeight = 62 + bottomPadding;

  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    if (isLandingPage) return;

    const checkBackup = async () => {
      const isDue = await shouldPromptWeeklyBackup();
      if (isDue) {
        setShowBackupModal(true);
      }
    };
    checkBackup();
  }, [isLandingPage]);

  // const handleDownloadBackupFile = async () => {
  //   const [
  //     username,
  //     notes,
  //     tasks,
  //     links,
  //     noteFolders,
  //     taskFolders,
  //     linkFolders,
  //   ] = await Promise.all([
  //     AsyncStorage.getItem(STORAGE_KEYS.USERNAME ?? "username"),
  //     AsyncStorage.getItem(STORAGE_KEYS.NOTES ?? "notes"),
  //     AsyncStorage.getItem(STORAGE_KEYS.TASKS ?? "tasks"),
  //     AsyncStorage.getItem(STORAGE_KEYS.LINKS ?? "links"),
  //     AsyncStorage.getItem(STORAGE_KEYS.NOTE_FOLDERS ?? "noteFolders"),
  //     AsyncStorage.getItem(STORAGE_KEYS.TASK_FOLDERS ?? "taskFolders"),
  //     AsyncStorage.getItem(STORAGE_KEYS.LINK_FOLDERS ?? "linkFolders"),
  //   ]);

  //   const backupPayload = {
  //     app: "notes",
  //     version: "1.0.0",
  //     exportDate: new Date().toISOString(),
  //     data: {
  //       username: username || "",
  //       notes: notes ? JSON.parse(notes) : [],
  //       tasks: tasks ? JSON.parse(tasks) : [],
  //       links: links ? JSON.parse(links) : [],
  //       noteFolders: noteFolders ? JSON.parse(noteFolders) : [],
  //       taskFolders: taskFolders ? JSON.parse(taskFolders) : [],
  //       linkFolders: linkFolders ? JSON.parse(linkFolders) : [],
  //     },
  //   };

  //   const jsonString = JSON.stringify(backupPayload, null, 2);
  //   const dateTag = new Date().toISOString().split("T")[0];
  //   const fileName = `notes_${dateTag}.json`;

  //   if (Platform.OS === "web") {
  //     const blob = new Blob([jsonString], { type: "application/json" });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } else {
  //     const file = new File(Paths.document, fileName);
  //     file.write(jsonString);

  //     if (await Sharing.isAvailableAsync()) {
  //       await Sharing.shareAsync(file.uri, {
  //         mimeType: "application/json",
  //         dialogTitle: "Save Notes Backup",
  //       });
  //     }
  //   }
  // };


  const handleDownloadBackupFile = async () => {
    const [rawNotesData, rawProfileData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.notes),
      AsyncStorage.getItem(STORAGE_KEYS.profile),
    ]);

    const parsedData = rawNotesData ? JSON.parse(rawNotesData) : {};
    const parsedProfile = rawProfileData ? JSON.parse(rawProfileData) : {};

    const backupPayload = {
      app: "notes",
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      data: {
        username: parsedProfile.username ?? parsedData.username ?? "",
        notes: parsedData.notes ?? [],
        tasks: parsedData.tasks ?? [],
        links: parsedData.links ?? [],
        noteFolders: parsedData.noteFolders ?? [],
        taskFolders: parsedData.taskFolders ?? [],
        linkFolders: parsedData.linkFolders ?? [],
      },
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const dateTag = new Date().toISOString().split("T")[0];
    const fileName = `notes_${dateTag}.json`;

    if (Platform.OS === "web") {
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const file = new File(Paths.document, fileName);
      file.write(jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Save Notes Backup",
        });
      }
    }
  };
  

  const sidebarNavItems = [
    {
      label: "Notes",
      path: "/app",
      icon: <Ionicons name="pencil" size={24} color="white" />,
    },
    {
      label: "Tasks",
      path: "/app/tasks",
      icon: <Ionicons name="checkbox" size={24} color="white" />,
    },
    {
      label: "Links",
      path: "/app/links",
      icon: <Ionicons name="link" size={24} color="white" />,
    },
    {
      label: "Settings",
      path: "/app/settings",
      icon: <Ionicons name="settings-outline" size={24} color="white" />,
    },
  ];

  const isSidebarItemActive = (itemPath: string) => {
    if (itemPath === "/app") {
      return (
        pathname === "/app" ||
        pathname === "/app/" ||
        pathname === "/app/notes"
      );
    }
    return pathname === itemPath;
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Analytics />

      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Desktop Web Sidebar */}
          {isDesktop && !isLandingPage && (
            <View
              style={{
                width: 76,
                backgroundColor: "#000000",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 28,
                paddingHorizontal: 8,
                zIndex: 50,
                height: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                {sidebarNavItems.map((item) => (
                  <SidebarIcon
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={isSidebarItemActive(item.path)}
                    onPress={() => router.push(item.path as any)}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={() => router.push("/" as any)}
                style={{ padding: 10, borderRadius: 12 }}
              >
                <Octicons name="arrow-left" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* MAIN CONTENT + BOTTOM NAVBAR (Native App & Small-Width Web) */}
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
          >
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#F59E0B",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: !showBottomBar
                  ? { display: "none" }
                  : {
                      backgroundColor: "#0e0900",
                      borderTopWidth: 1,
                      borderTopColor: "#1f1a10",
                      height: totalBarHeight,
                      paddingBottom: bottomPadding,
                      paddingTop: 8,
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      elevation: 8,
                      zIndex: 50,
                    },
                tabBarLabelStyle: {
                  fontSize: 11,
                  fontWeight: "600",
                  marginTop: 2,
                },
                sceneStyle: {
                  backgroundColor: "#0c0800",
                  paddingTop: isMobileApp ? 65 : 0,
                  paddingBottom: showBottomBar ? totalBarHeight : 0,
                },
              }}
            >
              <Tabs.Screen
                name="app/notes"
                options={{
                  title: "Notes",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="pencil" size={22} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="app/tasks"
                options={{
                  title: "Tasks",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="checkbox" size={22} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="app/links"
                options={{
                  title: "Links",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="link" size={22} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="app/settings"
                options={{
                  title: "Settings",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="settings-outline" size={22} color={color} />
                  ),
                }}
              />

              {/* Hidden auxiliary screens so they don't generate bottom tab buttons */}
              <Tabs.Screen name="index" options={{ href: null }} />
              <Tabs.Screen name="app/index" options={{ href: null }} />
            </Tabs>
          </View>
        </View>
      </View>

      <WeeklyBackupModal
        visible={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onDownloadBackup={handleDownloadBackupFile}
      />
    </ThemeProvider>
  );
}


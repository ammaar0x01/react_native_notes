// import React, { useEffect, useRef, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Pressable,
//   Image,
//   useWindowDimensions,
//   Platform,
//   StyleProp,
//   ViewStyle,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
// import Head from 'expo-router/head';

// const HERO_IMAGE = require('@/images/hero.jpg');

// const CHATBOT_PROMPT = `You are a data transformation assistant for "Notes", an offline-first React Native expense tracking app.

// Your task is to convert the attached spreadsheet data (e.g., Excel/XLSX/CSV) or raw text into a valid JSON backup file that matches the exact schema and keys of the app's official JSON format.

// ### Rules & Constraints:
// 1. DO NOT add any extra root keys or custom fields to individual expense objects. Every expense entry must only use these exact keys:
//    - "id": number (starting at 1, and ascending)
//    - "title": string (the description of the expense)
//    - "amount": number (numeric value, formatted to 2 decimal places where appropriate)
//    - "category": string (must be one of: "Food", "Transport", "Bills", "Shopping", "Entertainment", "Health")
//    - "date": string in strict "YYYY-MM-DD" format

// 2. The final JSON output structure must follow this exact top-level wrapper:
// {
//   "app": "Notes",
//   "version": "2.0",
//   "exportDate": "[Current ISO Timestamp]",
//   "data": {
//     "expenses": [ ...array of formatted expense objects... ],
//     "monthlyDummySeeded": true,
//     "notes": [ ... ],
//     "monthlyBudget": 1500,
//     "profile": { ... }
//   }
// }

// 3. If categories are missing or unspecified in the source file, infer the most logical category from the transaction description using the allowed categories list ("Food", "Transport", "Bills", "Shopping", "Entertainment", "Health").
// 4. Output ONLY valid JSON code inside a code block without any conversational filler or markdown explanations outside the code block.`;

// const DOWNLOAD_URL =
//   'https://github.com/ammaar0x01/react_native_money_manager/releases/tag/release-v1-0-0';

// type HoverPressableProps = {
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>;
//   hoverStyle?: StyleProp<ViewStyle>;
//   pressedStyle?: StyleProp<ViewStyle>;
//   children: React.ReactNode;
//   accessibilityLabel?: string;
// };

// function HoverPressable({
//   onPress,
//   style,
//   hoverStyle,
//   pressedStyle,
//   children,
//   accessibilityLabel,
// }: HoverPressableProps) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Pressable
//       accessibilityRole="button"
//       accessibilityLabel={accessibilityLabel}
//       onPress={onPress}
//       onHoverIn={() => setHovered(true)}
//       onHoverOut={() => setHovered(false)}
//       style={({ pressed }) => [
//         style,
//         hovered && hoverStyle,
//         pressed && pressedStyle,
//       ]}
//     >
//       {children}
//     </Pressable>
//   );
// }

// export default function LandingScreen() {
//   const scrollViewRef = useRef<ScrollView>(null);
//   const params = useLocalSearchParams();
//   const [importSectionY, setImportSectionY] = useState(0);

//   // Listen for query params when navigating to this page
//   useEffect(() => {
//     if (params.scrollTo === 'import' && importSectionY > 0) {
//       setTimeout(() => {
//         scrollViewRef.current?.scrollTo({ y: importSectionY, animated: true });
//       }, 150); // slight delay to ensure layout is ready
//     }
//   }, [params.scrollTo, importSectionY]);
//   // ------------------------------

//   const { width } = useWindowDimensions();
//   const isDesktop = width >= 768;
//   const [copiedPrompt, setCopiedPrompt] = useState(false);

//   const handleCopyPrompt = () => {
//     if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
//       navigator.clipboard.writeText(CHATBOT_PROMPT);
//     }
//     setCopiedPrompt(true);
//     setTimeout(() => setCopiedPrompt(false), 2500);
//   };

//   const openDownload = async () => {
//     if (Platform.OS === 'web') {
//       if (typeof window !== 'undefined') {
//         window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
//       }
//       return;
//     }

//     await openBrowserAsync(DOWNLOAD_URL, {
//       presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
//     });
//   };

//   return (
//     <>
//       <Head>
//         <title>Notes</title>
//       </Head>

//     <View style={styles.container}>
//       {/* Sticky landing page navbar */}
//       <View style={[styles.navbar, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
//         <View style={styles.brandContainer}>
//           <View>
//             <Text style={styles.brandText}>Notes</Text>
//             {/* <Text style={styles.brandSubText}>Expense tracker</Text> */}
//           </View>
//         </View>

//         <HoverPressable
//           style={styles.navLaunchButton}
//           hoverStyle={styles.navLaunchButtonHover}
//           pressedStyle={styles.navLaunchButtonPressed}
//           accessibilityLabel="Open the Notes app"
//           onPress={() => router.replace('/' as any)}
//         >
//           <Text style={styles.navLaunchButtonText}>Go to App</Text>
//           <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
//         </HoverPressable>
//       </View>

//       <ScrollView
//         ref={scrollViewRef}
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >

//       {/* Hero Section */}
//       <View style={[styles.heroSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
//         <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>

//           <Text style={styles.heroTitle}>
//             Know where your money goes.
//             {'\n'}
//             <Text style={styles.heroTitleHighlight}>Every month.</Text>
//           </Text>

//           <Text style={styles.heroDescription}>
//             Log daily expenses, set monthly budgets, and browse a full year of spending
//             history. Notes keeps your finances organized — with everything stored
//             privately on your device.
//           </Text>

//           <View style={styles.heroButtonsRow}>
//             <HoverPressable
//               style={styles.primaryButton}
//               hoverStyle={styles.primaryButtonHover}
//               pressedStyle={styles.primaryButtonPressed}
//               accessibilityLabel="Start tracking expenses for free"
//               onPress={() => router.replace('/' as any)}
//             >
//               <Text style={styles.primaryButtonText}>Start Tracking Free</Text>
//               <Ionicons name="arrow-forward" size={18} color="#2e2d01" style={{ marginLeft: 8 }} />
//             </HoverPressable>

//             <HoverPressable
//               style={styles.secondaryButton}
//               hoverStyle={styles.secondaryButtonHover}
//               pressedStyle={styles.secondaryButtonPressed}
//               accessibilityLabel="Open the monthly report"
//               onPress={() => router.replace('/monthly-expenses' as any)}
//             >
//               <Ionicons name="calendar-outline" size={18} color="#1F2937" style={{ marginRight: 8 }} />
//               <Text style={styles.secondaryButtonText}>Monthly Report</Text>
//             </HoverPressable>

//             <HoverPressable
//               style={styles.secondaryButton}
//               hoverStyle={styles.secondaryButtonHover}
//               pressedStyle={styles.secondaryButtonPressed}
//               accessibilityLabel="Download the Android app"
//               onPress={openDownload}
//             >
//               <Ionicons name="download-outline" size={18} color="#1F2937" style={{ marginRight: 8 }} />
//               <Text style={styles.secondaryButtonText}>Download Android App</Text>
//             </HoverPressable>
//           </View>

//           <View style={styles.heroTrustRow}>
//             <View style={styles.heroTrustItem}>
//               <Ionicons name="checkmark-circle" size={15} color="#1aaa00" />
//               <Text style={styles.heroTrustText}>No account needed</Text>
//             </View>
//             <View style={styles.heroTrustItem}>
//               <Ionicons name="checkmark-circle" size={15} color="#1aaa00" />
//               <Text style={styles.heroTrustText}>Works offline</Text>
//             </View>
//           </View>
//         </View>

//         {/* Hero Image */}
//         <View
//           style={[
//             styles.heroImageContainer,
//             isDesktop && styles.heroImageContainerDesktop,
//           ]}
//         >
//           <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />
//         </View>
//       </View>

//       {/* Features Grid Section */}
//       <View style={[styles.featuresSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
//         <Text style={styles.sectionCategory}>BUILT FOR BETTER SPENDING</Text>
//         <Text style={styles.sectionTitle}>Everything you need to stay on budget</Text>

//         <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
//           {/* Feature 1 */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureCardTitle}>Monthly budgets</Text>
//             <Text style={styles.featureCardDesc}>
//               Set a spending limit for the month, then watch the progress bar show exactly
//               how much is left — or how far over budget you are.
//             </Text>
//           </View>

//           {/* Feature 2 */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureCardTitle}>Expense History</Text>
//             <Text style={styles.featureCardDesc}>
//               Switch between this month and expenses from all previous months. Compare totals, spot trends,
//               and review past purchases month by month.
//             </Text>
//           </View>

//           {/* Feature 3 */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureCardTitle}>Private by design</Text>
//             <Text style={styles.featureCardDesc}>
//               Your expenses, budgets, and profile stay saved locally on your device.
//               No sign-up, no cloud sync, and no fuss.
//             </Text>
//           </View>
//         </View>
//       </View>


//       {/* ---------------- */}
// {/* Import Section
//       <View 
//         onLayout={(event) => {
//           // Capture the exact vertical pixel position of this section
//           setImportSectionY(event.nativeEvent.layout.y);
//         }}
//         style={[styles.importSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}
//       >
//         <Text style={styles.sectionCategory}>SEAMLESS MIGRATION</Text>
//         <Text style={styles.sectionTitle}>How to convert and import your expenses</Text>
//   </View>  */}
          
//       {/* SECTION: How to Convert & Import Expenses via JSON */}
//       <View 
//       onLayout={(event) => {
//           setImportSectionY(event.nativeEvent.layout.y);
//         }}
//       style={[styles.importSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
        
//         <Text style={styles.sectionCategory}>SEAMLESS MIGRATION</Text>
//         <Text style={styles.sectionTitle}>How to convert and import your expenses</Text>
//         <Text style={styles.importSubtitle}>
//           Have historical financial data in a spreadsheet, CSV, or another app? You can effortlessly load your past records into Notes by formatting them into a standard JSON backup file.
//         </Text>

//         <View style={[styles.importStepsGrid, isDesktop && styles.importStepsGridDesktop]}>
//           {/* Step 1 */}
//           <View style={styles.importCard}>
//             <View style={styles.importStepBadge}>
//               <Text style={styles.importStepBadgeText}>01</Text>
//             </View>
//             <Text style={styles.importCardTitle}>Structure your data</Text>
//             <Text style={styles.importCardDesc}>
//               Organize each transaction with the required keys: <Text style={styles.codeText}>id</Text>, <Text style={styles.codeText}>title</Text>, <Text style={styles.codeText}>amount</Text> (number), <Text style={styles.codeText}>category</Text>, and <Text style={styles.codeText}>date</Text> (in <Text style={styles.codeText}>YYYY-MM-DD</Text> format).
//             </Text>
//           </View>

//           {/* Step 2 */}
//           <View style={styles.importCard}>
//             <View style={styles.importStepBadge}>
//               <Text style={styles.importStepBadgeText}>02</Text>
//             </View>
//             <Text style={styles.importCardTitle}>Wrap in JSON format</Text>
//             <Text style={styles.importCardDesc}>
//               Nest your array of expenses inside a <Text style={styles.codeText}>data.expenses</Text> property along with app metadata (<Text style={styles.codeText}>"app": "Notes"</Text>) for full parser compatibility.
//             </Text>
//           </View>

//           {/* Step 3 */}
//           <View style={styles.importCard}>
//             <View style={styles.importStepBadge}>
//               <Text style={styles.importStepBadgeText}>03</Text>
//             </View>
//             <Text style={styles.importCardTitle}>Import into the app</Text>
//             <Text style={styles.importCardDesc}>
//               Save your file as a <Text style={styles.codeText}>.json</Text> file and use the app's backup or import option in settings to upload it. Your complete history will populate instantly!
//             </Text>
//           </View>
//         </View>

//         {/* Code Example Box */}
//         <View style={styles.codeBoxContainer}>
//           <View style={styles.codeBoxHeader}>
//             <Ionicons name="code-slash" size={16} color="#95F376" />
//             <Text style={styles.codeBoxHeaderText}>Example JSON Backup Schema</Text>
//           </View>
//           <Text style={styles.codeBoxContent}>{`{
//   "app": "Notes",
//   "version": "2.0",
//   "data": {
//     "expenses": [
//       {
//         "id": 1,
//         "title": "Groceries",
//         "amount": 650.00,
//         "category": "Food",
//         "date": "2026-10-31"
//       },
//       {
//         "id": 2,
//         "title": "Haircut",
//         "amount": 100.00,
//         "category": "Shopping",
//         "date": "2026-10-31"
//       }
//     ],
//     "monthlyBudget": 1500
//   }
// }`}</Text>
//         </View>

//         {/* Chatbot Conversion Prompt with Copy Button */}
//         <View style={styles.promptContainer}>
//           <View style={styles.promptHeader}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//               {/* <Ionicons name="sparkles" size={18} color="#15803D" /> */}
              
//               <Text style={styles.promptHeaderTitle}>AI Chatbot Conversion Prompt</Text>
//             </View>
          
//           </View>
//   <HoverPressable
//               style={[styles.copyButton, copiedPrompt && styles.copyButtonActive]}
//               hoverStyle={copiedPrompt ? undefined : styles.copyButtonHover}
//               pressedStyle={styles.copyButtonPressed}
//               accessibilityLabel="Copy the AI conversion prompt"
//               onPress={handleCopyPrompt}
//             >
//               <Ionicons
//                 name={copiedPrompt ? 'checkmark' : 'copy-outline'}
//                 size={14}
//                 color={copiedPrompt ? '#FFFFFF' : '#111827'}
//               />
//               <Text style={[styles.copyButtonText, copiedPrompt && styles.copyButtonTextActive]}>
//                 {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
//               </Text>
//             </HoverPressable>


//           <Text style={styles.promptSubtitle}>
//             Copy and paste this prompt into ChatGPT, Claude, or Gemini along with your Excel / CSV file to instantly convert your spreadsheets into valid app JSON format.
//           </Text>

//           <View style={styles.promptCodeBox}>
//             <Text style={styles.promptCodeText}>{CHATBOT_PROMPT}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           © 2026 Notes
//         </Text>
//           <Text style={styles.footerText}>
//           Built with React Native & Expo
//         </Text>
//       </View>
//       </ScrollView>
//     </View>

//     </> 
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },

//   // --- NAVBAR (sticky)
//   navbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     backgroundColor: '#b4ff9b',
//     zIndex: 10,
//     shadowColor: '#0B1F16',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   brandContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   brandText: {
//     fontSize: 19,
//     fontWeight: '800',
//     color: '#111827',
//   },
//   brandSubText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#6B7280',
//     letterSpacing: 0.4,
//     textTransform: 'uppercase',
//     marginTop: 1,
//   },
//   navLaunchButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111827',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   navLaunchButtonHover: {
//     backgroundColor: '#0b4900',
//   },
//   navLaunchButtonPressed: {
//     backgroundColor: '#15803D',
//     transform: [{ scale: 0.98 }],
//   },
//   navLaunchButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   // --- HERO
//   heroSection: {
//     paddingVertical: 50,
//     flexDirection: 'column',
//     minHeight: 500,
//   },
//   heroContent: {
//     alignItems: 'flex-start',
//     marginBottom: 40,
//     marginTop: 20,
//   },
//   heroContentDesktop: {
//     maxWidth: '52%',
//     paddingRight: 20,
//     marginTop: 60,
//   },
//   heroImageContainer: {
//     width: '100%',
//     aspectRatio: 1.45,
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#F3F4F6',
//   },
//   heroImageContainerDesktop: {
//     position: 'absolute',
//     right: 60,
//     top: 50,
//     width: '40%',
//     height: 430,
//   },
//   heroImage: {
//     width: '100%',
//     height: '100%',
//   },

//   heroTitle: {
//     fontSize: 38,
//     fontWeight: '900',
//     color: '#111827',
//     lineHeight: 46,
//     marginBottom: 16,
//   },
//   heroTitleHighlight: {
//     color: '#1aaa00',
//   },
//   heroDescription: {
//     fontSize: 16,
//     color: '#4B5563',
//     lineHeight: 25,
//     marginBottom: 24,
//     maxWidth: 560,
//   },
//   heroButtonsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   primaryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#95f376',
//     paddingHorizontal: 22,
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   primaryButtonHover: {
//     backgroundColor: '#7ee85c',
//     shadowColor: '#1aaa00',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   primaryButtonPressed: {
//     backgroundColor: '#6ad94a',
//     transform: [{ scale: 0.98 }],
//   },
//   primaryButtonText: {
//     color: '#2e2d01',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   secondaryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 22,
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   secondaryButtonHover: {
//     backgroundColor: '#DCFCE7',
//     shadowColor: '#1aaa00',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   secondaryButtonPressed: {
//     backgroundColor: '#C7F7B5',
//     transform: [{ scale: 0.98 }],
//   },
//   secondaryButtonText: {
//     color: '#1F2937',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   heroTrustRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 16,
//     marginTop: 22,
//   },
//   heroTrustItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   heroTrustText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//   },

//   // --- FEATURE SECTION
//   featuresSection: {
//     minHeight: 300,
//     paddingVertical: 50,
//     backgroundColor: '#F9FAFB',
//     marginTop: 40,
//   },
//   sectionCategory: {
//     fontSize: 12,
//     fontWeight: '800',
//     color: '#1aaa00',
//     letterSpacing: 1.2,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   featuresGrid: {
//     flexDirection: 'column',
//     gap: 20,
//     marginTop: 14,
//   },
//   featuresGridDesktop: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   featureCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 24,
//     borderRadius: 16,
//     shadowColor: '#0B1F16',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.06,
//     shadowRadius: 14,
//     elevation: 2,
//   },
//   featureCardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   featureCardDesc: {
//     fontSize: 14,
//     color: '#4B5563',
//     lineHeight: 21,
//   },

//   // --- IMPORT GUIDE SECTION
//   importSection: {
//     paddingVertical: 60,
//     backgroundColor: '#FFFFFF',
//   },
//   importSubtitle: {
//     fontSize: 15,
//     color: '#4B5563',
//     lineHeight: 24,
//     marginBottom: 36,
//     maxWidth: 700,
//   },
//   importStepsGrid: {
//     flexDirection: 'column',
//     gap: 20,
//     marginBottom: 30,
//   },
//   importStepsGridDesktop: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   importCard: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     padding: 24,
//     borderRadius: 16,
//     shadowColor: '#0B1F16',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.05,
//     shadowRadius: 14,
//     elevation: 2,
//   },
//   importStepBadge: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: '#DCFCE7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   importStepBadgeText: {
//     color: '#15803D',
//     fontWeight: '800',
//     fontSize: 13,
//   },
//   importCardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   importCardDesc: {
//     fontSize: 14,
//     color: '#4B5563',
//     lineHeight: 21,
//   },
//   codeText: {
//     fontWeight: '700',
//     color: '#1F2937',
//     backgroundColor: '#E5E7EB',
//     paddingHorizontal: 4,
//     borderRadius: 4,
//   },
//   codeBoxContainer: {
//     backgroundColor: '#0B1F16',
//     borderRadius: 16,
//     padding: 20,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(149, 243, 118, 0.2)',
//   },
//   codeBoxHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   codeBoxHeaderText: {
//     color: '#95F376',
//     fontWeight: '700',
//     fontSize: 13,
//   },
//   codeBoxContent: {
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//     color: '#E5E7EB',
//     fontSize: 12,
//     lineHeight: 18,
//   },

//   // --- PROMPT SECTION
//   promptContainer: {
//     marginTop: 40,
//     backgroundColor: '#F0FDF4',
//     borderRadius: 16,
//     padding: 24,
//     borderWidth: 1,
//     borderColor: '#DCFCE7',
//   },
//   promptHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   promptHeaderTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#111827',
//   },
//   promptSubtitle: {
//     fontSize: 14,
//     color: '#4B5563',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   copyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: '#FFFFFF',
//     maxWidth: 140,
//     borderRadius: 8,
//     marginBottom: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//   },
//   copyButtonHover: {
//     backgroundColor: '#DCFCE7',
//   },
//   copyButtonPressed: {
//     backgroundColor: '#C7F7B5',
//     transform: [{ scale: 0.98 }],
//   },
//   copyButtonActive: {
//     backgroundColor: '#16A34A',
//   },
//   copyButtonText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   copyButtonTextActive: {
//     color: '#FFFFFF',
//   },
//   promptCodeBox: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//   },
//   promptCodeText: {
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//     fontSize: 12,
//     color: '#374151',
//     lineHeight: 18,
//   },

//   // --- FOOTER
//   footer: {
//     paddingBottom: 30,
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   footerText: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 5,
//   },
// });



// newer1
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import Head from 'expo-router/head';

// const HERO_IMAGE = require('@/images/hero.jpg');
const HERO_IMAGE = require('@/images/img2.jpg');
// const HERO_IMAGE = require('@/images/img3.jpg');
// const HERO_IMAGE = require('@/images/img5.jpg');


const CHATBOT_PROMPT = `You are a data transformation assistant for "Notes", an offline-first React Native notes, tasks, and bookmarks productivity app.

Your task is to convert spreadsheet data, markdown notes, or raw text into a valid JSON backup file that matches the exact schema and keys of the app's official backup format.

### Rules & Constraints:
1. Every item entry must use sequential integer IDs starting at 1.
2. The final JSON output structure must follow this exact top-level wrapper:
{
  "app": "notes",
  "version": "1.0.0",
  "exportDate": "[Current ISO Timestamp]",
  "data": {
    "username": "Your Name",
    "notes": [ { "id": 1, "title": "...", "content": "...", "folderId": "..." } ],
    "tasks": [ { "id": 1, "title": "...", "description": "...", "completed": false, "folderId": "..." } ],
    "links": [ { "id": 1, "title": "...", "url": "...", "folderId": "..." } ],
    "noteFolders": [],
    "taskFolders": [],
    "linkFolders": []
  }
}

3. Output ONLY valid JSON code inside a code block without any conversational filler or markdown explanations outside the code block.`;

const DOWNLOAD_URL =
  'https://github.com/ammaar0x01/react_native_money_manager/releases/tag/release-v1-0-0';

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

type HoverPressableProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
};

function HoverPressable({
  onPress,
  style,
  hoverStyle,
  pressedStyle,
  children,
  accessibilityLabel,
}: HoverPressableProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        style,
        hovered && hoverStyle,
        pressed && pressedStyle,
      ]}
    >
      {children}
    </Pressable>
  );
}

export default function LandingScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams();
  const [importSectionY, setImportSectionY] = useState(0);

  useEffect(() => {
    if (params.scrollTo === 'import' && importSectionY > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: importSectionY, animated: true });
      }, 150);
    }
  }, [params.scrollTo, importSectionY]);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(CHATBOT_PROMPT);
    }
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const openDownload = async () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    await openBrowserAsync(DOWNLOAD_URL, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  return (
    <>
      <Head>
        <title>Notes & Productivity Workspace</title>
      </Head>

      <View style={styles.container}>
        {/* Sticky Navbar */}
        <View style={[styles.navbar, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Notes Workspace</Text>
          </View>

          <HoverPressable
            style={styles.navLaunchButton}
            hoverStyle={styles.navLaunchButtonHover}
            pressedStyle={styles.navLaunchButtonPressed}
            accessibilityLabel="Open the Notes app"
            onPress={() => router.replace('/' as any)}
          >
            <Text style={styles.navLaunchButtonText}>Go to App</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.accentText} style={{ marginLeft: 6 }} />
          </HoverPressable>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={[styles.heroSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
            <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
              <Text style={styles.heroTitle}>
                Your notes, tasks, & links.{'\n'}
                <Text style={styles.heroTitleHighlight}>All in one place.</Text>
              </Text>

              <Text style={styles.heroDescription}>
                Organize thoughts, check off daily priorities, and save essential web bookmarks
                in a fast, offline-first workspace designed for absolute privacy.
              </Text>

              <View style={styles.heroButtonsRow}>
                <HoverPressable
                  style={styles.primaryButton}
                  hoverStyle={styles.primaryButtonHover}
                  pressedStyle={styles.primaryButtonPressed}
                  accessibilityLabel="Open workspace"
                  onPress={() => router.replace('/' as any)}
                >
                  <Text style={styles.primaryButtonText}>Open Workspace</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.accentText} style={{ marginLeft: 8 }} />
                </HoverPressable>

                <HoverPressable
                  style={styles.secondaryButton}
                  hoverStyle={styles.secondaryButtonHover}
                  pressedStyle={styles.secondaryButtonPressed}
                  accessibilityLabel="Download Android App"
                  onPress={openDownload}
                >
                  <Ionicons name="download-outline" size={18} color={COLORS.textPrimary} style={{ marginRight: 8 }} />
                  <Text style={styles.secondaryButtonText}>Download APK</Text>
                </HoverPressable>
              </View>

              <View style={styles.heroTrustRow}>
                <View style={styles.heroTrustItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.heroTrustText}>100% Local Storage</Text>
                </View>
                <View style={styles.heroTrustItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.heroTrustText}>JSON Backup & Restore</Text>
                </View>
              </View>
            </View>

            {/* Hero Image */}
            <View
              style={[
                styles.heroImageContainer,
                isDesktop && styles.heroImageContainerDesktop,
              ]}
            >
              <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />
            </View>
          </View>

          {/* Features Grid Section */}
          <View style={[styles.featuresSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
            <Text style={styles.sectionCategory}>BUILT FOR PRODUCTIVITY</Text>
            <Text style={styles.sectionTitle}>Everything you need to stay organized</Text>

            <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
              <View style={styles.featureCard}>
                <Ionicons name="document-text-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} />
                <Text style={styles.featureCardTitle}>Rich Notes & Folders</Text>
                <Text style={styles.featureCardDesc}>
                  Capture ideas instantly with custom folders, searchable titles, and clean markdown-style formatting.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="checkbox-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} />
                <Text style={styles.featureCardTitle}>Interactive Tasks</Text>
                <Text style={styles.featureCardDesc}>
                  Track your daily objectives with strikethrough completion toggles, live progress counters, and folders.
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="link-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} />
                <Text style={styles.featureCardTitle}>Bookmark Manager</Text>
                <Text style={styles.featureCardDesc}>
                  Save, categorize, and launch your favorite web links and resources instantly without cluttering your browser.
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION: How to Import JSON Backups */}
          <View
            onLayout={(event) => {
              setImportSectionY(event.nativeEvent.layout.y);
            }}
            style={[styles.importSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}
          >
            <Text style={styles.sectionCategory}>SEAMLESS MIGRATION</Text>
            <Text style={styles.sectionTitle}>How to backup and restore your workspace</Text>
            <Text style={styles.importSubtitle}>
              Export your notes, tasks, and links into a clean JSON file anytime from Settings, or restore past backups in seconds.
            </Text>

            <View style={[styles.importStepsGrid, isDesktop && styles.importStepsGridDesktop]}>
              <View style={styles.importCard}>
                <View style={styles.importStepBadge}>
                  <Text style={styles.importStepBadgeText}>01</Text>
                </View>
                <Text style={styles.importCardTitle}>Export JSON</Text>
                <Text style={styles.importCardDesc}>
                  Navigate to Settings and tap <Text style={styles.codeText}>Export JSON</Text> to download your complete productivity archive.
                </Text>
              </View>

              <View style={styles.importCard}>
                <View style={styles.importStepBadge}>
                  <Text style={styles.importStepBadgeText}>02</Text>
                </View>
                <Text style={styles.importCardTitle}>Cloud & Email</Text>
                <Text style={styles.importCardDesc}>
                  Use the built-in Cloud Save or Email Backup options to keep your notes accessible across all your devices.
                </Text>
              </View>

              <View style={styles.importCard}>
                <View style={styles.importStepBadge}>
                  <Text style={styles.importStepBadgeText}>03</Text>
                </View>
                <Text style={styles.importCardTitle}>Restore Instantly</Text>
                <Text style={styles.importCardDesc}>
                  Select <Text style={styles.codeText}>Import JSON</Text> in Settings to restore all notes, tasks, links, and folders.
                </Text>
              </View>
            </View>

            {/* Code Example Box */}
            <View style={styles.codeBoxContainer}>
              <View style={styles.codeBoxHeader}>
                <Ionicons name="code-slash" size={16} color={COLORS.accent} />
                <Text style={styles.codeBoxHeaderText}>Example Backup Schema (`notes_2026-11-18.json`)</Text>
              </View>
              <Text style={styles.codeBoxContent}>{`{
  "app": "notes",
  "version": "1.0.0",
  "exportDate": "2026-11-18T20:16:44.773Z",
  "data": {
    "username": "ammaar0x01",
    "notes": [
      {
        "id": 1,
        "title": "Project Roadmap",
        "content": "Complete React Native app refactor.",
        "folderId": "ideas"
      }
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Deploy to Vercel",
        "completed": false,
        "folderId": "day"
      }
    ],
    "links": [],
    "noteFolders": [],
    "taskFolders": [],
    "linkFolders": []
  }
}`}</Text>
            </View>

            {/* Chatbot Conversion Prompt */}
            <View style={styles.promptContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptHeaderTitle}>AI Chatbot Conversion Prompt</Text>
                <HoverPressable
                  style={[styles.copyButton, copiedPrompt && styles.copyButtonActive]}
                  hoverStyle={copiedPrompt ? undefined : styles.copyButtonHover}
                  pressedStyle={styles.copyButtonPressed}
                  accessibilityLabel="Copy AI conversion prompt"
                  onPress={handleCopyPrompt}
                >
                  <Ionicons
                    name={copiedPrompt ? 'checkmark' : 'copy-outline'}
                    size={14}
                    color={copiedPrompt ? COLORS.accentText : COLORS.textPrimary}
                  />
                  <Text style={[styles.copyButtonText, copiedPrompt && styles.copyButtonTextActive]}>
                    {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                  </Text>
                </HoverPressable>
              </View>

              <Text style={styles.promptSubtitle}>
                Paste this prompt into ChatGPT or Claude along with your raw notes or text to format them into your notes backup schema.
              </Text>

              <View style={styles.promptCodeBox}>
                <Text style={styles.promptCodeText}>{CHATBOT_PROMPT}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Notes Workspace</Text>
            <Text style={styles.footerText}>Built with React Native & Expo</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  navLaunchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navLaunchButtonHover: {
    backgroundColor: '#D97706',
  },
  navLaunchButtonPressed: {
    backgroundColor: '#B45309',
    transform: [{ scale: 0.98 }],
  },
  navLaunchButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 14,
  },
  heroSection: {
    paddingVertical: 60,
    flexDirection: 'column',
    minHeight: 520,
  },
  heroContent: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  heroContentDesktop: {
    maxWidth: '52%',
    paddingRight: 20,
  },
  heroImageContainer: {
    width: '100%',
    aspectRatio: 1.45,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroImageContainerDesktop: {
    position: 'absolute',
    right: 60,
    top: 60,
    width: '42%',
    height: 420,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' }),
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 52,
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: COLORS.accent,
  },
  heroDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: 28,
    maxWidth: 540,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonHover: {
    backgroundColor: '#D97706',
  },
  primaryButtonPressed: {
    backgroundColor: '#B45309',
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryButtonHover: {
    backgroundColor: COLORS.border,
  },
  secondaryButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  heroTrustRow: {
    flexDirection: 'row',
    gap: 20,
  },
  heroTrustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTrustText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  featuresSection: {
    paddingVertical: 60,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionCategory: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' }),
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 20,
  },
  featuresGridDesktop: {
    flexDirection: 'row',
    gap: 24,
  },
  featureCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  featureCardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  importSection: {
    paddingVertical: 60,
  },
  importSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 700,
  },
  importStepsGrid: {
    gap: 20,
    marginBottom: 40,
  },
  importStepsGridDesktop: {
    flexDirection: 'row',
    gap: 24,
  },
  importCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  importStepBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  importStepBadgeText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  importCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  importCardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  codeText: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  codeBoxContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 30,
  },
  codeBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  codeBoxHeaderText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  codeBoxContent: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }),
    fontSize: 13,
    color: COLORS.textSecondary,
    padding: 16,
    lineHeight: 20,
  },
  promptContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  promptHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  copyButtonHover: {
    backgroundColor: COLORS.border,
  },
  copyButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  copyButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  copyButtonTextActive: {
    color: COLORS.accentText,
  },
  promptSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  promptCodeBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promptCodeText: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }),
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});


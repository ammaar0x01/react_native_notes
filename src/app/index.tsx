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
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import Head from 'expo-router/head';
// ------------------------------------

const HERO_IMAGE = require('@/images/hero.jpg');


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

  const GITHUB_URL = 'https://github.com/ammaar0x01';


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

function LandingScreen() {
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
            onPress={() => router.replace('/app' as any)}
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
                  accessibilityLabel="Open Notes"
                  onPress={() => router.replace('/app/notes' as any)}
                >
                  <Text style={styles.primaryButtonText}>Open Notes</Text>
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

{/* === SECTION */}
          {/* === Features Grid Section */}
          <View style={[styles.featuresSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
            <Text style={styles.sectionCategory}>BUILT FOR PRODUCTIVITY</Text>
            <Text style={styles.sectionTitle}>Everything you need to stay organized</Text>

            <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
              <View style={styles.featureCard}>
                {/* <Ionicons name="document-text-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} /> */}
                <Text style={styles.featureCardTitle}>Folder Organisation</Text>
                <Text style={styles.featureCardDesc}>
                  Record notes and ideas, and organise them with the use of predefined and custom folders, searchable titles.
                </Text>
              </View>

              <View style={styles.featureCard}>
                {/* <Ionicons name="checkbox-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} /> */}
                <Text style={styles.featureCardTitle}>Interactive Tasks</Text>
                <Text style={styles.featureCardDesc}>
                  Track your daily objectives with strikethrough completion toggles, live progress counters, and folders.
                </Text>
              </View>

              <View style={styles.featureCard}>
                {/* <Ionicons name="link-outline" size={28} color={COLORS.accent} style={{ marginBottom: 12 }} /> */}
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
                <Text style={styles.codeBoxHeaderText}>Example (`notes_2026-11-18.json`)</Text>
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
          {/* <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Notes Workspace</Text>
            <Text style={styles.footerText}>Built with React Native & Expo</Text>

             <HoverPressable
            style={styles.navLaunchButton}
            hoverStyle={styles.navLaunchButtonHover}
            pressedStyle={styles.navLaunchButtonPressed}
            accessibilityLabel="Open the Notes app"
            onPress={() => router.replace('/app' as any)}
          >
            <Text style={styles.navLaunchButtonText}>Go to App</Text>
            <Ionicons name="pencil" size={16} color={COLORS.accentText} style={{ marginLeft: 6 }} />
          </HoverPressable>
          </View> */}


          {/* Footer */}
{/* Footer */}
<View style={styles.footer}>
  <Text style={styles.footerText}>© 2026 Notes Workspace</Text>
  <Text style={styles.footerText}>Built with React Native & Expo</Text>

  <HoverPressable
    style={styles.githubLink}
    hoverStyle={styles.githubLinkHover}
    pressedStyle={styles.githubLinkPressed}
    accessibilityLabel="View source code on GitHub"
    // accessibilityRole="link"
    onPress={() => Linking.openURL(GITHUB_URL)}
  >
    <Ionicons name="logo-github" size={40} color="#FFFFFF" />
    {/* <Text style={styles.githubLinkText}>GitHub</Text> */}
  </HoverPressable>
</View>


        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  // newer -----
githubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    marginTop: 10, 
  },
  githubLinkHover: {
    opacity: 0.8,
  },
  githubLinkPressed: {
    opacity: 0.6,
  },
  githubLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // -------------

  // --- MAIN 
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

  // --- Navbar 
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,

    // backgroundColor: COLORS.surface,
    // backgroundColor: '#280900',

    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    // fontSize: 20,
    // fontWeight: '800',

    // ---
    fontSize: 22,
    marginTop: 10, 
    fontWeight: '400',
    fontFamily: 'serif',
    // fontSize: 50,
    // ---

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

  // --- hero section 
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
    // borderWidth: 1,
    // borderColor: COLORS.border,
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
    // fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' }),
    fontSize: 42,
    // fontWeight: '900',

    // ---
    marginTop: 20, 
    fontWeight: '400',
    fontFamily: 'serif',
    // fontSize: 50,
    // ---

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

  // --- SECTION 
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
    // fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' }),
    // fontSize: 28,
    // fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 32,

    // ---
    // marginTop: 20, 
    fontWeight: '400',
    
    fontFamily: 'serif',
    fontSize: 30,
    // ---
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
  // promptHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 10,
  // },

  promptHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
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
    // borderTopWidth: 1,
    // borderTopColor: COLORS.border,
    gap: 4,
    marginBottom: 30, 
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});




// import LandingScreen from '@/app/index';

export default function IndexRoute() {
  const { scrollTo, view } = useLocalSearchParams<{
    scrollTo?: string;
    view?: string;
  }>();

  // Allow mobile users to open the landing page explicitly (e.g., for the JSON Import Guide)
  const allowLandingOnNative = Boolean(scrollTo) || view === 'landing';

  if (Platform.OS !== 'web' && !allowLandingOnNative) {
    return <Redirect href="/app" />;
  }

  return <LandingScreen />;
}



// newer -remove later-
// import { Platform } from 'react-native';
// import { Redirect } from 'expo-router';

// import LandingScreen from '@/app/landing'; 

// export default function IndexRoute() {
//   if (Platform.OS !== 'web') {
//     return <Redirect href="/app" />; // or "/app/notes"
//   }

//   return <LandingScreen />;
// }

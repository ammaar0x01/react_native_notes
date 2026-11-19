/*
Common styles
=============
*/
import { StyleSheet, Platform } from "react-native";

// --- Theme Palette
const COLORS = {
  bg: "#0F1115",
  surface: "#1A1D24",
  surfaceElevated: "#242832",
  border: "#2E3340",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  accent: "#F59E0B", // Yellow-Orange
  accentText: "#111827",
  danger: "#EF4444",
};


// --- Common styles across the 4 main pages
const stylesCommon = StyleSheet.create({
  
  
// ------------------


  headerTitle: {
    // fontSize: 28,
    // fontWeight: '800',

    // ---
     marginTop: 20, 
    fontWeight: '400',
    
    fontFamily: 'serif',
    fontSize: 50,
    // ---

    color: COLORS.textPrimary,
  },
  

   // Folders Bar
  foldersSection: {
    // marginBottom: 16,
        marginTop: 12,
    marginBottom: 20,
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

    marginTop: 10, 
    marginBottom: 30,
  },


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

// ------------------



  
  // === BODY 
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  // === HEADER 
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  headerTitle: {
    // fontSize: 28,
    // fontWeight: '800',

    // ---
    // fontSize: 40,
    marginTop: 20,
    fontWeight: "400",

    fontFamily: "serif",
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
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  noteCount: {
    fontSize: 13,
    fontWeight: "700",
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
    alignItems: "center",
  },
  folderChip: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  folderChipTextActive: {
    color: COLORS.accentText,
  },
  folderChipActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.18)",
    gap: 6,
  },
  folderMiniAction: {
    padding: 2,
  },
  addFolderChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.accent,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addFolderChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accent,
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
        outlineStyle: "none",
      } as any,
    }),
  },

  // Empty & Notes List
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
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
});

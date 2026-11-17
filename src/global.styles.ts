/*
global.styles.ts 
================
*/

import { TextStyle, ViewStyle } from "react-native";
// import { ThemeDefault } from "./themeDefault.styles";
// -----------------------------------


export const ThemeDefault = {
  // background: "#ffffff",
  // background: "#000000",
  background: "#191919",
  
  backgroundForComponents: "#1aaa00", 

  text: "#000000",
  pageHeading: "#000000",
  pageSubheading: "#6B7280",

  color1: "#E59400",
  color2: "#D97706",
  color3: "#E59400",
  // -------------------------------------

  // --- MOBILE APP ---
  // -- Mobile APP header --
  topHeaderBackground: "#E59400",

  // -- Navbar (Bottom) --
  bottomNavBackground: "#000000",
  bottomNavText: "#ffffff",
  // -------------------------------------

  // --- WEB-APP ---
  topAndSideNavBackground: "#000000",
  topAndSideNavText: "#ffffff",

  // -- Collapsible navbar ---
  collapsibleNavItems: "#000000",
  // -------------------------------------

  // --- Cards --- 
  cardBackground: "#F9FAFB",
  cardText: "#00091c",
  cardBorder: "#FDE68A",
  // -------------------------------------
};


// --- Change the theme here --- 
export const themeName = ThemeDefault

// --- SETUP ---
const backgroundColor = themeName.background
const textColor = themeName.text
const pageHeadingColor = themeName.pageHeading 
const pageSubheadingColor = themeName.pageSubheading 
// --------------------------------------


export const GlobalStyles = {
  // === PAGE LAYOUT ===
  mainContainer: {
    flex: 1,
    backgroundColor: backgroundColor, 
    textColor: textColor, 
    padding: 40,
    paddingBottom: 0,
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: 40,
    // paddingTop: 40,

    paddingTop: 20,
  },
  contentWrapper: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 900,

  },
  contentWrapperDesktop: {
    maxWidth: 700,
  },

  // === HEADER ===
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 10,

  } as ViewStyle,

  pageHeading: {
    fontSize: 44,
    // fontWeight: '600', 
    fontWeight: "600" as TextStyle["fontWeight"],
    color: pageHeadingColor, 
    marginBottom: 5,
    letterSpacing: -1, 

    // fontSize: 34,
    // fontWeight: 'bold',
    // color: '#1a1a1a',
  },
  pageSubheading: {
    fontSize: 13,
    color: pageSubheadingColor, 

    // marginTop: 4,
    // marginBottom: 20, 
    marginBottom: 0, 

  } as const,
};

import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useRef, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

const HOLD_DURATION = 1100;
const FADE_DURATION = 450;

/**
 * Custom splash overlay. Uses React Native's built-in Animated API instead of
 * Reanimated so it does not trigger the reduced-motion development warning.
 */
export function AnimatedSplashOverlay() {
  const opacity = useRef(new Animated.Value(1)).current;
  const started = useRef(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleLayout = () => {
    if (started.current) return;
    started.current = true;

    SplashScreen.hideAsync().catch(() => {
      // The native splash is already gone (e.g. fast refresh).
    });

    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_DURATION,
      delay: HOLD_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setVisible(false);
    });
  };

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={handleLayout}
      style={[styles.splashOverlay, { opacity }]}
    >
      <Image
        style={styles.image}
        // source={require("@/assets/splash-icon.png")}
        source={require("@/assets/icon-splash.png")}
        contentFit="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#050807",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  image: {
    width: 140,
    height: 140,
  },
});

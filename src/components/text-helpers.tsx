import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  Linking,
  Platform,
  type TextStyle,
  type ViewStyle,
  type StyleProp,
  View,
} from 'react-native';

const URL_REGEX = /((?:https?:\/\/|www\.)[^\s]+)/gi;

interface LinkifiedTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  linkColor?: string;
  numberOfLines?: number;
}

export function LinkifiedText({
  text,
  style,
  linkColor = '#F59E0B',
  numberOfLines,
}: LinkifiedTextProps) {
  const parts = text.split(URL_REGEX);

  const handleOpenLink = (rawUrl: string) => {
    const normalizedUrl = rawUrl.startsWith('http')
      ? rawUrl
      : `https://${rawUrl}`;
    Linking.openURL(normalizedUrl).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, index) => {
        if (URL_REGEX.test(part)) {
          URL_REGEX.lastIndex = 0;
          return (
            <Text
              key={index}
              style={{
                color: linkColor,
                textDecorationLine: 'underline',
                fontWeight: '600',
              }}
              onPress={(e) => {
                e?.stopPropagation?.();
                handleOpenLink(part);
              }}
            >
              {part}
            </Text>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </Text>
  );
}


interface HorizontalScrollBarProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function HorizontalScrollBar({
  children,
  style,
  contentContainerStyle,
}: HorizontalScrollBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const webHoverProps =
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        }
      : {};

  return (
    <View
      {...(webHoverProps as any)}
      style={[
        { width: '100%' },
        style,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web' ? isHovered : false}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>
    </View>
  );
}


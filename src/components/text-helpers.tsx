// import React, { useRef, useEffect, useState } from 'react';
// import {
//   Text,
//   ScrollView,
//   Linking,
//   Platform,
//   type TextStyle,
//   type ViewStyle,
//   type StyleProp,
//   View,
// } from 'react-native';

// const URL_REGEX = /((?:https?:\/\/|www\.)[^\s]+)/gi;

// interface LinkifiedTextProps {
//   text: string;
//   style?: StyleProp<TextStyle>;
//   linkColor?: string;
//   numberOfLines?: number;
// }

// export function LinkifiedText({
//   text,
//   style,
//   linkColor = '#F59E0B',
//   numberOfLines,
// }: LinkifiedTextProps) {
//   const parts = text.split(URL_REGEX);

//   const handleOpenLink = (rawUrl: string) => {
//     const normalizedUrl = rawUrl.startsWith('http')
//       ? rawUrl
//       : `https://${rawUrl}`;
//     Linking.openURL(normalizedUrl).catch((err) =>
//       console.error('Failed to open URL:', err)
//     );
//   };

//   return (
//     <Text style={style} numberOfLines={numberOfLines}>
//       {parts.map((part, index) => {
//         if (URL_REGEX.test(part)) {
//           URL_REGEX.lastIndex = 0;
//           return (
//             <Text
//               key={index}
//               style={{
//                 color: linkColor,
//                 textDecorationLine: 'underline',
//                 fontWeight: '600',
//               }}
//               onPress={(e) => {
//                 e?.stopPropagation?.();
//                 handleOpenLink(part);
//               }}
//             >
//               {part}
//             </Text>
//           );
//         }
//         return <React.Fragment key={index}>{part}</React.Fragment>;
//       })}
//     </Text>
//   );
// }

// interface HorizontalScrollBarProps {
//   children: React.ReactNode;
//   contentContainerStyle?: StyleProp<ViewStyle>;
//   style?: StyleProp<ViewStyle>;
// }

// export function HorizontalScrollBar({
//   children,
//   contentContainerStyle,
//   style,
// }: HorizontalScrollBarProps) {
//   const scrollRef = useRef<ScrollView>(null);
//   const scrollOffsetRef = useRef(0);
//   const [isHovered, setIsHovered] = useState(false);

//   useEffect(() => {
//     if (Platform.OS !== 'web') return;

//     const node = (scrollRef.current as unknown as {
//       getScrollableNode?: () => HTMLElement;
//     })?.getScrollableNode?.();

//     if (!node) return;

//     const onWheel = (e: WheelEvent) => {
//       if (node.scrollWidth <= node.clientWidth) return;
//       if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//         e.preventDefault();
//         const nextOffset = Math.max(
//           0,
//           Math.min(
//             node.scrollWidth - node.clientWidth,
//             scrollOffsetRef.current + e.deltaY
//           )
//         );
//         scrollOffsetRef.current = nextOffset;
//         node.scrollLeft = nextOffset;
//       }
//     };

//     node.addEventListener('wheel', onWheel, { passive: false });
//     return () => node.removeEventListener('wheel', onWheel);
//   }, []);

//   return (
//     <View
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         width: '100%',
//         overflowX: isHovered ? 'auto' : 'hidden',
//       }}
//     >
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         showsHorizontalScrollIndicator={Platform.OS === 'web' ? isHovered : true}
//         onScroll={(e) => {
//           scrollOffsetRef.current = e.nativeEvent.contentOffset.x;
//         }}
//         scrollEventThrottle={16}
//         contentContainerStyle={contentContainerStyle}
//         style={style}
//       >
//         {children}
//       </ScrollView>
//     </View>
//   );
// }


// newer
// import React, { useState } from 'react';
// import { Platform, ScrollView, StyleProp, View, ViewStyle } from 'react-native';

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


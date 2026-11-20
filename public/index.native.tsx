// import { Redirect } from 'expo-router';

// export default function NativeEntry() {
//   return <Redirect href="/app" />;
// }


// import { Platform } from 'react-native';
// import { Redirect, useLocalSearchParams } from 'expo-router';
// import LandingScreen from '@/app/index';

// export default function IndexRoute() {
//   const { scrollTo, view } = useLocalSearchParams<{
//     scrollTo?: string;
//     view?: string;
//   }>();

//   // Allow mobile users to open the landing page explicitly (e.g., for the JSON Import Guide)
//   const allowLandingOnNative = Boolean(scrollTo) || view === 'landing';

//   if (Platform.OS !== 'web' && !allowLandingOnNative) {
//     return <Redirect href="/app" />;
//   }

//   return <LandingScreen />;
// }

// import { View, Text, StyleSheet } from 'react-native';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ActionButton } from '../../components/ActionButton';
// import { DhikrCard } from '../../components/DhikrCard';
// import { ArrowUp } from 'lucide-react-native';

// export default function DailyAdhkar() {
//   const handleContinue = () => {
//     router.push('/onboarding/benefits');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Swipe up or tap</Text>
//           <Text style={styles.subtitle}>Swipe up or tap through to read your daily adhkar</Text>
//         </View>

//         <View style={styles.mainContent}>
//           <DhikrCard
//             arabicText="الحمد لله"
//             transliteration="Alhamdulillah"
//             translation="(praise to god)"
//           />
//           <View style={styles.gestureIndicator}>
//             <ArrowUp color="#8E1A3B" size={24} />
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <ActionButton 
//             label="Continue" 
//             onPress={handleContinue} 
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F7F2',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 40,
//     paddingBottom: 24,
//     justifyContent: 'space-between',
//   },
//   header: {
//     alignItems: 'center',
//   },
//   title: {
//     fontFamily: 'Serif',
//     fontSize: 22,
//     color: '#1A1A1A',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontFamily: 'Sans',
//     fontSize: 16,
//     color: '#666666',
//     textAlign: 'center',
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gestureIndicator: {
//     marginTop: 24,
//     padding: 12,
//     borderRadius: 30,
//     backgroundColor: 'rgba(142, 26, 59, 0.1)',
//   },
//   footer: {
//     alignItems: 'center',
//   },
// });
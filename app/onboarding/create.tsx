// import { View, Text, StyleSheet } from 'react-native';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ActionButton } from '../../components/ActionButton';
// import { OptionCard } from '../../components/OptionCard';
// import { List, Star, Folder } from 'lucide-react-native';

// export default function CreatePlaylists() {
//   const handleContinue = () => {
//     router.push('/onboarding/daily');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Create your own</Text>
//           <Text style={styles.subtitle}>Create multiple of your own dhikr playlists</Text>
//         </View>

//         <View style={styles.mainContent}>
//           <View style={styles.optionsContainer}>
//             <OptionCard
//               icon={<List color="#8E1A3B" size={24} />}
//               title="Playlist"
//               description="Create your own playlist"
//               isActive={true}
//             />
//             <OptionCard
//               icon={<Star color="#D9C9A3" size={24} />}
//               title="AI Playlist"
//               description="Use AI to create a playlist"
//               isActive={false}
//             />
//             <OptionCard
//               icon={<Folder color="#D9C9A3" size={24} />}
//               title="Browse Playlists"
//               description="Discover our own playlists"
//               isActive={false}
//             />
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
//   optionsContainer: {
//     width: '100%',
//     gap: 16,
//   },
//   footer: {
//     alignItems: 'center',
//   },
// });
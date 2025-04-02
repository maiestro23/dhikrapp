// import { View, Text, StyleSheet } from 'react-native';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ActionButton } from '../../components/ActionButton';
// import { PlaylistCard } from '../../components/PlaylistCard';

// export default function BrowsePlaylists() {
//   const handleContinue = () => {
//     router.push('/onboarding/create');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Browse dhikr playlists</Text>
//           <Text style={styles.subtitle}>Explore our range of dhikr playlists</Text>
//         </View>

//         <View style={styles.mainContent}>
//           <PlaylistCard 
//             title="Gratitude Playlist"
//             count={15}
//             primaryText="I am grateful."
//             secondaryText="For all that I have."
//             tertiaryText="For all that I am."
//             progress={0.65}
//           />
//         </View>

//         <View style={styles.footer}>
//           <ActionButton 
//             label="Start exploring" 
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
//   footer: {
//     alignItems: 'center',
//   },
// });
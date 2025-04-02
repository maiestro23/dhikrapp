// import { View, Text, StyleSheet, Image } from 'react-native';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ActionButton } from '../../components/ActionButton';
// import { BenefitItem } from '../../components/BenefitItem';
// import { Bell, ChartPie as PieChart, User } from 'lucide-react-native';

// export default function Benefits() {
//   const handleGetStarted = () => {
//     router.push('/setup/goal');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>The benefits of dhikr are endless</Text>
//         </View>

//         <View style={styles.mainContent}>
//           <Image
//             source={{ uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop' }}
//             style={styles.bookImage}
//             resizeMode="contain"
//           />
          
//           <View style={styles.benefitsContainer}>
//             <BenefitItem 
//               icon={<Bell color="#8E1A3B" size={24} />}
//               text="Set personalised notifications"
//             />
//             <BenefitItem 
//               icon={<PieChart color="#8E1A3B" size={24} />}
//               text="Track your progress to stay motivated"
//             />
//             <BenefitItem 
//               icon={<User color="#8E1A3B" size={24} />}
//               text="Structured dhikr for every mood"
//             />
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <ActionButton 
//             label="Get started" 
//             onPress={handleGetStarted} 
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
//   mainContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 40,
//   },
//   bookImage: {
//     width: 200,
//     height: 120,
//   },
//   benefitsContainer: {
//     width: '100%',
//     gap: 20,
//   },
//   footer: {
//     alignItems: 'center',
//   },
// });
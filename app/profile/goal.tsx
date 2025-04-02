// import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ScrollView, Keyboard, Animated } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Check } from 'lucide-react-native';
// import { useProgressStore } from '../../stores/progressStore';
// import { useState, useRef } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';

// const goalOptions = [
//   { count: 100, time: '2 mins a day' },
//   { count: 500, time: '10 mins a day' },
//   { count: 1000, time: '20 mins a day' },
//   { count: 3000, time: '60 mins a day' },
// ];

// export default function GoalSettingsScreen() {
//   const router = useRouter();
//   const { dailyGoal, setDailyGoal } = useProgressStore();
//   const [customGoal, setCustomGoal] = useState('');
//   const [selectedGoal, setSelectedGoal] = useState<number | null>(dailyGoal);
//   const [error, setError] = useState<string | null>(null);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const confirmationOpacity = useRef(new Animated.Value(0)).current;

//   const showConfirmation = () => {
//     confirmationOpacity.setValue(1);
//     Animated.timing(confirmationOpacity, {
//       toValue: 0,
//       duration: 1500,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   const validateAndSetGoal = (goal: number): boolean => {
//     if (goal <= 0) {
//       setError('Goal must be greater than 0');
//       return false;
//     }
//     if (goal > 10000) {
//       setError('Goal cannot exceed 10,000');
//       return false;
//     }
//     setDailyGoal(goal);
//     showConfirmation();
//     return true;
//   };

//   const handleGoalSelect = (goal: number) => {
//     setError(null);
//     setCustomGoal('');
//     setSelectedGoal(goal);
//     Keyboard.dismiss();
//   };

//   const handleCustomGoalChange = (text: string) => {
//     setError(null);
//     setSelectedGoal(null);
//     if (text === '' || /^\d+$/.test(text)) {
//       setCustomGoal(text);
//     }
//   };

//   const handleSubmit = () => {
//     let goal: number | null = null;
    
//     if (customGoal) {
//       goal = parseInt(customGoal, 10);
//       if (isNaN(goal)) {
//         setError('Please enter a valid number');
//         return;
//       }
//     } else if (selectedGoal) {
//       goal = selectedGoal;
//     }

//     if (goal && validateAndSetGoal(goal)) {
//       Keyboard.dismiss();
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//     >
//       <LinearGradient
//         colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
//         locations={[0.158, 0.5112, 0.8644]}
//         style={styles.gradient}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <ArrowLeft color="#181818" size={24} />
//           </TouchableOpacity>
//           <Text style={styles.title}>Daily Goal</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <Animated.View 
//           style={[
//             styles.confirmation, 
//             { opacity: confirmationOpacity }
//           ]}
//         >
//           <Check color="#FFFFFF" size={20} />
//           <Text style={styles.confirmationText}>Goal updated!</Text>
//         </Animated.View>

//         <ScrollView 
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.content}>
//             <Text style={styles.subtitle}>
//               How much adhkar do you want to read per day?
//             </Text>
//             <Text style={styles.subtitleHint}>
//               You can change your goal later
//             </Text>

//             <View style={styles.goalsGrid}>
//               {goalOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option.count}
//                   style={[
//                     styles.goalCard,
//                     selectedGoal === option.count && styles.selectedGoalCard
//                   ]}
//                   onPress={() => handleGoalSelect(option.count)}
//                 >
//                   <Text style={[styles.goalCount, selectedGoal === option.count && styles.selectedText]}>
//                     {option.count}
//                   </Text>
//                   <Text style={styles.goalLabel}>adhkar</Text>
//                   <Text style={styles.goalTime}>({option.time})</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.customInputContainer}>
//               <Text style={styles.customInputLabel}>Enter Custom Adhkar</Text>
//               <View style={styles.inputWrapper}>
//                 <TextInput
//                   style={styles.customInput}
//                   value={customGoal}
//                   onChangeText={handleCustomGoalChange}
//                   onSubmitEditing={handleSubmit}
//                   placeholder="15000"
//                   placeholderTextColor="rgba(142, 26, 59, 0.3)"
//                   keyboardType="number-pad"
//                   maxLength={5}
//                   returnKeyType="done"
//                 />
//                 {Platform.OS !== 'web' && customGoal ? (
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={handleSubmit}
//                   >
//                     <Check color="#FFFFFF" size={20} />
//                   </TouchableOpacity>
//                 ) : null}
//               </View>
//               {error && (
//                 <Text style={styles.errorText}>{error}</Text>
//               )}
//             </View>

//             <TouchableOpacity 
//               style={[
//                 styles.button,
//                 (!customGoal && !selectedGoal) && styles.buttonDisabled
//               ]} 
//               onPress={handleSubmit}
//               disabled={!customGoal && !selectedGoal}
//             >
//               <Text style={styles.buttonText}>Bismillah</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     marginTop: Platform.OS === 'ios' ? 40 : 20,
//   },
//   backButton: {
//     padding: 4,
//   },
//   title: {
//     fontFamily: 'Classico',
//     fontSize: 22,
//     textAlign: 'center',
//     color: '#181818',
//   },
//   confirmation: {
//     position: 'absolute',
//     top: 80,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#7E0F3B',
//     gap: 8,
//     zIndex: 1,
//   },
//   confirmationText: {
//     fontFamily: 'Sofia-Pro-Medium',
//     fontSize: 14,
//     color: '#FFFFFF',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//   },
//   subtitle: {
//     fontFamily: 'Serif',
//     fontSize: 24,
//     color: '#1A1A1A',
//     textAlign: 'center',
//     marginBottom: 8,
//     paddingHorizontal: 20,
//   },
//   subtitleHint: {
//     fontFamily: 'Sans',
//     fontSize: 16,
//     color: '#666666',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   goalsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 16,
//     marginBottom: 24,
//   },
//   goalCard: {
//     width: '47%',
//     aspectRatio: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//   },
//   selectedGoalCard: {
//     borderColor: '#8E1A3B',
//     borderWidth: 2,
//   },
//   goalCount: {
//     fontFamily: 'Serif-Bold',
//     fontSize: 36,
//     color: '#8E1A3B',
//     marginBottom: 4,
//   },
//   selectedText: {
//     color: '#8E1A3B',
//   },
//   goalLabel: {
//     fontFamily: 'Sans',
//     fontSize: 14,
//     color: '#666666',
//     marginBottom: 2,
//   },
//   goalTime: {
//     fontFamily: 'Sans',
//     fontSize: 12,
//     color: '#999999',
//   },
//   customInputContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//     padding: 20,
//     marginBottom: 24,
//   },
//   customInputLabel: {
//     fontFamily: 'Sans',
//     fontSize: 14,
//     color: '#666666',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   customInput: {
//     flex: 1,
//     height: 56,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(142, 26, 59, 0.1)',
//     paddingHorizontal: 20,
//     fontFamily: 'Serif',
//     fontSize: 24,
//     color: '#8E1A3B',
//     textAlign: 'center',
//   },
//   submitButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#8E1A3B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontFamily: 'Sans',
//     fontSize: 14,
//     color: '#FF3B30',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   button: {
//     width: 337,
//     height: 59,
//     backgroundColor: '#7E0F3B',
//     borderRadius: 52,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginTop: 'auto',
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontFamily: 'Sofia-Pro',
//     fontSize: 22,
//     lineHeight: 26,
//   },
// });
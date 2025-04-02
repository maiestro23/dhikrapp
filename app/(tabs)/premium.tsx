import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { Check, Star } from 'lucide-react-native';

const features = [
  {
    title: 'Unlimited Dhikr Collections',
    description: 'Create and save as many dhikr collections as you want',
  },
  {
    title: 'AI-Powered Recommendations',
    description: 'Get personalized dhikr suggestions based on your preferences',
  },
  {
    title: 'Advanced Statistics',
    description: 'Detailed insights into your dhikr practice and progress',
  },
  {
    title: 'Custom Themes',
    description: 'Access exclusive premium themes and customization options',
  },
  {
    title: 'Audio Recitations',
    description: 'Listen to professional recitations of each dhikr',
  },
  {
    title: 'Offline Access',
    description: 'Access all features without an internet connection',
  },
];

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: 'per month',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$39.99',
    period: 'per year',
    popular: true,
    savings: 'Save 33%',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    popular: false,
  },
];

export default function PremiumScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Star color={theme.colors.accent} size={40} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Upgrade to Premium
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Enhance your spiritual journey with premium features
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View 
              key={index}
              style={[styles.featureItem, { backgroundColor: theme.colors.card }]}
            >
              <View style={[styles.checkCircle, { backgroundColor: theme.colors.accent }]}>
                <Check color="#FFFFFF" size={16} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text.secondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: plan.popular ? theme.colors.accent : theme.colors.border,
                }
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: theme.colors.accent }]}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <Text style={[styles.planName, { color: theme.colors.text.primary }]}>
                {plan.name}
              </Text>
              <Text style={[styles.planPrice, { color: theme.colors.accent }]}>
                {plan.price}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.colors.text.secondary }]}>
                {plan.period}
              </Text>
              {plan.savings && (
                <Text style={[styles.savingsText, { color: theme.colors.accent }]}>
                  {plan.savings}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.upgradeButton, { backgroundColor: theme.colors.accent }]}
        >
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 28,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Sans',
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 32,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  planCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  popularBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: -12,
  },
  popularText: {
    color: '#FFFFFF',
    fontFamily: 'Sans-Medium',
    fontSize: 12,
  },
  planName: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: 'Serif-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  planPeriod: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  savingsText: {
    fontFamily: 'Sans-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  upgradeButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Sans-Medium',
    fontSize: 16,
  },
});
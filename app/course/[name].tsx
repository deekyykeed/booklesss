import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoursePage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={24}
                color={colors.text}
                strokeWidth={1.6}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.header}>
            <Text style={[styles.courseTitle, { color: colors.text }]}>
              {decodeURIComponent(name || 'Course')}
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Course Details
            </Text>
            <Text style={[styles.description, { color: colors.tabIconDefault }]}>
              Course content will be displayed here.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 100,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  header: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});



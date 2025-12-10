import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@/components/Themed';
import CourseCard from '@/components/CourseCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.demoCardsContainer}>
        <CourseCard />
        <CourseCard useNativeInput />
        <CourseCard />
        <CourseCard />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  demoCardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
});

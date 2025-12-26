import CourseCard from '@/components/CourseCard';
import WorkChart from '@/components/WorkChart';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const courses = [
  { 
    name: 'Financial Management', 
    lastOpened: '3 days ago',
    liveUsers: 12,
  },
  { 
    name: 'Innovation & Entrepreneurship', 
    lastOpened: '4 days ago',
    liveUsers: 8,
  },
  { 
    name: 'Research Methods', 
    lastOpened: '3 weeks ago',
    liveUsers: 3,
  },
  { 
    name: 'Financial Modeling & Finance', 
    lastOpened: '3 weeks ago',
    liveUsers: 5,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const router = useRouter();

  const handleCoursePress = (courseName: string) => {
    router.push(`/course/${encodeURIComponent(courseName)}`);
  };

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <WorkChart />
      <View style={styles.coursesContainer}>
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            name={course.name}
            lastOpened={course.lastOpened}
            liveUsers={course.liveUsers}
            onPress={() => handleCoursePress(course.name)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  coursesContainer: {
    gap: 0,
  },
});

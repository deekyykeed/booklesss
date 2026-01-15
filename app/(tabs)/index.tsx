import CourseCard from '@/components/CourseCard';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FolderAddIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  const handleCoursePress = (courseName: string) => {
    router.push(`/course/${encodeURIComponent(courseName)}`);
  };

  const handleAddPress = () => {
    // Handle add button press
  };

  const colors = Colors[colorScheme ?? 'light'];
  const TAB_BAR_HEIGHT = 48;
  const buttonBottom = TAB_BAR_HEIGHT + insets.bottom + 16;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Home</Text>
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
      <TouchableOpacity
        style={[styles.addButton, { bottom: buttonBottom }]}
        onPress={handleAddPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconShadow}>
          <HugeiconsIcon icon={FolderAddIcon} size={24} color="#fff" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'GoogleSans-Bold',
    marginBottom: 20,
  },
  coursesContainer: {
    gap: 0,
  },
  addButton: {
    position: 'absolute',
    right: 14,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D97655',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
});

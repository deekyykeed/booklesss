import { Calendar02Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CourseCardProps {
  title: string;
  progress: number;
  teamMembers?: string[]; // Array of avatar URLs or initials
  dueDate?: string;
  color?: string;
  onPress?: () => void;
}

export default function CourseCard({
  title,
  progress,
  teamMembers = [],
  dueDate,
  color = "#0860fb",
  onPress,
}: CourseCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    // backgroundColor: color, // Removed background color
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Changed to Light for snappier feel
    scale.value = withTiming(0.999, { duration: 10 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 10 });
    onPress?.();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Header with Title and Menu */}
        <View style={styles.header}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {title}
          </Text>
          <HugeiconsIcon icon={MoreHorizontalIcon} size={24} color="#FFFFFF" />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Team Members */}
          <View style={styles.teamContainer}>
            {teamMembers.slice(0, 4).map((member, index) => (
              <View
                key={index}
                style={[
                  styles.avatar,
                  { marginLeft: index > 0 ? -8 : 0, zIndex: 4 - index },
                ]}
              >
                <Text style={styles.avatarText}>
                  {member.charAt(0).toUpperCase()}
                </Text>
              </View>
            ))}
            {teamMembers.length > 4 && (
              <View
                style={[
                  styles.avatar,
                  styles.moreAvatar,
                  { marginLeft: -8, zIndex: 0 },
                ]}
              >
                <Text style={styles.avatarText}>+{teamMembers.length - 4}</Text>
              </View>
            )}
          </View>

          {/* Due Date */}
          {dueDate && (
            <View style={styles.dateContainer}>
              <HugeiconsIcon icon={Calendar02Icon} size={16} color="#FFFFFF" />
              <Text style={styles.dateText}>{dueDate}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 200,
    flexDirection: "column",
    gap: 16,
    padding: 20,
    // borderRadius: 22, // Removed
    // borderWidth: 1, // Removed
    // borderColor: "#FFFFFF20", // Removed

    // iOS shadow - Removed for full screen/flat look
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.15,
    // shadowRadius: 16,

    // Android shadow - Removed
    // elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  courseTitle: {
    flex: 1,
    fontFamily: "Ernon", // Added Ernon font
    fontWeight: "700",
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  progressBarContainer: {
    width: "100%",
    marginTop: 8,
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#FFFFFF40",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF30",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  moreAvatar: {
    backgroundColor: "#FFFFFF40",
  },
  avatarText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF20",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

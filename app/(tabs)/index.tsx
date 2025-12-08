import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Booklesss</Text>
        <Text style={styles.subtitle}>Your School Social Network</Text>
        <ThemedView style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.description}>Welcome to your feed!</Text>

        {/* Demo content */}
        {Array.from({ length: 20 }).map((_, i) => (
          <ThemedView key={i} style={styles.card}>
            <Text style={styles.cardTitle}>Post {i + 1}</Text>
            <Text style={styles.cardText}>
              This is a sample post in your feed.
            </Text>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
});

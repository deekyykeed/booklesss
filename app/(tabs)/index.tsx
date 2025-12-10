import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from '@/components/Themed';
import CourseCard from '@/components/CourseCard';

export default function HomeScreen() {
  const [showNativeInput, setShowNativeInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.demoCardsContainer}>
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => setShowNativeInput(!showNativeInput)}
        >
          <Text style={styles.buttonText}>
            {showNativeInput ? 'Hide' : 'Test'} Native Input
          </Text>
        </TouchableOpacity>

        {showNativeInput && (
          <TextInput
            style={styles.nativeInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Type here to test native input..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
          />
        )}
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
    paddingBottom: 100,
  },
  testButton: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  nativeInput: {
    padding: 14,
    backgroundColor: '#efeee5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 33, 33, 0.1)',
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

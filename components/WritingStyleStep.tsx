import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { WritingStyleId, WRITING_STYLES_ARRAY } from '@/constants/WritingStyles';
import * as Haptics from 'expo-haptics';

interface WritingStyleStepProps {
  selectedStyle: WritingStyleId | null;
  onUpdate: (styleId: WritingStyleId) => void;
}

export default function WritingStyleStep({ selectedStyle, onUpdate }: WritingStyleStepProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSelect = (styleId: WritingStyleId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdate(styleId);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Your Study Style</Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        How would you like your content rewritten?
      </Text>

      <View style={styles.stylesContainer}>
        {WRITING_STYLES_ARRAY.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.styleCard,
                {
                  backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                  borderColor: isSelected ? colors.tint : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => handleSelect(style.id)}
              activeOpacity={0.7}
            >
              <View style={styles.styleHeader}>
                <Text style={styles.emoji}>{style.emoji}</Text>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: colors.tint }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.styleName, { color: colors.text }]}>{style.name}</Text>
              <Text style={[styles.styleDescription, { color: colors.tabIconDefault }]}>
                {style.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.tipContainer}>
        <Text style={[styles.tipText, { color: colors.tabIconDefault }]}>
          💡 Tip: You can change this later if you want to try a different style
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  stylesContainer: {
    gap: 12,
  },
  styleCard: {
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  styleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  styleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 149, 220, 0.1)',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

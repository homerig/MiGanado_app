import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type NumberCarouselPickerProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
};

export function NumberCarouselPicker({
  label = 'Edad',
  value,
  onChange,
  min = 0,
  max = 20,
}: NumberCarouselPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, index) => String(index + min));

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isSelected = option === value;

          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(option)}
            >
              <ThemedText style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#565859',
  },
  scrollContent: {
    paddingVertical: 4,
  },
  option: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#CCD5CF',
    backgroundColor: '#F3F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: '#407157',
    borderColor: '#407157',
  },
  optionText: {
    color: '#407157',
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});

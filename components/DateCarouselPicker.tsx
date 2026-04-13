import React, { useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

type DateCarouselPickerProps = {
  label?: string,
  value: string,
  onChange: (value: string) => void,
  error?: boolean,
};

export function DateCarouselPicker({
  label = 'Fecha',
  value,
  onChange,
  error = false,
}: DateCarouselPickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!value) {
      onChange(dayjs().format('YYYY-MM-DD'));
    }
  }, [value, onChange]);

  const selectedDate = useMemo(() => {
    if (!value) {
      return new Date();
    }

    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [value]);

  const handleChange = (_event: unknown, nextSelectedDate?: Date) => {
    if (nextSelectedDate) {
      onChange(dayjs(nextSelectedDate).format('YYYY-MM-DD'));
    }

    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, error && styles.buttonError]}
        onPress={() => setShowDatePicker((prev) => !prev)}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value ? dayjs(selectedDate).format('DD/MM/YYYY') : 'Seleccionar fecha'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            style={styles.picker}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    minHeight: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#E9ECEF',
  },
  buttonError: {
    borderColor: '#d44648',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#151E26',
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
});

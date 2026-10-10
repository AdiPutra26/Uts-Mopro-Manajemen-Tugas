import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Tertunda' },
  { key: 'in-progress', label: 'Diproses' },
  { key: 'completed', label: 'Selesai' },
  { key: 'recurring', label: 'Berjadwal 🔄' },
];

const FilterBar = ({ activeFilter, onSelectFilter }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {FILTERS.map((item) => {
          const isActive = activeFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.primary : colors.cardBackground,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelectFilter(item.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? colors.white : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 2,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});

export default FilterBar;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const HeaderStats = ({ tasks = [] }) => {
  const { colors, isDarkMode } = useTheme();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const recurring = tasks.filter((t) => t.recurrence && t.recurrence !== 'none').length;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statBox,
          SHADOWS.small,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.primary }]}>{total}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
      </View>

      <View
        style={[
          styles.statBox,
          SHADOWS.small,
          {
            backgroundColor: isDarkMode ? '#451A03' : '#FFFBEB',
            borderColor: isDarkMode ? '#78350F' : '#FDE68A',
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.statusInProgress }]}>{pending}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tertunda</Text>
      </View>

      <View
        style={[
          styles.statBox,
          SHADOWS.small,
          {
            backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5',
            borderColor: isDarkMode ? '#065F46' : '#A7F3D0',
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.statusCompleted }]}>{completed}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Selesai</Text>
      </View>

      <View
        style={[
          styles.statBox,
          SHADOWS.small,
          {
            backgroundColor: isDarkMode ? '#2E1065' : '#F5F3FF',
            borderColor: isDarkMode ? '#4C1D95' : '#DDD6FE',
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.recurrenceText }]}>{recurring}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Berjadwal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default HeaderStats;

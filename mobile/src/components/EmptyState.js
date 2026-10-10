import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const EmptyState = ({ onAddTask, isFiltered = false }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons
          name={isFiltered ? 'search-outline' : 'checkbox-outline'}
          size={42}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {isFiltered ? 'Tidak Ada Tugas Sesuai Filter' : 'Belum Ada Tugas'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {isFiltered
          ? 'Coba ganti filter atau kata kunci pencarian Anda.'
          : 'Daftar tugas Anda masih kosong. Mulai kelola aktivitas dengan menambahkan tugas baru.'}
      </Text>

      {!isFiltered && onAddTask ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onAddTask}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={colors.white} />
          <Text style={[styles.buttonText, { color: colors.white }]}>Tambah Tugas Pertama</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmptyState;

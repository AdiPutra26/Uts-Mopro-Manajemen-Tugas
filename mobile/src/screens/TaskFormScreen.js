import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SHADOWS } from '../constants/theme';
import taskService from '../services/taskService';
import { useTheme } from '../context/ThemeContext';

const PRIORITIES = [
  { key: 'low', label: 'Rendah' },
  { key: 'medium', label: 'Sedang' },
  { key: 'high', label: 'Tinggi' },
];

const STATUSES = [
  { key: 'pending', label: 'Tertunda' },
  { key: 'in-progress', label: 'Diproses' },
  { key: 'completed', label: 'Selesai' },
];

const RECURRENCES = [
  { key: 'none', label: 'Sekali', sub: 'Non-rutin', icon: 'remove-circle-outline' },
  { key: 'daily', label: 'Harian', sub: 'Tiap hari', icon: 'repeat-outline' },
  { key: 'weekly', label: 'Mingguan', sub: 'Tiap minggu', icon: 'calendar-outline' },
  { key: 'monthly', label: 'Bulanan', sub: 'Tiap bulan', icon: 'time-outline' },
];

const TaskFormScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const existingTask = route.params?.task;
  const isEditing = Boolean(existingTask);

  // Form State
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState(existingTask?.priority || 'medium');
  const [status, setStatus] = useState(existingTask?.status || 'pending');
  const [recurrence, setRecurrence] = useState(existingTask?.recurrence || 'none');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');

  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  // Quick preset untuk tanggal
  const setQuickDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const formatted = d.toISOString().split('T')[0];
    setDueDate(formatted);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Judul tugas wajib diisi!');
      return;
    }
    setTitleError('');
    setLoading(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      recurrence,
      dueDate: dueDate.trim() || null,
    };

    try {
      if (isEditing) {
        await taskService.updateTask(existingTask.id, payload);
        if (Platform.OS === 'web') {
          window.alert('Tugas berhasil diperbarui!');
          navigation.goBack();
        } else {
          Alert.alert('Sukses', 'Tugas berhasil diperbarui!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
        await taskService.createTask(payload);
        if (Platform.OS === 'web') {
          window.alert('Tugas baru berhasil ditambahkan!');
          navigation.goBack();
        } else {
          Alert.alert('Sukses', 'Tugas baru berhasil ditambahkan!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    } catch (error) {
      console.error('Error saat menyimpan tugas:', error);
      const msg =
        error.response?.data?.message ||
        'Terjadi masalah koneksi ke server. Silakan coba lagi.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Gagal Menyimpan', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Top Bar Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Card */}
          <View
            style={[
              styles.card,
              SHADOWS.medium,
              { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            ]}
          >
            {/* Input: Judul Tugas */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Judul Tugas <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: titleError ? colors.danger : colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Misal: Memberi makan peliharaan"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(val) => {
                  setTitle(val);
                  if (titleError) setTitleError('');
                }}
              />
              {titleError ? <Text style={[styles.errorText, { color: colors.danger }]}>{titleError}</Text> : null}
            </View>

            {/* Input: Deskripsi Tugas */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Deskripsi (Opsional)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Jelaskan detail aktivitas atau instruksi tugas..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>

            {/* Selector: Tugas Berjadwal (Recurrence) */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="repeat-outline" size={17} color={colors.primary} />
                <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 0 }]}>
                  Jadwal Berulang (Recurring Task)
                </Text>
              </View>
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                Pilih frekuensi pengulangan tugas (misal: harian memberi makan peliharaan)
              </Text>
              <View style={styles.recurrenceGrid}>
                {RECURRENCES.map((item) => {
                  const isSelected = recurrence === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.recurrenceChip,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.inputBackground,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setRecurrence(item.key)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                      <View style={{ marginLeft: 6 }}>
                        <Text
                          style={[
                            styles.chipLabel,
                            {
                              color: isSelected ? colors.primary : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={[styles.subLabel, { color: colors.textMuted }]}>{item.sub}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selector: Prioritas Tugas */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tingkat Prioritas</Text>
              <View style={styles.choiceRow}>
                {PRIORITIES.map((item) => {
                  const isSelected = priority === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.choiceChip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.inputBackground,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setPriority(item.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          {
                            color: isSelected ? colors.white : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selector: Status Tugas (jika edit atau preset) */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Status Tugas</Text>
              <View style={styles.choiceRow}>
                {STATUSES.map((item) => {
                  const isSelected = status === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.choiceChip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.inputBackground,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setStatus(item.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          {
                            color: isSelected ? colors.white : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Input: Tanggal Jatuh Tempo (Due Date) */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tenggat Waktu (YYYY-MM-DD)</Text>
              <View style={styles.dateInputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.textMuted}
                  style={styles.dateIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    styles.dateInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="2026-10-25"
                  placeholderTextColor={colors.textMuted}
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>

              {/* Quick Preset Buttons */}
              <View style={styles.quickDateRow}>
                <Text style={[styles.quickDateLabel, { color: colors.textSecondary }]}>Pintasan:</Text>
                <TouchableOpacity
                  style={[styles.quickDateBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() => setQuickDate(0)}
                >
                  <Text style={[styles.quickDateText, { color: colors.primary }]}>Hari Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickDateBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() => setQuickDate(1)}
                >
                  <Text style={[styles.quickDateText, { color: colors.primary }]}>Besok</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickDateBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() => setQuickDate(7)}
                >
                  <Text style={[styles.quickDateText, { color: colors.primary }]}>+1 Minggu</Text>
                </TouchableOpacity>
                {dueDate ? (
                  <TouchableOpacity
                    style={[styles.quickDateBtn, { backgroundColor: colors.dangerBg }]}
                    onPress={() => setDueDate('')}
                  >
                    <Text style={[styles.quickDateText, { color: colors.danger }]}>Hapus</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              SHADOWS.floating,
              { backgroundColor: colors.primary },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'checkmark-circle-outline' : 'add-circle-outline'}
                  size={20}
                  color={colors.white}
                />
                <Text style={[styles.saveButtonText, { color: colors.white }]}>
                  {isEditing ? 'Perbarui Tugas' : 'Simpan Tugas Baru'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  recurrenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recurrenceChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  subLabel: {
    fontSize: 10,
    marginTop: 1,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
  },
  dateInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  dateIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  dateInput: {
    paddingLeft: 42,
  },
  quickDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  quickDateLabel: {
    fontSize: 12,
  },
  quickDateBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quickDateText: {
    fontSize: 11,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default TaskFormScreen;

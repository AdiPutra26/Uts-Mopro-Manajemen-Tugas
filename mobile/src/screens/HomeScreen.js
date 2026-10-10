import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SHADOWS } from '../constants/theme';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import HeaderStats from '../components/HeaderStats';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const response = await taskService.getAllTasks();
      if (response && response.data) {
        setTasks(response.data);
      } else if (Array.isArray(response)) {
        setTasks(response);
      }
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks(false);
    }, [])
  );

  useEffect(() => {
    loadTasks(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks(false);
  };

  const handleToggleStatus = async (task) => {
    try {
      const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: updatedStatus } : t))
      );
      await taskService.toggleComplete(task);
    } catch (err) {
      loadTasks(false);
    }
  };

  const handleEditTask = (task) => {
    navigation.navigate('TaskForm', { task });
  };

  const handleDeleteTask = (task) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus "${task.title}"?`);
      if (confirmed) {
        (async () => {
          try {
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
            await taskService.deleteTask(task.id);
          } catch (err) {
            window.alert('Gagal menghapus tugas.');
            loadTasks(false);
          }
        })();
      }
      return;
    }

    // Mobile alert
    (async () => {
      try {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        await taskService.deleteTask(task.id);
      } catch (err) {
        loadTasks(false);
      }
    })();
  };

  // Tugas berjadwal (Recurring tasks)
  const recurringTasks = tasks.filter((t) => t.recurrence && t.recurrence !== 'none');
  // Tugas prioritas tinggi yang belum selesai
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed');

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Selamat Datang 👋
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Dashboard Taskify</Text>
        </View>

        {/* Toggle Mode Gelap / Terang */}
        <TouchableOpacity
          style={[
            styles.themeBtn,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={20}
            color={isDarkMode ? '#FBBF24' : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Banner Motivasi Santri Coding */}
        <View
          style={[
            styles.banner,
            SHADOWS.medium,
            {
              backgroundColor: isDarkMode ? '#1E1B4B' : colors.primaryLight,
              borderColor: isDarkMode ? '#312E81' : '#C7D2FE',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTag, { color: colors.primary }]}>
              Santri Coding Showcase
            </Text>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
              Fullstack Javascript Developer
            </Text>
            <Text style={[styles.bannerDesc, { color: colors.textSecondary }]}>
              Express.js RESTful API & React Native Mobile
            </Text>
          </View>
          <View style={[styles.bannerIconCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="rocket-outline" size={26} color={colors.white} />
          </View>
        </View>

        {/* Statistik Ringkas */}
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          Ringkasan Aktivitas 📊
        </Text>
        <HeaderStats tasks={tasks} />

        {/* Tombol Aksi Cepat */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, SHADOWS.small, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('TaskForm')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.white} />
            <Text style={[styles.actionBtnText, { color: colors.white }]}>Tambah Tugas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              SHADOWS.small,
              { backgroundColor: colors.cardBackground, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => navigation.navigate('Tugas')}
            activeOpacity={0.8}
          >
            <Ionicons name="list-outline" size={18} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Tugas Berjadwal (Recurring Tasks) */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="repeat-outline" size={20} color={colors.recurrenceText} />
            <Text style={[styles.sectionHeading, { color: colors.textPrimary, marginBottom: 0 }]}>
              Tugas Berjadwal (Rutinitas)
            </Text>
          </View>
          <Text style={[styles.badgeCount, { backgroundColor: colors.recurrenceBg, color: colors.recurrenceText }]}>
            {recurringTasks.length} Jadwal
          </Text>
        </View>

        {recurringTasks.length > 0 ? (
          recurringTasks.map((item) => (
            <TaskCard
              key={item.id}
              task={item}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <View style={[styles.emptySection, { backgroundColor: colors.cardBackground, borderColor: colors.borderLight }]}>
            <Text style={[styles.emptySectionText, { color: colors.textSecondary }]}>
              Belum ada tugas berjadwal. Buat jadwal rutin (harian/mingguan) seperti 'memberi makan peliharaan'.
            </Text>
          </View>
        )}

        {/* Section: Tugas Prioritas Tinggi */}
        {highPriorityTasks.length > 0 ? (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="flame-outline" size={20} color={colors.priorityHigh} />
                <Text style={[styles.sectionHeading, { color: colors.textPrimary, marginBottom: 0 }]}>
                  Perlu Perhatian (Prioritas Tinggi)
                </Text>
              </View>
            </View>
            {highPriorityTasks.slice(0, 3).map((item) => (
              <TaskCard
                key={item.id}
                task={item}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </>
        ) : null}

        {loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  themeBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  bannerTag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 12,
  },
  bannerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '700',
  },
  emptySection: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptySectionText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HomeScreen;

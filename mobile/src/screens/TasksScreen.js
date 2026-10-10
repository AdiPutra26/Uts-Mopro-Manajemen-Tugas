import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SHADOWS } from '../constants/theme';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import HeaderStats from '../components/HeaderStats';
import { useTheme } from '../context/ThemeContext';

const TasksScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState(null);

  // Ambil data tugas dari backend
  const loadTasks = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    setErrorMessage(null);

    try {
      const response = await taskService.getAllTasks();
      if (response && response.data) {
        setTasks(response.data);
      } else if (Array.isArray(response)) {
        setTasks(response);
      }
    } catch (err) {
      console.error('Gagal mengambil data tugas:', err);
      setErrorMessage(
        'Tidak dapat terhubung ke server backend. Pastikan server Express aktif di port 5000.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Muat ulang setiap kali tab fokus
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

  // Toggle status selesai / belum selesai
  const handleToggleStatus = async (task) => {
    try {
      const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: updatedStatus } : t))
      );
      await taskService.toggleComplete(task);
    } catch (err) {
      if (Platform.OS === 'web') {
        window.alert('Gagal memperbarui status tugas.');
      } else {
        Alert.alert('Gagal', 'Tidak dapat memperbarui status tugas.');
      }
      loadTasks(false);
    }
  };

  // Hapus tugas dengan konfirmasi
  const handleDeleteTask = (task) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus tugas "${task.title}"?`);
      if (confirmed) {
        (async () => {
          try {
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
            await taskService.deleteTask(task.id);
          } catch (err) {
            window.alert('Gagal menghapus tugas dari server.');
            loadTasks(false);
          }
        })();
      }
      return;
    }

    Alert.alert(
      'Hapus Tugas',
      `Apakah Anda yakin ingin menghapus tugas "${task.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              setTasks((prev) => prev.filter((t) => t.id !== task.id));
              await taskService.deleteTask(task.id);
            } catch (err) {
              Alert.alert('Gagal', 'Gagal menghapus tugas dari server.');
              loadTasks(false);
            }
          },
        },
      ]
    );
  };

  const handleEditTask = (task) => {
    navigation.navigate('TaskForm', { task });
  };

  // Filter & Search di sisi client
  const filteredTasks = tasks.filter((task) => {
    let matchesStatus = true;
    if (statusFilter === 'recurring') {
      matchesStatus = task.recurrence && task.recurrence !== 'none';
    } else if (statusFilter !== 'all') {
      matchesStatus = task.status === statusFilter;
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header Aplikasi */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Daftar Tugas 📑</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            Kelola seluruh aktivitas dan jadwal tugas
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.themeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
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

      {/* Konten Utama */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Widget Statistik */}
            <HeaderStats tasks={tasks} />

            {/* Error Banner jika gagal koneksi */}
            {errorMessage ? (
              <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg }]}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                <Text style={[styles.errorBannerText, { color: colors.danger }]}>{errorMessage}</Text>
                <TouchableOpacity onPress={() => loadTasks(true)}>
                  <Text style={[styles.retryText, { color: colors.danger }]}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Pencarian & Filter */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
            <FilterBar activeFilter={statusFilter} onSelectFilter={setStatusFilter} />
          </>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Memuat tugas...</Text>
            </View>
          ) : (
            <EmptyState
              onAddTask={() => navigation.navigate('TaskForm')}
              isFiltered={Boolean(searchQuery || statusFilter !== 'all')}
            />
          )
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={[styles.fab, SHADOWS.floating, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('TaskForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
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
    paddingBottom: 14,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TasksScreen;

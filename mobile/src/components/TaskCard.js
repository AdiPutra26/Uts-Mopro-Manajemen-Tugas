import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const getRecurrenceInfo = (recurrence, colors) => {
  switch (recurrence) {
    case 'daily':
      return { label: 'Harian', icon: 'repeat-outline', bg: colors.recurrenceBg, text: colors.recurrenceText };
    case 'weekly':
      return { label: 'Mingguan', icon: 'calendar-outline', bg: colors.recurrenceBg, text: colors.recurrenceText };
    case 'monthly':
      return { label: 'Bulanan', icon: 'time-outline', bg: colors.recurrenceBg, text: colors.recurrenceText };
    default:
      return null;
  }
};

const getStatusBadge = (status, colors) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Selesai',
        bg: colors.statusCompletedBg,
        text: colors.statusCompleted,
        icon: 'checkmark-circle-outline',
      };
    case 'in-progress':
      return {
        label: 'Proses',
        bg: colors.statusInProgressBg,
        text: colors.statusInProgress,
        icon: 'time-outline',
      };
    default:
      return {
        label: 'Tertunda',
        bg: colors.statusPendingBg,
        text: colors.statusPending,
        icon: 'ellipse-outline',
      };
  }
};

const getPriorityBadge = (priority, colors) => {
  switch (priority) {
    case 'high':
      return {
        label: 'Tinggi',
        bg: colors.priorityHighBg,
        text: colors.priorityHigh,
      };
    case 'medium':
      return {
        label: 'Sedang',
        bg: colors.priorityMediumBg,
        text: colors.priorityMedium,
      };
    default:
      return {
        label: 'Rendah',
        bg: colors.priorityLowBg,
        text: colors.priorityLow,
      };
  }
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const { colors } = useTheme();
  const isCompleted = task.status === 'completed';
  const statusInfo = getStatusBadge(task.status, colors);
  const priorityInfo = getPriorityBadge(task.priority, colors);
  const recurrenceInfo = getRecurrenceInfo(task.recurrence, colors);

  return (
    <View
      style={[
        styles.card,
        SHADOWS.medium,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Header Kartu: Status Bar kiri & Checkbox */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleStatus(task)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isCompleted ? 'checkbox' : 'square-outline'}
            size={24}
            color={isCompleted ? colors.statusCompleted : colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => onEdit(task)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              isCompleted && { textDecorationLine: 'line-through', color: colors.textMuted },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.primaryLight }]}
            onPress={() => onEdit(task)}
            activeOpacity={0.6}
          >
            <Ionicons name="create-outline" size={19} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.dangerBg }]}
            onPress={() => onDelete(task)}
            activeOpacity={0.6}
          >
            <Ionicons name="trash-outline" size={19} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Deskripsi Tugas */}
      {task.description ? (
        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
            isCompleted && { color: colors.textMuted },
          ]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      ) : null}

      {/* Footer Kartu: Badges & Due Date */}
      <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
        <View style={styles.badgesRow}>
          {/* Status Badge */}
          <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
            <Ionicons name={statusInfo.icon} size={13} color={statusInfo.text} />
            <Text style={[styles.badgeText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>

          {/* Priority Badge */}
          <View style={[styles.badge, { backgroundColor: priorityInfo.bg }]}>
            <Text style={[styles.badgeText, { color: priorityInfo.text }]}>
              {priorityInfo.label}
            </Text>
          </View>

          {/* Recurrence Badge (Jadwal Berulang) */}
          {recurrenceInfo ? (
            <View style={[styles.badge, { backgroundColor: recurrenceInfo.bg }]}>
              <Ionicons name={recurrenceInfo.icon} size={13} color={recurrenceInfo.text} />
              <Text style={[styles.badgeText, { color: recurrenceInfo.text, fontWeight: '700' }]}>
                {recurrenceInfo.label}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Tenggat Waktu (Due Date) */}
        {task.dueDate ? (
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{task.dueDate}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 10,
    marginTop: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  description: {
    fontSize: 13,
    marginTop: 8,
    marginLeft: 34,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    marginLeft: 34,
    flexWrap: 'wrap',
    gap: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default TaskCard;

export const LIGHT_COLORS = {
  primary: '#4F46E5', // Indigo
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',

  background: '#F8FAFC', // Slate 50
  cardBackground: '#FFFFFF',
  cardBorder: '#E2E8F0',

  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400

  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9',
  inputBackground: '#F8FAFC',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabBarActive: '#4F46E5',
  tabBarInactive: '#94A3B8',

  // Status colors
  statusPending: '#64748B',
  statusPendingBg: '#F1F5F9',

  statusInProgress: '#D97706',
  statusInProgressBg: '#FEF3C7',

  statusCompleted: '#059669',
  statusCompletedBg: '#D1FAE5',

  // Priority colors
  priorityLow: '#0D9488',
  priorityLowBg: '#CCFBF1',

  priorityMedium: '#2563EB',
  priorityMediumBg: '#DBEAFE',

  priorityHigh: '#DC2626',
  priorityHighBg: '#FEE2E2',

  // Recurrence (Jadwal Berulang)
  recurrenceBg: '#EDE9FE',
  recurrenceText: '#7C3AED',

  // Utilities
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  white: '#FFFFFF',
};

export const DARK_COLORS = {
  primary: '#6366F1', // Lighter Indigo for Dark Mode
  primaryLight: '#1E1B4B',
  primaryDark: '#4338CA',

  background: '#0F172A', // Deep Slate
  cardBackground: '#1E293B', // Slate 800
  cardBorder: '#334155', // Slate 700

  textPrimary: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500

  border: '#334155',
  borderLight: '#1E293B',
  inputBackground: '#0F172A',

  // Tab bar
  tabBarBackground: '#1E293B',
  tabBarBorder: '#334155',
  tabBarActive: '#818CF8',
  tabBarInactive: '#64748B',

  // Status colors (dark theme tuned)
  statusPending: '#94A3B8',
  statusPendingBg: '#334155',

  statusInProgress: '#FBBF24',
  statusInProgressBg: '#451A03',

  statusCompleted: '#34D399',
  statusCompletedBg: '#064E3B',

  // Priority colors (dark theme tuned)
  priorityLow: '#2DD4BF',
  priorityLowBg: '#134E4A',

  priorityMedium: '#60A5FA',
  priorityMediumBg: '#1E3A8A',

  priorityHigh: '#F87171',
  priorityHighBg: '#7F1D1D',

  // Recurrence (Jadwal Berulang)
  recurrenceBg: '#2E1065',
  recurrenceText: '#C4B5FD',

  // Utilities
  danger: '#F87171',
  dangerBg: '#7F1D1D',
  white: '#FFFFFF',
};

// Default export untuk kompatibilitas
export const COLORS = LIGHT_COLORS;

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  floating: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};

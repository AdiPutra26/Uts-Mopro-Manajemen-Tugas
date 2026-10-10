import React from 'react';
import {
  View, Platform,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../services/api';

const AboutScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Tentang Aplikasi ℹ️</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Informasi proyek, preferensi tema & pengembang
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card: Pengaturan Tema (Light / Dark Mode Toggle) */}
        <View
          style={[
            styles.card,
            SHADOWS.medium,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isDarkMode ? '#312E81' : colors.primaryLight },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={22}
                  color={isDarkMode ? '#FBBF24' : colors.primary}
                />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Tema Tampilan
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Mode {isDarkMode ? 'Gelap (Dark Mode)' : 'Terang (Light Mode)'}
                </Text>
              </View>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Sentuh switch di atas untuk beralih antara tema Terang dan Gelap. Seluruh halaman dan komponen aplikasi akan menyesuaikan warna secara otomatis.
          </Text>
        </View>

        {/* Card: Informasi Tugas Akhir Showcase */}
        <View
          style={[
            styles.card,
            SHADOWS.medium,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="school-outline" size={22} color="#059669" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Showcase Santri Coding
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Tugas Akhir Fullstack Developer
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Aplikasi <Text style={{ fontWeight: '700', color: colors.primary }}>Taskify</Text> dikembangkan sebagai proyek showcase komprehensif mengintegrasikan backend <Text style={{ fontWeight: '600' }}>Express.js MVC</Text> dan mobile client <Text style={{ fontWeight: '600' }}>React Native (Expo)</Text>.
          </Text>

          {/* Badge Fitur Utama */}
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>CRUD Realtime</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.recurrenceBg }]}>
              <Text style={[styles.tagText, { color: colors.recurrenceText }]}>Tugas Berjadwal</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.statusCompletedBg }]}>
              <Text style={[styles.tagText, { color: colors.statusCompleted }]}>Bottom Navigation</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.priorityMediumBg }]}>
              <Text style={[styles.tagText, { color: colors.priorityMedium }]}>Dark / Light Theme</Text>
            </View>
          </View>
        </View>

        {/* Card: Status Koneksi Backend API */}
        <View
          style={[
            styles.card,
            SHADOWS.medium,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="server-outline" size={22} color="#D97706" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Status Server API
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Node.js Express MVC
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.apiBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Text style={[styles.apiLabel, { color: colors.textSecondary }]}>Base URL Terhubung:</Text>
            <Text style={[styles.apiUrl, { color: colors.primary }]}>{BASE_URL}/api/tasks</Text>
          </View>
        </View>

        {/* Card: Pengembang & Profil */}
        <View
          style={[
            styles.card,
            SHADOWS.medium,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="person-outline" size={22} color="#2563EB" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Profil Pengembang
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Fullstack JavaScript Developer
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.linkBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleOpenLink('https://santricoding.com')}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={18} color={colors.white} />
            <Text style={[styles.linkBtnText, { color: colors.white }]}>Kunjungi Santri Coding</Text>
          </TouchableOpacity>
        </View>

        {/* Versi Aplikasi */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Taskify Mobile App v1.1.0 • Built with React Native & Express
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  apiBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  apiLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  apiUrl: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    marginVertical: 14,
  },
});

export default AboutScreen;

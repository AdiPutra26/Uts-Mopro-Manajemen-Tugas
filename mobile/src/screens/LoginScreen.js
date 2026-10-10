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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  // State autentikasi showcase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      const msg = 'Silakan isi email dan password Anda.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Perhatian', msg);
      }
      return;
    }

    // Simulasi login sukses untuk showcase
    setCurrentUser({
      name: 'Santri Developer',
      email: email.trim(),
      role: 'Fullstack JavaScript Developer',
      joined: 'Oktober 2026',
    });
    setIsLoggedIn(true);
  };

  const handleDemoLogin = () => {
    setEmail('developer@santricoding.com');
    setPassword('secret1234');
    setCurrentUser({
      name: 'Santri Coding Showcase User',
      email: 'developer@santricoding.com',
      role: 'Fullstack JavaScript Developer',
      joined: 'Oktober 2026',
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isLoggedIn ? 'Profil Akun 👤' : 'Masuk Akun 🔐'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isLoggedIn ? 'Kelola status sesi developer Anda' : 'Autentikasi showcase portfolio Taskify'}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoggedIn ? (
            /* ==========================================
               Tampilan Profil Saat Sudah Login
               ========================================== */
            <View
              style={[
                styles.profileCard,
                SHADOWS.medium,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
            >
              <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="person" size={40} color={colors.white} />
              </View>

              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {currentUser?.name}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.primary }]}>
                {currentUser?.email}
              </Text>
              <Text style={[styles.profileRole, { color: colors.textSecondary }]}>
                {currentUser?.role}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.statusCompletedBg, borderColor: colors.statusCompleted },
                ]}
              >
                <Ionicons name="checkmark-circle" size={15} color={colors.statusCompleted} />
                <Text style={[styles.statusBadgeText, { color: colors.statusCompleted }]}>
                  Sesi Aktif & Terverifikasi
                </Text>
              </View>

              <View style={[styles.infoDivider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.profileDetailsRow}>
                <Text style={[styles.detailKey, { color: colors.textSecondary }]}>Program:</Text>
                <Text style={[styles.detailVal, { color: colors.textPrimary }]}>
                  Fullstack Developer (Santri Coding)
                </Text>
              </View>

              <View style={styles.profileDetailsRow}>
                <Text style={[styles.detailKey, { color: colors.textSecondary }]}>Waktu Sesi:</Text>
                <Text style={[styles.detailVal, { color: colors.textPrimary }]}>
                  {currentUser?.joined}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.logoutBtn, { backgroundColor: colors.dangerBg }]}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={18} color={colors.danger} />
                <Text style={[styles.logoutBtnText, { color: colors.danger }]}>
                  Keluar dari Akun
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ==========================================
               Tampilan Form Login
               ========================================== */
            <View
              style={[
                styles.formCard,
                SHADOWS.medium,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
            >
              <View style={styles.formHeader}>
                <View style={[styles.loginIconWrap, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="lock-closed" size={26} color={colors.primary} />
                </View>
                <Text style={[styles.formHeading, { color: colors.textPrimary }]}>
                  Selamat Datang Kembali
                </Text>
                <Text style={[styles.formSubheading, { color: colors.textSecondary }]}>
                  Gunakan email Anda atau tombol Coba Akun Demo
                </Text>
              </View>

              {/* Input Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Alamat Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: colors.inputBackground, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="nama@santricoding.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Input Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Kata Sandi</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: colors.inputBackground, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="key-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="Masukkan password Anda"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tombol Masuk */}
              <TouchableOpacity
                style={[styles.submitBtn, SHADOWS.floating, { backgroundColor: colors.primary }]}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="log-in-outline" size={20} color={colors.white} />
                <Text style={[styles.submitBtnText, { color: colors.white }]}>Masuk Sekarang</Text>
              </TouchableOpacity>

              {/* Pemisah atau */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>ATAU</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Tombol Cepat Akun Demo */}
              <TouchableOpacity
                style={[
                  styles.demoBtn,
                  { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                ]}
                onPress={handleDemoLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="flash-outline" size={18} color={colors.primary} />
                <Text style={[styles.demoBtnText, { color: colors.primary }]}>
                  Gunakan Akun Demo (1-Klik Masuk)
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  formCard: {
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    marginTop: 10,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  formSubheading: {
    fontSize: 12,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: '600',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 10,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoDivider: {
    width: '100%',
    height: 1,
    marginVertical: 12,
  },
  profileDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
  },
  detailKey: {
    fontSize: 13,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 20,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default LoginScreen;

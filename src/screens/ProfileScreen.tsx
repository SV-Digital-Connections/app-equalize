import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import AppHeader from '../components/AppHeader';
import Icon, { type IconName } from '../design-system/Icon';
import { loadUserData, loadProfileData } from '../mock';

interface ProfileOption {
  id: string;
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const { navigate } = useRouter();
  const userData = loadUserData();
  const profileSections = loadProfileData();

  const profileOptions = profileSections.find((s) => s.section === 'personal')?.options || [];
  const settingsOptions = profileSections.find((s) => s.section === 'settings')?.options || [];

  const handleOptionPress = (optionId: string) => {
    const { log } = require('../utils/log');
    log.info('Option pressed:', optionId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader
        greeting={userData.greeting}
        name={userData.name}
        unreadCount={userData.unreadCount}
        onPressMessages={() => navigate('Messages')}
        onPressProfile={() => navigate('Account')}
        includeSpacer={false}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Icon name="account-circle" size={24} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Meu Perfil</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color={colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="camera" size={20} color={colors.textPrimary} />
            <Text style={styles.editButtonText}>Editar foto</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {profileSections.find((s) => s.section === 'personal')?.label}
          </Text>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionRow}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionLeft}>
                <Icon name={option.icon as IconName} size={24} color={colors.textSecondary} />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.value && <Text style={styles.optionValue}>{option.value}</Text>}
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {profileSections.find((s) => s.section === 'settings')?.label}
          </Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionRow}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionLeft}>
                <Icon name={option.icon as IconName} size={24} color={colors.textSecondary} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigate('Login')}>
          <Icon name="logout" size={24} color={colors.textSecondary} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>

      <BottomNavbar
        items={[
          { key: 'home', label: 'Página Inicial', icon: 'home-outline', onPress: () => navigate('Main') },
          {
            key: 'identity',
            label: 'Identidade',
            customIcon: 'identity',
            onPress: () => navigate('Account'),
          },
          { key: 'care', label: 'Cuidados', icon: 'molecule', onPress: () => navigate('Care') },
          {
            key: 'regen',
            label: 'Regeneração',
            icon: 'arrow-collapse-vertical',
            onPress: () => navigate('Regeneration'),
          },
          {
            key: 'maint',
            label: 'Manutenção',
            icon: 'account-cog-outline',
            onPress: () => navigate('Maintenance'),
          },
          {
            key: 'checks',
            label: 'Checkups',
            icon: 'clipboard-pulse-outline',
            onPress: () => navigate('Checkups'),
          },
          {
            key: 'trail',
            label: 'Trilha',
            icon: 'chart-timeline-variant',
            onPress: () => navigate('Trail'),
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
    paddingTop: 100,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.buttonBackground,
  },
  editButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionValue: {
    color: colors.textSecondary,
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginTop: 24,
    marginBottom: 16,
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});

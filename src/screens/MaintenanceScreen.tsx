import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import Icon from '../design-system/Icon';
import AppHeader from '../components/AppHeader';
import { loadMaintenanceData, loadUserData } from '../mock';

export default function MaintenanceScreen() {
  const { navigate, goBack } = useRouter();
  const maintenanceData = loadMaintenanceData();
  const userData = loadUserData();

  const getIconByStatus = (status: string) => {
    return status === 'done' ? 'check-circle' : 'calendar-month';
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
        {/* Título da seção */}
        <View style={styles.titleSection}>
          <Icon name="account-cog-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Manutenção</Text>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>{maintenanceData.subtitle}</Text>

        {/* Texto principal */}
        <Text style={styles.mainText}>{maintenanceData.mainText}</Text>

        {/* Seção de procedimentos */}
        <Text style={styles.proceduresTitle}>{maintenanceData.proceduresTitle}</Text>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {/* Linha vertical da timeline */}
          <View style={styles.timelineLine} />

          {maintenanceData.procedures.map((procedure) => (
            <View key={procedure.id} style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <Icon name={getIconByStatus(procedure.status)} size={28} color={colors.textSecondary} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>{procedure.dateLabel}</Text>
                <Text style={styles.timelineTitle}>{procedure.title}</Text>
              </View>
            </View>
          ))}
        </View>
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
          { key: 'trail', label: 'Trilha', icon: 'map-marker-path', onPress: () => navigate('Trail') },
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
    paddingBottom: 140, // leave space for bottom navbar
    paddingTop: 100,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  mainText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 32,
  },
  proceduresTitle: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  timelineContainer: {
    marginTop: 8,
    paddingLeft: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 33,
    top: 14,
    bottom: 20,
    width: 2,
    backgroundColor: colors.textSecondary,
    opacity: 0.4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  timelineIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    zIndex: 2,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  timelineTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
});

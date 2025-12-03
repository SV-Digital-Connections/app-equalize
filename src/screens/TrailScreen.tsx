import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import Icon from '../design-system/Icon';
import AppHeader from '../components/AppHeader';
import { loadTrailData, loadUserData } from '../mock';

export default function TrailScreen() {
  const { navigate, goBack } = useRouter();
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const trailData = loadTrailData();
  const trailItems = trailData.trailItems;
  const userData = loadUserData();

  type Status = 'calendar' | 'check' | 'close' | 'circle';

  const handleCardPress = (itemId: number) => {
    setExpandedCard(expandedCard === itemId ? null : itemId);
  };

  const downloadFile = () => {
    // Função para download do arquivo

    const { log } = require('../utils/log');
    log.info('Download arquivo');
  };

  const renderStatusIcon = (status: Status) => {
    const iconColor = colors.textSecondary;
    switch (status) {
      case 'calendar':
        return <Icon name="calendar-month" size={28} color={iconColor} />;
      case 'check':
        return <Icon name="check-circle" size={28} color={iconColor} />;
      case 'close':
        return <Icon name="close-circle" size={28} color={iconColor} />;
      default:
        return <Icon name="circle-outline" size={28} color={iconColor} />;
    }
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
          <Icon name="map-marker-path" size={24} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Sua trilha</Text>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>{trailData.subtitle}</Text>

        {/* Texto principal */}
        <Text style={styles.mainText}>{trailData.mainText}</Text>

        {/* Trail Items */}
        <View style={styles.trailItemsContainer}>
          {trailItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.trailCard, expandedCard === item.id && styles.trailCardExpanded]}
              onPress={() => handleCardPress(item.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={item.icon as React.ComponentProps<typeof Icon>['name']}
                      size={20}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardDate}>{item.date}</Text>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardCategory}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.statusIcon}>{renderStatusIcon(item.status)}</View>
              </View>

              {expandedCard === item.id && item.hasDownload && (
                <View style={styles.expandedContent}>
                  <Button
                    mode="contained"
                    style={styles.downloadButton}
                    onPress={downloadFile}
                    icon="download"
                  >
                    Arquivo.pdf
                  </Button>
                </View>
              )}
            </TouchableOpacity>
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
  trailItemsContainer: {
    gap: 12,
  },
  trailCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.headerBackground,
    marginBottom: 4,
  },
  trailCardExpanded: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.buttonBackground,
    transform: [{ scale: 1.02 }],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.headerBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 2,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardCategory: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statusIcon: {
    marginLeft: 12,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.headerBackground,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: colors.headerBackground,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
});

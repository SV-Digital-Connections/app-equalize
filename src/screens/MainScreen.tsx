import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import Skeleton from '../components/Skeleton';
import { colors } from '../theme/colors';
import { log } from '../utils/log';
import { layout } from '../theme/layout';
import { useHomeViewModel } from '../viewmodels/useHomeViewModel';
import { useRouter } from '../app/router/RouterProvider';
import AppHeader from '../components/AppHeader';
import BottomNavbar from '../components/BottomNavbar';
import { ModalCard } from '../components/ModalCard';
import { useHeaderMeasurement } from './hooks/useHeaderMeasurement';
import { useScaleModal } from './hooks/useScaleModal';
import NewsHero from './components/NewsHero';
import ResultsCarousel from './components/ResultsCarousel';
import ProceduresBlock from './components/ProceduresBlock';
import NextProcedureFloat from './components/NextProcedureFloat';
import { strings } from '../app/strings';

export default function MainScreen() {
  const { data: state, loading, error } = useHomeViewModel();
  const { navigate } = useRouter();
  const { headerH, onHeaderLayout } = useHeaderMeasurement();
  const [floatH, setFloatH] = React.useState(0);
  const spacerHeight = React.useMemo(
    () => Math.max(0, headerH + floatH - layout.resultsSpacerOffset),
    [headerH, floatH],
  );
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({ title: '', content: '' });
  const [scrollY, setScrollY] = React.useState(0);
  const { open: openScale, close: closeScale } = useScaleModal();

  const openModal = React.useCallback(
    (title: string, content: string) => {
      setModalContent({ title, content });
      setModalVisible(true);
      openScale();
    },
    [openScale],
  );

  const closeModal = React.useCallback(() => {
    setModalVisible(false);
    closeScale();
  }, [closeScale]);

  return (
    <View style={styles.container}>
      <AppHeader
        greeting={strings.hello}
        name={strings.userName}
        unreadCount={state?.unreadCount}
        onPressMessages={() => navigate('Messages')}
        onPressProfile={() => navigate('Account')}
        onLayout={onHeaderLayout}
        includeSpacer={true}
      />
      <NextProcedureFloat
        headerHeight={headerH}
        dateLabel={state?.upcoming.dateLabel}
        name={state?.upcoming.name}
        onMeasured={setFloatH}
        onPress={() => navigate('NextSteps')}
        scrollY={scrollY}
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: 0 }]}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <View style={{ height: spacerHeight }} />
        <NewsHero
          onSeeMore={() => navigate('News')}
          heroImageUri={state?.hero?.imageUri}
          heroVideoUri={state?.hero?.videoUri}
        />
        <ResultsCarousel results={state?.results ?? []} onSeeAll={() => navigate('Results')} />

        {loading && (
          <View style={{ paddingVertical: 16 }}>
            <Skeleton style={{ height: 220, borderRadius: 16 }} />
            <View style={{ height: 12 }} />
            <Skeleton style={{ height: 18, width: 140, borderRadius: 4 }} />
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton style={{ width: 160, height: 213, borderRadius: 12 }} />
              <Skeleton style={{ width: 160, height: 213, borderRadius: 12 }} />
              <Skeleton style={{ width: 160, height: 213, borderRadius: 12 }} />
            </View>
            <View style={{ height: 16 }} />
            <Skeleton style={{ height: 18, width: 120, borderRadius: 4 }} />
            <View style={{ height: 8 }} />
            <Skeleton style={{ height: 56, borderRadius: 12 }} />
            <View style={{ height: 8 }} />
            <Skeleton style={{ height: 56, borderRadius: 12 }} />
            <View style={{ height: 8 }} />
            <Skeleton style={{ height: 56, borderRadius: 12 }} />
          </View>
        )}
        {error && (
          <View style={{ paddingVertical: 8 }}>
            <View style={{ backgroundColor: '#462a2a', padding: 10, borderRadius: 8 }}>
              <Text style={{ color: '#ffd7d7' }}>
                {strings.errorLoading}: {String(error)}
              </Text>
            </View>
          </View>
        )}

        {!!state && (
          <ProceduresBlock
            care={state.care}
            regeneration={state.regeneration}
            maintenance={state.maintenance}
            onItemPress={(item) =>
              openModal(item.title, strings.modalDetailsTemplate(item.title, item.dateLabel, item.status))
            }
            onCareSeeMore={() => navigate('Care')}
            onRegenerationSeeMore={() => navigate('Regeneration')}
            onMaintenanceSeeMore={() => navigate('Maintenance')}
          />
        )}
      </ScrollView>

      <ModalCard
        visible={modalVisible}
        title={modalContent.title}
        content={modalContent.content}
        onClose={closeModal}
        primaryAction={{
          label: strings.modalPrimaryDownload,
          onPress: () => log.info('Download PDF'),
          icon: 'download',
        }}
      />

      <BottomNavbar
        items={[
          { key: 'home', label: strings.home, icon: 'home-outline' },
          {
            key: 'identity',
            label: strings.identity,
            customIcon: 'identity',
            onPress: () => navigate('Account'),
          },
          { key: 'care', label: strings.care, icon: 'molecule', onPress: () => navigate('Care') },
          {
            key: 'regen',
            label: strings.regeneration,
            icon: 'arrow-collapse-vertical',
            onPress: () => navigate('Regeneration'),
          },
          {
            key: 'maint',
            label: strings.maintenance,
            icon: 'account-cog-outline',
            onPress: () => navigate('Maintenance'),
          },
          {
            key: 'checks',
            label: strings.checkups,
            icon: 'clipboard-pulse-outline',
            onPress: () => navigate('Checkups'),
          },
          { key: 'trail', label: strings.trail, icon: 'map-marker-path', onPress: () => navigate('Trail') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#D96F6F' },
  scroll: { paddingHorizontal: layout.screenPadding, paddingBottom: 120 },
  cardBlock: { paddingBottom: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  downloadButton: {
    backgroundColor: colors.headerBackground,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

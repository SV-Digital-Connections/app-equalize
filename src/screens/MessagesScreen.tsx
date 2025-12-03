import React from 'react';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { View, StyleSheet, ScrollView, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import MessagesSection from '../components/MessagesSection';
import { useMessagesViewModel } from '../viewmodels/useMessagesViewModel';
import AppHeader from '../components/AppHeader';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import { strings } from '../app/strings';
import { loadUserData } from '../mock';

export default function MessagesScreen() {
  const { messages, unreadCount } = useMessagesViewModel();
  const { goBack, canGoBack, navigate } = useRouter();
  const userData = loadUserData();

  // Edge-swipe back (da esquerda para direita)
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_: GestureResponderEvent, s: PanResponderGestureState) => {
          // gesto lateral com início na borda esquerda e movimento horizontal > vertical
          const edgeStart = s.moveX <= 24; // 24px da borda
          const horizontal = Math.abs(s.dx) > Math.abs(s.dy) && s.dx > 30;
          return edgeStart && horizontal;
        },
        onPanResponderRelease: () => {
          if (canGoBack) goBack();
        },
      }),
    [canGoBack, goBack],
  );
  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <AppHeader
        greeting={userData.greeting}
        name={userData.name}
        unreadCount={userData.unreadCount}
        onPressMessages={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>{strings.messages}</Text>
        </View>
        {messages?.length ? (
          <MessagesSection messages={messages} />
        ) : (
          <Text style={styles.empty}>{strings.empty}</Text>
        )}
      </ScrollView>
      <BottomNavbar
        items={[
          { key: 'home', label: strings.home, icon: 'home-outline', onPress: () => navigate('Main') },
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 80 },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: layout.sectionTitleTopPadding + 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '700',
  },
  empty: { color: colors.textMuted, marginTop: 16, paddingHorizontal: 16 },
});

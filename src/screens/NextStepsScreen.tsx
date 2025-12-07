import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import AppHeader from '../components/AppHeader';
import Icon from '../design-system/Icon';
import RecipeCardCompact from '../components/RecipeCardCompact';
import type { Recipe } from '../domain/care/types';
import { loadNextSteps, loadUserData } from '../mock';

export default function NextStepsScreen() {
  const { navigate } = useRouter();
  const mockNextSteps = loadNextSteps() as Recipe[];
  const userData = loadUserData();

  const handleRecipePress = (recipe: Recipe) => {
    navigate('Care');
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
          <Icon name="calendar-month" size={24} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Próximos passos</Text>
        </View>

        <View style={styles.cardsSection}>
          {mockNextSteps.map((recipe) => (
            <RecipeCardCompact
              key={recipe.id}
              title={recipe.title}
              subtitle={recipe.date}
              status={recipe.status}
              onPress={() => handleRecipePress(recipe)}
            />
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
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '600',
  },
  cardsSection: {
    marginTop: 8,
    gap: 8,
  },
});

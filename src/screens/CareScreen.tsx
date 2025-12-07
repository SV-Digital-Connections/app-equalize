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
import { ModalCard } from '../components/ModalCard';
import RecipeCardExpanded from '../components/RecipeCardExpanded';
import RecipeCardCompact from '../components/RecipeCardCompact';
import type { Recipe } from '../domain/care/types';
import { loadCareData, loadUserData } from '../mock';

export default function Cuidados() {
  const { navigate } = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);

  const careData = loadCareData();
  const userData = loadUserData();

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const downloadPDF = () => {
    const { log } = require('../utils/log');
    log.info('Download PDF');
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
          <Icon name="molecule" size={24} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Cuidados</Text>
        </View>

        <Text style={styles.subtitle}>{careData.description}</Text>

        <Text style={styles.mainText}>{careData.mainText}</Text>

        <Text style={styles.routineTitle}>Rotina de cuidados</Text>

        <View style={styles.cardsSection}>
          {careData.recipes.map((recipe) =>
            recipe.expanded && recipe.details ? (
              <RecipeCardExpanded
                key={recipe.id}
                date={recipe.date}
                title={recipe.title}
                author={recipe.author}
                details={recipe.details}
                status={recipe.status}
                pdfFileName={recipe.pdfFileName}
                onDownloadPDF={downloadPDF}
                onStatusPress={() => openRecipeModal(recipe)}
              />
            ) : (
              <RecipeCardCompact
                key={recipe.id}
                title={recipe.title}
                subtitle={recipe.date}
                status={recipe.status}
                onPress={() => openRecipeModal(recipe)}
              />
            )
          )}
        </View>
      </ScrollView>

      <ModalCard
        visible={modalVisible}
        title={selectedRecipe?.title || 'Receita manipulados'}
        content={
          <>
            <Text style={styles.modalSubtitle}>{selectedRecipe?.author || ''}</Text>
            {selectedRecipe?.details?.map((detail, index) => (
              <View key={index}>
                <Text style={styles.modalText}>{detail.label}</Text>
                <Text style={styles.modalText}>{detail.content}</Text>
              </View>
            ))}
          </>
        }
        onClose={closeModal}
        primaryAction={{ label: selectedRecipe?.pdfFileName || 'Arquivo.pdf', onPress: downloadPDF, icon: 'download' }}
      />

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
  container: { flex: 1, backgroundColor: colors.background },
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
  routineSection: {
    marginTop: 32,
  },
  routineTitle: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardsSection: {
    marginTop: 8,
    gap: 8,
  },
  modalSubtitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});

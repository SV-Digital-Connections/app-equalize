import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from '../app/router/RouterProvider';
import AppHeader from '../components/AppHeader';
import Icon from '../design-system/Icon';
import { Divider, RoundedCard } from '../components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { loadUserData } from '../mock';
import { useNewsRepository } from '../providers/NewsRepositoryProvider';
import type { NewsItem } from '../domain/news/types';

export default function NewsScreen() {
  const { navigate, goBack } = useRouter();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = loadUserData();
  const newsRepo = useNewsRepository();

  useEffect(() => {
    loadNewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsRepo.getNewsList();
      setNewsItems(data);
    } catch (err) {
      setError('Falha ao carregar notícias');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardIndex: number) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  // Featured article - primeiro item do array
  const featuredArticle = newsItems[0];
  
  // Additional news cards - demais itens
  const additionalNews = newsItems.slice(1);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
      </View>
    );
  }

  if (error || !featuredArticle) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'Nenhuma notícia disponível'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        greeting={userData.greeting}
        name={userData.name}
        unreadCount={userData.unreadCount}
        onPressMessages={() => navigate('Messages')}
        onPressProfile={() => navigate('Account')}
        includeSpacer={false}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 140 }]}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Icon name="newspaper-variant-outline" size={24} color={colors.textPrimary} />
          <Text style={styles.sectionTitle}>Novidades</Text>
        </View>

        {/* Linha divisória branca */}
        <Divider style={{ backgroundColor: '#FFFFFF' }} />

        {/* Imagem com proporção maior */}
        <View style={styles.imageContainer}>
          <RoundedCard style={styles.newsCard}>
            <Image
              source={{ uri: featuredArticle.imageUrl }}
              resizeMode="cover"
              style={styles.newsImage}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            />
            <View style={styles.overlay}>
              <Text style={styles.newsTitle}>{featuredArticle.title}</Text>
              <Text style={styles.newsSubtitle}>{featuredArticle.subtitle}</Text>
            </View>
          </RoundedCard>
        </View>

        {/* Conteúdo da notícia */}
        <View style={styles.articleContent}>
          <Text style={styles.articleTitle}>{featuredArticle.title}</Text>
          <Text style={styles.articleDate}>{featuredArticle.date}</Text>

          {featuredArticle.content.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={styles.articleText}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Cards de notícias adicionais */}
        <View style={styles.newsCardsSection}>
          {additionalNews.map((newsItem, index) => (
            <View key={newsItem.id}>
              <TouchableOpacity onPress={() => toggleCard(index)} activeOpacity={0.8}>
                <RoundedCard style={styles.newsCard}>
                  <Image
                    source={{ uri: newsItem.imageUrl }}
                    style={styles.newsCardImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.newsCardGradient}
                  />
                  <View style={styles.newsCardOverlay}>
                    <Text style={styles.newsCardTitle}>{newsItem.title}</Text>
                    <Text style={styles.newsCardSubtitle}>{newsItem.subtitle}</Text>
                  </View>
                </RoundedCard>
              </TouchableOpacity>

              {expandedCard === index && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedTitle}>{newsItem.title}</Text>
                  <Text style={styles.expandedDate}>{newsItem.date}</Text>
                  <Text style={styles.expandedText}>{newsItem.content}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Placeholder content - removido para dar espaço ao artigo */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    padding: 20
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '600',
  },
  imageContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 220,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  overlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  newsTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  newsSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 18,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 40,
  },

  // Estilos do artigo
  articleContent: {
    marginTop: 24,
    paddingHorizontal: 4,
  },

  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  articleDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },

  articleText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },

  // Estilos dos cards de notícias
  newsCardsSection: {
    marginTop: 32,
    paddingHorizontal: 4,
    gap: 16,
  },

  newsCardImage: {
    width: '100%',
    height: 140,
  },

  newsCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 80,
  },

  newsCardOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },

  newsCardTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  newsCardSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },

  // Estilos do conteúdo expandido
  expandedContent: {
    backgroundColor: colors.surface,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.headerBackground,
  },

  expandedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  expandedDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },

  expandedText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

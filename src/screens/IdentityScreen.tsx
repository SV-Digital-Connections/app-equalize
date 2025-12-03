import React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, ViewStyle } from 'react-native';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';
import Icon from '../design-system/Icon';
import { layout } from '../theme/layout';
import { useRouter } from '../app/router/RouterProvider';
import BottomNavbar from '../components/BottomNavbar';
import AppHeader from '../components/AppHeader';
import { loadIdentityData, loadUserData } from '../mock';

export default function IdentityScreen() {
  const { goBack, navigate } = useRouter();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  // Load identity data from JSON
  const identityData = loadIdentityData();
  const userData = loadUserData();

  // Facial point positions (layout-specific, kept in component)
  const facialPointPositions: Record<
    string,
    { position: { top: number; left: string; marginLeft: number }; dotPos: { top: number; left: number } }
  > = {
    testa: {
      position: { top: 25, left: '50%', marginLeft: -21 },
      dotPos: { top: 15, left: 15 },
    },
    sobrancelha: {
      position: { top: 65, left: '30%', marginLeft: -21 },
      dotPos: { top: 15, left: 15 },
    },
    boca: {
      position: { top: 165, left: '50%', marginLeft: -21 },
      dotPos: { top: 15, left: 15 },
    },
    queixo: {
      position: { top: 225, left: '50%', marginLeft: -21 },
      dotPos: { top: 15, left: 15 },
    },
    pescoco: {
      position: { top: 305, left: '50%', marginLeft: -21 },
      dotPos: { top: 15, left: 15 },
    },
  };

  // Helper to get tooltip position based on point id
  const getTooltipPosition = (pointId: string) => {
    const positions: Record<string, { top: number; left: string; marginLeft: number }> = {
      testa: { top: 220, left: '50%', marginLeft: -75 },
      sobrancelha: { top: 250, left: '30%', marginLeft: -100 },
      boca: { top: 350, left: '50%', marginLeft: -75 },
      queixo: { top: 410, left: '50%', marginLeft: -75 },
      pescoco: { top: 490, left: '50%', marginLeft: -75 },
    };
    return positions[pointId] || { top: 0, left: '50%', marginLeft: 0 };
  };

  const showTooltip = (id: string) => {
    setActiveTooltip(id);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };
  return (
    <View style={styles.container}>
      <AppHeader
        greeting={userData.greeting}
        name={userData.name}
        unreadCount={userData.unreadCount}
        onPressMessages={() => navigate('Messages')}
        onPressProfile={() => navigate('Account')}
        includeSpacer={true}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 140 }]}>
        {/* Identity Section */}
        <View style={styles.identitySection}>
          <View style={styles.titleSection}>
            <Icon name="account-circle-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>Minha Identidade</Text>
          </View>

          <View style={styles.photoContainer}>
            <FlatList
              data={identityData.mainPhotos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.carouselContainer}
              decelerationRate="fast"
              onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const x = e.nativeEvent.contentOffset.x;
                const screenWidth = Dimensions.get('window').width;
                const newIndex = Math.round(x / screenWidth);
                setActiveImageIndex(newIndex);
              }}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  <View style={styles.photoFrame}>
                    <Image source={{ uri: item.uri }} style={styles.facePhoto} resizeMode="cover" />

                    {/* Overlay dots for facial mapping - Only first photo has points */}
                    {item.id === '1' &&
                      identityData.facialPoints.map((point) => {
                        const pointLayout = facialPointPositions[point.id];
                        if (!pointLayout) return null;
                        return (
                          <Pressable
                            key={point.id}
                            style={[styles.touchArea, pointLayout.position as unknown as ViewStyle]}
                            onPressIn={() => showTooltip(point.id)}
                            onPressOut={hideTooltip}
                          >
                            <View style={[styles.dot, pointLayout.dotPos]} />
                          </Pressable>
                        );
                      })}

                    {/* Date overlay at bottom of image */}
                    <View style={styles.dateOverlay}>
                      <Text style={styles.dateOverlayText}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Tooltips renderizados fora do container da imagem */}
          {identityData.facialPoints.map((point) => {
            if (activeTooltip === point.id && activeImageIndex === 0) {
              const tooltipPos = getTooltipPosition(point.id);
              return (
                <React.Fragment key={point.id}>
                  <View style={styles.tooltipOverlay} />
                  <View style={[styles.tooltip, tooltipPos as unknown as ViewStyle]}>
                    <Text style={styles.tooltipText}>{point.title}</Text>
                    <Text style={styles.tooltipSubtext}>{point.subtitle}</Text>
                  </View>
                </React.Fragment>
              );
            }
            return null;
          })}

          {/* Navigation dots */}
          <View style={styles.navigationDotsContainer}>
            <View style={styles.navigationDots}>
              {identityData.mainPhotos.map((_, index) => (
                <View
                  key={index}
                  style={[styles.navDot, activeImageIndex === index && styles.navDotActive]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Text Content Sections */}
        {identityData.questionsAndAnswers.map((qa) => (
          <View key={qa.id} style={styles.textSection}>
            <Text style={styles.questionTitle}>{qa.question}</Text>
            <Text style={styles.answerText}>{qa.answer}</Text>
          </View>
        ))}

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Fotos</Text>
          <View style={styles.photosContainer}>
            {identityData.photos.map((photo) => (
              <View key={photo.id} style={styles.photoItem}>
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.sidePhoto} resizeMode="cover" />
                  <View style={styles.captionOverlay}>
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 3D Section */}
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>3D</Text>
          <View style={[styles.photosContainer, { marginTop: 8 }]}>
            {identityData.photos3D.map((photo) => (
              <View key={photo.id} style={styles.photoItem}>
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.sidePhoto} resizeMode="cover" />
                  <View style={styles.captionOverlay}>
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.textSection}>
          <View style={styles.goalsSection}>
            <Text style={styles.goalsTitle}>{identityData.goalsAndObjectives.title}</Text>

            {identityData.goalsAndObjectives.items.map((goal) => (
              <View key={goal.id} style={styles.goalItem}>
                <Text style={styles.goalQuestion}>{goal.question}</Text>
                <Text style={styles.goalAnswer}>{goal.answer}</Text>
              </View>
            ))}
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 10, paddingHorizontal: layout.screenPadding },
  identitySection: {
    paddingVertical: 0,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: layout.sectionTitleFontSize,
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  carouselContainer: {
    paddingHorizontal: 0,
  },
  carouselItem: {
    width: Dimensions.get('window').width,
    alignItems: 'flex-start',
  },
  photoFrame: {
    position: 'relative',
    width: 320,
    height: 400,
    backgroundColor: colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  facePhoto: {
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
  },

  // Área de toque aumentada
  touchArea: {
    width: 42,
    height: 42,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dateOverlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  navigationDotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  navigationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
  },
  navDotActive: {
    backgroundColor: colors.headerBackground,
  },
  textSection: {
    paddingVertical: 20,
    marginBottom: 10,
  },
  questionTitle: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 24,
  },
  answerText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  photosSection: {
    paddingVertical: 20,
    marginBottom: 40,
  },
  photosTitle: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  photoItem: {
    flex: 1,
    alignItems: 'center',
  },
  photoWrapper: {
    position: 'relative',
    width: '100%',
  },
  sidePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  photoCaption: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  questionSection: {
    marginBottom: 24,
  },
  questionText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  goalsSection: {
    paddingTop: 10
  },
  goalsTitle: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalQuestion: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  goalAnswer: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  // Estilos do tooltip
  tooltipOverlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 5000,
    height: 5000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minWidth: 150,
    borderWidth: 2,
    borderColor: colors.headerBackground,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  tooltipSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
  },
});

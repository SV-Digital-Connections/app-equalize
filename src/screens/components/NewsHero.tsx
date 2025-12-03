import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SectionHeader from '../../components/SectionHeader';
import PromoBanner from '../../components/PromoBanner';
import MediaHero from '../../components/MediaHero';
import { colors } from '../../theme/colors';
import { strings } from '../../app/strings';

type Props = {
  onSeeMore: () => void;
  heroImageUri?: string;
  heroVideoUri?: string;
};

export default function NewsHero({ onSeeMore, heroImageUri, heroVideoUri }: Props) {
  const safeImage =
    heroImageUri ??
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60&auto=format&fit=crop';
  return (
    <View style={styles.container}>
      <SectionHeader
        title={strings.newsForYou}
        style={{ paddingHorizontal: 0 }}
        action={
          <Text accessibilityRole="button" style={styles.action} onPress={onSeeMore}>
            {strings.seeMore} ›
          </Text>
        }
      />
      <View style={{ marginTop: 12 }}>
        <PromoBanner onPress={onSeeMore} />
      </View>
      <View style={styles.heroWrapper}>
        <MediaHero uri={safeImage} videoUri={heroVideoUri} loop muted />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  action: { color: colors.textSecondary },
  heroWrapper: {
    paddingHorizontal: 0,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.headerBackground,
    borderRadius: 16,
  },
});

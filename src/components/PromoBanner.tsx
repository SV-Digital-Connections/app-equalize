import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { RoundedCard } from './Card';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onPress?: () => void;
};

export default function PromoBanner({ onPress }: Props) {
  const content = (
    <RoundedCard style={styles.card}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200&q=60&auto=format&fit=crop',
        }}
        resizeMode="cover"
        style={styles.image}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Chegou nova onda de calor, como proceder</Text>
        <Text style={styles.subtitle}>Confira aqui 10 dicas de cuidados com seus procedimentos</Text>
      </View>
    </RoundedCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.headerBackground,
  },
  image: { width: '100%', height: 140 },
  gradient: { position: 'absolute', left: 0, right: 0, top: 0, height: 80 },
  overlay: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  title: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  subtitle: { color: colors.textSecondary, marginTop: 4, opacity: 0.8 },
});

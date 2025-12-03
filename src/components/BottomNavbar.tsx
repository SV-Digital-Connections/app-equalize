import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import type { IconName } from '../design-system/Icon';
import Icon from '../design-system/Icon';
import { colors } from '../theme/colors';

// Componente de ícone personalizado para identidade
const IdentityIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={[styles.customIcon, { borderColor: color }]}>
    <View style={[styles.face, { borderColor: color }]}>
      {/* Olhos */}
      <View style={styles.eyes}>
        <View style={[styles.eye, { backgroundColor: color }]} />
        <View style={[styles.eye, { backgroundColor: color }]} />
      </View>
      {/* Sorriso */}
      <View style={[styles.smile, { borderColor: color }]} />
    </View>
    {/* Cabelo */}
    <View style={[styles.hair, { borderColor: color }]} />
    {/* Pontos decorativos */}
    <View style={styles.leftDots}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
    <View style={styles.rightDots}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  </View>
);

type NavItem = {
  key: string;
  label: string;
  icon?: IconName;
  imageSource?: ImageSourcePropType; // Para usar require() ou {uri: ''}
  customIcon?: 'identity'; // Para ícones customizados
  onPress?: () => void;
};

type Props = {
  items: NavItem[];
};

export default function BottomNavbar({ items }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {items.map((it) => (
          <TouchableRipple key={it.key} onPress={it.onPress} borderless style={styles.itemTouchable}>
            <View style={styles.item}>
              {it.customIcon === 'identity' ? (
                <IdentityIcon color={colors.textSecondary} />
              ) : it.imageSource ? (
                <Image source={it.imageSource} style={styles.iconImage} />
              ) : (
                <Icon name={it.icon!} size={36} color={colors.textSecondary} />
              )}
              <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit allowFontScaling={false}>
                {it.label}
              </Text>
            </View>
          </TouchableRipple>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    paddingBottom: Platform.select({ ios: 8, android: 4, default: 4 }),
    paddingTop: 4,
    backgroundColor: 'transparent',
  },
  inner: {
    backgroundColor: colors.navBackground,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  itemTouchable: { flex: 1, borderRadius: 12 },
  item: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: {
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 8,
    lineHeight: 10,
    maxWidth: 70,
    textAlign: 'center',
    fontWeight: '500',
  },
  iconImage: { width: 36, height: 36, tintColor: colors.textSecondary },
  // Estilos para o ícone customizado de identidade
  customIcon: {
    width: 36,
    height: 36,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    borderWidth: 1.8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyes: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 1.5,
  },
  eye: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 2,
  },
  smile: {
    width: 9,
    height: 4.5,
    borderBottomWidth: 1.5,
    borderBottomLeftRadius: 4.5,
    borderBottomRightRadius: 4.5,
  },
  hair: {
    position: 'absolute',
    top: -3,
    width: 24,
    height: 12,
    borderTopWidth: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  leftDots: {
    position: 'absolute',
    left: 3,
    top: 9,
  },
  rightDots: {
    position: 'absolute',
    right: 3,
    top: 9,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    marginVertical: 1.5,
  },
});

import React from 'react';
import type { ViewProps } from 'react-native';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';

type Props = ViewProps & {
  uri: string;
  dateLabel?: string;
  onPress?: () => void;
};

export default function ResultCard({ uri, dateLabel, style, onPress, ...rest }: Props) {
  if (onPress) {
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View style={styles.imageWrapper}>
          <View style={styles.container}>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          </View>
        </View>
        {!!dateLabel && <Text style={styles.date}>{dateLabel}</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style} {...rest}>
      <View style={styles.imageWrapper}>
        <View style={styles.container}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        </View>
      </View>
      {!!dateLabel && <Text style={styles.date}>{dateLabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.headerBackground,
    overflow: 'hidden',
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  image: { width: '100%', height: '100%' },
  date: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
});

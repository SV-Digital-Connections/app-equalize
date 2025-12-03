import React from 'react';
import type { ViewProps } from 'react-native';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { RightChevron } from './IconBadge';

type Props = ViewProps & {
  left?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  right?: React.ReactNode;
};

export default function ListRow({ left, title, subtitle, actionLabel, right, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>{left}</View>
      <View style={styles.center}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {right ? right : actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : <RightChevron />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 8, paddingVertical: 8 },
  left: { width: 40, alignItems: 'center' },
  center: { flex: 1, marginLeft: -30 },
  title: { color: colors.textPrimary, fontWeight: '700', fontSize: 20, letterSpacing: 0.1 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  action: { color: colors.textMuted },
});

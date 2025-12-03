import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: object;
  dense?: boolean;
};

export default function SectionHeader({ title, icon, action, dense, style }: Props) {
  return (
    <View style={[styles.container, dense && styles.containerDense, style]}>
      <View style={styles.left}>
        {icon}
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  containerDense: { paddingHorizontal: spacing.md },
  left: { flexDirection: 'row', alignItems: 'center' },
  title: { color: colors.textSecondary, marginLeft: spacing.sm, fontWeight: '700', letterSpacing: 0.3 },
});

import React from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { RoundedCard, Divider } from './Card';
import SectionHeader from './SectionHeader';
import ListRow from './ListRow';
import Icon from '../design-system/Icon';

type Props = ViewProps & {
  title?: string;
  dateLabel?: string;
  name?: string;
  onMeasured?: (h: number) => void;
  hideIcon?: boolean;
  hideMoreInfo?: boolean;
  customLayout?: boolean;
  onPress?: () => void;
};

export default function NextProcedureSection({
  title = 'Próximos passos:',
  dateLabel = '25 de agosto',
  name = 'Fio Silhouett',
  onMeasured,
  style,
  hideIcon = false,
  hideMoreInfo = false,
  customLayout = false,
  onPress,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
      {...rest}
    >
      <View style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        <RoundedCard
          style={styles.card}
          onLayout={(e: LayoutChangeEvent) => onMeasured?.(e.nativeEvent.layout.height)}
          accessibilityRole="button"
          accessibilityLabel="Próximos passos"
        >
          <View style={styles.newLayoutContainer}>
            <View style={styles.leftContent}>
              <Icon name="calendar-month" size={28} color={colors.textPrimary} />
              <View style={styles.textContent}>
                <Text style={styles.dateText}>{dateLabel}</Text>
                <Text style={styles.nameText}>{name}</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.moreInfoText}>Mais informações</Text>
              <Icon name="chevron-right" size={24} color={colors.textMuted} />
            </View>
          </View>
        </RoundedCard>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
    position: 'relative',
  },
  container: {
    backgroundColor: 'transparent',
    paddingTop: 8,
  },
  titleText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 0,
    marginLeft: 16,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    overflow: 'visible',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  newLayoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textContent: {
    flex: 1,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  nameText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreInfoText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { RoundedCard } from './Card';
import Icon from '../design-system/Icon';
import ListRow from './ListRow';

export interface RecipeCardCompactProps {
  title: string;
  subtitle: string;
  status: 'completed' | 'pending' | 'cancelled';
  onPress?: () => void;
}

export default function RecipeCardCompact({ title, subtitle, status, onPress }: RecipeCardCompactProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'cancelled':
      case 'pending':
        return 'close-circle';
      default:
        return 'check-circle';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <RoundedCard style={styles.recipeCard}>
        <ListRow
          title={title}
          subtitle={subtitle}
          right={
            <View style={styles.iconContainer}>
              <Icon name={getStatusIcon()} size={36} color={colors.textSecondary} />
            </View>
          }
        />
      </RoundedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    borderWidth: 1,
    borderColor: colors.headerBackground,
    borderRadius: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

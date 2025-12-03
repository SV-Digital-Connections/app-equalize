import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../theme/colors';
import { RoundedCard } from './Card';
import Icon from '../design-system/Icon';

export interface RecipeDetail {
  label: string;
  content: string;
}

export interface RecipeCardExpandedProps {
  date: string;
  title: string;
  author: string;
  details: RecipeDetail[];
  status: 'completed' | 'pending' | 'cancelled';
  pdfFileName?: string;
  onDownloadPDF?: () => void;
  onStatusPress?: () => void;
}

export default function RecipeCardExpanded({
  date,
  title,
  author,
  details,
  status,
  pdfFileName = 'Arquivo.pdf',
  onDownloadPDF,
  onStatusPress,
}: RecipeCardExpandedProps) {
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
    <RoundedCard style={styles.expandedRecipeCard}>
      <View style={styles.expandedCardHeader}>
        <View>
          <Text style={styles.expandedCardSubtitle}>{date}</Text>
          <Text style={styles.expandedCardTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onStatusPress}>
          <Icon name={getStatusIcon()} size={36} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.recipeAuthor}>{author}</Text>

      {details.map((detail, index) => (
        <View key={index}>
          <Text style={styles.recipeLabel}>{detail.label}</Text>
          <Text style={styles.recipeText}>{detail.content}</Text>
        </View>
      ))}

      {onDownloadPDF && (
        <TouchableOpacity style={styles.downloadButton} onPress={onDownloadPDF}>
          <Text style={styles.downloadButtonText}>{pdfFileName}</Text>
          <Icon name="download" size={24} color={colors.buttonText} />
        </TouchableOpacity>
      )}
    </RoundedCard>
  );
}

const styles = StyleSheet.create({
  expandedRecipeCard: {
    borderWidth: 1,
    borderColor: colors.headerBackground,
    borderRadius: 16,
    padding: 16,
  },
  expandedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  expandedCardSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  expandedCardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  recipeAuthor: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  recipeLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  recipeText: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  downloadButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
});

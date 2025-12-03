import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import Icon from '../design-system/Icon';
import type { MessageItem } from '../domain/home/types';
import { layout } from '../theme/layout';

export type MessageRowProps = {
  message: MessageItem;
};

export default function MessageRow({ message }: MessageRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUnread = !message.read;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getExpandedContent = () => {
    if (message.title === 'Chegou nova onda de calor, como proceder') {
      return 'As altas temperaturas registradas neste verão têm causado impactos diretos na saúde da pele. O calor excessivo aliado à radiação solar intensa, especialmente entre 10h e 16h, pode causar queimaduras solares e até acentuar manchas, especialmente em peles sensíveis. Por isso, o cuidado com a pele se torna ainda mais essencial nesta época do ano.\n\nTratamentos como limpeza de pele profunda, hidratação com ativos calmantes e máscaras antioxidantes são altamente recomendados. Além disso, é fundamental reforçar o uso diário de protetor solar, mesmo em ambientes internos. A proteção é sempre mais eficaz do que o tratamento, que só repara!';
    }
    return 'Conteúdo expandido adicional da mensagem...';
  };

  return (
    <TouchableOpacity onPress={toggleExpansion} activeOpacity={0.8}>
      <View style={styles.dividerTop} />
      <View style={styles.row}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, isUnread ? styles.titleUnread : styles.titleRead]}
          >
            {message.title}
          </Text>
          <View style={styles.rightIcons}>
            {isUnread && <View style={styles.unreadDot} />}
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </View>
        </View>
        <Text style={[styles.date, isUnread && styles.dateUnread]}>{message.dateLabel}</Text>
        <Text
          numberOfLines={isExpanded ? undefined : 2}
          ellipsizeMode="tail"
          style={[styles.preview, isUnread ? styles.previewUnread : styles.previewRead]}
        >
          {message.preview}
        </Text>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedText}>{getExpandedContent()}</Text>
          </View>
        )}

        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dividerTop: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  row: {
    paddingVertical: 12,
    backgroundColor: colors.background,
    marginBottom: 1,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 32,
    justifyContent: 'flex-end',
  },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textPrimary },
  title: { fontSize: 16, letterSpacing: 0.15, flex: 1 },
  titleUnread: { color: colors.textPrimary, fontWeight: '700' },
  titleRead: { color: colors.textMuted, fontWeight: '600' },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 2, opacity: 0.7 },
  dateUnread: { color: colors.textMuted },
  preview: { marginTop: 6, fontSize: 14, lineHeight: 20 },
  previewUnread: { color: colors.textPrimary, opacity: 0.95 },
  previewRead: { color: colors.textMuted, opacity: 0.7 },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.textMuted,
    opacity: 0.5,
  },
  expandedText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    textAlign: 'justify',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginTop: 10, opacity: 0.2 },
});

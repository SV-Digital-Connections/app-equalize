import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SectionHeader from './SectionHeader';
import { Divider } from './Card';
import { layout } from '../theme/layout';
import MessageRow from './MessageRow';
import Icon from '../design-system/Icon';
import { colors } from '../theme/colors';
import type { MessageItem } from '../domain/home/types';

export type MessagesSectionProps = {
  messages: MessageItem[];
};

export default function MessagesSection({ messages }: MessagesSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {messages.map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 4, paddingHorizontal: 20 },
  list: { gap: 0 },
});

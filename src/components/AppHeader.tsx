// ...existing code...
import React, { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Badge, IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';
import Icon from '../design-system/Icon';
import { layout } from '../theme/layout';
import { strings } from '../app/strings';

// ...existing code...

export type AppHeaderProps = {
  greeting: string;
  name: string;
  unreadCount?: number;
  onPressMessages: () => void;
  onPressShare?: () => void;
  onPressProfile?: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  showBack?: boolean;
  onPressBack?: () => void;
  includeSpacer?: boolean; // rendera um espaçador medido logo abaixo do header
};

export default function AppHeader({
  greeting,
  name,
  unreadCount = 0,
  onPressMessages,
  onPressProfile,
  onPressShare,
  onLayout,
  showBack,
  onPressBack,
  includeSpacer = false,
}: AppHeaderProps) {
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  function handleLayout(e: LayoutChangeEvent) {
    const h = e.nativeEvent.layout.height;
    setMeasuredHeight(h);
    if (onLayout) onLayout(e);
  }

  return (
    <>
      <SafeAreaView style={styles.header} onLayout={handleLayout}>
        <View style={styles.titleWrapper}>
          {showBack && (
            <IconButton
              accessibilityLabel={strings.a11yBack}
              icon={(props) => <Icon name="chevron-left" color={props.color} size={28} />}
              iconColor={colors.textSecondary}
              size={28}
              onPress={onPressBack}
            />
          )}
          <View style={styles.titleTextWrapper}>
            <Text style={styles.hello}>{greeting}</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {/* share button */}
          <IconButton
            accessibilityLabel={strings.a11yShare}
            icon={(props) => <Icon name="share-variant" color={props.color} size={28} />}
            iconColor={colors.textSecondary}
            size={28}
            style={{ marginHorizontal: 1 }}
            onPress={onPressShare}
          />
          <View style={{ position: 'relative' }}>
            <IconButton
              accessibilityLabel={strings.a11yMessages}
              icon={(props) => <Icon name="email-outline" color={props.color} size={28} />}
              iconColor={colors.textSecondary}
              size={28}
              style={{ marginHorizontal: 1 }}
              onPress={onPressMessages}
            />
            {!!unreadCount && (
              <Badge style={styles.badge} size={16}>
                {unreadCount}
              </Badge>
            )}
          </View>
          <IconButton
            accessibilityLabel={strings.a11yProfile}
            icon={(props) => <Icon name="account-circle-outline" color={props.color} size={28} />}
            iconColor={colors.textSecondary}
            size={28}
            style={{ marginHorizontal: 1 }}
            onPress={onPressProfile}
          />
        </View>
      </SafeAreaView>

      {/* Espaçador dinâmico que empurra o conteúdo para ficar abaixo do cabeçalho */}
      {includeSpacer && <View style={{ height: measuredHeight || DEFAULT_HEADER_SPACER_HEIGHT }} />}
    </>
  );
}

// ...existing code...

const styles = StyleSheet.create({
  header: {
    // tornar o header mais compacto para as proporções desejadas
    // reduzir o padding superior para diminuir a altura total
    paddingTop: 12,
    paddingLeft: 20,
    // puxar os ícones um pouco mais para a direita reduzindo o paddingRight
    paddingRight: Math.max(8, layout.floatingHorizontal - 6),
    // reduzir o espaçamento inferior para aproximar o texto da borda inferior
    paddingBottom: 12,
    backgroundColor: colors.headerBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    // tornar o header absoluto para garantir que ele fique acima do restante
    // e permitir que um espaçador empurre o conteúdo abaixo dele
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1000,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  hello: { color: colors.textSecondary, fontSize: 16, fontWeight: '700', opacity: 0.95, marginBottom: 2 },
  name: { color: colors.textSecondary, fontSize: 22, fontWeight: '700', letterSpacing: 0.2, marginTop: 0 },
  titleWrapper: { flexDirection: 'column', justifyContent: 'center' },
  titleTextWrapper: { marginLeft: 0 },
  // move the action icons down so they align with the second line ("Monica")
  headerActions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  badge: { position: 'absolute', top: 8, right: 2, backgroundColor: '#D96F6F' },
});

// ...existing code...

export const DEFAULT_HEADER_SPACER_HEIGHT = 72; // fallback aproximado para a altura visual do header (mais compacto)

export const HeaderSpacer = ({ height }: { height?: number }) => {
  return <View style={{ height: height ?? DEFAULT_HEADER_SPACER_HEIGHT }} />;
};
// ...existing code...

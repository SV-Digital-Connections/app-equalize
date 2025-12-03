import React from 'react';
import { View } from 'react-native';
import NextProcedureSection from '../../components/NextProcedureSection';
import { layout } from '../../theme/layout';

type Props = {
  headerHeight: number;
  dateLabel?: string;
  name?: string;
  onMeasured?: (h: number) => void;
  onPress?: () => void;
  scrollY?: number;
};

export default function NextProcedureFloat({ headerHeight, dateLabel, name, onMeasured, onPress, scrollY = 0 }: Props) {
  const floatTop = React.useMemo(() => headerHeight, [headerHeight]);
  const backgroundOpacity = React.useMemo(() => {
    const threshold = 50;
    const maxOpacity = 0.85;
    if (scrollY <= threshold) return 0;
    const opacity = Math.min((scrollY - threshold) / 200, maxOpacity);
    return opacity;
  }, [scrollY]);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: floatTop,
        borderRadius: layout.floatingCardRadius,
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
        borderWidth: 0,
        overflow: 'visible',
        paddingBottom: 0,
        marginBottom: 0,
        zIndex: 20,
      }}
      onLayout={(e) => onMeasured?.(e.nativeEvent.layout.height)}
    >
      <NextProcedureSection dateLabel={dateLabel} name={name} onPress={onPress} />
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import ProcedureSection from '../../components/ProcedureSection';
import type { ProcedureItem } from '../../domain/home/types';
import { strings } from '../../app/strings';

type Props = {
  care: ProcedureItem[];
  regeneration: ProcedureItem[];
  maintenance: ProcedureItem[];
  onItemPress: (item: ProcedureItem) => void;
  onCareSeeMore?: () => void;
  onRegenerationSeeMore?: () => void;
  onMaintenanceSeeMore?: () => void;
};

export default function ProceduresBlock({ care, regeneration, maintenance, onItemPress, onCareSeeMore, onRegenerationSeeMore, onMaintenanceSeeMore }: Props) {
  return (
    <View style={{ marginTop: 24 }}>
      <ProcedureSection title={strings.care} iconName="molecule" items={care} onItemPress={onItemPress} onPressSeeAll={onCareSeeMore} />
      <ProcedureSection
        title={strings.regeneration}
        iconName="arrow-collapse-vertical"
        items={regeneration}
        onItemPress={onItemPress}
        onPressSeeAll={onRegenerationSeeMore}
      />
      <ProcedureSection
        title={strings.maintenance}
        iconName="account-cog-outline"
        items={maintenance}
        onItemPress={onItemPress}
        onPressSeeAll={onMaintenanceSeeMore}
      />
    </View>
  );
}

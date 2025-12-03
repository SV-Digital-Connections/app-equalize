import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { paperTheme } from '../theme/paperTheme';
import { AuthProvider } from '../providers/AuthProvider';
import { HomeRepositoryProvider } from '../providers/HomeRepositoryProvider';
import { NewsRepositoryProvider } from '../providers/NewsRepositoryProvider';
import { UseCasesProvider } from '../providers/UseCasesProvider';
import { GetHomeDataUseCase } from '../application/usecases/GetHomeData';
import { buildHomeRepositoryFromConfig } from '../infra/home/HomeRepositoryFactory';
import { buildNewsRepositoryFromConfig } from '../infra/news/NewsRepositoryFactory';
import { config } from './config';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const repo = React.useMemo(() => buildHomeRepositoryFromConfig(config), []);
  const newsRepo = React.useMemo(() => buildNewsRepositoryFromConfig(config), []);
  const useCases = React.useMemo(() => ({ getHomeData: new GetHomeDataUseCase(repo) }), [repo]);
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <HomeRepositoryProvider repo={repo}>
          <NewsRepositoryProvider repo={newsRepo}>
            <UseCasesProvider value={useCases}>{children}</UseCasesProvider>
          </NewsRepositoryProvider>
        </HomeRepositoryProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

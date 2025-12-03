import React, { createContext, useContext, useMemo } from 'react';
import type { NewsRepository } from '../domain/news/types';

const Ctx = createContext<NewsRepository | undefined>(undefined);

export function useNewsRepository(): NewsRepository {
  const value = useContext(Ctx);
  if (!value) throw new Error('useNewsRepository must be used within NewsRepositoryProvider');
  return value;
}

export function NewsRepositoryProvider({
  repo,
  children,
}: {
  repo: NewsRepository;
  children: React.ReactNode;
}) {
  const value = useMemo(() => repo, [repo]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

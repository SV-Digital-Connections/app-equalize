# Mock Data Structure

Esta pasta contém os dados mockados do aplicativo organizados em arquivos JSON separados por domínio.

## Objetivo

Facilitar a transição gradual de dados mockados para integração real com a API, mantendo os mocks em arquivos JSON estruturados ao invés de valores hard-coded no código.

## Estrutura de Arquivos

### 📄 `home.json`
Dados da home (procedimento próximo e contador de mensagens não lidas)
```json
{
  "upcoming": { "dateLabel": "...", "name": "..." },
  "unreadCount": 3
}
```

### 📄 `news.json`
Lista de notícias/novidades com conteúdo completo
```json
[
  {
    "id": "1",
    "title": "...",
    "subtitle": "...",
    "imageUrl": "...",
    "date": "...",
    "content": "..."
  }
]
```

### 📄 `results.json`
Galeria de fotos de resultados
```json
[
  {
    "id": "1",
    "imageUrl": "...",
    "dateLabel": "..."
  }
]
```

### 📄 `messages.json`
Lista de mensagens do usuário
```json
[
  {
    "id": "1",
    "title": "...",
    "preview": "...",
    "dateLabel": "...",
    "read": false
  }
]
```

### 📄 `care.json`
Dados da seção de Cuidados (receitas e procedimentos)
```json
{
  "description": "...",
  "mainText": "...",
  "recipes": [...],
  "procedures": [...]
}
```

### 📄 `regeneration.json`
Lista de procedimentos de Regeneração
```json
[
  {
    "id": "1",
    "dateLabel": "...",
    "title": "...",
    "status": "scheduled"
  }
]
```

### 📄 `maintenance.json`
Lista de procedimentos de Manutenção
```json
[
  {
    "id": "1",
    "dateLabel": "...",
    "title": "...",
    "status": "scheduled"
  }
]
```

## Como Usar

### Importar dados mockados

```typescript
import {
  loadAllMockData,
  loadHomeData,
  loadNews,
  loadNewsById,
  loadResults,
  loadMessages,
  loadMessageById,
  loadCareData,
  loadCareProcedures,
  loadRegenerationProcedures,
  loadMaintenanceProcedures,
} from '../mock';

// Carregar todos os dados
const allData = loadAllMockData();

// Carregar dados específicos
const news = loadNews();
const results = loadResults();
const messages = loadMessages();
```

### MockHomeRepository

O `MockHomeRepository` já está configurado para carregar dados desses arquivos JSON:

```typescript
// src/infra/home/MockHomeRepository.ts
export class MockHomeRepository implements HomeRepository {
  async getHomeData(): Promise<HomeData> {
    await new Promise((r) => setTimeout(r, 50));
    return loadAllMockData();
  }
}
```

## Transição para API Real

### Passo 1: Mocks em JSON (✅ Atual)
Dados mockados em arquivos JSON separados, fáceis de editar e manter.

### Passo 2: Implementar Services
Criar services que fazem requisições HTTP:
```typescript
// src/services/newsService.ts
export async function getNews() {
  const client = getHttpClient();
  const response = await client.get('/news');
  return response.data;
}
```

### Passo 3: Atualizar RemoteRepository
```typescript
// src/infra/home/RemoteHomeRepository.ts
export class RemoteHomeRepository implements HomeRepository {
  async getHomeData(): Promise<HomeData> {
    // Chama os services reais
    const [upcoming, news, results, messages] = await Promise.all([
      getUpcoming(),
      getNews(),
      getResults(),
      getMessages(),
    ]);
    
    return { upcoming, news, results, messages, ... };
  }
}
```

### Passo 4: Alternar via Config
```typescript
// src/app/config.ts
export const config = {
  repoKind: 'remote', // Mudar de 'mock' para 'remote'
  apiBaseUrl: 'https://api.equalize.com',
};
```

## Editando os Mocks

Para adicionar ou editar dados mockados:

1. Abra o arquivo JSON correspondente em `src/mock/`
2. Edite os dados seguindo a estrutura existente
3. Salve o arquivo
4. O app recarregará automaticamente com os novos dados

## Validação

Os tipos TypeScript garantem que os dados JSON estão corretos:
- Se adicionar campos novos, atualize os types em `src/domain/*/types.ts`
- O TypeScript alertará se houver incompatibilidade

## Benefícios

✅ **Fácil manutenção**: Editar JSON é mais simples que editar código  
✅ **Separação de responsabilidades**: Dados separados da lógica  
✅ **Transição gradual**: Trocar mock por API endpoint por endpoint  
✅ **Colaboração**: Não desenvolvedores podem editar JSON  
✅ **Versionamento**: Fácil ver mudanças nos dados via Git  
✅ **Teste**: Pode criar múltiplos cenários de teste

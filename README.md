# My App (Expo + React Native)

A production-grade Expo app with a modular design system, Clean Architecture (MVVM + Use Cases), and resilient data access (Timeout, Retry, Circuit Breaker with mock fallback). This README covers environment setup and run instructions plus concise guides on Clean Code, SOLID, and GoF patterns used here.

## Prerequisites

- Node.js LTS (v18+ recommended)
- pnpm, npm, or yarn (examples below use npm)
- Expo CLI (installed automatically via `npx`)
- Android Studio (Android emulator) and/or Xcode (iOS Simulator, macOS only)

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm start
   ```
3. Run the app
   - Android: press `a` in the Expo CLI or run `npm run android`
   - iOS (macOS): press `i` in the Expo CLI or run `npm run ios`
   - Web: press `w` or run `npm run web`

## Project layout

- `App.tsx` — App entry; mounts providers and the router.
- `index.ts` — Registers the app with Expo.
- `src/app` — Composition root (providers, router).
- `src/application` — Use cases (application services) and contracts.
- `src/domain` — Domain models and types.
- `src/infra` — Infrastructure: repositories, resilience decorators, failover.
- `src/viewmodels` — MVVM view-model hooks that orchestrate use cases.
- `src/components` — Reusable UI components (design system + sections).
- `src/screens` — Screen containers that compose components.
- `src/theme` — Theme tokens: colors, spacing, typography, elevation, layout.

## Environment configuration

- TypeScript: strict mode enabled via `tsconfig.json`.
- Expo SDK: 53.x
- React Native Paper (MD3 theme) is integrated and themed via `src/theme/paperTheme.ts`.
- Layout animations opt-in is enabled in `src/utils/animations.ts` and wired in `App.tsx`.

### App Center Configuration

This project uses Microsoft App Center for analytics and crash reporting.

#### Setup Steps

1. **Get App Center App Secrets:**
   - Sign in to [App Center](https://appcenter.ms)
   - Create or select your app for iOS and Android
   - Navigate to Settings and copy each App Secret

2. **Configure Secrets:**
   - Open `appcenter-config.json` at project root
   - Replace placeholder values with your actual App Secrets:
     ```json
     {
       "app_secret": {
         "ios": "your-ios-app-secret-here",
         "android": "your-android-app-secret-here"
       }
     }
     ```

3. **Update Service Configuration:**
   - Open `src/services/appCenter.ts`
   - Update `APP_CENTER_CONFIG` with your App Secrets

#### Usage

App Center is automatically initialized on app startup. Use the provided functions to track events and errors:

```typescript
import { trackEvent, trackError } from './src/services/appCenter';

// Track custom events
trackEvent('user_login', { method: 'email' });
trackEvent('screen_view', { screen: 'Home' });

// Track errors
try {
  // your code
} catch (error) {
  trackError(error as Error, { context: 'user_action' });
}
```

#### Privacy Controls

Users can opt-in/opt-out of analytics:

```typescript
import { setAnalyticsEnabled, isAnalyticsEnabled } from './src/services/appCenter';

// Check status
const enabled = await isAnalyticsEnabled();

// Toggle analytics
await setAnalyticsEnabled(false);
```

**Note:** If App Secrets are not configured, App Center will skip initialization gracefully.

## Running with device/simulator

- Android: Ensure Android emulator is running or connect a device with USB debugging.
- iOS: Use Xcode Simulator (macOS) or connect a device.
- Expo Go: You can scan the QR code in the Expo CLI to run on your phone.

## Testing (lightweight)

This repo includes a small dev test scaffold (`src/devtests/usecases.spec.ts`). You can adapt it to your preferred framework (Jest, Vitest). For now, run the TypeScript compiler as a sanity check:

```bash
npx tsc --noEmit
```

## Clean Code principles in this repo

- Small, focused modules: UI components do one thing; view models orchestrate state; use cases handle app logic.
- Meaningful names: files and symbols communicate intent (e.g., `GetHomeData`, `HomeRepositoryFactory`).
- Separation of concerns: domain, application, infra, and presentation layers are isolated.
- Avoid magic numbers/strings: design tokens (`src/theme`) centralize values.
- Early returns and guard clauses: reduce nesting, clarify flow.
- Immutability where possible: avoid side effects within pure functions.
- Error handling at boundaries: infra layer decorates repositories with resilience.

## SOLID principles in practice

- Single Responsibility: Components like `MessagesSection` only render; `useHomeViewModel` coordinates state; repositories fetch data.
- Open/Closed: Add new repository strategies or UI sections without modifying existing code paths.
- Liskov Substitution: All repositories implement the same interface (`src/domain/home/types.ts`).
- Interface Segregation: Narrow contracts for use cases and repositories; UI consumes view-model outputs, not infra types.
- Dependency Inversion: High-level modules depend on abstractions (factories/providers supply implementations).

## Design patterns used

- Repository: Abstracts data source (remote/mock) behind a domain-friendly interface.
- Factory: `HomeRepositoryFactory` builds a decorated repository (timeout, retry, breaker).
- Decorator: `infra/resilience/*Decorator.ts` add cross-cutting concerns without changing core logic.
- Composite / Strategy: `FailoverCompositeRepository` selects/fails over between sources based on a simple strategy.
- Provider (DI): React Context providers compose dependencies at the app boundary (`AppProviders`).
- MVVM: View models expose state to the UI; screens subscribe and render.
- Adapter (light): Mapping network/domain shapes where needed in the infra layer.

## Gang of Four (GoF) patterns overview

- Creational
  - Factory Method / Abstract Factory: Centralized creation of repositories and their decorators.
  - Builder (conceptually in UI): Layered component props compose complex UI without large constructors.
- Structural
  - Decorator: Wrap repositories with retry/timeout/circuit breaker.
  - Composite: Combine multiple repositories and choose among them.
  - Adapter: Translate remote payloads to domain types.
- Behavioral
  - Strategy: Repository selection policy for failover.
  - Observer: React state/subscription model (view models -> components) acts like observer.
  - Command (light): Use cases encapsulate an action with inputs/outputs.

## Use case contract example

`src/application/usecases/GetHomeData.ts`

- Input: none (the view model triggers it for the Home screen)
- Output: `{ header, nextProcedure, sections, messages }` (domain-shaped data)
- Errors: surfaced as typed errors; infra layer retries/fallbacks before propagating.

## Troubleshooting

- Metro cache issues: clear with `expo start -c`.
- Types out of date: run `npx tsc --noEmit` to surface type errors quickly.
- Android emulator not found: open Android Studio > Device Manager and start a virtual device.
- iOS simulator issues: `xcode-select --install` and ensure Command Line Tools are set.

## Scripts

- `npm start` — Start Expo dev server.
- `npm run android` — Launch on Android.
- `npm run ios` — Launch on iOS (macOS only).
- `npm run web` — Launch web target.

## License

This project is for internal/demo purposes. Add your license here if needed.

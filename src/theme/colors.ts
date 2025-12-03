// Centralized color palette extracted from the provided mock image
// Naming favors usage contexts to keep it clear across the app

export const colors = {
  // App surfaces
  background: '#1C1818', // dark charcoal/brownish
  surface: '#231F20',
  surfaceAlt: '#2B2728',

  // Text
  textPrimary: '#EDEDED',
  textSecondary: '#B7E2DA',
  textMuted: '#B9B9B9',
  placeholder: '#6F6E6E',

  // Brand
  brandSoft: '#A5C1BB', // “jornada” text
  brandGradientStart: '#A5C1BB', // gradient for EQUALIZE
  brandGradientEnd: '#C7CBC6',

  // Inputs & buttons
  inputBackground: '#FFFFFF',
  inputText: '#1C1818',
  buttonBackground: '#4A4E39', // olive-like button from mock
  buttonText: '#F0F1ED',

  // Main header and accents
  headerBackground: '#6B6F52',
  divider: '#3A3A3A',
  cardOutline: '#343233',

  // Bottom navigation bar
  navBackground: '#0F3F34',
  navText: '#DDE7E2',
} as const;

export type AppColors = typeof colors;

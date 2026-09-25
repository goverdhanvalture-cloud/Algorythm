// Semantic visualization state colors. Each state pairs a color with a distinct
// label/icon in the components so meaning never relies on color alone.
export const STATE_COLORS = {
  light: {
    neutral:    { bg: '#E2ECEB', border: '#B0C4C1', text: '#0F2926' },
    active:     { bg: '#0D9488', border: '#0F766E', text: '#FFFFFF' },
    comparing:  { bg: '#D97706', border: '#B45309', text: '#FFFFFF' },
    swapping:   { bg: '#DC2626', border: '#B91C1C', text: '#FFFFFF' },
    selected:   { bg: '#0284C7', border: '#0369A1', text: '#FFFFFF' },
    visited:    { bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF' },
    found:      { bg: '#16A34A', border: '#15803D', text: '#FFFFFF' },
    sorted:     { bg: '#059669', border: '#047857', text: '#FFFFFF' },
    error:      { bg: '#E11D48', border: '#BE123C', text: '#FFFFFF' },
    eliminated: { bg: '#EAEFEF', border: '#D5E0DF', text: '#A0B0AD' },
  },
  dark: {
    neutral:    { bg: '#142825', border: '#1E3B37', text: '#E6F4F1' },
    active:     { bg: '#14B8A6', border: '#2DD4BF', text: '#081312' },
    comparing:  { bg: '#F59E0B', border: '#FBBF24', text: '#081312' },
    swapping:   { bg: '#EF4444', border: '#F87171', text: '#FFFFFF' },
    selected:   { bg: '#38BDF8', border: '#7DD3FC', text: '#081312' },
    visited:    { bg: '#818CF8', border: '#A5B4FC', text: '#081312' },
    found:      { bg: '#22C55E', border: '#4ADE80', text: '#081312' },
    sorted:     { bg: '#10B981', border: '#34D399', text: '#081312' },
    error:      { bg: '#F43F5E', border: '#FB7185', text: '#FFFFFF' },
    eliminated: { bg: '#0E1E1C', border: '#162D29', text: '#3B5A56' },
  },
};

export const STATE_LABELS = {
  neutral: 'Neutral',
  active: 'Active',
  comparing: 'Comparing',
  swapping: 'Swapping',
  selected: 'Selected',
  visited: 'Visited',
  found: 'Found',
  sorted: 'Sorted',
  error: 'Error',
  eliminated: 'Eliminated',
};

export function getStateColor(theme, state) {
  const palette = STATE_COLORS[theme] || STATE_COLORS.light;
  return palette[state] || palette.neutral;
}

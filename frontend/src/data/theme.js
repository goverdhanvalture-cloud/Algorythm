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
    original:   { bg: '#E2E8F0', border: '#CBD5E1', text: '#334155' },
    dividing:   { bg: '#F1F5F9', border: '#94A3B8', text: '#475569' },
    single:     { bg: '#FFEDD5', border: '#FDBA74', text: '#9A3412' },
    merging:    { bg: '#ECFDF5', border: '#6EE7B7', text: '#047857' },
    complete:   { bg: '#DCFCE3', border: '#22C55E', text: '#14532D' },
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
    original:   { bg: '#1E293B', border: '#334155', text: '#94A3B8' },
    dividing:   { bg: '#0F172A', border: '#475569', text: '#CBD5E1' },
    single:     { bg: '#431407', border: '#9A3412', text: '#FDBA74' },
    merging:    { bg: '#064E3B', border: '#059669', text: '#6EE7B7' },
    complete:   { bg: '#14532D', border: '#4ADE80', text: '#DCFCE3' },
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
  original: 'Original',
  dividing: 'Dividing',
  single: 'Single Elements',
  merging: 'Merging',
  complete: 'Complete',
};

export function getStateColor(theme, state) {
  const palette = STATE_COLORS[theme] || STATE_COLORS.light;
  return palette[state] || palette.neutral;
}

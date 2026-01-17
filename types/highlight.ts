export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface HighlightSegment {
  text: string;
  isHighlighted: boolean;
  highlightId?: string;
  color?: HighlightColor;
  hasNote?: boolean;
}

/**
 * Color definitions for highlights
 * Each color has a background and border style
 */
export const HIGHLIGHT_COLORS: Record<
  HighlightColor,
  { bg: string; border: string }
> = {
  yellow: {
    bg: 'rgba(255, 235, 59, 0.3)',
    border: '#FDD835',
  },
  green: {
    bg: 'rgba(76, 175, 80, 0.3)',
    border: '#66BB6A',
  },
  blue: {
    bg: 'rgba(33, 150, 243, 0.3)',
    border: '#42A5F5',
  },
  pink: {
    bg: 'rgba(233, 30, 99, 0.3)',
    border: '#EC407A',
  },
  purple: {
    bg: 'rgba(156, 39, 176, 0.3)',
    border: '#AB47BC',
  },
};

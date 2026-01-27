export const FLAG_NAMES = {
  SHOW_YC_BANNER: 'SHOW_YC_BANNER',
  SHOW_PS_BANNER: 'SHOW_PS_BANNER',
} as const;

export type FlagName = keyof typeof FLAG_NAMES;

export type FlagsState = {
  readonly [K in keyof typeof FLAG_NAMES]: boolean;
};
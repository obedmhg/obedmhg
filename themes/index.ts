import type { Theme } from '@/lib/types';
import type { ThemeDef } from './types';
import { terminal } from './terminal';
import { clean } from './clean';
import { editorial } from './editorial';
import { blueprint } from './blueprint';

export const themeRegistry: Record<Theme, ThemeDef> = {
  terminal,
  clean,
  editorial,
  blueprint,
};

export function getTheme(t: Theme): ThemeDef {
  return themeRegistry[t];
}

export type { ThemeDef } from './types';

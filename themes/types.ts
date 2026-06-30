export interface ChromeLabels {
  summary: string;
  experience: string;
  skills: string;
  highlight: string;
  certifications: string;
  contactCta: string;
}

export interface ChromeConfig {
  /** terminal window chrome (term-bar dots, shell prompt hero) */
  showTerminalChrome: boolean;
  /** the stat chips row under the hero */
  showChips: boolean;
  /** the cyan "#" prefix on section labels */
  showHash: boolean;
  /** per-role vYYYY.MM version tag */
  showVersionTags: boolean;
  /** ● ACTIVE / ✓ SHIPPED badge */
  showStatusBadges: boolean;
  /** the slug@company "repo" line under each role title */
  showRepoLine: boolean;
  labels: ChromeLabels;
  /** Google Fonts <link> href used by the downloaded standalone document */
  fonts: string;
}

export interface ThemeDef {
  css: string;
  chrome: ChromeConfig;
}

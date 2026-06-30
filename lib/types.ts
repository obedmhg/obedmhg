export type Theme = 'terminal' | 'clean' | 'editorial' | 'blueprint';

export const THEMES: Theme[] = ['terminal', 'clean', 'editorial', 'blueprint'];

export const THEME_LABELS: Record<Theme, string> = {
  terminal: 'Terminal',
  clean: 'Clean',
  editorial: 'Editorial',
  blueprint: 'Blueprint',
};

export interface ExperienceItem {
  title: string;
  company: string;
  dates: string;
  location?: string;
  duration?: string;
  description: string[];
  skills: string[];
}

export interface Certification {
  name: string;
  institution: string;
  date?: string;
}

export interface ContactLink {
  label: string;
  url: string;
}

export interface ResumeData {
  header: {
    name: string;
    title: string;
    org?: string;
    experience: string;
    photo?: string;
  };
  about: { summary: string[] };
  skills: string[];
  experience: ExperienceItem[];
  highlight?: {
    title: string;
    meta?: string;
    description: string;
    url?: string;
  };
  certifications: Certification[];
  contact: {
    location?: string;
    email?: string;
    phone?: string;
    links?: ContactLink[];
  };
}

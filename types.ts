
export enum AppState {
  IDENTITY = 'IDENTITY',
  SPLASH = 'SPLASH',
  PROPOSAL = 'PROPOSAL',
  ROMANTIC_ACCEPT = 'ROMANTIC_ACCEPT',
  BESTIE_CONFIRM = 'BESTIE_CONFIRM',
  FINAL_BESTIE = 'FINAL_BESTIE',
  DASHBOARD = 'DASHBOARD'
}

export type UserType = 'Eren Yeager' | 'Ann Mariya';

export type ThemeType = 'pink' | 'lavender' | 'mint' | 'sky' | 'peach' | 'golden';

export type TabType = 'home' | 'journal' | 'sync';

export interface JournalEntry {
  id: string;
  author: UserType;
  content: string;
  timestamp: number;
  seen: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'mood' | 'pulse';
  author: UserType;
  detail: string;
  timestamp: number;
  seen: boolean;
}

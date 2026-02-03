
export enum AppState {
  SPLASH = 'SPLASH',
  PROPOSAL = 'PROPOSAL',
  ROMANTIC_ACCEPT = 'ROMANTIC_ACCEPT',
  BESTIE_CONFIRM = 'BESTIE_CONFIRM',
  FINAL_BESTIE = 'FINAL_BESTIE',
  DASHBOARD = 'DASHBOARD'
}

export type TabType = 'home' | 'chat' | 'vision' | 'journal' | 'sync';

export interface ActivityEvent {
  id: string;
  type: 'vision' | 'chat' | 'mood' | 'pulse';
  detail: string;
  timestamp: number;
}

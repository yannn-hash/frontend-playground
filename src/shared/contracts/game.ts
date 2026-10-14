import type { ComponentType, ReactNode } from 'react';

export type Difficulty = 'Dasar' | 'Menengah' | 'Lanjutan';
export type GameId =
  | 'box-model'
  | 'flexbox-dock'
  | 'grid-architect'
  | 'responsive-rescue'
  | 'state-quest'
  | 'motion-studio';
export interface GameMetadata {
  id: GameId;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  accent: string;
  icon: string;
  topics: string[];
  duration: string;
}
export interface VisualControl {
  label: string;
  selector: string;
  property: string;
  type: 'number' | 'select';
  suffix?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[];
}
export interface MissionDefinition {
  id: string;
  revision: number;
  title: string;
  objective: string;
  starter: string;
  solution: string;
  hints: [string, string];
  explanation: string;
  controls: VisualControl[];
  viewports?: number[];
}
export interface ElementSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
  styles: Record<string, string>;
}
export interface LayoutSnapshot {
  viewport: number;
  nodes: Record<string, ElementSnapshot>;
  reduced?: Record<string, ElementSnapshot>;
}
export interface Check {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}
export interface ValidationResult {
  passed: boolean;
  checks: Check[];
}
export interface QuestState {
  status: 'idle' | 'loading' | 'success' | 'error';
  requestId: number;
}
export interface QuestEvent {
  type: 'LOAD' | 'RESOLVE' | 'REJECT' | 'RETRY' | 'CANCEL';
  requestId: number;
}
export interface QuestScenario {
  name: string;
  initial: QuestState;
  events: QuestEvent[];
  expected: QuestState[];
}
export interface GameDefinition extends GameMetadata {
  language: 'css' | 'javascript';
  editable: boolean;
  arenaHtml: string;
  arenaCss: string;
  Arena: ComponentType<{ children: ReactNode }>;
  missions: MissionDefinition[];
  craft: string[];
  validate: (
    missionIndex: number,
    snapshots: LayoutSnapshot[],
    traces?: QuestState[][],
  ) => ValidationResult;
  scenarios?: (missionIndex: number) => QuestScenario[];
}
export interface DraftRecord {
  revision: number;
  code: string;
  manual: boolean;
}
export interface ProgressRecord {
  version: 1;
  completed: string[];
  drafts: Record<string, DraftRecord>;
}
export type GameLoader = () => Promise<{ default: GameDefinition }>;

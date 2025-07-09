export enum QuestType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  SPECIAL = "SPECIAL",
}

export type Quest = {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  reward: number;
  goal: number;
  progress: number; // This is client-side mock progress
  href: string;
};

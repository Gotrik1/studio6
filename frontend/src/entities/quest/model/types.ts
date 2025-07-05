export type Quest = {
  id: string;
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
  title: string;
  description: string;
  reward: number;
  goal: number;
  progress: number; // This is client-side mock progress
  href: string;
};

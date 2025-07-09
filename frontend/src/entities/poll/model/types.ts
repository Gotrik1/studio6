export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type PollAuthor = {
  id: string;
  name: string;
  avatar: string | null;
};

export type Poll = {
  id: string;
  title: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  author?: PollAuthor | null;
};

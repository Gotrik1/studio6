type ReportUser = {
  id: string;
  name: string;
  avatar: string | null;
};

export type Report = {
  id: string;
  category: string;
  description: string | null;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reporter: ReportUser;
  reportedUser: ReportUser;
};

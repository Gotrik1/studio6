type ReportUser = {
  id: string;
  name: string;
  avatar: string | null;
};

export type Report = {
  id: string;
  reason: string;
  context: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reporter: ReportUser;
  reportedUser: ReportUser;
};

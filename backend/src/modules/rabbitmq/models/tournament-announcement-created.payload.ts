export interface TournamentAnnouncementCreatedPayload {
  announcementId: string;
  tournamentId: string;
  tournamentSlug: string;
  tournamentName: string;
  subject: string;
  participantIds: string[];
}

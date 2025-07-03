'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTeams } from '@/entities/team/api/teams';
import type { Team } from '@/entities/team/model/types';
import { useSession } from '@/shared/lib/session/client';

interface TeamContextType {
  teams: Team[];
  loading: boolean;
  addTeam: (team: Omit<Team, 'rank' | 'members' | 'slug' | 'captain'>) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTeams() {
      try {
        const fetchedTeams = await fetchTeams();
        setTeams(fetchedTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, []);

  const addTeam = (newTeamData: Omit<Team, 'rank' | 'members' | 'slug' | 'captain'>) => {
    const newTeam: Team = {
      ...newTeamData,
      captain: user?.name || 'Вы',
      rank: teams.length + 1, // Simple rank assignment
      members: 1, // The creator
      slug: newTeamData.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setTeams(prevTeams => [newTeam, ...prevTeams]);
  };

  return (
    <TeamContext.Provider value={{ teams, loading, addTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};

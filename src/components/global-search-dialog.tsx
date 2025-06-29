'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { smartSearch, type SmartSearchOutput } from '@/ai/flows/smart-search-flow';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SmartSearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const searchResults = await smartSearch(searchQuery);
        setResults(searchResults);
      } catch (err) {
        console.error("Global search failed:", err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults(null);
    }
  }, [open]);

  useEffect(() => {
    if (query) {
      setLoading(true);
      debouncedSearch(query);
    } else {
      setResults(null);
      setLoading(false);
    }
  }, [query, debouncedSearch]);

  const onSelect = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Поиск по командам, игрокам, турнирам..."
                className="h-12 w-full border-0 shadow-none focus-visible:ring-0 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        <ScrollArea className="max-h-[70vh]">
            <div className="p-4">
            {loading && !results && <div className="p-4 flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/></div>}
            
            {!loading && !query && (
                 <div className="text-center text-muted-foreground p-8">Начните вводить запрос для поиска.</div>
            )}

            {!loading && query && !results?.users.length && !results?.teams.length && !results?.tournaments.length && (
                <div className="text-center text-muted-foreground p-8">Ничего не найдено.</div>
            )}
            
            {results?.teams && results.teams.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-sm px-2">Команды</h4>
                {results.teams.map((team) => (
                    <Button key={team.slug} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(`/teams/${team.slug}`)}>
                        <Avatar className="mr-3 h-8 w-8">
                            <AvatarImage src={team.logo} data-ai-hint={team.dataAiHint} />
                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{team.name}</span>
                    </Button>
                ))}
              </div>
            )}

            {results?.users && results.users.length > 0 && (
                <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm px-2">Игроки</h4>
                    {results.users.map((user) => (
                        <Button key={user.id} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(user.profileUrl)}>
                            <Avatar className="mr-3 h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                        </Button>
                    ))}
                </div>
            )}

            {results?.tournaments && results.tournaments.length > 0 && (
                 <div className="space-y-2">
                    <h4 className="font-semibold text-sm px-2">Турниры</h4>
                    {results.tournaments.map((tournament) => (
                        <Button key={tournament.slug} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(`/tournaments/${tournament.slug}`)}>
                            <div className="h-8 w-8 mr-3 flex items-center justify-center bg-muted rounded-sm">
                                <Trophy className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span>{tournament.name}</span>
                        </Button>
                    ))}
                </div>
            )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

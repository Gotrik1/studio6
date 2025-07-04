import { Injectable } from '@nestjs/common';
import { friendsList, pendingRequests, suggestedFriends } from '@/shared/lib/mock-data/friends';

@Injectable()
export class FriendsService {
  findAll() {
    return friendsList;
  }

  findRequests() {
    return pendingRequests;
  }
  
  findSuggestions() {
      return suggestedFriends;
  }
}

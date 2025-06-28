// src/services/userService.ts

export interface LeaderboardHost {
  id: string;
  name: string;
  avatar: string;
  successfulGroups: number;
  totalMembersServed: number;
  hostRating: number;
  joinDate: string;
}

export interface User {
  userId: string;
  role: string;
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  successfulGroups?: number;
  totalMembersServed?: number;
  hostRating?: number;
  verificationStatus?: string;
}

export const userService = {
  // Fetch all users from placeholder data
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch('/placeholder-users.json');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return mock data as fallback
      return [
        {
          userId: "host01",
          role: "Verified Host",
          name: "Charles Green",
          email: "charles.green@example.com",
          joinDate: "2024-07-20",
          avatar: "https://i.pravatar.cc/80?img=10",
          successfulGroups: 15,
          totalMembersServed: 127,
          hostRating: 4.9
        },
        {
          userId: "host02",
          role: "Verified Host",
          name: "Diana Chen",
          email: "diana.chen@example.com",
          joinDate: "2024-06-15",
          avatar: "https://i.pravatar.cc/80?img=15",
          successfulGroups: 23,
          totalMembersServed: 189,
          hostRating: 4.8
        },
        {
          userId: "host03",
          role: "Verified Host",
          name: "Marcus Johnson",
          email: "marcus.j@example.com",
          joinDate: "2024-05-10",
          avatar: "https://i.pravatar.cc/80?img=20",
          successfulGroups: 31,
          totalMembersServed: 245,
          hostRating: 4.9
        }
      ];
    }
  },

  // Get ranked hosts for leaderboard
  async getTopHosts(limit: number = 5): Promise<LeaderboardHost[]> {
    try {
      const allUsers = await this.getUsers();
      
      const rankedHosts = allUsers
        .filter(user => 
          (user.role === 'Verified Host' || user.role === 'HOST') && 
          user.successfulGroups && 
          user.successfulGroups > 0
        )
        .sort((a, b) => (b.successfulGroups || 0) - (a.successfulGroups || 0)) // Sort by successful groups descending
        .slice(0, limit) // Get top N hosts
        .map(user => ({
          id: user.userId,
          name: user.name,
          avatar: user.avatar || `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 50) + 1}`,
          successfulGroups: user.successfulGroups || 0,
          totalMembersServed: user.totalMembersServed || 0,
          hostRating: user.hostRating || 4.5,
          joinDate: user.joinDate
        }));

      return rankedHosts;
    } catch (error) {
      console.error('Error fetching top hosts:', error);
      return [];
    }
  }
};
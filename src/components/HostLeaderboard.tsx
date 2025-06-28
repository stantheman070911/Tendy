import React, { useState, useEffect } from 'react';
import { userService, type LeaderboardHost } from '../services/userService';

interface HostLeaderboardProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export const HostLeaderboard: React.FC<HostLeaderboardProps> = ({ 
  limit = 5, 
  showTitle = true,
  compact = false 
}) => {
  const [hosts, setHosts] = useState<LeaderboardHost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopHosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching top community hosts...');
        const topHosts = await userService.getTopHosts(limit);
        setHosts(topHosts);
        console.log(`Loaded ${topHosts.length} top hosts for leaderboard`);
      } catch (err) {
        console.error('Error loading host leaderboard:', err);
        setError('Failed to load host leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopHosts();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="leaderboard-container">
        <div className="flex items-center justify-center py-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
            <p className="text-sm font-semibold text-charcoal">Loading top hosts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="text-center py-lg">
          <i className="ph-bold ph-warning-circle text-error text-4xl mb-md"></i>
          <h3 className="text-xl font-semibold text-error mb-2">Unable to Load Leaderboard</h3>
          <p className="text-charcoal/80">{error}</p>
        </div>
      </div>
    );
  }

  if (hosts.length === 0) {
    return (
      <div className="leaderboard-container">
        <div className="text-center py-lg">
          <i className="ph-bold ph-house-line text-stone text-4xl mb-md"></i>
          <h3 className="text-xl font-semibold text-charcoal mb-2">No Hosts Yet</h3>
          <p className="text-charcoal/80">Be the first to become a community host!</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'rank-1 bg-gradient-to-r from-harvest-gold/20 to-harvest-gold/10 border-harvest-gold/30';
      case 1:
        return 'rank-2 bg-gradient-to-r from-stone/20 to-stone/10 border-stone/30';
      case 2:
        return 'rank-3 bg-gradient-to-r from-amber-600/20 to-amber-600/10 border-amber-600/30';
      default:
        return 'bg-white border-stone/10';
    }
  };

  const getJoinedDate = (joinDate: string) => {
    const date = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className={`leaderboard-container ${compact ? 'compact' : ''}`}>
      {showTitle && (
        <div className="text-center mb-lg">
          <h3 className="text-3xl font-lora text-evergreen mb-2 flex items-center justify-center gap-2">
            <i className="ph-bold ph-trophy text-harvest-gold"></i>
            Top Community Hosts
          </h3>
          <p className="text-charcoal/80">
            Celebrating our amazing hosts who build community and fight food waste!
          </p>
        </div>
      )}

      <div className="space-y-md">
        {hosts.map((host, index) => (
          <div
            key={host.id}
            className={`leaderboard-item ${getRankStyle(index)} border-2 rounded-xl p-md transition-all duration-300 hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex items-center gap-md">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {getRankIcon(index)}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={host.avatar}
                  alt={`${host.name} Avatar`}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>

              {/* Host Info */}
              <div className="flex-grow">
                <h4 className="text-xl font-bold text-evergreen">{host.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-charcoal/80">
                    Hosting since {getJoinedDate(host.joinDate)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-harvest-gold">
                      {host.hostRating}
                    </span>
                    <i className="ph-fill ph-star text-harvest-gold text-sm"></i>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-evergreen">
                  {host.successfulGroups}
                </div>
                <div className="text-sm text-charcoal/80">
                  Groups Hosted
                </div>
                <div className="text-xs text-stone mt-1">
                  {host.totalMembersServed} members served
                </div>
              </div>
            </div>

            {/* Achievement Badge for Top 3 */}
            {index < 3 && (
              <div className="mt-md pt-md border-t border-white/50">
                <div className="flex items-center justify-center gap-2">
                  <i className="ph-bold ph-medal text-harvest-gold"></i>
                  <span className="text-sm font-semibold text-evergreen">
                    {index === 0 ? 'Community Champion' : 
                     index === 1 ? 'Neighborhood Hero' : 
                     'Local Leader'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-lg text-center">
        <div className="bg-harvest-gold/10 rounded-lg p-md border border-harvest-gold/20">
          <h4 className="font-semibold text-evergreen mb-2">Want to Join the Leaderboard?</h4>
          <p className="text-sm text-charcoal/80 mb-md">
            Become a verified host and start building your local food community!
          </p>
          <button className="h-10 px-6 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform">
            <i className="ph-bold ph-house-line mr-2"></i>
            Apply to Host
          </button>
        </div>
      </div>

      {/* Leaderboard Info */}
      <div className="mt-md text-center">
        <p className="text-xs text-stone">
          <i className="ph-bold ph-info mr-1"></i>
          Rankings based on successfully completed group buys • Updated daily
        </p>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import clubService from '../../services/clubService';
import ClubCard from '../../components/clubs/ClubCard';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const ClubsList = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const response = await clubService.getClubs({ 
          page, 
          limit: 12,
          search: debouncedSearch || undefined
        });
        setClubs(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to load clubs', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-dark-900">Discover Clubs</h1>
          <p className="mt-2 text-dark-500 max-w-2xl">
            Explore the diverse range of student organizations at SLIIT. Find your community, develop new skills, and make lifelong friends.
          </p>
        </div>
        
        <div className="w-full md:w-80 relative shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-dark-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search clubs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && clubs.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          {clubs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {clubs.map(club => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-dark-50 rounded-2xl border border-dark-100">
              <h3 className="text-lg font-bold text-dark-900 mb-2">No clubs found</h3>
              <p className="text-dark-500">We couldn't find any clubs matching "{debouncedSearch}".</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="px-4 py-2 text-sm font-medium text-dark-700 bg-white border border-dark-200 rounded-lg">
                  Page {page} of {totalPages}
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClubsList;

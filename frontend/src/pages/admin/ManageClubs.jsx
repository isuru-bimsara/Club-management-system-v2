//frontend/src/pages/admin/ManageClubs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clubService from '../../services/clubService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ClubTable from '../../components/clubs/ClubTable';
import Modal from '../../components/ui/Modal';

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchClubs = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const response = await clubService.getClubs({ page: currentPage, limit: 10 });
      setClubs(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (error) {
      toast.error('Failed to load clubs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs(page);
  }, [page]);

  const handleEdit = (club) => {
    navigate(`/admin/clubs/edit/${club._id}`);
  };

  const confirmDelete = (club) => {
    setClubToDelete(club);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!clubToDelete) return;
    
    setIsDeleting(true);
    try {
      await clubService.deleteClub(clubToDelete._id);
      toast.success('Club deleted successfully');
      setDeleteModalOpen(false);
      setClubToDelete(null);
      // Refresh list, go to previous page if last item on current page
      if (clubs.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchClubs(page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete club');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Manage Clubs</h1>
          <p className="mt-1 text-sm text-dark-500">Create, edit, and delete university clubs</p>
        </div>
        <Button onClick={() => navigate('/admin/clubs/add')} className="shrink-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Club
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : clubs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clubs found"
          description="Get started by creating the first club for the university."
          action={
            <Button onClick={() => navigate('/admin/clubs/add')}>
              Add Club
            </Button>
          }
        />
      ) : (
        <>
          <ClubTable clubs={clubs} onEdit={handleEdit} onDelete={confirmDelete} />
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 border border-dark-200 rounded-xl shadow-sm mt-4">
              <p className="text-sm text-dark-600">
                Page <span className="font-medium text-dark-900">{page}</span> of <span className="font-medium text-dark-900">{totalPages}</span>
              </p>
              <div className="space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
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

      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Club"
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Are you sure you want to delete <span className="font-bold text-dark-900">{clubToDelete?.clubName}</span>? 
            This action cannot be undone and will permanently delete all associated events, tickets, and notifications.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-100">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageClubs;

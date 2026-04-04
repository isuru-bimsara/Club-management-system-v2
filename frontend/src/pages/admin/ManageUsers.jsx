import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDateTime } from '../../utils/formatDate';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers({ page: currentPage, limit: 10 });
      setUsers(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const confirmAction = (user) => {
    setUserToAction(user);
    setActionModalOpen(true);
  };

  const handleAction = async () => {
    if (!userToAction) return;
    
    setIsProcessing(true);
    const action = userToAction.status === 'active' ? adminService.banUser : adminService.unbanUser;
    
    try {
      await action(userToAction._id);
      toast.success(`User ${userToAction.status === 'active' ? 'banned' : 'unbanned'} successfully`);
      setActionModalOpen(false);
      setUserToAction(null);
      fetchUsers(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const openRoleModal = (user) => {
    setUserToAction(user);
    setSelectedRole(user.role);
    setRoleModalOpen(true);
  };

  const handleRoleChange = async () => {
    if (!userToAction || !selectedRole) return;
    
    setIsProcessing(true);
    try {
      await adminService.changeUserRole(userToAction._id, selectedRole);
      toast.success(`User role updated to ${selectedRole}`);
      setRoleModalOpen(false);
      setUserToAction(null);
      fetchUsers(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Manage Users</h1>
        <p className="mt-1 text-sm text-dark-500">View and manage student accounts</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-dark-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-dark-600">
              <thead className="bg-dark-50 text-dark-900 border-b border-dark-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">User</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 overflow-hidden font-bold">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-dark-900">{user.name}</div>
                          <div className="text-xs text-dark-500">{user.studentId} • {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium">{user.role}</td>
                    <td className="px-6 py-4">
                      <Badge status={user.status}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4">{formatDateTime(user.createdAt, 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1.5 text-xs"
                        onClick={() => openRoleModal(user)}
                        disabled={user.role === 'superadmin'}
                      >
                        Change Role
                      </Button>
                      <Button
                        variant={user.status === 'active' ? 'danger' : 'secondary'}
                        className="!px-3 !py-1.5 text-xs"
                        onClick={() => confirmAction(user)}
                        disabled={user.role === 'admin' || user.role === 'superadmin'}
                      >
                        {user.status === 'active' ? (
                          <><ShieldAlert className="h-3 w-3 mr-1" /> Ban</>
                        ) : (
                          <><ShieldCheck className="h-3 w-3 mr-1" /> Unban</>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
        isOpen={actionModalOpen} 
        onClose={() => setActionModalOpen(false)}
        title={userToAction?.status === 'active' ? "Ban User" : "Unban User"}
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Are you sure you want to {userToAction?.status === 'active' ? 'ban' : 'unban'} <span className="font-bold text-dark-900">{userToAction?.name}</span>? 
            {userToAction?.status === 'active' ? ' They will not be able to log in to the system.' : ' They will regain access to the system.'}
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-100">
            <Button variant="secondary" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={userToAction?.status === 'active' ? 'danger' : 'primary'} 
              onClick={handleAction} 
              isLoading={isProcessing}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={roleModalOpen} 
        onClose={() => setRoleModalOpen(false)}
        title="Change User Role"
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Select a new role for <span className="font-bold text-dark-900">{userToAction?.name}</span>:
          </p>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded-md border border-dark-300 py-2 px-3 text-sm flex h-10 w-full rounded-md border border-dark-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="student">Student</option>
            <option value="president">President</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-100">
            <Button variant="secondary" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRoleChange} 
              isLoading={isProcessing}
            >
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;

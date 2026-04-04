import React from 'react';
import { Edit2, Trash2, Building2 } from 'lucide-react';

const ClubTable = ({ clubs, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-dark-200 bg-white shadow-sm">
      <table className="w-full whitespace-nowrap text-left text-sm text-dark-600">
        <thead className="bg-dark-50 text-dark-900">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Club</th>
            <th scope="col" className="px-6 py-4 font-semibold">President</th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">Members</th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">Events</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-200">
          {clubs.map((club) => (
            <tr key={club._id} className="hover:bg-dark-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-dark-200 bg-dark-50 flex items-center justify-center">
                    {club.logo ? (
                      <img className="h-full w-full object-cover" src={club.logo} alt="" />
                    ) : (
                      <Building2 className="h-5 w-5 text-dark-400" />
                    )}
                  </div>
                  <div className="font-medium text-dark-900">{club.clubName}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-dark-900">{club.president?.name || 'N/A'}</div>
                <div className="text-xs text-dark-500">{club.president?.email}</div>
              </td>
              <td className="px-6 py-4 text-center font-medium">
                {club.memberCount || 0}
              </td>
              <td className="px-6 py-4 text-center font-medium">
                {club.eventCount || 0}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(club)}
                    className="rounded-md p-2 text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Edit Club"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(club)}
                    className="rounded-md p-2 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Club"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubTable;

import React, { useEffect, useState } from 'react';
import { FileDown, Calendar, Users, Building2, Ticket } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const Reports = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await adminService.getReports();
        setData(response);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setIsLoading(false);
    }
    };

    fetchReports();
  }, []);

  const handleExportCSV = () => {
    // Generate CSV for Events Attendance
    if (!data?.eventAttendance) return;

    const headers = ['Event Title', 'Club', 'Date', 'Tickets Sold', 'Total Revenue'];
    const rows = data.eventAttendance.map(event => [
      `"${event.title}"`,
      `"${event.club?.clubName || 'N/A'}"`,
      formatDateTime(event.date, 'yyyy-MM-dd'),
      event.ticketsSold,
      event.ticketsSold * event.ticketPrice
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `events_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">System Reports</h1>
          <p className="mt-1 text-sm text-dark-500">Comprehensive overview of platform activity</p>
        </div>
        <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Events CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-500" />
              Event Attendance & Revenue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-dark-600">
                <thead className="bg-dark-50 text-dark-900 border-y border-dark-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Club</th>
                    <th className="px-4 py-3 font-semibold text-center">Tickets Sold</th>
                    <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200">
                  {data?.eventAttendance?.length > 0 ? data.eventAttendance.map((event) => (
                    <tr key={event._id} className="hover:bg-dark-50/50">
                      <td className="px-4 py-3 font-medium text-dark-900">{event.title}</td>
                      <td className="px-4 py-3 text-xs">{event.club?.clubName}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Ticket className="h-3 w-3 text-dark-400" />
                          <span>{event.ticketsSold} / {event.totalTickets}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-primary-600">
                        {formatCurrency(event.ticketsSold * event.ticketPrice)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-dark-500">No events data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-500" />
              Club Performance
            </h2>
            <div className="space-y-4">
              {data?.topClubs?.length > 0 ? data.topClubs.map((club, index) => (
                <div key={club._id} className="flex flex-col gap-1 pb-4 border-b border-dark-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dark-900 line-clamp-1">{club.clubName}</span>
                    <span className="text-xs font-bold bg-dark-100 px-2 py-1 rounded">#{index + 1}</span>
                  </div>
                  <div className="flex justify-between text-xs text-dark-500">
                    <span>{club.memberCount} members</span>
                    <span>{club.eventCount} events</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-dark-500">No club performance data</p>
              )}
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-white/80" />
              System Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-white/80">Total Revenue</span>
                <span className="font-bold text-xl">{formatCurrency(data?.summary?.totalRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-white/80">Active Clubs</span>
                <span className="font-bold text-xl">{data?.summary?.totalClubs || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-white/80">Total Students</span>
                <span className="font-bold text-xl">{data?.summary?.totalStudents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Events Hosted</span>
                <span className="font-bold text-xl">{data?.summary?.totalEvents || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

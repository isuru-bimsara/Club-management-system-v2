import React, { useEffect, useState, useCallback } from 'react';
import { FileDown, Calendar, Users, Building2, Ticket, Filter, RefreshCcw, Download } from 'lucide-react';
import adminService from '../../services/adminService';
import clubService from '../../services/clubService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatDateTime } from '../../utils/formatDate';

const Reports = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [clubs, setClubs] = useState([]);

  // Filters (Applied to the report)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    clubId: ''
  });

  // Pending Filters (In the form, not yet applied)
  const [pendingFilters, setPendingFilters] = useState({
    startDate: '',
    endDate: '',
    clubId: ''
  });

  const fetchClubs = async () => {
    try {
      const response = await clubService.getClubs({ limit: 100 });
      setClubs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch clubs', error);
    }
  };

  const fetchReports = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await adminService.getReports(filters);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    fetchReports(data === null);
  }, [fetchReports]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(pendingFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = { startDate: '', endDate: '', clubId: '' };
    setPendingFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const handleExportCSV = () => {
    const maxCols = 6;
    const pad = (arr) => {
      while (arr.length < maxCols) arr.push("");
      return arr;
    };

    const summaryRows = [
      pad(["SUMMARY REPORT"]),
      pad(["Total Clubs", data?.summary?.totalClubs || 0]),
      pad(["Total Students", data?.summary?.totalStudents || 0]),
      pad(["Total System Revenue (Merch)", data?.summary?.totalRevenue || 0]),
      pad([]),
      pad(["EVENT DETAILS"]),
      ["Event Title", "Club", "Date", "Tickets Sold", "Tickets Capacity", "Merch Revenue"]
    ];

    const dataRows = data.eventAttendance.map((event) => [
      `"${event.title.replace(/"/g, '""')}"`,
      `"${(event.club?.clubName || "N/A").replace(/"/g, '""')}"`,
      `"${formatDate(event.date)}"`,
      event.ticketsSold,
      event.totalTickets,
      event.merchRevenue || 0,
    ]);

    const csvContent = "\ufeff" + summaryRows.map(e => e.join(",")).join("\n") + "\n"
      + dataRows.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `system_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className={`space-y-6 ${isRefreshing ? 'opacity-70 pointer-events-none' : ''} transition-opacity`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">System Reports</h1>
          <p className="mt-1 text-sm text-dark-500">Analyze club activities and event performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fetchReports(false)} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportCSV} variant="primary" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Form */}
      <div className="card p-6 bg-white border border-dark-200">
        <div className="flex items-center gap-2 mb-4 text-dark-900 font-bold">
          <Filter className="h-4 w-4" />
          Report Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-dark-500 uppercase mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={pendingFilters.startDate}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-dark-200 focus:border-primary-500 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-500 uppercase mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={pendingFilters.endDate}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-dark-200 focus:border-primary-500 focus:ring-primary-500 text-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-dark-500 uppercase mb-2">Club Filter</label>
            <select
              name="clubId"
              value={pendingFilters.clubId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-dark-200 focus:border-primary-500 focus:ring-primary-500 text-sm"
            >
              <option value="">All Clubs</option>
              {clubs.map(club => (
                <option key={club._id} value={club._id}>{club.clubName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button onClick={handleApplyFilters} variant="primary" className="flex-1">Generate Report</Button>
            <Button onClick={handleResetFilters} variant="outline" className="px-4">Reset</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Attendance Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-dark-100 flex justify-between items-center bg-dark-50/50">
              <h2 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary-500" />
                Event Attendance & Revenue Details
              </h2>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">
                {data?.eventAttendance?.length || 0} Events
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-dark-600">
                <thead className="bg-white text-dark-400 uppercase text-[10px] tracking-wider border-b border-dark-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">Event Details</th>
                    <th className="px-6 py-4 font-bold text-center">Date</th>
                    <th className="px-6 py-4 font-bold text-center">Tickets</th>
                    <th className="px-6 py-4 font-bold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {data?.eventAttendance?.length > 0 ? data.eventAttendance.map((event) => (
                    <tr key={event._id} className="hover:bg-dark-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-dark-900 leading-tight mb-1">{event.title}</span>
                          <span className="text-[10px] text-dark-400 font-medium px-2 py-0.5 bg-dark-100 rounded self-start">
                            {event.club?.clubName || 'Unknown Club'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs whitespace-nowrap">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-24 h-1.5 bg-dark-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500"
                              style={{ width: `${Math.min((event.ticketsSold / event.totalTickets) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-dark-500">
                            {event.ticketsSold} / {event.totalTickets}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-600">
                            {formatCurrency(event.merchRevenue || 0)}
                          </span>
                          <span className="text-[10px] text-dark-400 uppercase font-black">
                            Merchandise
                          </span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-dark-400">
                          <Calendar className="h-8 w-8 opacity-20" />
                          <p>No event data found for the selected filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary-500" />
                Revenue by Club
              </h2>
              <div className="space-y-4">
                {data?.revenueByClub?.length > 0 ? data.revenueByClub.map((club, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <span className="text-sm text-dark-600 group-hover:text-dark-900 transition-colors">{club._id}</span>
                    <span className="text-sm font-bold text-primary-600">{formatCurrency(club.totalRevenue)}</span>
                  </div>
                )) : (
                  <p className="text-xs text-dark-400 italic">No revenue data available</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-bold text-dark-900 mb-4 flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary-500" />
                Monthly Attendance Trend
              </h2>
              <div className="space-y-4">
                {data?.attendanceByMonth?.length > 0 ? data.attendanceByMonth.map((month, index) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-dark-400 w-16">{months[month._id.month - 1]} {month._id.year}</span>
                      <div className="flex-1 h-3 bg-dark-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 opacity-70"
                          style={{ width: `${Math.min((month.totalAttendance / 100) * 100, 100)}%` }} // Scaling normalization?
                        />
                      </div>
                      <span className="text-xs font-bold text-dark-900">{month.totalAttendance}</span>
                    </div>
                  );
                }) : (
                  <p className="text-xs text-dark-400 italic">No attendance trend data</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-900 text-white shadow-xl shadow-primary-500/10">
            <h2 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2 opacity-80">
              <RefreshCcw className="h-4 w-4" />
              Quick Summary
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/60 uppercase">Total System Revenue</p>
                <p className="text-3xl font-black">{formatCurrency(data?.summary?.totalRevenue || 0)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Clubs</p>
                  <p className="text-xl font-black">{data?.summary?.totalClubs || 0}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Users</p>
                  <p className="text-xl font-black">{data?.summary?.totalStudents || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-500" />
              Top Performing Clubs
            </h2>
            <div className="space-y-3">
              {data?.topClubs?.length > 0 ? data.topClubs.map((club, index) => (
                <div key={club._id} className="group p-3 rounded-xl border border-dark-50 hover:bg-dark-50 hover:border-dark-100 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-dark-900 text-sm line-clamp-1">{club.clubName}</span>
                    <span className="text-[10px] font-black bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">#{index + 1}</span>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold text-dark-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {club.memberCount} Members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {club.eventCount} Events
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-dark-500">No club stats available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


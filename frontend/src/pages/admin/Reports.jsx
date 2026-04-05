import React, { useEffect, useState } from 'react';
import { FileDown, Calendar, Users, Building2, Ticket } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import clubService from '../../services/clubService';
import Input from '../../components/ui/Input';
import { Search, Filter, RefreshCcw } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  
  // Filter state
  const [clubId, setClubId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (clubId) params.clubId = clubId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await adminService.getReports(params);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const clubsRes = await clubService.getClubs({ limit: 100 });
        if (clubsRes.data) setClubs(clubsRes.data);
      } catch (err) {
        console.error('Failed to fetch clubs', err);
      }
    };
    init();
    fetchReports();
  }, []);

  const handleClearFilters = () => {
    setClubId('');
    setStartDate('');
    setEndDate('');
    
    // Fetch all reports (clear filters)
    setIsLoading(true);
    adminService.getReports({}).then(res => {
      setData(res);
      setIsLoading(false);
    });
  };

  const handleExportCSV = () => {
    const maxCols = 4;
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
      ["EVENT DETAILS"],
      ["Event Title", "Club", "Date", "Merch Revenue"]
    ];

    const dataRows = data.eventAttendance.map((event) => [
      `"${event.title.replace(/"/g, '""')}"`,
      `"${(event.club?.clubName || "N/A").replace(/"/g, '""')}"`,
      `"${formatDate(event.date)}"`,
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">System Reports</h1>
          <p className="mt-1 text-sm text-dark-500">Comprehensive overview of platform activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Events CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="label-text block mb-1.5 ml-1">Select Club</label>
            <select
              className="w-full input-field"
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
            >
              <option value="">All Clubs</option>
              {clubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label className="label-text block mb-1.5 ml-1">Start Date</label>
            <input
              type="date"
              className="w-full input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="label-text block mb-1.5 ml-1">End Date</label>
            <input
              type="date"
              className="w-full input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={fetchReports} className="flex-1 md:flex-none flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              Generate
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleClearFilters}
              className="flex-1 md:flex-none px-3"
              title="Reset Filters"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {(clubId || startDate || endDate) && (
          <div className="mt-4 flex items-center gap-2 text-xs text-primary-600 font-medium bg-primary-50 w-fit px-3 py-1.5 rounded-full border border-primary-100">
             <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
             Filtering applied
          </div>
        )}
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
                    <th className="px-6 py-4 font-bold">Event Details</th>
                    <th className="px-6 py-4 font-bold text-center">Date</th>
                    <th className="px-6 py-4 font-bold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200">
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
                      <td colSpan="3" className="px-4 py-8 text-center text-dark-500">No events data available</td>
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

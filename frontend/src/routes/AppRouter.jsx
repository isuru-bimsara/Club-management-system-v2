// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import { ROLES } from '../utils/constants';

// // Layouts
// import Navbar from '../components/layout/Navbar';
// import Sidebar from '../components/layout/Sidebar';
// import PageWrapper from '../components/layout/PageWrapper';
// import Spinner from '../components/ui/Spinner';

// // Public/Auth Pages
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';
// import AdminLogin from '../pages/auth/AdminLogin';

// // Student Pages
// import Home from '../pages/student/Home';
// import ClubsList from '../pages/student/ClubsList';
// import ClubDetails from '../pages/student/ClubDetails';
// import EventDetails from '../pages/student/EventDetails';
// import CalendarView from '../pages/student/CalendarView';
// import MyTickets from '../pages/student/MyTickets';
// import StudentProfile from '../pages/student/StudentProfile';

// // President Pages
// import PresidentDashboard from '../pages/president/PresidentDashboard';
// import ManageClubProfile from '../pages/president/ManageClubProfile';
// import ManageEvents from '../pages/president/ManageEvents';
// import AddEditEvent from '../pages/president/AddEditEvent';
// import TicketInbox from '../pages/president/TicketInbox';
// import ManageMembers from '../pages/president/ManageMembers';
// import TicketScanner from '../pages/president/TicketScanner';

// // Admin Pages
// import AdminDashboard from '../pages/admin/AdminDashboard';
// import ManageClubs from '../pages/admin/ManageClubs';
// import AddClub from '../pages/admin/AddClub';
// import EditClub from '../pages/admin/EditClub';
// import ManageUsers from '../pages/admin/ManageUsers';
// import Reports from '../pages/admin/Reports';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Redirect based on role if unauthorized
//     if (user.role === ROLES.ADMIN || user.role === ROLES.SUPERADMIN) return <Navigate to="/admin" replace />;
//     if (user.role === ROLES.PRESIDENT) return <Navigate to="/president" replace />;
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// const MainLayout = ({ children, role }) => {
//   return <PageWrapper role={role}>{children}</PageWrapper>;
// };

// const AppRouter = () => {
//   return (
//     <Routes>
//       {/* Auth Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/admin-login" element={<AdminLogin />} />

//       {/* Student Routes */}
//       <Route path="/" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><Home /></MainLayout></ProtectedRoute>} />
//       <Route path="/clubs" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><ClubsList /></MainLayout></ProtectedRoute>} />
//       <Route path="/clubs/:id" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><ClubDetails /></MainLayout></ProtectedRoute>} />
//       <Route path="/events" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><CalendarView /></MainLayout></ProtectedRoute>} />
//       <Route path="/calendar" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><CalendarView /></MainLayout></ProtectedRoute>} />
//       <Route path="/events/:id" element={<ProtectedRoute><MainLayout role={ROLES.STUDENT}><EventDetails /></MainLayout></ProtectedRoute>} />

//       <Route path="/my-tickets" element={
//         <ProtectedRoute>
//           <MainLayout role={ROLES.STUDENT}><MyTickets /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/profile" element={
//         <ProtectedRoute>
//           <MainLayout role={ROLES.STUDENT}><StudentProfile /></MainLayout>
//         </ProtectedRoute>
//       } />

//       {/* President Routes */}
//       <Route path="/president" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><PresidentDashboard /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/club-profile" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><ManageClubProfile /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/events" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><ManageEvents /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/events/add" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><AddEditEvent /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/events/edit/:id" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><AddEditEvent /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/tickets" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><TicketInbox /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/members" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><ManageMembers /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/president/scanner" element={
//         <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
//           <MainLayout role={ROLES.PRESIDENT}><TicketScanner /></MainLayout>
//         </ProtectedRoute>
//       } />

//       {/* Admin Routes */}
//       <Route path="/admin" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><AdminDashboard /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/clubs" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><ManageClubs /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/tickets" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><TicketInbox /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/clubs/add" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><AddClub /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/clubs/edit/:id" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><EditClub /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/users" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><ManageUsers /></MainLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/admin/reports" element={
//         <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
//           <MainLayout role={ROLES.ADMIN}><Reports /></MainLayout>
//         </ProtectedRoute>
//       } />

//       {/* Catch All */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default AppRouter;

//frontend/src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

// Layouts
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PageWrapper from "../components/layout/PageWrapper";
import Spinner from "../components/ui/Spinner";

// Public/Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLogin from "../pages/auth/AdminLogin";

// Student Pages
import Home from "../pages/student/Home";
import ClubsList from "../pages/student/ClubsList";
import ClubDetails from "../pages/student/ClubDetails";
import EventDetails from "../pages/student/EventDetails";
import CalendarView from "../pages/student/CalendarView";
import MyTickets from "../pages/student/MyTickets";
import StudentProfile from "../pages/student/StudentProfile";
import MyMerch from "../pages/student/MyMerch";

// President Pages
import PresidentDashboard from "../pages/president/PresidentDashboard";
import ManageClubProfile from "../pages/president/ManageClubProfile";
import ManageEvents from "../pages/president/ManageEvents";
import AddEditEvent from "../pages/president/AddEditEvent";
import TicketInbox from "../pages/president/TicketInbox";
import ManageMembers from "../pages/president/ManageMembers";
import TicketScanner from "../pages/president/TicketScanner";
import MerchInbox from "../pages/president/MerchInbox";
import ManageMerch from "../pages/president/ManageMerch";
import AddMerchandise from "../pages/president/AddMerchandise";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageClubs from "../pages/admin/ManageClubs";
import AddClub from "../pages/admin/AddClub";
import EditClub from "../pages/admin/EditClub";
import ManageUsers from "../pages/admin/ManageUsers";
import Reports from "../pages/admin/Reports";

// ✅ FIXED: Properly handle role authorization including SUPERADMIN
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Step 1: Wait for authentication to finish loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Step 2: After loading, check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: Check role-based access
  if (allowedRoles) {
    const userRole = user.role?.toLowerCase().trim();
    const isAuthorized = allowedRoles.some(
      (role) => role.toLowerCase().trim() === userRole,
    );

    if (!isAuthorized) {
      // Show error toast and redirect based on role
      if (userRole === "superadmin" || userRole === "admin") {
        return <Navigate to="/admin" replace />;
      }
      if (userRole === "president") {
        return <Navigate to="/president" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const MainLayout = ({ children, role }) => {
  return <PageWrapper role={role}>{children}</PageWrapper>;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Auth Routes - Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      {/* Student Routes - Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <ClubsList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/:id"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <ClubDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <CalendarView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <CalendarView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <EventDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <MyTickets />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <StudentProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* President Routes - Protected */}
      <Route
        path="/president"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <PresidentDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/club-profile"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <ManageClubProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/events"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <ManageEvents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/events/add"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <AddEditEvent />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/events/edit/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <AddEditEvent />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/tickets"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <TicketInbox />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/members"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <ManageMembers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/scanner"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <TicketScanner />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Admin Routes - Protected for ADMIN and SUPERADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clubs"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <ManageClubs />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tickets"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <TicketInbox />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clubs/add"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <AddClub />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clubs/edit/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <EditClub />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <ManageUsers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      // student route replace /my-tickets
      <Route
        path="/my-merch"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <MyMerch />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/merch"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <MerchInbox />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/merch/add"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <AddMerchandise />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/president/events/:id/merch"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PRESIDENT]}>
            <MainLayout role={ROLES.PRESIDENT}>
              <ManageMerch />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-merch"
        element={
          <ProtectedRoute>
            <MainLayout role={ROLES.STUDENT}>
              <MyMerch />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/merch"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
            <MainLayout role={ROLES.ADMIN}>
              <MerchInbox />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

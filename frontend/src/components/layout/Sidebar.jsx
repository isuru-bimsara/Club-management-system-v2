// //frontend/src/components/layout/Sidebar.jsx
// import React from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import {
//   Home,
//   Users,
//   Building2,
//   Calendar,
//   Ticket,
//   PieChart,
//   Settings,
//   Package,
//   Bell
// } from 'lucide-react';
// import useAuth from '../../hooks/useAuth';
// import { ROLES } from '../../utils/constants';
// import logo from '../../assets/logo.png';

// const Sidebar = ({ isOpen, onClose }) => {
//   const { role } = useAuth();

//   const adminLinks = [
//     { section: 'ADMINISTRATION', items: [
//       { name: 'System Dashboard', to: '/admin', icon: PieChart },
//       { name: 'Manage Clubs', to: '/admin/clubs', icon: Building2 },
//       { name: 'Manage Users', to: '/admin/users', icon: Users },
//       // { name: 'Ticket Approvals', to: '/admin/tickets', icon: Ticket },
//       { name: 'Merchandise Approvals', to: '/admin/merch', icon: Package },
//       { name: 'Reports', to: '/admin/reports', icon: PieChart },
//     ]}
//   ];

//   const presidentLinks = [
//     { section: 'CLUB MANAGEMENT', items: [
//       { name: 'Club Dashboard', to: '/president', icon: PieChart },
//       { name: 'My Club', to: '/president/club-profile', icon: Building2 },
//       { name: 'Manage Events', to: '/president/events', icon: Calendar },
//       // { name: 'Ticket Inbox', to: '/president/tickets', icon: Ticket },
//       { name: 'Merchandise Inbox', to: '/president/merch', icon: Package },
//       { name: 'Members', to: '/president/members', icon: Users },
//     ]}
//   ];

//   const studentLinks = [
//     { section: 'MAIN MENU', items: [
//       { name: 'Home', to: '/', icon: Home },
//       { name: 'Clubs', to: '/clubs', icon: Building2 },
//       { name: 'Events Calendar', to: '/calendar', icon: Calendar },
//     ]},
//     { section: 'PERSONAL', items: [
//       // { name: 'My Tickets', to: '/my-tickets', icon: Ticket },
//       { name: 'My Merchandise', to: '/my-merch', icon: Package },
//       { name: 'Profile', to: '/profile', icon: Settings },
//     ]}
//   ];

//   let menuGroups = [...studentLinks];
//   if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
//     menuGroups = [...menuGroups, ...adminLinks];
//   } else if (role === ROLES.PRESIDENT) {
//     menuGroups = [...menuGroups, ...presidentLinks];
//   }

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-dark-900/80 backdrop-blur-sm lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:m-4 lg:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col`}
//       >
//         <div className="flex h-24 shrink-0 items-center px-8 border-b border-dark-50">
//            <Link to="/" className="flex items-center">
//               <img src={logo} alt="SLIIT Events Logo" className="h-14 w-auto object-contain hover:opacity-90 transition-opacity" />
//            </Link>
//         </div>

//         <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
//           <nav className="flex-1 space-y-8">
//             {menuGroups.map((group, groupIdx) => (
//               <div key={groupIdx}>
//                 <h3 className="px-2 text-[10px] font-bold uppercase tracking-widest text-dark-400 mb-3 ml-1">
//                    {group.section}
//                 </h3>
//                 <div className="space-y-1">
//                   {group.items.map((item) => (
//                     <NavLink
//                       key={item.name}
//                       to={item.to}
//                       onClick={() => {
//                         if (window.innerWidth < 1024) onClose();
//                       }}
//                       className={({ isActive }) => {
//                         const isMatch = window.location.pathname === item.to || (window.location.pathname.startsWith(`${item.to}/`) && item.to !== '/');
//                         return `group flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
//                           isMatch
//                             ? 'bg-primary-800 text-white shadow-md shadow-primary-900/20 translate-x-1'
//                             : 'text-dark-500 hover:bg-dark-50 hover:text-dark-900'
//                         }`;
//                       }}
//                     >
//                       {({ isActive }) => {
//                         const isMatch = window.location.pathname === item.to || (window.location.pathname.startsWith(`${item.to}/`) && item.to !== '/');
//                         return (
//                           <>
//                             <item.icon
//                               className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
//                                 isMatch
//                                   ? 'text-white'
//                                   : 'text-dark-400 group-hover:text-dark-600'
//                               }`}
//                               aria-hidden="true"
//                             />
//                             {item.name}
//                           </>
//                         );
//                       }}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  Calendar,
  Ticket,
  PieChart,
  Settings,
  Package,
  Bell,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import logo from "../../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const adminLinks = [
    {
      section: "ADMINISTRATION",
      items: [
        { name: "System Dashboard", to: "/admin", icon: PieChart },
        { name: "Manage Clubs", to: "/admin/clubs", icon: Building2 },
        { name: "Manage Users", to: "/admin/users", icon: Users },
        { name: "Merchandise Approvals", to: "/admin/merch", icon: Package },
        { name: "Reports", to: "/admin/reports", icon: PieChart },
      ],
    },
  ];

  const presidentLinks = [
    {
      section: "CLUB MANAGEMENT",
      items: [
        { name: "Club Dashboard", to: "/president", icon: PieChart },
        { name: "My Club", to: "/president/club-profile", icon: Building2 },
        { name: "Manage Events", to: "/president/events", icon: Calendar },
        { name: "Add Merchandise", to: "/president/merch/add", icon: Package },
        { name: "Merchandise Inbox", to: "/president/merch", icon: Package },
        { name: "Members", to: "/president/members", icon: Users },
      ],
    },
  ];

  const studentLinks = [
    {
      section: "MAIN MENU",
      items: [
        { name: "Home", to: "/", icon: Home },
        { name: "Clubs", to: "/clubs", icon: Building2 },
        { name: "Events Calendar", to: "/calendar", icon: Calendar },
      ],
    },
    {
      section: "PERSONAL",
      items: [
        { name: "My Merchandise", to: "/my-merch", icon: Package },
        { name: "Profile", to: "/profile", icon: Settings },
      ],
    },
  ];

  let menuGroups = [...studentLinks];
  if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
    // Filter out PERSONAL section for admins as requested
    menuGroups = menuGroups.filter(g => g.section !== "PERSONAL");
    menuGroups = [...menuGroups, ...adminLinks];
  } else if (role === ROLES.PRESIDENT) {
    menuGroups = [...menuGroups, ...presidentLinks];
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:m-4 lg:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col`}
      >
        <div className="flex h-24 shrink-0 items-center px-8 border-b border-dark-50">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="SLIIT Events Logo"
              className="h-14 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
          <nav className="flex-1 space-y-8">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="px-2 text-[10px] font-bold uppercase tracking-widest text-dark-400 mb-3 ml-1">
                  {group.section}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) => {
                        const isMatch =
                          window.location.pathname === item.to ||
                          (window.location.pathname.startsWith(`${item.to}/`) &&
                            item.to !== "/");
                        return `group flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                          isMatch
                            ? "bg-primary-800 text-white shadow-md shadow-primary-900/20 translate-x-1"
                            : "text-dark-500 hover:bg-dark-50 hover:text-dark-900"
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const isMatch =
                          window.location.pathname === item.to ||
                          (window.location.pathname.startsWith(`${item.to}/`) &&
                            item.to !== "/");
                        return (
                          <>
                            <item.icon
                              className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                                isMatch
                                  ? "text-white"
                                  : "text-dark-400 group-hover:text-dark-600"
                              }`}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
                        );
                      }}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

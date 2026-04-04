// // //frontend/src/pages/president/MerchInbox.jsx
// // import React, { useEffect, useState } from 'react';
// // import merchService from '../../services/merchService';
// // import Spinner from '../../components/ui/Spinner';
// // import Button from '../../components/ui/Button';
// // import { formatCurrency } from '../../utils/formatCurrency';
// // import { formatDateTime } from '../../utils/formatDate';
// // import toast from 'react-hot-toast';

// // const MerchInbox = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const load = async () => {
// //     setLoading(true);
// //     setOrders(await merchService.getOrdersForPresident());
// //     setLoading(false);
// //   };

// //   useEffect(() => { load(); }, []);

// //   const update = async (id, status) => {
// //     await merchService.updateOrderStatus(id, status);
// //     toast.success(`Order ${status}`);
// //     load();
// //   };

// //   if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-2xl font-bold text-dark-900">Merchandise Inbox</h1>
// //       <div className="grid gap-3">
// //         {orders.map((o) => (
// //           <div key={o._id} className="card p-4 flex flex-wrap items-center gap-4 justify-between">
// //             <div>
// //               <p className="font-bold text-dark-900">{o.merchandise?.name}</p>
// //               <p className="text-sm text-dark-500">Buyer: {o.buyer?.name}</p>
// //               <p className="text-sm text-dark-500">Qty: {o.quantity} · {formatCurrency(o.amount)}</p>
// //               <p className="text-xs text-dark-400">Submitted {formatDateTime(o.createdAt)}</p>
// //               <a className="text-primary-600 text-sm" href={o.receiptImage} target="_blank" rel="noreferrer">View Receipt</a>
// //             </div>
// //             <div className="flex gap-2">
// //               <Button variant="secondary" onClick={()=>update(o._id,'rejected')} disabled={o.status!=='pending'}>Reject</Button>
// //               <Button onClick={()=>update(o._id,'approved')} disabled={o.status!=='pending'}>Approve</Button>
// //             </div>
// //           </div>
// //         ))}
// //         {orders.length === 0 && <p className="text-sm text-dark-500">No receipts to review.</p>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MerchInbox;

// import React, { useEffect, useState } from "react";
// import merchService from "../../services/merchService";
// import Spinner from "../../components/ui/Spinner";
// import Button from "../../components/ui/Button";
// import { formatCurrency } from "../../utils/formatCurrency";
// import { formatDateTime } from "../../utils/formatDate";
// import toast from "react-hot-toast";

// const statusClasses = {
//   pending: "bg-amber-100 text-amber-700",
//   approved: "bg-green-100 text-green-700",
//   rejected: "bg-red-100 text-red-700",
// };

// const MerchInbox = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     setLoading(true);
//     setOrders(await merchService.getOrdersForPresident());
//     setLoading(false);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const update = async (id, status) => {
//     await merchService.updateOrderStatus(id, status);
//     toast.success(`Order ${status}`);
//     load();
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center py-12">
//         <Spinner size="lg" />
//       </div>
//     );

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-dark-900">Merchandise Inbox</h1>
//       <div className="grid gap-3">
//         {orders.map((o) => (
//           <div
//             key={o._id}
//             className="card p-4 flex flex-wrap items-center gap-4 justify-between"
//           >
//             <div>
//               <p className="font-bold text-dark-900">{o.merchandise?.name}</p>
//               <p className="text-sm text-dark-500">Buyer: {o.buyer?.name}</p>
//               <p className="text-sm text-dark-500">
//                 Qty: {o.quantity} · {formatCurrency(o.amount)}
//               </p>
//               <p className="text-xs text-dark-400">
//                 Submitted {formatDateTime(o.createdAt)}
//               </p>
//               <a
//                 className="text-primary-600 text-sm"
//                 href={o.receiptImage}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 View Receipt
//               </a>
//             </div>

//             <div className="flex items-center gap-3">
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[o.status] || "bg-dark-100 text-dark-700"}`}
//               >
//                 {o.status}
//               </span>
//               <div className="flex gap-2">
//                 <Button
//                   variant="secondary"
//                   onClick={() => update(o._id, "rejected")}
//                   disabled={o.status !== "pending"}
//                 >
//                   Reject
//                 </Button>
//                 <Button
//                   onClick={() => update(o._id, "approved")}
//                   disabled={o.status !== "pending"}
//                 >
//                   Approve
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//         {orders.length === 0 && (
//           <p className="text-sm text-dark-500">No receipts to review.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MerchInbox;

import React, { useEffect, useState } from "react";
import merchService from "../../services/merchService";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

const statusClasses = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusRank = { pending: 0, approved: 1, rejected: 2 };

const MerchInbox = () => {
  const { role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await merchService.getOrdersForPresident();
    // sort: pending first, then approved, then rejected, then by createdAt desc
    data.sort((a, b) => {
      const rankA = statusRank[a.status] ?? 3;
      const rankB = statusRank[b.status] ?? 3;
      if (rankA !== rankB) return rankA - rankB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);


  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-900">
        {role === ROLES.ADMIN || role === ROLES.SUPERADMIN
          ? "Merchandise Approvals"
          : "Merchandise Inbox"}
      </h1>
      <div className="grid gap-3">
        {orders.map((o) => (
          <div
            key={o._id}
            className="card p-4 flex flex-wrap items-center gap-4 justify-between"
          >
            <div>
              {o.merchandise?.event?.name && (
                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
                  {o.merchandise.event.name}
                </p>
              )}
              <p className="font-bold text-dark-900 text-lg">
                {o.merchandise?.name}
              </p>
              <p className="text-sm text-dark-500">Buyer: {o.buyer?.name}</p>
              <p className="text-sm text-dark-500">
                Qty: {o.quantity} · {formatCurrency(o.amount)}
              </p>
              <p className="text-xs text-dark-400">
                Submitted {formatDateTime(o.createdAt)}
              </p>
              <a
                className="text-primary-600 text-sm"
                href={o.receiptImage}
                target="_blank"
                rel="noreferrer"
              >
                View Receipt
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusClasses[o.status] || "bg-dark-100 text-dark-700"}`}
              >
                {o.status}
              </span>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-dark-500">No receipts to review.</p>
        )}
      </div>
    </div>
  );
};

export default MerchInbox;
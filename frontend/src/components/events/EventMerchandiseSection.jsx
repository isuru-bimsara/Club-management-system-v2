// // //frontend/src/components/events/EventMerchandiseSection.jsx
// // import React, { useEffect, useState } from 'react';
// // import merchService from '../../services/merchService';
// // import Button from '../ui/Button';
// // import Spinner from '../ui/Spinner';
// // import toast from 'react-hot-toast';

// // const EventMerchandiseSection = ({ eventId }) => {
// //   const [items, setItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selected, setSelected] = useState(null);
// //   const [qty, setQty] = useState(1);
// //   const [receipt, setReceipt] = useState(null);

// //   useEffect(() => {
// //     merchService.getEventMerch(eventId).then(setItems).finally(()=>setLoading(false));
// //   }, [eventId]);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     if (!selected || !receipt) return toast.error('Select item and upload receipt');
// //     await merchService.placeOrder({ merchandiseId: selected, quantity: qty, receipt });
// //     toast.success('Order submitted. Await approval.');
// //     setSelected(null); setQty(1); setReceipt(null);
// //   };

// //   if (loading) return <Spinner size="sm" />;

// //   return (
// //     <div className="card p-4 space-y-3">
// //       <h3 className="text-lg font-bold text-dark-900">Merchandise</h3>
// //       {items.length === 0 && <p className="text-sm text-dark-500">No merchandise for this event.</p>}
// //       {items.map((m) => (
// //         <label key={m._id} className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary-300 cursor-pointer">
// //           <input type="radio" name="merch" value={m._id} checked={selected === m._id} onChange={()=>setSelected(m._id)} />
// //           <div className="flex-1">
// //             <p className="font-semibold text-dark-900">{m.name}</p>
// //             <p className="text-sm text-dark-500">LKR {m.price} · Available {m.totalQuantity - m.soldQuantity}</p>
// //             {m.bankDetails?.map((b,i)=>(
// //               <p key={i} className="text-xs text-dark-500">{b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}</p>
// //             ))}
// //           </div>
// //         </label>
// //       ))}
// //       {items.length > 0 && (
// //         <form onSubmit={submit} className="space-y-3">
// //           <input type="number" min="1" className="input" value={qty} onChange={(e)=>setQty(e.target.value)} placeholder="Quantity" />
// //           <input type="file" accept="image/*" className="input" onChange={(e)=>setReceipt(e.target.files[0])} />
// //           <Button type="submit">Submit Receipt</Button>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default EventMerchandiseSection;

// import React, { useEffect, useState } from "react";
// import merchService from "../../services/merchService";
// import Button from "../ui/Button";
// import Spinner from "../ui/Spinner";
// import toast from "react-hot-toast";

// const EventMerchandiseSection = ({ eventId }) => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [receipt, setReceipt] = useState(null);

//   useEffect(() => {
//     merchService
//       .getEventMerch(eventId)
//       .then(setItems)
//       .finally(() => setLoading(false));
//   }, [eventId]);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!selected || !receipt) {
//       return toast.error("Select an item and upload receipt");
//     }
//     try {
//       await merchService.placeOrder({
//         merchandiseId: selected,
//         quantity: qty,
//         receiptImage: receipt,
//       });
//       toast.success("Order submitted. Await approval.");
//       setSelected(null);
//       setQty(1);
//       setReceipt(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit order");
//     }
//   };

//   if (loading) return <Spinner size="sm" />;

//   return (
//     <div className="card p-4 space-y-3">
//       <h3 className="text-lg font-bold text-dark-900">Merchandise</h3>
//       {items.length === 0 && (
//         <p className="text-sm text-dark-500">No merchandise for this event.</p>
//       )}
//       {items.map((m) => (
//         <label
//           key={m._id}
//           className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary-300 cursor-pointer"
//         >
//           <input
//             type="radio"
//             name="merch"
//             value={m._id}
//             checked={selected === m._id}
//             onChange={() => setSelected(m._id)}
//           />
//           <div className="flex-1">
//             <p className="font-semibold text-dark-900">{m.name}</p>
//             <p className="text-sm text-dark-500">
//               LKR {m.price} · Available {m.totalQuantity - m.soldQuantity}
//             </p>
//             {m.bankDetails?.map((b, i) => (
//               <p key={i} className="text-xs text-dark-500">
//                 {b.bankName} | {b.accountName} | {b.accountNumber}{" "}
//                 {b.branch && `| ${b.branch}`}
//               </p>
//             ))}
//           </div>
//         </label>
//       ))}
//       {items.length > 0 && (
//         <form onSubmit={submit} className="space-y-3">
//           <input
//             type="number"
//             min="1"
//             className="input"
//             value={qty}
//             onChange={(e) => setQty(e.target.value)}
//             placeholder="Quantity"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             className="input"
//             onChange={(e) => setReceipt(e.target.files[0])}
//           />
//           <Button type="submit">Submit Receipt</Button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default EventMerchandiseSection;


import React, { useEffect, useState } from "react";
import merchService from "../../services/merchService";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const EventMerchandiseSection = ({ eventId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    merchService
      .getEventMerch(eventId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [eventId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected || !receipt) {
      return toast.error("Select an item and upload receipt");
    }
    try {
      await merchService.placeOrder({
        merchandiseId: selected,
        quantity: qty,
        receiptImage: receipt,
      });
      toast.success("Order submitted. Await approval.");
      setSelected(null);
      setQty(1);
      setReceipt(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit order");
    }
  };

  if (loading) return <Spinner size="sm" />;

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg font-bold text-dark-900">Merchandise</h3>
      {items.length === 0 && (
        <p className="text-sm text-dark-500">No merchandise for this event.</p>
      )}
      {items.map((m) => (
        <label
          key={m._id}
          className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary-300 cursor-pointer"
        >
          <input
            type="radio"
            name="merch"
            value={m._id}
            checked={selected === m._id}
            onChange={() => setSelected(m._id)}
          />
          <div className="flex-1">
            <p className="font-semibold text-dark-900">{m.name}</p>
            <p className="text-sm text-dark-500">
              LKR {m.price} · Available {m.totalQuantity - m.soldQuantity}
            </p>
            <p className="text-xs text-dark-500">Venue: {m.venue}</p>
            {m.bankDetails?.map((b, i) => (
              <p key={i} className="text-xs text-dark-500">
                {b.bankName} | {b.accountName} | {b.accountNumber}{" "}
                {b.branch && `| ${b.branch}`}
              </p>
            ))}
          </div>
        </label>
      ))}
      {items.length > 0 && (
        <form onSubmit={submit} className="space-y-3">
          <input
            type="number"
            min="1"
            className="input"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Quantity"
            required
          />
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => setReceipt(e.target.files[0])}
            required
          />
          <Button type="submit">Submit Receipt</Button>
        </form>
      )}
    </div>
  );
};

export default EventMerchandiseSection;
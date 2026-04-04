

// // // import React, { useEffect, useState } from 'react';
// // // import merchService from '../../services/merchService';
// // // import eventService from '../../services/eventService';
// // // import Button from '../../components/ui/Button';
// // // import Spinner from '../../components/ui/Spinner';
// // // import toast from 'react-hot-toast';
// // // import useAuth from '../../hooks/useAuth';
// // // import { formatCurrency } from '../../utils/formatCurrency';

// // // const makeBlankBank = () => ({ bankName: '', accountName: '', accountNumber: '', branch: '' });

// // // const AddMerchandise = () => {
// // //   const { user } = useAuth();
// // //   const [events, setEvents] = useState([]);
// // //   const [selectedEvent, setSelectedEvent] = useState('');
// // //   const [banks, setBanks] = useState([makeBlankBank()]);
// // //   const [form, setForm] = useState({ name: '', price: '', totalQuantity: '', merchImage: null });
// // //   const [preview, setPreview] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [items, setItems] = useState([]);
// // //   const [editingId, setEditingId] = useState(null);

// // //   useEffect(() => {
// // //     const load = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const resp = await eventService.getEvents({ page: 1, limit: 500 });
// // //         const evts = resp?.data?.data || resp?.data || resp;
// // //         const mine = (evts || []).filter((e) => {
// // //           const ownerId = typeof e.createdBy === 'string' ? e.createdBy : e.createdBy?._id;
// // //           return ownerId === user?._id;
// // //         });
// // //         setEvents(mine);
// // //         if (mine[0]) setSelectedEvent(mine[0]._id);
// // //       } catch (err) {
// // //         toast.error(err.response?.data?.message || 'Unable to load events');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     load();
// // //   }, [user]);

// // //   useEffect(() => {
// // //     const loadItems = async () => {
// // //       if (!selectedEvent) return;
// // //       const list = await merchService.getEventMerch(selectedEvent);
// // //       setItems(list);
// // //     };
// // //     loadItems();
// // //   }, [selectedEvent]);

// // //   const handleBankChange = (idx, field, val) => {
// // //     setBanks((prev) => {
// // //       const next = prev.map((b) => ({ ...b }));
// // //       next[idx][field] = val;
// // //       return next;
// // //     });
// // //   };

// // //   const addBank = () => setBanks((b) => [...b.map((x) => ({ ...x })), makeBlankBank()]);
// // //   const removeBank = (idx) => setBanks((b) => b.filter((_, i) => i !== idx));

// // //   const resetForm = () => {
// // //     setForm({ name: '', price: '', totalQuantity: '', merchImage: null });
// // //     setBanks([makeBlankBank()]);
// // //     setPreview(null);
// // //     setEditingId(null);
// // //   };

// // //   const onFileChange = (file) => {
// // //     setForm((f) => ({ ...f, merchImage: file }));
// // //     setPreview(file ? URL.createObjectURL(file) : null);
// // //   };

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     if (!selectedEvent) return toast.error('Select an event');
// // //     setSaving(true);
// // //     try {
// // //       const payload = {
// // //         eventId: selectedEvent,
// // //         name: form.name,
// // //         price: form.price,
// // //         totalQuantity: form.totalQuantity,
// // //         bankDetails: banks,
// // //         merchImage: form.merchImage,
// // //       };
// // //       if (editingId) {
// // //         await merchService.updateMerch(editingId, payload);
// // //         toast.success('Merchandise updated');
// // //       } else {
// // //         await merchService.createMerch(payload);
// // //         toast.success('Merchandise created');
// // //       }
// // //       resetForm();
// // //       const list = await merchService.getEventMerch(selectedEvent);
// // //       setItems(list);
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to save merchandise');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const startEdit = (item) => {
// // //     setEditingId(item._id);
// // //     setForm({
// // //       name: item.name,
// // //       price: item.price,
// // //       totalQuantity: item.totalQuantity,
// // //       merchImage: null,
// // //     });
// // //     setBanks(item.bankDetails?.length ? item.bankDetails.map((b) => ({ ...b })) : [makeBlankBank()]);
// // //     setPreview(item.image || null);
// // //   };

// // //   const del = async (id) => {
// // //     if (!window.confirm('Delete this item?')) return;
// // //     await merchService.deleteMerch(id);
// // //     toast.success('Deleted');
// // //     setItems((prev) => prev.filter((m) => m._id !== id));
// // //     if (editingId === id) resetForm();
// // //   };

// // //   if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

// // //   return (
// // //     <div className="space-y-10">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-2xl font-bold text-dark-900">Merchandise</h1>
// // //           <p className="text-sm text-dark-500">Create, edit, and delete merchandise per event.</p>
// // //         </div>
// // //       </div>

// // //       <div className="card p-6 md:p-8 space-y-8">
// // //         {/* Form title */}
// // //         <div>
// // //           <h3 className="text-xl font-semibold text-dark-900 mb-2">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
// // //           <p className="text-sm text-dark-500">Fill the details and upload an item image.</p>
// // //         </div>

// // //         {/* Form grid */}
// // //         <form onSubmit={submit} className="space-y-6">
// // //           <div className="space-y-4">
// // //             <label className="text-xs font-semibold text-dark-600 uppercase">Event *</label>
// // //             <select className="input h-12" value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)} required>
// // //               <option value="" disabled>Select Event</option>
// // //               {events.map(ev => (
// // //                 <option key={ev._id} value={ev._id}>{ev.title}</option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div className="space-y-4">
// // //             <label className="text-xs font-semibold text-dark-600 uppercase">Item Name *</label>
// // //             <input className="input h-12" placeholder="e.g. Club T-Shirt" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
// // //           </div>

// // //           <div className="grid gap-4 md:grid-cols-2">
// // //             <div className="space-y-2">
// // //               <label className="text-xs font-semibold text-dark-600 uppercase">Price *</label>
// // //               <input className="input h-12" type="number" min="0" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <label className="text-xs font-semibold text-dark-600 uppercase">Total Quantity *</label>
// // //               <input className="input h-12" type="number" min="1" placeholder="Total Quantity" value={form.totalQuantity} onChange={(e)=>setForm({...form,totalQuantity:e.target.value})} required />
// // //             </div>
// // //           </div>

// // //           <div className="space-y-2">
// // //             <label className="text-xs font-semibold text-dark-600 uppercase">Item Image</label>
// // //             <input className="input h-12" type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files[0])} />
// // //             {preview && <img src={preview} alt="preview" className="h-28 w-full object-cover rounded-lg border border-dark-100" />}
// // //           </div>

// // //           <div className="space-y-3">
// // //             <div className="flex items-center justify-between">
// // //               <h4 className="text-sm font-semibold text-dark-800">Bank Details</h4>
// // //               <Button type="button" variant="secondary" size="sm" onClick={addBank}>Add Bank</Button>
// // //             </div>
// // //             {banks.map((b, idx) => (
// // //               <div key={idx} className="rounded-2xl border border-dark-100 bg-dark-50 p-4 space-y-3">
// // //                 <div className="grid md:grid-cols-2 gap-3">
// // //                   <input className="input h-11" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
// // //                   <input className="input h-11" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
// // //                   <input className="input h-11" placeholder="Account Number" value={b.accountNumber} onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)} required />
// // //                   <input className="input h-11" placeholder="Branch (optional)" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
// // //                 </div>
// // //                 {banks.length > 1 && (
// // //                   <div className="flex justify-end">
// // //                     <Button variant="secondary" size="sm" type="button" onClick={()=>removeBank(idx)}>Remove</Button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div className="flex justify-end gap-2 pt-2">
// // //             {editingId && (
// // //               <Button type="button" variant="secondary" onClick={resetForm}>
// // //                 Cancel
// // //               </Button>
// // //             )}
// // //             <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
// // //           </div>
// // //         </form>
// // //       </div>

// // //       {/* Items list below form */}
// // //       <div className="space-y-3">
// // //         <h3 className="text-lg font-semibold text-dark-900">Items</h3>
// // //         {items.length === 0 && (
// // //           <div className="card p-6 text-sm text-dark-500">No merchandise for this event yet.</div>
// // //         )}
// // //         {items.map((m) => (
// // //           <div key={m._id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //             <div className="flex gap-3">
// // //               <div className="h-20 w-20 rounded-xl overflow-hidden bg-dark-50 border border-dark-100">
// // //                 {m.image ? (
// // //                   <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
// // //                 ) : (
// // //                   <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
// // //                 )}
// // //               </div>
// // //               <div>
// // //                 <p className="font-semibold text-dark-900">{m.name}</p>
// // //                 <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
// // //                 <p className="text-xs text-primary-700 font-semibold">
// // //                   Sold: {m.soldQuantity} / {m.totalQuantity}
// // //                 </p>
// // //                 <div className="mt-1 space-y-1">
// // //                   {m.bankDetails?.map((b,i)=>(
// // //                     <p key={i} className="text-[11px] text-dark-500">
// // //                       {b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}
// // //                     </p>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <div className="flex gap-2">
// // //               <Button variant="secondary" size="sm" onClick={()=>startEdit(m)}>Edit</Button>
// // //               <Button variant="danger" size="sm" onClick={()=>del(m._id)}>Delete</Button>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AddMerchandise;


// // import React, { useEffect, useState } from 'react';
// // import merchService from '../../services/merchService';
// // import eventService from '../../services/eventService';
// // import Button from '../../components/ui/Button';
// // import Spinner from '../../components/ui/Spinner';
// // import toast from 'react-hot-toast';
// // import useAuth from '../../hooks/useAuth';
// // import { formatCurrency } from '../../utils/formatCurrency';

// // const makeBlankBank = () => ({ bankName: '', accountName: '', accountNumber: '', branch: '' });

// // const AddMerchandise = () => {
// //   const { user } = useAuth();
// //   const [events, setEvents] = useState([]);
// //   const [selectedEvent, setSelectedEvent] = useState('');
// //   const [banks, setBanks] = useState([makeBlankBank()]);
// //   const [form, setForm] = useState({ name: '', price: '', totalQuantity: '', merchImage: null });
// //   const [preview, setPreview] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [items, setItems] = useState([]);
// //   const [editingId, setEditingId] = useState(null);

// //   useEffect(() => {
// //     const load = async () => {
// //       setLoading(true);
// //       try {
// //         const resp = await eventService.getEvents({ page: 1, limit: 500 });
// //         const evts = resp?.data?.data || resp?.data || resp;
// //         const mine = (evts || []).filter((e) => {
// //           const ownerId = typeof e.createdBy === 'string' ? e.createdBy : e.createdBy?._id;
// //           return ownerId === user?._id;
// //         });
// //         setEvents(mine);
// //         if (mine[0]) setSelectedEvent(mine[0]._id);
// //       } catch (err) {
// //         toast.error(err.response?.data?.message || 'Unable to load events');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     load();
// //   }, [user]);

// //   useEffect(() => {
// //     const loadItems = async () => {
// //       if (!selectedEvent) return;
// //       const list = await merchService.getEventMerch(selectedEvent);
// //       setItems(list);
// //     };
// //     loadItems();
// //   }, [selectedEvent]);

// //   const handleBankChange = (idx, field, val) => {
// //     // numeric check for accountNumber
// //     if (field === 'accountNumber' && val && !/^\d*$/.test(val)) {
// //       toast.error('Account Number must be digits only');
// //       return;
// //     }
// //     setBanks((prev) => {
// //       const next = prev.map((b) => ({ ...b }));
// //       next[idx][field] = val;
// //       return next;
// //     });
// //   };

// //   const addBank = () => setBanks((b) => [...b.map((x) => ({ ...x })), makeBlankBank()]);
// //   const removeBank = (idx) => setBanks((b) => b.filter((_, i) => i !== idx));

// //   const resetForm = () => {
// //     setForm({ name: '', price: '', totalQuantity: '', merchImage: null });
// //     setBanks([makeBlankBank()]);
// //     setPreview(null);
// //     setEditingId(null);
// //   };

// //   const onFileChange = (file) => {
// //     setForm((f) => ({ ...f, merchImage: file }));
// //     setPreview(file ? URL.createObjectURL(file) : null);
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     if (!selectedEvent) return toast.error('Select an event');

// //     // prevent negative or non-numeric price/quantity
// //     if (Number(form.price) < 0 || isNaN(Number(form.price))) return toast.error('Price must be a positive number');
// //     if (Number(form.totalQuantity) < 1 || isNaN(Number(form.totalQuantity))) return toast.error('Quantity must be at least 1');

// //     setSaving(true);
// //     try {
// //       const payload = {
// //         eventId: selectedEvent,
// //         name: form.name,
// //         price: form.price,
// //         totalQuantity: form.totalQuantity,
// //         bankDetails: banks,
// //         merchImage: form.merchImage,
// //       };
// //       if (editingId) {
// //         await merchService.updateMerch(editingId, payload);
// //         toast.success('Merchandise updated');
// //       } else {
// //         await merchService.createMerch(payload);
// //         toast.success('Merchandise created');
// //       }
// //       resetForm();
// //       const list = await merchService.getEventMerch(selectedEvent);
// //       setItems(list);
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to save merchandise');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const startEdit = (item) => {
// //     setEditingId(item._id);
// //     setForm({
// //       name: item.name,
// //       price: item.price,
// //       totalQuantity: item.totalQuantity,
// //       merchImage: null,
// //     });
// //     setBanks(item.bankDetails?.length ? item.bankDetails.map((b) => ({ ...b })) : [makeBlankBank()]);
// //     setPreview(item.image || null);
// //   };

// //   const del = async (id) => {
// //     if (!window.confirm('Delete this item?')) return;
// //     await merchService.deleteMerch(id);
// //     toast.success('Deleted');
// //     setItems((prev) => prev.filter((m) => m._id !== id));
// //     if (editingId === id) resetForm();
// //   };

// //   if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

// //   return (
// //     <div className="space-y-8">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-dark-900">Merchandise</h1>
// //           <p className="text-sm text-dark-500">Create, edit, and delete merchandise per event.</p>
// //         </div>
// //       </div>

// //       <div className="card p-5 md:p-6 space-y-6 max-w-4xl">
// //         <div>
// //           <h3 className="text-lg font-semibold text-dark-900 mb-2">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
// //           <p className="text-xs text-dark-500">Smaller form footprint with clear labels.</p>
// //         </div>

// //         <form onSubmit={submit} className="space-y-5">
// //           <div className="space-y-2">
// //             <label className="text-[11px] font-semibold text-dark-600 uppercase">Event *</label>
// //             <select className="input h-11 text-sm" value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)} required>
// //               <option value="" disabled>Select Event</option>
// //               {events.map(ev => (
// //                 <option key={ev._id} value={ev._id}>{ev.title}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="space-y-2">
// //             <label className="text-[11px] font-semibold text-dark-600 uppercase">Item Name *</label>
// //             <input className="input h-11 text-sm" placeholder="e.g. Club T-Shirt" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
// //           </div>

// //           <div className="grid gap-3 md:grid-cols-2">
// //             <div className="space-y-1">
// //               <label className="text-[11px] font-semibold text-dark-600 uppercase">Price *</label>
// //               <input className="input h-11 text-sm" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
// //             </div>
// //             <div className="space-y-1">
// //               <label className="text-[11px] font-semibold text-dark-600 uppercase">Total Quantity *</label>
// //               <input className="input h-11 text-sm" type="number" min="1" step="1" placeholder="Total Quantity" value={form.totalQuantity} onChange={(e)=>setForm({...form,totalQuantity:e.target.value})} required />
// //             </div>
// //           </div>

// //           <div className="space-y-2">
// //             <label className="text-[11px] font-semibold text-dark-600 uppercase">Item Image</label>
// //             <input className="input h-11 text-sm" type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files[0])} />
// //             {preview && <img src={preview} alt="preview" className="h-24 w-full object-cover rounded-lg border border-dark-100" />}
// //           </div>

// //           <div className="space-y-3">
// //             <div className="flex items-center justify-between">
// //               <h4 className="text-sm font-semibold text-dark-800">Bank Details</h4>
// //               <Button type="button" variant="secondary" size="sm" onClick={addBank}>Add Bank</Button>
// //             </div>
// //             {banks.map((b, idx) => (
// //               <div key={idx} className="rounded-xl border border-dark-100 bg-dark-50 p-3 space-y-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
// //                 <div className="grid md:grid-cols-2 gap-2">
// //                   <input className="input h-10 text-sm" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
// //                   <input className="input h-10 text-sm" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
// //                   <input className="input h-10 text-sm" placeholder="Account Number (digits only)" value={b.accountNumber} onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)} required />
// //                   <input className="input h-10 text-sm" placeholder="Branch (optional)" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
// //                 </div>
// //                 {banks.length > 1 && (
// //                   <div className="flex justify-end">
// //                     <Button variant="secondary" size="sm" type="button" onClick={()=>removeBank(idx)}>Remove</Button>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           <div className="flex justify-end gap-2 pt-2">
// //             {editingId && (
// //               <Button type="button" variant="secondary" onClick={resetForm}>
// //                 Cancel
// //               </Button>
// //             )}
// //             <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
// //           </div>
// //         </form>
// //       </div>

// //       {/* Items list below form */}
// //       <div className="space-y-3">
// //         <h3 className="text-lg font-semibold text-dark-900">Items</h3>
// //         {items.length === 0 && (
// //           <div className="card p-6 text-sm text-dark-500">No merchandise for this event yet.</div>
// //         )}
// //         {items.map((m) => {
// //           const available = m.totalQuantity - m.soldQuantity;
// //           return (
// //             <div key={m._id} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
// //               <div className="flex gap-3">
// //                 <div className="h-20 w-20 rounded-xl overflow-hidden bg-dark-50 border border-dark-100">
// //                   {m.image ? (
// //                     <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
// //                   ) : (
// //                     <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold text-dark-900">{m.name}</p>
// //                   <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
// //                   <div className="mt-1 flex items-center gap-3 text-xs font-semibold">
// //                     <span className="text-primary-700">Sold: {m.soldQuantity}</span>
// //                     <span className="text-dark-500">/</span>
// //                     <span className="text-emerald-700">Total: {m.totalQuantity}</span>
// //                     <span className="text-dark-500">(Available {available})</span>
// //                   </div>
// //                   <div className="mt-1 space-y-1">
// //                     {m.bankDetails?.map((b,i)=>(
// //                       <p key={i} className="text-[11px] text-dark-500 bg-dark-50/50 rounded px-2 py-1 inline-block">
// //                         {b.bankName} · {b.accountName} · {b.accountNumber}{b.branch ? ` · ${b.branch}` : ''}
// //                       </p>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="flex gap-2">
// //                 <Button variant="secondary" size="sm" onClick={()=>startEdit(m)}>Edit</Button>
// //                 <Button variant="danger" size="sm" onClick={()=>del(m._id)}>Delete</Button>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddMerchandise;

// import React, { useEffect, useState } from 'react';
// import merchService from '../../services/merchService';
// import eventService from '../../services/eventService';
// import Button from '../../components/ui/Button';
// import Spinner from '../../components/ui/Spinner';
// import toast from 'react-hot-toast';
// import useAuth from '../../hooks/useAuth';
// import { formatCurrency } from '../../utils/formatCurrency';

// const makeBlankBank = () => ({ bankName: '', accountName: '', accountNumber: '', branch: '' });

// const AddMerchandise = () => {
//   const { user } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState('');
//   const [banks, setBanks] = useState([makeBlankBank()]);
//   const [bankErrors, setBankErrors] = useState(['']);
//   const [form, setForm] = useState({ name: '', price: '', totalQuantity: '', merchImage: null });
//   const [errors, setErrors] = useState({ price: '', totalQuantity: '' });
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [items, setItems] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const resp = await eventService.getEvents({ page: 1, limit: 500 });
//         const evts = resp?.data?.data || resp?.data || resp;
//         const mine = (evts || []).filter((e) => {
//           const ownerId = typeof e.createdBy === 'string' ? e.createdBy : e.createdBy?._id;
//           return ownerId === user?._id;
//         });
//         setEvents(mine);
//         if (mine[0]) setSelectedEvent(mine[0]._id);
//       } catch (err) {
//         toast.error(err.response?.data?.message || 'Unable to load events');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [user]);

//   useEffect(() => {
//     const loadItems = async () => {
//       if (!selectedEvent) return;
//       const list = await merchService.getEventMerch(selectedEvent);
//       setItems(list);
//     };
//     loadItems();
//   }, [selectedEvent]);

//   const handleNumberField = (field, value, min = 0) => {
//     if (!/^\d*$/.test(value)) {
//       setErrors((e) => ({ ...e, [field]: 'Numbers only' }));
//     } else if (value !== '' && Number(value) < min) {
//       setErrors((e) => ({ ...e, [field]: `Must be ≥ ${min}` }));
//     } else {
//       setErrors((e) => ({ ...e, [field]: '' }));
//     }
//     setForm((f) => ({ ...f, [field]: value }));
//   };

//   const handleBankChange = (idx, field, val) => {
//     setBanks((prev) => {
//       const next = prev.map((b) => ({ ...b }));
//       next[idx][field] = val;
//       return next;
//     });
//     if (field === 'accountNumber') {
//       setBankErrors((prev) => {
//         const next = [...prev];
//         next[idx] = /^\d*$/.test(val) ? '' : 'Digits only';
//         return next;
//       });
//     }
//   };

//   const addBank = () => {
//     setBanks((b) => [...b.map((x) => ({ ...x })), makeBlankBank()]);
//     setBankErrors((e) => [...e, '']);
//   };
//   const removeBank = (idx) => {
//     setBanks((b) => b.filter((_, i) => i !== idx));
//     setBankErrors((e) => e.filter((_, i) => i !== idx));
//   };

//   const resetForm = () => {
//     setForm({ name: '', price: '', totalQuantity: '', merchImage: null });
//     setErrors({ price: '', totalQuantity: '' });
//     setBanks([makeBlankBank()]);
//     setBankErrors(['']);
//     setPreview(null);
//     setEditingId(null);
//   };

//   const onFileChange = (file) => {
//     setForm((f) => ({ ...f, merchImage: file }));
//     setPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const hasErrors = () =>
//     errors.price || errors.totalQuantity || bankErrors.some((e) => e);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!selectedEvent) return toast.error('Select an event');
//     if (hasErrors()) return toast.error('Fix validation errors first');

//     setSaving(true);
//     try {
//       const payload = {
//         eventId: selectedEvent,
//         name: form.name,
//         price: form.price,
//         totalQuantity: form.totalQuantity,
//         bankDetails: banks,
//         merchImage: form.merchImage,
//       };
//       if (editingId) {
//         await merchService.updateMerch(editingId, payload);
//         toast.success('Merchandise updated');
//       } else {
//         await merchService.createMerch(payload);
//         toast.success('Merchandise created');
//       }
//       resetForm();
//       const list = await merchService.getEventMerch(selectedEvent);
//       setItems(list);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save merchandise');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startEdit = (item) => {
//     setEditingId(item._id);
//     setForm({
//       name: item.name,
//       price: item.price,
//       totalQuantity: item.totalQuantity,
//       merchImage: null,
//     });
//     setBanks(item.bankDetails?.length ? item.bankDetails.map((b) => ({ ...b })) : [makeBlankBank()]);
//     setBankErrors(item.bankDetails?.map(() => '') || ['']);
//     setPreview(item.image || null);
//   };

//   const del = async (id) => {
//     if (!window.confirm('Delete this item?')) return;
//     await merchService.deleteMerch(id);
//     toast.success('Deleted');
//     setItems((prev) => prev.filter((m) => m._id !== id));
//     if (editingId === id) resetForm();
//   };

//   if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-dark-900">Merchandise</h1>
//           <p className="text-sm text-dark-500">Create, edit, and delete merchandise per event.</p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="card p-5 md:p-6 space-y-6 max-w-4xl">
//         <div className="space-y-1">
//           <h3 className="text-lg font-semibold text-dark-900">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
//           <p className="text-xs text-dark-500">Keep details concise. Upload a clear product image.</p>
//         </div>

//         <form onSubmit={submit} className="space-y-5">
//           <div className="space-y-2">
//             <label className="text-xs font-semibold text-dark-600 uppercase">Event *</label>
//             <select className="input h-11" value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)} required>
//               <option value="" disabled>Select Event</option>
//               {events.map(ev => (
//                 <option key={ev._id} value={ev._id}>{ev.title}</option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-semibold text-dark-600 uppercase">Item Name *</label>
//             <input className="input h-11" placeholder="e.g. Club T-Shirt" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
//           </div>

//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <label className="text-xs font-semibold text-dark-600 uppercase">Price *</label>
//               <input
//                 className="input h-11"
//                 type="text"
//                 inputMode="numeric"
//                 placeholder="Price"
//                 value={form.price}
//                 onChange={(e)=>handleNumberField('price', e.target.value, 0)}
//                 required
//               />
//               {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
//             </div>
//             <div className="space-y-1">
//               <label className="text-xs font-semibold text-dark-600 uppercase">Total Quantity *</label>
//               <input
//                 className="input h-11"
//                 type="text"
//                 inputMode="numeric"
//                 placeholder="Total Quantity"
//                 value={form.totalQuantity}
//                 onChange={(e)=>handleNumberField('totalQuantity', e.target.value, 1)}
//                 required
//               />
//               {errors.totalQuantity && <p className="text-xs text-red-600">{errors.totalQuantity}</p>}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-semibold text-dark-600 uppercase">Item Image</label>
//             <input className="input h-11" type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files[0])} />
//             {preview && <img src={preview} alt="preview" className="h-24 w-full object-cover rounded-lg border border-dark-100" />}
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <h4 className="text-sm font-semibold text-dark-800">Bank Details</h4>
//               <Button type="button" variant="secondary" size="sm" onClick={addBank}>Add Bank</Button>
//             </div>
//             {banks.map((b, idx) => (
//               <div key={idx} className="rounded-2xl border border-dark-100 bg-dark-50 p-4 space-y-3">
//                 <div className="grid md:grid-cols-2 gap-3">
//                   <input className="input h-11" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
//                   <input className="input h-11" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
//                   <div className="space-y-1">
//                     <input
//                       className="input h-11"
//                       placeholder="Account Number"
//                       value={b.accountNumber}
//                       inputMode="numeric"
//                       onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)}
//                       required
//                     />
//                     {bankErrors[idx] && <p className="text-xs text-red-600">{bankErrors[idx]}</p>}
//                   </div>
//                   <input className="input h-11" placeholder="Branch (optional)" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
//                 </div>
//                 <div className="flex flex-wrap gap-2 text-[11px] text-dark-600">
//                   <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.bankName || 'Bank'}</span>
//                   <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.accountName || 'Account name'}</span>
//                   <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.accountNumber || 'Account #'}</span>
//                   {b.branch && <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.branch}</span>}
//                 </div>
//                 {banks.length > 1 && (
//                   <div className="flex justify-end">
//                     <Button variant="secondary" size="sm" type="button" onClick={()=>removeBank(idx)}>Remove</Button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-2 pt-2">
//             {editingId && (
//               <Button type="button" variant="secondary" onClick={resetForm}>
//                 Cancel
//               </Button>
//             )}
//             <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
//           </div>
//         </form>
//       </div>

//       {/* Items list */}
//       <div className="space-y-3">
//         <h3 className="text-lg font-semibold text-dark-900">Items</h3>
//         {items.length === 0 && (
//           <div className="card p-6 text-sm text-dark-500">No merchandise for this event yet.</div>
//         )}
//         {items.map((m) => {
//           const sold = m.soldQuantity || 0;
//           const total = m.totalQuantity || 0;
//           const available = total - sold;
//           return (
//             <div key={m._id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex gap-3">
//                 <div className="h-20 w-20 rounded-xl overflow-hidden bg-dark-50 border border-dark-100">
//                   {m.image ? (
//                     <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
//                   )}
//                 </div>
//                 <div className="space-y-1">
//                   <p className="font-semibold text-dark-900">{m.name}</p>
//                   <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
//                   <div className="flex gap-2 text-xs font-semibold">
//                     <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">Sold: {sold}</span>
//                     <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Total: {total}</span>
//                     <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Available: {available}</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {m.bankDetails?.map((b,i)=>(
//                       <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-dark-50 border border-dark-100 text-dark-600">
//                         {b.bankName} · {b.accountName} · {b.accountNumber}{b.branch ? ` · ${b.branch}` : ''}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="secondary" size="sm" onClick={()=>startEdit(m)}>Edit</Button>
//                 <Button variant="danger" size="sm" onClick={()=>del(m._id)}>Delete</Button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AddMerchandise;

import React, { useEffect, useState } from 'react';
import merchService from '../../services/merchService';
import eventService from '../../services/eventService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';

const makeBlankBank = () => ({ bankName: '', accountName: '', accountNumber: '', branch: '' });

const AddMerchandise = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [banks, setBanks] = useState([makeBlankBank()]);
  const [bankErrors, setBankErrors] = useState(['']);
  const [form, setForm] = useState({ name: '', venue: '', price: '', totalQuantity: '', merchImage: null });
  const [errors, setErrors] = useState({ price: '', totalQuantity: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await eventService.getEvents({ page: 1, limit: 500 });
        const evts = resp?.data?.data || resp?.data || resp;
        const mine = (evts || []).filter((e) => {
          const ownerId = typeof e.createdBy === 'string' ? e.createdBy : e.createdBy?._id;
          return ownerId === user?._id;
        });
        setEvents(mine);
        if (mine[0]) setSelectedEvent(mine[0]._id);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    const loadItems = async () => {
      if (!selectedEvent) return;
      const list = await merchService.getEventMerch(selectedEvent);
      setItems(list);
    };
    loadItems();
  }, [selectedEvent]);

  const handleNumberField = (field, value, min = 0) => {
    if (!/^\d*$/.test(value)) {
      setErrors((e) => ({ ...e, [field]: 'Numbers only' }));
    } else if (value !== '' && Number(value) < min) {
      setErrors((e) => ({ ...e, [field]: `Must be ≥ ${min}` }));
    } else {
      setErrors((e) => ({ ...e, [field]: '' }));
    }
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleBankChange = (idx, field, val) => {
    setBanks((prev) => {
      const next = prev.map((b) => ({ ...b }));
      next[idx][field] = val;
      return next;
    });
    if (field === 'accountNumber') {
      setBankErrors((prev) => {
        const next = [...prev];
        next[idx] = /^\d*$/.test(val) ? '' : 'Digits only';
        return next;
      });
    }
  };

  const addBank = () => {
    setBanks((b) => [...b.map((x) => ({ ...x })), makeBlankBank()]);
    setBankErrors((e) => [...e, '']);
  };
  const removeBank = (idx) => {
    setBanks((b) => b.filter((_, i) => i !== idx));
    setBankErrors((e) => e.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setForm({ name: '', venue: '', price: '', totalQuantity: '', merchImage: null });
    setErrors({ price: '', totalQuantity: '' });
    setBanks([makeBlankBank()]);
    setBankErrors(['']);
    setPreview(null);
    setEditingId(null);
  };

  const onFileChange = (file) => {
    setForm((f) => ({ ...f, merchImage: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const hasErrors = () => errors.price || errors.totalQuantity || bankErrors.some((e) => e);

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return toast.error('Select an event');
    if (hasErrors()) return toast.error('Fix validation errors first');
    setSaving(true);
    try {
      const payload = {
        eventId: selectedEvent,
        name: form.name,
        venue: form.venue,
        price: form.price,
        totalQuantity: form.totalQuantity,
        bankDetails: banks,
        merchImage: form.merchImage,
      };
      if (editingId) {
        await merchService.updateMerch(editingId, payload);
        toast.success('Merchandise updated');
      } else {
        await merchService.createMerch(payload);
        toast.success('Merchandise created');
      }
      resetForm();
      const list = await merchService.getEventMerch(selectedEvent);
      setItems(list);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save merchandise');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      venue: item.venue,
      price: item.price,
      totalQuantity: item.totalQuantity,
      merchImage: null,
    });
    setBanks(item.bankDetails?.length ? item.bankDetails.map((b) => ({ ...b })) : [makeBlankBank()]);
    setBankErrors(item.bankDetails?.map(() => '') || ['']);
    setPreview(item.image || null);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await merchService.deleteMerch(id);
    toast.success('Deleted');
    setItems((prev) => prev.filter((m) => m._id !== id));
    if (editingId === id) resetForm();
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Merchandise</h1>
          <p className="text-sm text-dark-500">Create, edit, and delete merchandise per event.</p>
        </div>
      </div>

      <div className="card p-5 md:p-6 space-y-6 max-w-4xl">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-dark-900">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
          <p className="text-xs text-dark-500">Keep details concise. Upload a clear product image.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-600 uppercase">Event *</label>
            <select className="input h-11" value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)} required>
              <option value="" disabled>Select Event</option>
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-600 uppercase">Item Name *</label>
            <input className="input h-11" placeholder="e.g. Club T-Shirt" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-600 uppercase">Venue *</label>
            <input className="input h-11" placeholder="Pickup venue" value={form.venue} onChange={(e)=>setForm({...form,venue:e.target.value})} required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-dark-600 uppercase">Price *</label>
              <input
                className="input h-11"
                type="text"
                inputMode="numeric"
                placeholder="Price"
                value={form.price}
                onChange={(e)=>handleNumberField('price', e.target.value, 0)}
                required
              />
              {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-dark-600 uppercase">Total Quantity *</label>
              <input
                className="input h-11"
                type="text"
                inputMode="numeric"
                placeholder="Total Quantity"
                value={form.totalQuantity}
                onChange={(e)=>handleNumberField('totalQuantity', e.target.value, 1)}
                required
              />
              {errors.totalQuantity && <p className="text-xs text-red-600">{errors.totalQuantity}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-600 uppercase">Item Image</label>
            <input className="input h-11" type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files[0])} />
            {preview && <img src={preview} alt="preview" className="h-24 w-full object-cover rounded-lg border border-dark-100" />}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-dark-800">Bank Details</h4>
              <Button type="button" variant="secondary" size="sm" onClick={addBank}>Add Bank</Button>
            </div>
            {banks.map((b, idx) => (
              <div key={idx} className="rounded-2xl border border-dark-100 bg-dark-50 p-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="input h-11" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
                  <input className="input h-11" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
                  <div className="space-y-1">
                    <input
                      className="input h-11"
                      placeholder="Account Number"
                      value={b.accountNumber}
                      inputMode="numeric"
                      onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)}
                      required
                    />
                    {bankErrors[idx] && <p className="text-xs text-red-600">{bankErrors[idx]}</p>}
                  </div>
                  <input className="input h-11" placeholder="Branch (optional)" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-dark-600">
                  <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.bankName || 'Bank'}</span>
                  <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.accountName || 'Account name'}</span>
                  <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.accountNumber || 'Account #'}</span>
                  {b.branch && <span className="px-2 py-1 rounded-full bg-white border border-dark-100">{b.branch}</span>}
                </div>
                {banks.length > 1 && (
                  <div className="flex justify-end">
                    <Button variant="secondary" size="sm" type="button" onClick={()=>removeBank(idx)}>Remove</Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-dark-900">Items</h3>
        {items.length === 0 && (
          <div className="card p-6 text-sm text-dark-500">No merchandise for this event yet.</div>
        )}
        {items.map((m) => {
          const sold = m.soldQuantity || 0;
          const total = m.totalQuantity || 0;
          const available = total - sold;
          return (
            <div key={m._id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-dark-50 border border-dark-100">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-dark-900">{m.name}</p>
                  <p className="text-xs text-dark-500">Venue: {m.venue}</p>
                  <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">Sold: {sold}</span>
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Total: {total}</span>
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Available: {available}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {m.bankDetails?.map((b,i)=>(
                      <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-dark-50 border border-dark-100 text-dark-600">
                        {b.bankName} · {b.accountName} · {b.accountNumber}{b.branch ? ` · ${b.branch}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={()=>startEdit(m)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={()=>del(m._id)}>Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddMerchandise;
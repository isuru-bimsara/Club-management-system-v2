import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import merchService from '../../services/merchService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const blankBank = { bankName: '', accountName: '', accountNumber: '', branch: '' };

const ManageMerch = () => {
  const { id: eventId } = useParams();
  const [items, setItems] = useState([]);
  const [banks, setBanks] = useState([blankBank]);
  const [form, setForm] = useState({ name: '', price: '', totalQuantity: '', bannerImage: null });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const list = await merchService.getEventMerch(eventId);
    setItems(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, [eventId]);

  const handleBankChange = (idx, field, val) => {
    const next = [...banks];
    next[idx][field] = val;
    setBanks(next);
  };

  const addBank = () => setBanks((b) => [...b, blankBank]);
  const removeBank = (idx) => setBanks((b) => b.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await merchService.createMerch({
        eventId,
        name: form.name,
        price: form.price,
        totalQuantity: form.totalQuantity,
        bankDetails: banks,
        bannerImage: form.bannerImage,
      });
      toast.success('Merchandise created');
      setForm({ name: '', price: '', totalQuantity: '', bannerImage: null });
      setBanks([blankBank]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-900">Merchandise for Event</h1>

      <form onSubmit={submit} className="card p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
          <input className="input" type="number" placeholder="Total Quantity" value={form.totalQuantity} onChange={(e)=>setForm({...form,totalQuantity:e.target.value})} required />
          <input className="input md:col-span-3" type="file" accept="image/*" onChange={(e)=>setForm({...form,bannerImage:e.target.files[0]})} />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-dark-800">Bank Details</h3>
          {banks.map((b, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-3">
              <input className="input" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
              <input className="input" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
              <input className="input" placeholder="Account Number" value={b.accountNumber} onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)} required />
              <input className="input" placeholder="Branch" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
              <div className="md:col-span-4 flex justify-end">
                {banks.length > 1 && <Button variant="secondary" type="button" onClick={()=>removeBank(idx)}>Remove</Button>}
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addBank}>Add Bank</Button>
        </div>

        <Button type="submit">Create Merchandise</Button>
      </form>

      <div className="grid gap-3">
        {items.map((m) => (
          <div key={m._id} className="card p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-dark-900">{m.name}</p>
              <p className="text-sm text-dark-500">LKR {m.price}</p>
              <p className="text-xs text-dark-400">Available: {m.totalQuantity - m.soldQuantity} / {m.totalQuantity}</p>
              {m.bankDetails?.map((b, i) => (
                <p key={i} className="text-xs text-dark-500">
                  {b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}
                </p>
              ))}
            </div>
            <span className="text-sm text-primary-700 font-semibold">Sold {m.soldQuantity}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-dark-500">No merchandise yet.</p>}
      </div>
    </div>
  );
};

export default ManageMerch;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PurchaseOrder, LineItem, Vendor, COMPANY_DETAILS } from './types';
import { generatePONumber } from './utils/helpers';
import { getAIOptimizedDescription } from './services/geminiService';
import POPreview from './components/POPreview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isLoading, setIsLoading] = useState(false);
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState({
    materials: [] as string[],
    brands: [] as string[],
    specifications: [] as string[]
  });

  const [po, setPo] = useState<PurchaseOrder>({
    id: Math.random().toString(36).substr(2, 9),
    poNumber: "159",
    date: new Date().toISOString().split('T')[0],
    location: "Opposite- parameswaram LPS school",
    projectName: "Mr.ABHIRAJ CHEMPOOR",
    preparedBy: "sujith",
    vendor: { name: '', address: '', email: '', phone: '', gstin: '' },
    items: [
      { id: '1', description: 'Heatx', brand: 'Fevicol', specification: '2KG', quantity: 2, unit: 'Nos', rate: 0, taxPercent: 18 }
    ],
    notes: '',
    terms: '',
    totalAmount: 0,
    totalTax: 0,
    grandTotal: 0
  });

  // Load suggestions from localStorage on mount
  useEffect(() => {
    const savedMaterials = localStorage.getItem('msi_materials');
    const savedBrands = localStorage.getItem('msi_brands');
    const savedSpecs = localStorage.getItem('msi_specs');

    setSuggestions({
      materials: savedMaterials ? JSON.parse(savedMaterials) : [],
      brands: savedBrands ? JSON.parse(savedBrands) : [],
      specifications: savedSpecs ? JSON.parse(savedSpecs) : []
    });
  }, []);

  // Save current items to suggestions list
  const saveCurrentToSuggestions = useCallback(() => {
    const newMaterials = Array.from(new Set([...suggestions.materials, ...po.items.map(i => i.description).filter(Boolean)]));
    const newBrands = Array.from(new Set([...suggestions.brands, ...po.items.map(i => i.brand).filter(Boolean)]));
    const newSpecs = Array.from(new Set([...suggestions.specifications, ...po.items.map(i => i.specification).filter(Boolean)]));

    setSuggestions({
      materials: newMaterials,
      brands: newBrands,
      specifications: newSpecs
    });

    localStorage.setItem('msi_materials', JSON.stringify(newMaterials));
    localStorage.setItem('msi_brands', JSON.stringify(newBrands));
    localStorage.setItem('msi_specs', JSON.stringify(newSpecs));
  }, [po.items, suggestions]);

  const calculateTotals = useCallback(() => {
    let subtotal = 0;
    let taxTotal = 0;
    po.items.forEach(item => {
      const lineSubtotal = item.quantity * item.rate;
      const lineTax = lineSubtotal * (item.taxPercent / 100);
      subtotal += lineSubtotal;
      taxTotal += lineTax;
    });
    setPo(prev => ({ ...prev, totalAmount: subtotal, totalTax: taxTotal, grandTotal: subtotal + taxTotal }));
  }, [po.items]);

  useEffect(() => { calculateTotals(); }, [calculateTotals]);

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setPo(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      brand: '',
      specification: '',
      quantity: 1,
      unit: 'Nos',
      rate: 0,
      taxPercent: 18
    };
    setPo(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    if (po.items.length > 1) {
      setPo(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    }
  };

  const handlePreview = () => {
    saveCurrentToSuggestions();
    setActiveTab('preview');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Datalists for Dropdowns */}
      <datalist id="material-suggestions">
        {suggestions.materials.map(m => <option key={m} value={m} />)}
      </datalist>
      <datalist id="brand-suggestions">
        {suggestions.brands.map(b => <option key={b} value={b} />)}
      </datalist>
      <datalist id="spec-suggestions">
        {suggestions.specifications.map(s => <option key={s} value={s} />)}
      </datalist>

      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 no-print flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-black text-xl">M</div>
          <h1 className="font-bold leading-tight">MIDSPACE INTERIORS</h1>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md ${activeTab === 'form' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>Editor</button>
          <button onClick={handlePreview} className={`px-4 py-2 rounded-md ${activeTab === 'preview' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>Preview Export</button>
          <button onClick={() => { saveCurrentToSuggestions(); window.print(); }} className="px-4 py-2 bg-blue-600 rounded-md">Print</button>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8">
        {activeTab === 'form' ? (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">PRQ NO</label>
                <input className="w-full border-b p-1 outline-none focus:border-emerald-500" value={po.poNumber} onChange={e => setPo({...po, poNumber: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">PO Date</label>
                <input type="date" className="w-full border-b p-1 outline-none" value={po.date} onChange={e => setPo({...po, date: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                <input className="w-full border-b p-1 outline-none" value={po.projectName} onChange={e => setPo({...po, projectName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Prepared By</label>
                <input className="w-full border-b p-1 outline-none" value={po.preparedBy} onChange={e => setPo({...po, preparedBy: e.target.value})} />
              </div>
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                <input className="w-full border-b p-1 outline-none" value={po.location} onChange={e => setPo({...po, location: e.target.value})} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b flex justify-between">
                <h3 className="font-bold">Items List</h3>
                <button onClick={addItem} className="text-sm bg-emerald-600 text-white px-3 py-1 rounded">+ Add</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                    <tr>
                      <th className="px-4 py-2">Materials</th>
                      <th className="px-4 py-2">Brand</th>
                      <th className="px-4 py-2">Specification</th>
                      <th className="px-4 py-2 w-20">UOM</th>
                      <th className="px-4 py-2 w-20">Qty</th>
                      <th className="px-4 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {po.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <input 
                            list="material-suggestions"
                            className="w-full outline-none focus:bg-slate-50" 
                            value={item.description} 
                            onChange={e => updateItem(item.id, 'description', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="brand-suggestions"
                            className="w-full outline-none focus:bg-slate-50" 
                            value={item.brand} 
                            onChange={e => updateItem(item.id, 'brand', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="spec-suggestions"
                            className="w-full outline-none focus:bg-slate-50" 
                            value={item.specification} 
                            onChange={e => updateItem(item.id, 'specification', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            className="w-full outline-none" 
                            value={item.unit} 
                            onChange={e => updateItem(item.id, 'unit', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="number" 
                            className="w-full outline-none" 
                            value={item.quantity} 
                            onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} 
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:scale-110 transition-transform">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-center pb-10">
              <button onClick={handlePreview} className="bg-emerald-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all">Generate Preview & Save List</button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-center mb-8 space-x-4 no-print">
              <button onClick={() => setActiveTab('form')} className="bg-white px-6 py-2 rounded-full border shadow-sm">← Back to Editor</button>
              <button onClick={() => { saveCurrentToSuggestions(); window.print(); }} className="bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg">Download / Print PDF</button>
            </div>
            <POPreview po={po} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

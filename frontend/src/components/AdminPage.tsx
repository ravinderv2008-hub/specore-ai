import React, { useState } from 'react';
import { Shield, Plus, Trash2, Edit2, CheckCircle2, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';
import { AnyComponent, ComponentCategory } from '../types';
import { ALL_COMPONENTS } from '../data/componentsData';

export const AdminPage: React.FC = () => {
  const [componentsList, setComponentsList] = useState<AnyComponent[]>(ALL_COMPONENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  const [newComp, setNewComp] = useState<Partial<AnyComponent>>({
    category: 'CPU',
    brand: '',
    model: '',
    productName: '',
    price: 15000,
    rating: 4.8,
    reviewCount: 100,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60',
    description: '',
    powerRequirement: 65,
    availability: true,
    performanceScore: 80,
    advantages: ['High performance', 'Energy efficient'],
    disadvantages: ['Premium price'],
    recommendedUseCases: ['Gaming', 'Productivity']
  });

  const handleDelete = (id: number) => {
    setComponentsList(componentsList.filter(c => c.id !== id));
  };

  const handleSavePrice = (id: number) => {
    setComponentsList(
      componentsList.map(c => (c.id === id ? { ...c, price: newPrice } : c))
    );
    setEditingId(null);
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComp.brand || !newComp.model || !newComp.productName) return;

    const created: AnyComponent = {
      id: Date.now(),
      category: newComp.category as ComponentCategory,
      brand: newComp.brand,
      model: newComp.model,
      productName: newComp.productName,
      price: Number(newComp.price) || 10000,
      rating: 4.8,
      reviewCount: 50,
      imageUrl: newComp.imageUrl || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60',
      description: newComp.description || 'Verified SpecCore Component.',
      powerRequirement: Number(newComp.powerRequirement) || 65,
      availability: true,
      performanceScore: Number(newComp.performanceScore) || 80,
      advantages: newComp.advantages || ['Certified hardware'],
      disadvantages: newComp.disadvantages || ['Standard warranty'],
      recommendedUseCases: ['Gaming', 'General Computing']
    };

    setComponentsList([created, ...componentsList]);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>SpecCore Administrator Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Hardware Catalog & Inventory Control
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add new hardware, calibrate estimated market pricing, and manage component lifecycle flags.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Component</span>
        </button>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-400 font-semibold uppercase">Total Tracked SKUs</div>
          <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">
            {componentsList.length}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-400 font-semibold uppercase">Active Categories</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">10</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-400 font-semibold uppercase">Socket Profiles</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">AM5, LGA1700, AM4</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-400 font-semibold uppercase">System Status</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <PackageCheck className="h-5 w-5" />
            <span>Rule Engine Online</span>
          </div>
        </div>
      </div>

      {/* Components Management Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Brand & Model</th>
                <th className="px-6 py-4 font-bold">Power Draw</th>
                <th className="px-6 py-4 font-bold">Performance Index</th>
                <th className="px-6 py-4 font-bold">Estimated Price (₹)</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {componentsList.map(comp => (
                <tr key={comp.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    {comp.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {comp.brand} {comp.model}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-1">{comp.productName}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">{comp.powerRequirement}W</td>
                  <td className="px-6 py-4 text-xs font-semibold">{comp.performanceScore}/100</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {editingId === comp.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newPrice}
                          onChange={e => setNewPrice(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-xs border rounded bg-gray-50 dark:bg-gray-900"
                        />
                        <button
                          onClick={() => handleSavePrice(comp.id)}
                          className="text-xs text-emerald-600 font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span>₹{comp.price.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(comp.id);
                        setNewPrice(comp.price);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit Price"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete SKU"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Hardware SKU</h3>

            <form onSubmit={handleAddComponent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Category</label>
                <select
                  value={newComp.category}
                  onChange={e => setNewComp({ ...newComp, category: e.target.value as any })}
                  className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                >
                  {['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Cabinet', 'Cooler', 'Monitor'].map(
                    c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMD, ASUS"
                    value={newComp.brand}
                    onChange={e => setNewComp({ ...newComp, brand: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ryzen 9 7900X"
                    value={newComp.model}
                    onChange={e => setNewComp({ ...newComp, model: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500">Full Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AMD Ryzen 9 7900X 12-Core 24-Thread Desktop Processor"
                  value={newComp.productName}
                  onChange={e => setNewComp({ ...newComp, productName: e.target.value })}
                  className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newComp.price}
                    onChange={e => setNewComp({ ...newComp, price: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">TDP (Watts)</label>
                  <input
                    type="number"
                    value={newComp.powerRequirement}
                    onChange={e => setNewComp({ ...newComp, powerRequirement: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Perf (0-100)</label>
                  <input
                    type="number"
                    value={newComp.performanceScore}
                    onChange={e => setNewComp({ ...newComp, performanceScore: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

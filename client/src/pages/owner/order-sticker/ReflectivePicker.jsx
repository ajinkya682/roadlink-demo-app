import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import img4 from '../../../assets/images/stickers/reflective-chrome-blob.png';
import img5 from '../../../assets/images/stickers/reflective-halo-ring.png';
import img6 from '../../../assets/images/stickers/reflective-hazard-accent.png';
import img7 from '../../../assets/images/stickers/reflective-night-edge.png';

const MOCK_TEMPLATES = [
  { _id: '4', name: 'Reflective Chrome Blob', previewImageUrl: img4 },
  { _id: '5', name: 'Reflective Halo Ring', previewImageUrl: img5 },
  { _id: '6', name: 'Reflective Hazard Accent', previewImageUrl: img6 },
  { _id: '7', name: 'Reflective Night Edge', previewImageUrl: img7 }
];

export default function ReflectivePicker() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  // Array of selected template IDs. Order matters for badge "1" and "2".
  const [selections, setSelections] = useState([]);

  const handleSelect = (id) => {
    setSelections(prev => {
      // If already selected, maybe unselect? The spec says "tapping a third replaces the first".
      // What if they tap one that's already selected? Let's allow duplicates (same design twice).
      // Wait, if we allow duplicates, tapping the exact same card should select it as item #2.
      // Let's implement an array of selected objects instead of just IDs to allow duplicates safely if needed,
      // but typical UI grids toggle selection. Let's assume clicking a card adds it. If it's already in the list, 
      // maybe they can add it twice by tapping it again, or maybe tapping an already selected card deselects it?
      // Spec: "(can be the same design twice, or two different ones)". So clicking should probably add to a queue.
      // But how to deselect? A simple approach: 
      // Just keep a queue of length 2. Tapping appends. If length > 2, shift.
      
      const newSelections = [...prev, id];
      if (newSelections.length > 2) {
        newSelections.shift(); // Remove the oldest
      }
      return newSelections;
    });
  };

  const handleClear = () => {
    setSelections([]);
  };

  const handleContinue = () => {
    if (selections.length === 2) {
      navigate('/order-sticker/cart', { 
        state: { 
          tier: 'reflective', 
          vehicle,
          selections: [
            { templateId: selections[0], position: 'front', previewImageUrl: MOCK_TEMPLATES.find(t => t._id === selections[0]).previewImageUrl },
            { templateId: selections[1], position: 'back', previewImageUrl: MOCK_TEMPLATES.find(t => t._id === selections[1]).previewImageUrl }
          ] 
        } 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Reflective</h1>
        </div>
        <button onClick={handleClear} className="text-sm text-slate-500 font-medium">Clear</button>
      </header>

      <main className="flex-1 px-6 pt-6 pb-28 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Choose 2 designs</h2>
          <p className="text-slate-500 text-sm">(they can be the same or different)</p>
        </div>

        {/* Counter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-slate-200 flex justify-center items-center">
          <span className="font-bold text-[#1E3A8A] text-lg">{selections.length} of 2 selected</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {MOCK_TEMPLATES.map(template => {
            // Check how many times this template is selected and what positions (1 or 2)
            const selectionIndexes = [];
            selections.forEach((selId, index) => {
              if (selId === template._id) selectionIndexes.push(index + 1);
            });

            return (
              <div 
                key={template._id}
                onClick={() => handleSelect(template._id)}
                className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all relative ${
                  selectionIndexes.length > 0 ? 'border-2 border-[#1E3A8A] shadow-md' : 'border border-slate-200 shadow-sm'
                }`}
              >
                {/* Visual cue for reflective material */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 pointer-events-none z-10"></div>
                
                {/* Badges */}
                {selectionIndexes.length > 0 && (
                  <div className="absolute top-2 right-2 flex space-x-1 z-20">
                    {selectionIndexes.map(num => (
                      <div key={num} className="bg-[#1E3A8A] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
                        {num}
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview */}
                <div className="aspect-square bg-slate-100 relative">
                  <img src={template.previewImageUrl} alt={template.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-3 bg-white border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{template.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[420px] p-6 bg-white border-t border-slate-200 z-10 pb-8">
        <button
          onClick={handleContinue}
          disabled={selections.length !== 2}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-colors ${
            selections.length === 2
              ? 'bg-[#F59E0B] text-white hover:bg-amber-600' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

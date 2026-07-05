import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const MOCK_TEMPLATES = [
  { _id: '1', name: 'Standard Immersive Gradient', previewImageUrl: '/src/assets/images/stickers/standard-immersive-gradient.png' },
  { _id: '2', name: 'Standard Minimal Card', previewImageUrl: '/src/assets/images/stickers/standard-minimal-card.png' },
  { _id: '3', name: 'Standard Split Panel', previewImageUrl: '/src/assets/images/stickers/standard-split-panel.png' }
];

export default function StandardPicker() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const handleContinue = () => {
    if (selectedId) {
      // Pass selected data via state or context. Using state for simplicity.
      navigate('/order-sticker/cart', { state: { tier: 'standard', selections: [{ templateId: selectedId, position: null, previewImageUrl: MOCK_TEMPLATES.find(t => t._id === selectedId).previewImageUrl }] } });
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Choose Design</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-28 overflow-y-auto">
        <p className="text-slate-600 mb-6 font-medium">Select a layout for your Standard sticker.</p>
        
        <div className="space-y-6">
          {MOCK_TEMPLATES.map(template => {
            const isSelected = selectedId === template._id;
            return (
              <div 
                key={template._id}
                onClick={() => setSelectedId(template._id)}
                className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'border-2 border-[#1E3A8A] shadow-md relative' : 'border border-slate-200 shadow-sm'
                }`}
              >
                {/* Large Preview */}
                <div className="h-48 w-full bg-slate-100 relative">
                  <img src={template.previewImageUrl} alt={template.name} className="w-full h-full object-cover" />
                  
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-white rounded-full shadow-sm">
                      <CheckCircle2 size={24} className="text-[#10B981]" fill="currentColor" stroke="white" />
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-slate-800 text-lg">{template.name}</h3>
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
          disabled={!selectedId}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-colors ${
            selectedId 
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

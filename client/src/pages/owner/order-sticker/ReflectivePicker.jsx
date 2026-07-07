import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Maximize2, X } from 'lucide-react';

import img2 from '../../../assets/images/stickers/sticker-template2.png';
import img3 from '../../../assets/images/stickers/sticker-template3.png';
import img4 from '../../../assets/images/stickers/sticker-template4.png';
import img5 from '../../../assets/images/stickers/sticker-template5.png';
import img6 from '../../../assets/images/stickers/sticker-template6.png';
import img7 from '../../../assets/images/stickers/sticker-template7.png';
import img8 from '../../../assets/images/stickers/sticker-template8.png';
import img9 from '../../../assets/images/stickers/sticker-template9.png';
import img10 from '../../../assets/images/stickers/sticker-template10.png';
import img11 from '../../../assets/images/stickers/sticker-template11.png';
import img12 from '../../../assets/images/stickers/sticker-template12.png';
import img13 from '../../../assets/images/stickers/sticker-template13.png';
import img14 from '../../../assets/images/stickers/sticker-template14.png';
import img15 from '../../../assets/images/stickers/sticker-template15.png';
import img16 from '../../../assets/images/stickers/sticker-template16.png';
import img17 from '../../../assets/images/stickers/sticker-template17.png';
import img18 from '../../../assets/images/stickers/sticker-template18.png';
import img19 from '../../../assets/images/stickers/sticker-template19.png';

const MOCK_TEMPLATES = [
  { _id: 'template-2', name: 'Design 1', previewImageUrl: img2 },
  { _id: 'template-3', name: 'Design 2', previewImageUrl: img3 },
  { _id: 'template-4', name: 'Design 3', previewImageUrl: img4 },
  { _id: 'template-5', name: 'Design 4', previewImageUrl: img5 },
  { _id: 'template-6', name: 'Design 5', previewImageUrl: img6 },
  { _id: 'template-7', name: 'Design 6', previewImageUrl: img7 },
  { _id: 'template-8', name: 'Design 7', previewImageUrl: img8 },
  { _id: 'template-9', name: 'Design 8', previewImageUrl: img9 },
  { _id: 'template-10', name: 'Design 9', previewImageUrl: img10 },
  { _id: 'template-11', name: 'Design 10', previewImageUrl: img11 },
  { _id: 'template-12', name: 'Design 11', previewImageUrl: img12 },
  { _id: 'template-13', name: 'Design 12', previewImageUrl: img13 },
  { _id: 'template-14', name: 'Design 13', previewImageUrl: img14 },
  { _id: 'template-15', name: 'Design 14', previewImageUrl: img15 },
  { _id: 'template-16', name: 'Design 15', previewImageUrl: img16 },
  { _id: 'template-17', name: 'Design 16', previewImageUrl: img17 },
  { _id: 'template-18', name: 'Design 17', previewImageUrl: img18 },
  { _id: 'template-19', name: 'Design 18', previewImageUrl: img19 }
];

export default function ReflectivePicker() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  // Array of selected template IDs. Order matters for badge "1" and "2".
  const [selections, setSelections] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

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
                  
                  {/* Full Screen Button */}
                  <div className="absolute bottom-2 right-2 z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullScreenImage(template.previewImageUrl);
                      }}
                      className="bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white text-slate-700"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
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

      {/* Full Screen Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setFullScreenImage(null)}
            className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"
          >
            <X size={24} />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Full Screen Preview" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
        </div>
      )}
    </div>
  );
}

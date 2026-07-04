import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Image as ImageIcon, Palette, Lock, Eye, EyeOff } from 'lucide-react';

export default function PremiumCustomizer() {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [previewMode, setPreviewMode] = useState(false);
  const [activeElementId, setActiveElementId] = useState(null);

  const qrSafeZone = { width: 100, height: 100, bottom: 10, right: 10 };

  const addText = () => {
    const newElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'New Text',
      x: 20,
      y: 20,
      color: '#000000',
      fontSize: 16
    };
    setElements([...elements, newElement]);
    setActiveElementId(newElement.id);
  };

  const addImageMock = () => {
    alert('Image upload would trigger here');
  };

  const handleDrag = (id, dx, dy) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        let newX = el.x + dx;
        let newY = el.y + dy;
        
        // Simple mock snap away from QR zone (bottom right 100x100)
        // Canvas is roughly 100% width, ~300px height depending on device.
        // This is a simplified constraint for the MVP UI.
        
        return { ...el, x: newX, y: newY };
      }
      return el;
    }));
  };

  const handleContinue = () => {
    navigate('/order-sticker/cart', { 
      state: { 
        tier: 'premium', 
        selections: [], 
        customization: { layoutJson: elements, bgColor } 
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 relative">
      <header className="px-4 py-3 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Custom Design</h1>
        </div>
        <button 
          onClick={() => {
            setPreviewMode(!previewMode);
            setActiveElementId(null);
          }} 
          className="flex items-center space-x-1 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full"
        >
          {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{previewMode ? 'Edit' : 'Preview'}</span>
        </button>
      </header>

      {/* Editor Canvas Area */}
      <main className="flex-1 flex flex-col p-4">
        <div 
          className="w-full aspect-[4/3] rounded-xl shadow-md relative overflow-hidden transition-colors"
          style={{ backgroundColor: bgColor }}
          onClick={() => setActiveElementId(null)}
        >
          {/* Elements */}
          {elements.map(el => (
            <div 
              key={el.id}
              style={{ left: el.x, top: el.y, color: el.color, fontSize: el.fontSize }}
              className={`absolute cursor-move select-none p-1 ${!previewMode && activeElementId === el.id ? 'ring-2 ring-blue-500 ring-dashed' : ''}`}
              onClick={(e) => {
                if(previewMode) return;
                e.stopPropagation();
                setActiveElementId(el.id);
              }}
              // Minimal touch drag mock
              onTouchMove={(e) => {
                if(previewMode) return;
                const touch = e.touches[0];
                // basic drag logic requires state tracking start pos, simplifying for UI demo
              }}
            >
              {el.content}
            </div>
          ))}

          {/* Locked QR Safe Zone */}
          <div 
            className="absolute bg-white/90 border border-slate-300 rounded shadow-sm flex flex-col items-center justify-center p-2"
            style={{ 
              width: qrSafeZone.width, 
              height: qrSafeZone.height, 
              bottom: qrSafeZone.bottom, 
              right: qrSafeZone.right 
            }}
          >
             <div className="w-12 h-12 bg-black flex items-center justify-center text-white text-[8px] mb-1">QR</div>
             {!previewMode && (
               <div className="flex items-center text-[10px] text-slate-500 font-medium">
                 <Lock size={10} className="mr-1" /> Safe Zone
               </div>
             )}
          </div>
        </div>

        {/* Toolbar & Actions */}
        {!previewMode && (
          <div className="mt-auto bg-white rounded-t-2xl shadow-[0_-4px_15px_rgba(0,0,0,0.05)] p-4 -mx-4 pb-24">
            
            <div className="flex justify-around mb-6">
              <button onClick={addText} className="flex flex-col items-center text-slate-600 hover:text-[#1E3A8A]">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                  <Type size={20} />
                </div>
                <span className="text-xs font-medium">Text</span>
              </button>
              
              <button onClick={addImageMock} className="flex flex-col items-center text-slate-600 hover:text-[#1E3A8A]">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                  <ImageIcon size={20} />
                </div>
                <span className="text-xs font-medium">Image</span>
              </button>
              
              <button onClick={() => setBgColor(bgColor === '#ffffff' ? '#1E3A8A' : '#ffffff')} className="flex flex-col items-center text-slate-600 hover:text-[#1E3A8A]">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                  <Palette size={20} />
                </div>
                <span className="text-xs font-medium">Color</span>
              </button>
            </div>

            {/* Properties for active element could go here */}
            {activeElementId && (
               <div className="bg-slate-50 p-3 rounded-lg flex space-x-2 border border-slate-200">
                 <button className="flex-1 text-xs py-2 bg-white border border-slate-200 rounded shadow-sm">Change Text</button>
                 <button className="flex-1 text-xs py-2 bg-white border border-slate-200 rounded shadow-sm">Color</button>
                 <button className="flex-1 text-xs py-2 bg-red-50 text-red-600 border border-red-100 rounded shadow-sm" onClick={() => setElements(elements.filter(e => e.id !== activeElementId))}>Delete</button>
               </div>
            )}
            
          </div>
        )}
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 z-10">
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-[#F59E0B] text-white rounded-xl font-bold text-lg shadow-sm hover:bg-amber-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

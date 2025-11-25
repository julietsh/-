import React, { useState } from 'react';
import { PoeticEntry } from '../types';
import { Button } from './Button';
import { Trash2, Edit2, Check, X, Share2 } from 'lucide-react';

interface PoemCardProps {
  entry: PoeticEntry;
  onUpdate: (id: string, newPoem: string) => void;
  onDelete: (id: string) => void;
}

export const PoemCard: React.FC<PoemCardProps> = ({ entry, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPoem, setEditedPoem] = useState(entry.poem);

  const handleSave = () => {
    onUpdate(entry.id, editedPoem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPoem(entry.poem);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-100 flex flex-col h-full transition-transform hover:shadow-xl hover:-translate-y-1 duration-300">
      <div className="relative h-64 overflow-hidden bg-stone-100 group">
        <img 
          src={entry.imageUrl} 
          alt="User uploaded context" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
           {/* Future feature: Download/Share image */}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-stone-50/50">
        <div className="flex-grow">
          {isEditing ? (
            <textarea
              className="w-full h-full min-h-[200px] p-3 bg-white border border-stone-200 rounded-md focus:ring-2 focus:ring-stone-400 focus:outline-none font-serif leading-relaxed resize-none text-stone-800"
              value={editedPoem}
              onChange={(e) => setEditedPoem(e.target.value)}
            />
          ) : (
            <div className="prose prose-stone max-w-none">
              <pre className="whitespace-pre-wrap font-serif text-stone-800 text-lg leading-relaxed font-medium">
                {entry.poem}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-sm text-stone-500">
          <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="저장">
                  <Check size={18} />
                </button>
                <button onClick={handleCancel} className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors" title="취소">
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 text-stone-600 hover:bg-stone-200 rounded-full transition-colors" title="수정">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(entry.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title="삭제">
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

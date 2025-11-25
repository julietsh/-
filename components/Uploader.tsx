import React, { useRef } from 'react';
import { Button } from './Button';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isLoading ? 'border-stone-200 bg-stone-50 opacity-50 cursor-not-allowed' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50 cursor-pointer'}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={!isLoading ? handleDrop : undefined}
      onClick={() => !isLoading && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-stone-100 rounded-full text-stone-600">
          {isLoading ? (
             <div className="animate-pulse">
               <ImageIcon size={32} />
             </div>
          ) : (
            <Upload size={32} />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-stone-800">
            {isLoading ? "시상이 떠오르는 중..." : "이미지 업로드"}
          </h3>
          <p className="text-stone-500 text-sm max-w-xs mx-auto">
            클릭하여 업로드하거나 이미지를 드래그 앤 드롭하세요.<br/>
            (JPG, PNG, WebP)
          </p>
        </div>
        {!isLoading && (
          <Button variant="secondary" className="mt-2 pointer-events-none">
            파일 선택
          </Button>
        )}
      </div>
    </div>
  );
};

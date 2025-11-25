import React, { useState, useEffect } from 'react';
import { Uploader } from './components/Uploader';
import { PoemCard } from './components/PoemCard';
import { PoeticEntry } from './types';
import { storageService } from './services/storageService';
import { generatePoemFromImage } from './services/geminiService';
import { BookOpen, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [entries, setEntries] = useState<PoeticEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loaded = storageService.getAll();
    setEntries(loaded);
  }, []);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Convert File to Base64 for storage and API
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;

        try {
          // 2. Call Gemini API
          const poem = await generatePoemFromImage(base64Image);

          // 3. Create Entry object
          const newEntry: PoeticEntry = {
            id: crypto.randomUUID(),
            imageUrl: base64Image,
            poem: poem,
            createdAt: Date.now()
          };

          // 4. Save to Storage
          storageService.add(newEntry);

          // 5. Update UI
          setEntries(prev => [newEntry, ...prev]);
        } catch (apiError) {
          setError("시를 짓는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          console.error(apiError);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("이미지 파일을 읽을 수 없습니다.");
        setLoading(false);
      };

    } catch (e) {
      setError("알 수 없는 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말로 이 시를 삭제하시겠습니까?")) {
      storageService.delete(id);
      setEntries(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleUpdate = (id: string, newPoem: string) => {
    storageService.update(id, newPoem);
    setEntries(prev => prev.map(item => 
      item.id === id ? { ...item, poem: newPoem } : item
    ));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-stone-800 p-2 rounded-lg text-white">
              <PenTool size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-stone-900">시작 (Si-Jak)</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{entries.length}편의 시</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Intro / Upload Section */}
        <div className="mb-12 max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
              사진이 시가 되는 순간
            </h2>
            <p className="text-stone-500 leading-relaxed">
              당신의 소중한 추억이 담긴 사진을 올려주세요.<br />
              AI가 그 순간의 감정을 아름다운 언어로 그려냅니다.
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
            <Uploader onImageSelected={handleImageUpload} isLoading={loading} />
          </div>

          {error && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
               {error}
             </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 mb-6">
             <div className="h-px bg-stone-200 flex-grow"></div>
             <span className="text-stone-400 font-serif italic text-sm">나의 시집</span>
             <div className="h-px bg-stone-200 flex-grow"></div>
           </div>

          {entries.length === 0 ? (
            <div className="text-center py-20 text-stone-400 bg-white rounded-xl border border-dashed border-stone-200">
              <p>아직 작성된 시가 없습니다.</p>
              <p className="text-sm mt-2">첫 번째 사진을 올려보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {entries.map(entry => (
                <PoemCard 
                  key={entry.id} 
                  entry={entry} 
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-20 py-8 border-t border-stone-200 text-center text-stone-400 text-sm">
        <p>© 2024 Si-Jak. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;

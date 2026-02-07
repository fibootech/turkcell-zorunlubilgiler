import { useState } from 'react';
import { ZorunluBilgiListesi } from './components/admin/ZorunluBilgiListesi';
import { KampanyaSayfasiDemo } from './components/page/KampanyaSayfasiDemo';

type View = 'admin' | 'page';

function App() {
  const [currentView, setCurrentView] = useState<View>('page');

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg border border-[#E5E7EB] p-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentView('page')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              currentView === 'page'
                ? 'bg-[#005F9E] text-white'
                : 'text-[#6B7280] hover:bg-[#F3F4F6]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Kampanya Sayfası
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              currentView === 'admin'
                ? 'bg-[#005F9E] text-white'
                : 'text-[#6B7280] hover:bg-[#F3F4F6]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Paneli
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        {currentView === 'admin' ? (
          <ZorunluBilgiListesi />
        ) : (
          <KampanyaSayfasiDemo />
        )}
      </div>

    
    </div>
  );
}

export default App;

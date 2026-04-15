import React from 'react';
import { BookMarked, PlayCircle, PlusCircle } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'library', label: 'Library', icon: <BookMarked size={20} /> },
    { id: 'add', label: 'Add Word', icon: <PlusCircle size={20} /> },
    { id: 'review', label: 'Review', icon: <PlayCircle size={20} /> },
  ];

  return (
    <nav className="glass" style={{ 
      position: 'fixed', 
      bottom: '1.5rem', 
      left: '1rem', 
      right: '1rem', 
      padding: '0.5rem',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 1000
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: 1,
            background: 'transparent',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '0.5rem 0',
            fontSize: '0.75rem'
          }}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && (
            <div style={{ 
              width: '4px', 
              height: '4px', 
              background: 'var(--primary)', 
              borderRadius: '50%',
              marginTop: '2px'
            }} />
          )}
        </button>
      ))}
    </nav>
  );
}

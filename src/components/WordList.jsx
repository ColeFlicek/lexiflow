import React from 'react';
import { Trash2, BookOpen, CheckCircle, Volume2, Zap } from 'lucide-react';

export function WordList({ words, onDelete, onMarkMastered }) {
  const playAudio = (url) => {
    if (url) new Audio(url).play();
  };

  if (words.length === 0) {
    return (
      <div className="glass fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
        <p style={{ color: 'var(--text-muted)' }}>Your library is empty. Add some words to start learning!</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Library ({words.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {words.map((word) => {
          const knownLevel = word.knownCount || 0;
          const progressPercent = (knownLevel / 5) * 100;
          
          return (
            <div key={word.id} className="glass" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{word.word}</h3>
                    {word.mastered && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
                  </div>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{word.phonetic}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {word.audio && (
                    <button onClick={() => playAudio(word.audio)} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                      <Volume2 size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => onMarkMastered(word.id)} 
                    style={{ 
                      padding: '0.5rem', 
                      background: word.mastered ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                      color: word.mastered ? 'var(--bg-deep)' : 'white'
                    }}
                    title={word.mastered ? "Unmark Mastered" : "Mark as Mastered"}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(word.id)} 
                    style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Mastery Progress
                  </span>
                  <span style={{ fontSize: '0.75rem', color: word.mastered ? 'var(--success)' : 'var(--primary)', fontWeight: 700 }}>
                    {word.mastered ? 'MASTERED' : `Level ${knownLevel}/5`}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${progressPercent}%`, 
                      background: word.mastered ? 'var(--success)' : 'var(--primary)',
                      transition: 'width 0.4s ease-out',
                      boxShadow: word.mastered ? '0 0 8px var(--success)' : 'none'
                    }} />
                </div>
              </div>

              <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-main)', borderLeft: '3px solid var(--glass-border)', paddingLeft: '0.75rem' }}>
                {word.definition}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

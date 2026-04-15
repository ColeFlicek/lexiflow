import React from 'react';
import { Trash2, BookOpen, CheckCircle, Volume2 } from 'lucide-react';

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
        {words.map((word) => (
          <div key={word.id} className="glass" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{word.word}</h3>
                  {word.mastered && <CheckCircle size={16} style={{ color: 'var(--success)' }} />}
                </div>
                <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>{word.phonetic}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {word.audio && (
                  <button onClick={() => playAudio(word.audio)} style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)' }}>
                    <Volume2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => onMarkMastered(word.id)} 
                  style={{ 
                    padding: '0.4rem', 
                    background: word.mastered ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                    color: word.mastered ? 'var(--bg-deep)' : 'white'
                  }}
                >
                  <CheckCircle size={16} />
                </button>
                <button 
                  onClick={() => onDelete(word.id)} 
                  style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {word.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

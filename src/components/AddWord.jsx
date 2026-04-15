import React, { useState, useEffect } from 'react';
import { Search, Plus, Volume2, Loader2, Check } from 'lucide-react';
import { useDictionary } from '../hooks/useDictionary';

export function AddWord({ onAdd, settings }) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { fetchWord, loading, error } = useDictionary(settings);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim().length > 1) {
        const data = await fetchWord(input.trim());
        setPreview(data);
        setSelectedIdx(0);
      } else {
        setPreview(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [input, fetchWord]);

  const handleAdd = () => {
    if (preview && preview.definitions[selectedIdx]) {
      const selectedDef = preview.definitions[selectedIdx];
      onAdd({
        word: preview.word,
        phonetic: preview.phonetic,
        audio: preview.audio,
        partOfSpeech: selectedDef.partOfSpeech,
        definition: selectedDef.definition,
        example: selectedDef.example
      });
      setInput('');
      setPreview(null);
    }
  };

  const playAudio = () => {
    if (preview?.audio) {
      new Audio(preview.audio).play();
    }
  };

  return (
    <div className="fade-in" style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add New Word</h2>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Type a word..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
        />
        {loading && (
          <Loader2 
            className="animate-spin" 
            size={18} 
            style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} 
          />
        )}
      </div>

      {error && input.length > 2 && (
        <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>
      )}

      {preview && (
        <div className="glass fade-in" style={{ marginTop: '1rem', padding: '1.25rem', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>{preview.word}</h3>
              <p style={{ color: 'var(--secondary)', fontWeight: 500 }}>{preview.phonetic || '(No phonetic)'}</p>
            </div>
            {preview.audio && (
              <button onClick={playAudio} className="glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <Volume2 size={20} />
              </button>
            )}
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Select Best Definition:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {preview.definitions.map((def, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className="glass"
                  style={{ 
                    padding: '0.75rem', 
                    cursor: 'pointer',
                    border: selectedIdx === idx ? '1px solid var(--primary)' : '1px solid transparent',
                    background: selectedIdx === idx ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                     <div style={{ flex: 1 }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          background: 'rgba(255,255,255,0.1)', 
                          padding: '0.1rem 0.4rem', 
                          borderRadius: '1rem', 
                          color: 'var(--primary)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          marginRight: '0.5rem'
                        }}>
                          {def.partOfSpeech}
                        </span>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{def.definition}</p>
                     </div>
                     {selectedIdx === idx && <Check size={16} color="var(--primary)" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAdd}
            style={{ 
              width: '100%', 
              background: 'var(--primary)', 
              color: 'var(--bg-deep)',
              boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
              padding: '1rem'
            }}
          >
            <Plus size={20} /> Add to Library
          </button>
        </div>
      )}
    </div>
  );
}

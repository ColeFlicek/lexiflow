import React, { useState, useEffect } from 'react';
import { Search, Plus, Volume2, Loader2, MessageCircle } from 'lucide-react';
import { useDictionary } from '../hooks/useDictionary';

export function AddWord({ onAdd }) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState(null);
  const { fetchWord, loading, error } = useDictionary();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim().length > 2) {
        const data = await fetchWord(input.trim());
        setPreview(data);
      } else {
        setPreview(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [input, fetchWord]);

  const handleAdd = () => {
    if (preview) {
      onAdd(preview);
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
        <div className="glass" style={{ marginTop: '1rem', padding: '1.25rem', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>{preview.word}</h3>
              <p style={{ color: 'var(--secondary)', fontWeight: 500 }}>{preview.phonetic}</p>
            </div>
            {preview.audio && (
              <button onClick={playAudio} className="glass" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <Volume2 size={20} />
              </button>
            )}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'rgba(255,255,255,0.1)', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '1rem', 
              color: 'var(--primary)',
              textTransform: 'uppercase',
              fontWeight: 700,
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              {preview.partOfSpeech}
            </span>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{preview.definition}</p>
            {preview.example && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                "{preview.example}"
              </p>
            )}
          </div>

          <button 
            onClick={handleAdd}
            style={{ 
              width: '100%', 
              background: 'var(--primary)', 
              color: 'var(--bg-deep)',
              boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)'
            }}
          >
            <Plus size={20} /> Add to Library
          </button>
        </div>
      )}
    </div>
  );
}

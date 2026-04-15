import React from 'react';
import { Globe, Key, RefreshCcw, ExternalLink } from 'lucide-react';

export function Settings({ settings, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Settings</h2>
      
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Globe size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem' }}>Dictionary Provider</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="source" 
              checked={settings.source === 'free'} 
              onChange={() => handleChange('source', 'free')}
              style={{ width: 'auto' }}
            />
            <div>
              <p style={{ fontWeight: 600 }}>Free Dictionary API</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Wiktionary-based, no setup required.</p>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="source" 
              checked={settings.source === 'mw'} 
              onChange={() => handleChange('source', 'mw')}
              style={{ width: 'auto' }}
            />
            <div>
              <p style={{ fontWeight: 600 }}>Merriam-Webster (Collegiate)</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Authoritative data & High-quality audio.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Key size={20} color="var(--secondary)" />
          <h3 style={{ fontSize: '1.1rem' }}>API Keys</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Merriam-Webster requires a free API key (Collegiate Dictionary).
          </p>
          <input 
            type="password" 
            placeholder="Enter MW Collegiate Key..."
            value={settings.mwKey}
            onChange={(e) => handleChange('mwKey', e.target.value)}
          />
          <a 
            href="https://dictionaryapi.com/register/index" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.875rem', 
              color: 'var(--secondary)',
              textDecoration: 'none'
            }}
          >
            Get a free key <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <RefreshCcw size={20} color="var(--success)" />
          <h3 style={{ fontSize: '1.1rem' }}>Advanced</h3>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <p style={{ fontWeight: 600 }}>Enable Fallback Strategy</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              If primary fails or lacks audio, try the alternative.
            </p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.fallback}
            onChange={(e) => handleChange('fallback', e.target.checked)}
            style={{ width: 'auto', scale: '1.5' }}
          />
        </label>
      </div>
    </div>
  );
}

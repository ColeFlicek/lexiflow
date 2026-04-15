import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AddWord } from './components/AddWord';
import { WordList } from './components/WordList';
import { Flashcards } from './components/Flashcards';
import { Settings } from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('library');
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem('lexiflow_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [dictionarySettings, setDictionarySettings] = useState(() => {
    const saved = localStorage.getItem('lexiflow_settings');
    return saved ? JSON.parse(saved) : {
      source: 'free',
      mwKey: '',
      fallback: true
    };
  });

  useEffect(() => {
    localStorage.setItem('lexiflow_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('lexiflow_settings', JSON.stringify(dictionarySettings));
  }, [dictionarySettings]);

  const handleAddWord = (wordData) => {
    const newWord = {
      ...wordData,
      id: Date.now(),
      mastered: false,
      addedAt: new Date().toISOString(),
    };
    setWords([newWord, ...words]);
    setActiveTab('library');
  };

  const handleDeleteWord = (id) => {
    setWords(words.filter(w => w.id !== id));
  };

  const handleMarkMastered = (id) => {
    setWords(words.map(w => 
      w.id === id ? { ...w, mastered: !w.mastered } : w
    ));
  };

  return (
    <>
      <header style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800
        }}>
          LexiFlow
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Master Your Vocabulary</p>
      </header>

      <main style={{ paddingBottom: '7rem' }}>
        {activeTab === 'library' && (
          <WordList 
            words={words} 
            onDelete={handleDeleteWord} 
            onMarkMastered={handleMarkMastered}
          />
        )}
        {activeTab === 'add' && (
          <AddWord onAdd={handleAddWord} settings={dictionarySettings} />
        )}
        {activeTab === 'review' && (
          <Flashcards 
            words={words} 
            onMarkMastered={handleMarkMastered} 
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={dictionarySettings} 
            onUpdate={setDictionarySettings} 
          />
        )}
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;

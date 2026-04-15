import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, Volume2, Trophy } from 'lucide-react';

export function Flashcards({ words, onMarkMastered }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // Only review non-mastered words or a mix? 
  // Requirement sagt "mark as mastered", so we probably review non-mastered words.
  const unmasteredWords = words.filter(w => !w.mastered);

  if (unmasteredWords.length === 0) {
    return (
      <div className="glass fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Trophy size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
        <h2 style={{ marginBottom: '1rem' }}>Great Job!</h2>
        <p style={{ color: 'var(--text-muted)' }}>You've mastered all the words in your library. Add more to keep learning!</p>
      </div>
    );
  }

  const currentWord = unmasteredWords[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < unmasteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionDone(true);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const handleMastered = () => {
    onMarkMastered(currentWord.id);
    if (unmasteredWords.length === 1) {
      setSessionDone(true);
    } else if (currentIndex === unmasteredWords.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const playAudio = (e) => {
    e.stopPropagation();
    if (currentWord.audio) new Audio(currentWord.audio).play();
  };

  if (sessionDone) {
    return (
      <div className="glass fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Trophy size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
        <h2 style={{ marginBottom: '1rem' }}>Session Complete!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You've reviewed all pending words.</p>
        <button 
          onClick={() => { setSessionDone(false); setCurrentIndex(0); }}
          style={{ width: '100%', background: 'var(--primary)', color: 'var(--bg-deep)' }}
        >
          <RotateCcw size={20} /> Restart Session
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Review Mode</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {currentIndex + 1} / {unmasteredWords.length}
        </span>
      </div>

      <div 
        onClick={toggleFlip}
        style={{ perspective: '1000px', cursor: 'pointer', height: '350px', marginBottom: '2rem' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="glass" style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{currentWord.word}</h1>
            <p style={{ color: 'var(--secondary)', fontSize: '1.25rem' }}>{currentWord.phonetic}</p>
            {currentWord.audio && (
              <button 
                onClick={playAudio} 
                style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '0.75rem' }}
              >
                <Volume2 size={24} />
              </button>
            )}
            <p style={{ position: 'absolute', bottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Tap to flip
            </p>
          </div>

          {/* Back */}
          <div className="glass" style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'rgba(255,255,255,0.1)', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '1rem', 
              color: 'var(--primary)',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              {currentWord.partOfSpeech}
            </span>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.4 }}>{currentWord.definition}</p>
            {currentWord.example && (
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                "{currentWord.example}"
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handlePrev} disabled={currentIndex === 0} style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}>
          <ChevronLeft size={20} /> Prev
        </button>
        <button 
          onClick={handleMastered}
          style={{ flex: 1, background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success)', border: '1px solid var(--success)' }}
        >
          <CheckCircle size={20} /> Mastered
        </button>
        <button onClick={handleNext} style={{ flex: 1, background: 'var(--primary)', color: 'var(--bg-deep)' }}>
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

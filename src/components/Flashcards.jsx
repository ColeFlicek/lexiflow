import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, Volume2, Trophy, Brain, XCircle, Zap } from 'lucide-react';

export function Flashcards({ words, onReviewResult }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // Used to restart and re-shuffle

  // Process and priority-shuffle the words for each session
  const reviewPool = useMemo(() => {
    const unmastered = words.filter(w => !w.mastered);
    
    // Group by knownCount
    const groups = {};
    unmastered.forEach(w => {
      const count = w.knownCount || 0;
      if (!groups[count]) groups[count] = [];
      groups[count].push(w);
    });

    // Shuffle within each group and flatten
    const result = [];
    const sortedLevels = Object.keys(groups).sort((a, b) => Number(a) - Number(b));
    
    sortedLevels.forEach(level => {
      const shuffledLevel = [...groups[level]].sort(() => Math.random() - 0.5);
      result.push(...shuffledLevel);
    });

    return result;
  }, [words, sessionKey]);

  if (reviewPool.length === 0) {
    return (
      <div className="glass fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Trophy size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
        <h2 style={{ marginBottom: '1rem' }}>Library Mastered!</h2>
        <p style={{ color: 'var(--text-muted)' }}>You've mastered all current words. Keep it up!</p>
      </div>
    );
  }

  const currentWord = reviewPool[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < reviewPool.length - 1) {
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

  const handleReviewStep = (result) => {
    onReviewResult(currentWord.id, result);
    handleNext();
  };

  const playAudio = (e) => {
    e.stopPropagation();
    if (currentWord.audio) new Audio(currentWord.audio).play();
  };

  if (sessionDone) {
    return (
      <div className="glass fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Trophy size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
        <h2 style={{ marginBottom: '1rem' }}>Session Over</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You've made great progress today!</p>
        <button 
          onClick={() => { setSessionDone(false); setCurrentIndex(0); setSessionKey(prev => prev + 1); }}
          style={{ width: '100%', background: 'var(--primary)', color: 'var(--bg-deep)' }}
        >
          <RotateCcw size={20} /> New Priority Session
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '1.1rem' }}>Priority Review</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'rgba(255,165,0,0.1)', 
              color: 'var(--primary)', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '1rem',
              fontWeight: 700
            }}>
              Level {currentWord.knownCount || 0}/5
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {currentIndex + 1} / {reviewPool.length}
            </span>
        </div>
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
                style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '0.75rem' }}
              >
                <Volume2 size={24} />
              </button>
            )}
            <p style={{ position: 'absolute', bottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Tap to see definition
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

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={() => handleReviewStep('forgot')}
          style={{ 
            flex: 1, 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '1rem'
          }}
        >
          <XCircle size={18} />
          <span style={{ fontSize: '0.75rem' }}>Forgot</span>
        </button>
        
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0} 
          style={{ flex: 0.5, background: 'rgba(255,255,255,0.05)', padding: '1rem' }}
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          onClick={() => handleReviewStep('knew')}
          className="glass"
          style={{ 
            flex: 1.5, 
            background: 'var(--primary)', 
            color: 'var(--bg-deep)',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '1rem',
            boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.3)'
          }}
        >
          <CheckCircle size={20} />
          <span style={{ fontSize: '0.875rem' }}>I Knew It</span>
        </button>
      </div>
    </div>
  );
}

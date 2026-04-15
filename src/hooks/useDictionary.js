import { useState, useCallback } from 'react';

/**
 * Custom hook to fetch word data from multiple dictionary resources.
 */
export const useDictionary = (settings) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFromFree = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return null;
      const data = await response.json();
      const entry = data[0];
      
      return {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics.find(p => p.text)?.text || '',
        audio: entry.phonetics.find(p => p.audio)?.audio || '',
        meanings: entry.meanings.map(m => ({
          partOfSpeech: m.partOfSpeech,
          definitions: m.definitions.map(d => ({
            definition: d.definition,
            example: d.example || ''
          }))
        })).flat()
      };
    } catch {
      return null;
    }
  };

  const fetchFromMW = async (word, apiKey) => {
    if (!apiKey) throw new Error('Merriam-Webster API key missing in settings.');
    
    try {
      const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
      if (!response.ok) return null;
      const data = await response.json();
      
      // If word not found, MW returns suggestions as strings
      if (data.length === 0 || typeof data[0] === 'string') return null;

      const entry = data[0];
      
      // Construct audio URL
      // Formula: https://media.merriam-webster.com/audio/prons/en/us/mp3/[subdir]/[audio].mp3
      let audioUrl = '';
      if (entry.hwi?.prs?.[0]?.sound?.audio) {
        const audioName = entry.hwi.prs[0].sound.audio;
        let subdir = audioName.charAt(0);
        if (audioName.startsWith('bix')) subdir = 'bix';
        else if (audioName.startsWith('gg')) subdir = 'gg';
        else if (/^[0-9_]/.test(audioName)) subdir = 'number';
        
        audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioName}.mp3`;
      }

      return {
        word: entry.hwi?.hw?.replace(/\*/g, '') || word,
        phonetic: entry.hwi?.prs?.[0]?.mw || '',
        audio: audioUrl,
        meanings: [{
          partOfSpeech: entry.fl || '',
          definitions: entry.shortdef.map(d => ({
            definition: d,
            example: ''
          }))
        }]
      };
    } catch {
      return null;
    }
  };

  const fetchWord = useCallback(async (word) => {
    if (!word) return null;
    setLoading(true);
    setError(null);

    try {
      let result = null;
      let secondary = null;

      if (settings.source === 'mw') {
        result = await fetchFromMW(word, settings.mwKey);
        if (!result && settings.fallback) {
          result = await fetchFromFree(word);
        } else if (result && settings.fallback && !result.audio) {
          // Attempt to get audio from secondary if missing
          secondary = await fetchFromFree(word);
          if (secondary?.audio) result.audio = secondary.audio;
        }
      } else {
        result = await fetchFromFree(word);
        if (!result && settings.fallback && settings.mwKey) {
          result = await fetchFromMW(word, settings.mwKey);
        } else if (result && settings.fallback && !result.audio && settings.mwKey) {
          secondary = await fetchFromMW(word, settings.mwKey);
          if (secondary?.audio) result.audio = secondary.audio;
        }
      }

      if (!result) {
        throw new Error('Word not found in available resources.');
      }

      // Flatten and limit definitions to 5 as requested
      const allDefinitions = [];
      result.meanings.forEach(m => {
        m.definitions.forEach(d => {
          allDefinitions.push({
            ...d,
            partOfSpeech: m.partOfSpeech
          });
        });
      });

      return {
        ...result,
        definitions: allDefinitions.slice(0, 5)
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  return { fetchWord, loading, error };
};

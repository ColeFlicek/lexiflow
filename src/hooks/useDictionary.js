import { useState, useCallback } from 'react';

/**
 * Custom hook to fetch word data from the Free Dictionary API.
 */
export const useDictionary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWord = useCallback(async (word) => {
    if (!word) return null;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const data = await response.json();
      
      // Extract essential info
      const entry = data[0];
      const result = {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics.find(p => p.text)?.text || '',
        audio: entry.phonetics.find(p => p.audio)?.audio || '',
        definition: entry.meanings[0].definitions[0].definition,
        example: entry.meanings[0].definitions[0].example || '',
        partOfSpeech: entry.meanings[0].partOfSpeech,
      };
      
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchWord, loading, error };
};

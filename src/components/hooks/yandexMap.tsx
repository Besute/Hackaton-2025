import { useEffect, useState } from 'react';

declare const ymaps3: any;

export const useYMap = (apiKey: string) => {
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        await ymaps3.ready;
        setIsLoading(false);
        setMap(ymaps3);
      } catch (err) {
        setError('Failed to load Yandex Maps');
        setIsLoading(false);
      }
    };

    loadMap();
  }, [apiKey]);

  return { map, isLoading, error };
};
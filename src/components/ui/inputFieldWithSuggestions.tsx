'use client';

import { useState, useRef, useEffect } from 'react';

interface AddressSuggestion {
  address: string;
  coordinates?: { lat: number; lon: number };
}

interface AddressInputWithSuggestionsProps {
  onAddressSelect: (address: string, coordinates?: { lat: number; lon: number }) => void;
  placeholder?: string;
  className?: string;
}

const AddressInputWithSuggestions = ({
  onAddressSelect,
  placeholder = "Введите адрес...",
  className = ""
}: AddressInputWithSuggestionsProps) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const YANDEX_API_KEY = '5f041a6c-1e38-413b-97fc-768e096974c4'; // ЗАМЕНИТЕ на ваш ключ!
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_KEY}&format=json&geocode=${encodeURIComponent(query)}&results=5`;
      
      console.log('Отправляем запрос:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Ответ от геокодера:', data);
      
      const featureMember = data.response?.GeoObjectCollection?.featureMember;
      
      if (featureMember && featureMember.length > 0) {
        const addressSuggestions: AddressSuggestion[] = [];
        
        for (const item of featureMember.slice(0, 5)) {
          const geoObject = item.GeoObject;
          if (geoObject) {
            let coordinates: { lat: number; lon: number } | undefined;
            
            if (geoObject.Point) {
              const [lon, lat] = geoObject.Point.pos.split(' ').map(Number);
              coordinates = { lat, lon };
            }
            
            addressSuggestions.push({
              address: geoObject.name || geoObject.description || 'Неизвестный адрес',
              coordinates
            });
          }
        }
        
        setSuggestions(addressSuggestions);
        setShowSuggestions(addressSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Ошибка получения подсказок:', error);
      setSuggestions(getTestSuggestions(query));
      setShowSuggestions(true);
    } finally {
      setIsLoading(false);
    }
  };
  const getTestSuggestions = (query: string): AddressSuggestion[] => {
    const testAddresses = [
      'ул. Ленина, 1, Москва',
      'ул. Пушкина, 10, Москва', 
      'ул. Тверская, 15, Москва',
      'пр. Мира, 25, Москва',
      'ул. Арбат, 30, Москва',
      'ул. Садовая, 5, Санкт-Петербург',
      'Невский проспект, 20, Санкт-Петербург'
    ].filter(addr => addr.toLowerCase().includes(query.toLowerCase()));

    return testAddresses.map(addr => ({
      address: addr,
      coordinates: { 
        lat: 55.7558 + (Math.random() - 0.5) * 0.1, 
        lon: 37.6173 + (Math.random() - 0.5) * 0.1 
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const timeoutId = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    onAddressSelect(suggestion.address, suggestion.coordinates);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {suggestion.address}
                      </div>
                      {suggestion.coordinates && (
                        <div className="text-xs text-gray-500 mt-1">
                          Координаты: {suggestion.coordinates.lat.toFixed(4)}, {suggestion.coordinates.lon.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              {inputValue.length < 2 ? 'Введите минимум 2 символа' : 'Адреса не найдены'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressInputWithSuggestions;
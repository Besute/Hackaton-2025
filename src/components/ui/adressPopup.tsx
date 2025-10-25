"use client"

import { useState, useEffect } from "react";
import AddressInputWithSuggestions from "./inputFieldWithSuggestions";

interface AdressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: string, lunch: string, work: string, type: string, lat: number | undefined, lon: number | undefined) => void;
}

const YANDEX_MAPS_API_KEY = "5f041a6c-1e38-413b-97fc-768e096974c4";

// Функция для загрузки Яндекс Карт
const loadYandexMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve();
      return;
    }

    // Проверяем, не загружается ли уже скрипт
    if ((window as any).ymapsLoading) {
      const checkLoaded = setInterval(() => {
        if (window.ymaps) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    (window as any).ymapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    script.onload = () => {
      window.ymaps.ready(() => {
        (window as any).ymapsLoading = false;
        resolve();
      });
    };
    script.onerror = () => {
      (window as any).ymapsLoading = false;
      reject(new Error('Не удалось загрузить Яндекс Карты'));
    };
    document.head.appendChild(script);
  });
};
const geocodeAddress = async (address: string): Promise<[number, number]> => {
  if (!window.ymaps) {
    await loadYandexMaps();
  }
  return new Promise((resolve, reject) => {
    window.ymaps.geocode(address, { results: 1 })
      .then((result: any) => {
        const firstGeoObject = result.geoObjects.get(0);
        if (firstGeoObject) {
          const coordinates = firstGeoObject.geometry.getCoordinates();
          resolve(coordinates);
        } else {
          reject(new Error(`Адрес не найден: ${address}`));
        }
      })
      .catch((error: any) => {
        reject(new Error(`Ошибка геокодирования: ${error.message}`));
      });
  });
};

const AdressPopup = function({isOpen, onClose, onSubmit} : AdressPopupProps) {
  const [formData, setFormData] = useState({
    address: '',
    workHours: '',
    lunchBreak: '',
    type: 'Стандарт',
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isYmapsLoaded, setIsYmapsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isYmapsLoaded) {
      loadYandexMaps()
        .then(() => setIsYmapsLoaded(true))
        .catch(console.error);
    }
  }, [isOpen, isYmapsLoaded]);

  const handleClose = () => {
    setFormData({
      address: '',
      workHours: '',
      lunchBreak: '',
      type: 'Стандарт'
    });
    setCoordinates(null);
    onClose();
  };

  const handleAddressSelect = async (address: string, coords?: { lat: number; lon: number }) => {
    setFormData(prev => ({ ...prev, address }));
    
    if (coords) {
      setCoordinates(coords);
    } else {
      try {
        const [lat, lon] = await geocodeAddress(address);
        setCoordinates({ lat, lon });
      } catch (error) {
        console.error('Ошибка геокодирования:', error);
        setCoordinates(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.address && !coordinates) {
      try {
        const [lat, lon] = await geocodeAddress(formData.address);
        setCoordinates({ lat, lon });
      } catch (error) {
        console.error('Не удалось геокодировать адрес:', error);
        alert('Не удалось определить координаты адреса. Проверьте правильность адреса.');
        return;
      }
    }
    console.log(formData, coordinates)
    onSubmit(formData.address, formData.lunchBreak, formData.workHours, formData.type, coordinates?.lat, coordinates?.lon);
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Добавить нового клиента</h1>
          <p className="text-gray-600 mt-2">Заполните информацию о клиенте</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Адрес клиента
            </label>
            <AddressInputWithSuggestions onAddressSelect={handleAddressSelect}/>
            {coordinates && (
              <p className="text-xs text-green-600">
                Координаты: {coordinates.lat.toFixed(6)}, {coordinates.lon.toFixed(6)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="workHours" className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Время работы
            </label>
            <input
              type="text"
              id="workHours"
              name="workHours"
              value={formData.workHours}
              onChange={handleChange}
              placeholder="9:00 - 18:00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lunchBreak" className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Обеденный перерыв
            </label>
            <input
              type="text"
              id="lunchBreak"
              name="lunchBreak"
              value={formData.lunchBreak}
              onChange={handleChange}
              placeholder="13:00 - 14:00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="typeClient" className="text-sm font-medium text-gray-700 flex items-center">
              Тип клиента
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Стандарт">Стандарт</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdressPopup
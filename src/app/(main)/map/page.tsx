'use client';

import { useEffect, useState } from 'react';
import YandexMapRoute from '@/src/components/ui/mapOnPage';
import { Vertex } from '@/src/types/vertex';

const MapPage = () => {
  const [points, setPoints] = useState<Vertex[]>([]);
    
  useEffect(() => {
    const predefinedPoints: Vertex[] = [
      {
        address: 'ул. Тверская, 1, Москва',
        clientType: 'vip',
        lt: 55.7604,
        lg: 37.6184,
        timeOfWork: "8:00 - 16:00"
      },
      {
        address: 'Красная площадь, Москва',
        clientType: 'standard', 
        lt: 55.756315,
        lg: 37.614716,
        timeOfWork: "8:00 - 16:00"
      },
    ];

    setPoints(predefinedPoints);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Маршрут до клиентов
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Точек в маршруте:</span> {points.length}
            </div>
            <div>
              <span className="font-semibold">VIP клиентов:</span> {points.filter(p => p.clientType === 'vip').length}
            </div>
            <div>
              <span className="font-semibold">Стандартных:</span> {points.filter(p => p.clientType === 'standard').length}
            </div>
          </div>
        </div>
      </div>


      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm border h-full">
          <YandexMapRoute vertexes={points} />
        </div>
      </div>

      <div className="bg-white border-t p-3">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Ваше местоположение</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Стандартные клиенты</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>VIP клиенты</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Маршрут</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
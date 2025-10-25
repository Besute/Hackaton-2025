import React, { useEffect, useRef, useState } from 'react';
import { Vertex } from '@/src/types/vertex';

interface RouteInfo {
  totalDistance: number;
  totalDuration: number;
  segments: Array<{
    from: string;
    to: string;
    distance: number;
    duration: number;
  }>;
}

interface YandexMapRouteProps {
  vertexes: Vertex[];
  className?: string;
}

const YANDEX_MAPS_API_KEY = "5f041a6c-1e38-413b-97fc-768e096974c4"

declare global {
  interface Window {
    ymaps: any;
    ymapsScriptLoaded?: boolean;
  }
}

const YandexMapRoute: React.FC<YandexMapRouteProps> = ({ 
  vertexes, 
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [multiRoute, setMultiRoute] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [currentPlacemark, setCurrentPlacemark] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается браузером'));
        return;
      }

      const attemptGetLocation = (attempts: number = 0) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position.coords.latitude === null || position.coords.longitude === null) {
              if (attempts < 100) {
                setTimeout(() => attemptGetLocation(attempts + 1), 1500);
                return;
              }
              reject(new Error('Не удалось получить корректные координаты'));
              return;
            }
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            if (attempts < 100) {
              setTimeout(() => attemptGetLocation(attempts + 1), 1500);
              return;
            }
            reject(new Error(`Ошибка получения местоположения: ${error.message}`));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      };

      attemptGetLocation();
    });
  };

  const startWatchingPosition = () => {
    if (!navigator.geolocation) {
      console.warn('Геолокация не поддерживается');
      return;
    }

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.latitude === null || position.coords.longitude === null) {
            console.warn('Получены некорректные координаты');
            return;
          }

          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          
          setCurrentLocation(prevLocation => {
            if (!prevLocation || 
                Math.abs(prevLocation.lat - newLocation.lat) > 0.0001 || 
                Math.abs(prevLocation.lon - newLocation.lon) > 0.0001) {
              
              updateCurrentPlacemark(newLocation);
              return newLocation;
            }
            
            return prevLocation;
          });
        },
        (error) => {
          console.error('Ошибка отслеживания положения:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        }
      );
      setIsWatching(true);
    } catch (err) {
      console.error('Ошибка при запуске отслеживания:', err);
    }
  };

  const stopWatchingPosition = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  };

  const updateCurrentPlacemark = (location: { lat: number; lon: number }) => {
    if (!mapInstanceRef.current) return;

    try {
      if (currentPlacemark) {
        mapInstanceRef.current.geoObjects.remove(currentPlacemark);
      }

      const newPlacemark = new window.ymaps.Placemark(
        [location.lat, location.lon],
        {
          balloonContent: 'Ваше текущее местоположение',
          iconCaption: 'Вы здесь'
        },
        {
          preset: 'islands#blueCircleDotIconWithCaption'
        }
      );

      mapInstanceRef.current.geoObjects.add(newPlacemark);
      setCurrentPlacemark(newPlacemark);
    } catch (err) {
      console.error('Ошибка обновления метки:', err);
    }
  };

  const buildRoute = async () => {
    if (!mapInstanceRef.current || !currentLocation || vertexes.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      
      const waypoints: Array<[number, number]> = [
        [currentLocation.lat, currentLocation.lon]
      ];

      for (const vertex of vertexes) {
        waypoints.push([vertex.lt, vertex.lg]);
      }

      if (multiRoute) {
        mapInstanceRef.current.geoObjects.remove(multiRoute);
      }

      const newMultiRoute = new window.ymaps.multiRouter.MultiRoute(
        {
          referencePoints: waypoints,
          params: {
            routingMode: 'auto'
          }
        },
        {
          boundsAutoApply: true,
          wayPointStartIconColor: '#0000ff',
          wayPointStartIconFillColor: '#ffffff',
          wayPointFinishIconColor: '#ff0000',
          wayPointFinishIconFillColor: '#ffffff',
          pinIconFillColor: '#1e98ff',
          routeActiveStrokeWidth: 6,
          routeActiveStrokeColor: '#1e98ff'
        }
      );

      mapInstanceRef.current.geoObjects.add(newMultiRoute);
      setMultiRoute(newMultiRoute);

      newMultiRoute.model.events.add('requestsuccess', () => {
        const activeRoute = newMultiRoute.getActiveRoute();
        if (activeRoute) {
          const totalDistance = activeRoute.properties.get('distance');
          const totalDuration = activeRoute.properties.get('duration');
          
          const segments: RouteInfo['segments'] = [];
          const paths = activeRoute.getPaths();
          
          paths.forEach((path: any, index: number) => {
            segments.push({
              from: index === 0 ? 'Текущее положение' : vertexes[index - 1].address,
              to: vertexes[index]?.address || 'Конечная точка',
              distance: path.properties.get('distance'),
              duration: path.properties.get('duration')
            });
          });

          setRouteInfo({
            totalDistance,
            totalDuration,
            segments
          });
        }
        setIsLoading(false);
      });

      newMultiRoute.model.events.add('requesterror', () => {
        setError('Ошибка построения маршрута');
        setIsLoading(false);
      });

    } catch (err) {
      console.error('Ошибка построения маршрута:', err);
      setError(err instanceof Error ? err.message : 'Ошибка построения маршрута');
      setIsLoading(false);
    }
  };

  const initializeMap = async () => {
    if (isInitializedRef.current || !mapRef.current) {
      return;
    }

    try {
      await window.ymaps.ready();

      const location = await getCurrentLocation();
      setCurrentLocation(location);
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }

      const yandexMap = new window.ymaps.Map(mapRef.current, {
        center: [location.lat, location.lon],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      mapInstanceRef.current = yandexMap;
      isInitializedRef.current = true;

      updateCurrentPlacemark(location);
      startWatchingPosition();

    } catch (err) {
      console.error('Ошибка инициализации карты:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка инициализации карты';
      setError(errorMessage);
      
      try {
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
        
        const defaultCenter = [55.751244, 37.618423];
        const yandexMap = new window.ymaps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl']
        });
        
        mapInstanceRef.current = yandexMap;
        isInitializedRef.current = true;
      } catch (mapErr) {
        console.error('Не удалось создать карту:', mapErr);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loadYandexMaps = () => {
    if (window.ymaps) {
      initializeMap();
      return;
    }

    if (window.ymapsScriptLoaded) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    script.onload = () => {
      window.ymapsScriptLoaded = true;
      initializeMap();
    };
    script.onerror = () => {
      setError('Ошибка загрузки Яндекс Карт');
      setIsLoading(false);
    };
    
    window.ymapsScriptLoaded = true;
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadYandexMaps();

    return () => {
      stopWatchingPosition();
      if (mapInstanceRef.current && mapRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
          isInitializedRef.current = false;
        } catch (err) {
          console.error('Ошибка при очистке карты:', err);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && currentLocation && vertexes.length > 0) {
      buildRoute();
    }
  }, [vertexes, currentLocation]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} м`;
    }
    return `${(meters / 1000).toFixed(1)} км`;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          Ошибка: {error}
        </div>
      )}
      
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
          Загрузка карты и построение маршрута...
        </div>
      )}

      {isWatching && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Отслеживание положения активно
        </div>
      )}

      <div 
        ref={mapRef} 
        className="w-full h-[80vh] rounded-lg shadow-lg"
      />
      {routeInfo && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Информация о маршруте</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
            <div className="text-gray-700">
              <strong>Общее расстояние:</strong> {formatDistance(routeInfo.totalDistance)}
            </div>
            <div className="text-gray-700 mt-1">
              <strong>Общее время:</strong> {formatDuration(routeInfo.totalDuration)}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Участки маршрута:</h4>
            <div className="space-y-3">
              {routeInfo.segments.map((segment, index) => (
                <div key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                  <div className="font-medium text-gray-800">
                    {segment.from} → {segment.to}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDistance(segment.distance)} • {formatDuration(segment.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YandexMapRoute;
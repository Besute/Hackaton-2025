import { Vertex } from '@/src/types/vertex';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AccessContext } from '../context/access';

declare global {
  interface Window {
    ymaps: any;
  }
}

const MapOnPage = function () {
    const { points } = useContext(AccessContext);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const routeRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Загрузка API Яндекс Карт
    useEffect(() => {
        if (window.ymaps) {
            setMapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
    }, []);

    // Инициализация карты и маршрута
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || points.length === 0) return;

        window.ymaps.ready(() => {
            // Создаем карту
            const map = new window.ymaps.Map(mapRef.current, {
                center: [points[0].lt, points[0].lg],
                zoom: 10,
                controls: ['zoomControl', 'fullscreenControl']
            });
            mapInstanceRef.current = map;

            // Создаем мультимаршрут через все точки
            const multiRoute = new window.ymaps.multiRouter.MultiRoute({
                referencePoints: points.map(p => [p.lt, p.lg]),
                params: {
                    routingMode: 'auto'
                }
            }, {
                boundsAutoApply: true
            });

            // Удаляем старый маршрут
            if (routeRef.current) {
                map.geoObjects.remove(routeRef.current);
            }

            // Добавляем маршрут на карту
            map.geoObjects.add(multiRoute);
            routeRef.current = multiRoute;

            // Добавляем маркеры для каждой точки
            points.forEach((point, index) => {
                const marker = new window.ymaps.Placemark(
                    [point.lt, point.lg],
                    {
                        balloonContent: `
                            <div>
                                <strong>Точка ${index + 1}</strong><br/>
                                ${point.address}<br/>
                                Тип: ${point.clientType}
                            </div>
                        `
                    },
                    {
                        preset: 'islands#blueCircleDotIcon'
                    }
                );
                map.geoObjects.add(marker);
            });
        });
    }, [mapLoaded, points]);

    if (points.length === 0) {
        return (
            <div style={{ height: '100vh', width: '100%' }} className="flex items-center justify-center">
                <div className="text-gray-500">Нет точек для отображения</div>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <div
                ref={mapRef}
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
};

export default MapOnPage;
'use client';

import { useContext, useEffect, useState } from 'react';
import YandexMapRoute from '@/src/components/ui/mapOnPage';
import { Vertex } from '@/src/types/vertex';
import { AccessContext } from '@/src/components/context/access';

const MapPage = () => {

  const {baseURL, token} = useContext(AccessContext)
  const [points, setPoints] = useState<Vertex[]>([]);
    
  useEffect(() => {
    async function getCurrentVertexes() {
            const currentVerts = (await fetch(baseURL + "/get_vertexes", {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `${token}`
                }
            }))
            const data = await currentVerts.json();
            const currRoute = (await fetch(baseURL + "/create_route", {
              method: "POST",
              headers: {
                "Content-Type" : "application/json",
                "Authorization" : `${token}`
              },
              body: JSON.stringify({
                vertexes: data.vertexes,
              })
            }))
            const data2 = await currRoute.json();
            console.log(data2)
            setPoints(data2.vertexes || [])
        }
        getCurrentVertexes();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Маршрут до клиентов
          </h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm border h-full">
          <YandexMapRoute vertexes={points} />
        </div>
      </div>

    </div>
  );
};

export default MapPage;
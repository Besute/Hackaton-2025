"use client"

import { AccessContext } from '@/src/components/context/access';
import AdressPopup from '@/src/components/ui/adressPopup';
import Button from '@/src/components/ui/button';
import VertexCard from '@/src/components/ui/vertexCard';
import { Vertex } from '@/src/types/vertex';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const MainPage = function() {
    const router = useRouter();
    const {setPoints} = useContext(AccessContext)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [vertexes, setVertexes] = useState<Vertex[]>([
    {
      address: 'ул. Ленина, 1, Москва',
      clientType: 'vip',
      lt: 55.7558,
      lg: 37.6173
    },
    {
      address: 'ул. Пушкина, 10, Санкт-Петербург',
      clientType: 'standard',
      lt: 59.9343,
      lg: 30.3351
    }])
    const addVertex = (vertex: Vertex) => {
        setVertexes(prev => [...prev, vertex]);
    };

    async function handleDelete() {
        return;
    }

    async function handleEdit() {
        return;
    }

    useEffect(() => {}, [])
    return (
        <>
            <div className="mt-[3rem] w-full s-[75%]">
                <h1 className="text-[3rem] text-black font-bold text-center mb-[3rem]">Ваши адреса</h1>
                <div className="text-center mb-8">
                    <Button 
                        text="+ Добавить адрес" 
                        className="font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg shadow-md px-8 py-3 mb-3" 
                        onSubmit={() => setIsModalOpen(true)} 
                    />
                </div>
                <div className='mb-[5rem]'>
                    {vertexes.map((vertex, index) => (
                        <VertexCard
                        key={index}
                        vertex={vertex}
                        className='hover:bg-gray-100'
                        />
                    ))}
                </div>
                <Button text="Сгенерировать маршрут" className="font-medium m-auto w-[20%] hover:bg-gray-100 bg-white rounded-lg shadow-md border border-gray-200 p-[2rem] mb-3" onSubmit={() => {
                    setPoints(vertexes)
                    router.push("/map")
                }} />
                <AdressPopup 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
            />
            </div>
        </>
    )
}

export default MainPage
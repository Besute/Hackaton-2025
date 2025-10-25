"use client"

import { AccessContext } from '@/src/components/context/access';
import AdressPopup from '@/src/components/ui/adressPopup';
import Button from '@/src/components/ui/button';
import VertexCard from '@/src/components/ui/vertexCard';
import { Vertex } from '@/src/types/vertex';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';

const MainPage = function() {
    const router = useRouter();
    const {setPoints, token, baseURL} = useContext(AccessContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [vertexes, setVertexes] = useState<Vertex[]>([]);
    useLayoutEffect(() => {
        async function getCurrentVertexes() {
            const currentVerts = (await fetch(baseURL + "/get_vertexes", {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `${token}`
                }
            }))
            const data = await currentVerts.json();
            setVertexes(data.vertexes || [])
        }
        getCurrentVertexes();
    }, [loading])
    const addVertex = async (address: string, lunch: string, timeOfWork: string, clientType: string, lat: undefined | number, lon: number | undefined) => {
        setLoading(true);
        await fetch(baseURL + "/add_vertex", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify({
                address,
                client_type: clientType,
                working_hours: timeOfWork,
                lunch_hours: lunch,
                lt: (lat === undefined ? null : lat),
                lg: (lon === undefined ? null : lon),
            })
        })
        setLoading(false);
    };

    async function handleDelete(address: string) {
        fetch(baseURL + "/delete_vertex", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify({
                token,
                address
            })
        })
    }

    useEffect(() => {}, [])
    return (
        <>
            <div className="mt-[3rem] w-full s-[75%]">
                <h1 className="text-[3rem] text-black font-bold text-center mb-[3rem]">Ваши адреса</h1>
                <div className="text-center mb-8">
                    <Button 
                        text="+ Добавить адрес" 
                        className="w-[30%] m-auto font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg shadow-md px-8 py-3 mb-3" 
                        onSubmit={() => setIsModalOpen(true)} 
                    />
                </div>
                <div className='mb-[5rem]'>
                    {vertexes.map((vertex, index) => (
                        <VertexCard
                        key={index}
                        vertex={{address: vertex.address, lt: vertex.lt, lg: vertex.lg, lunch_hours: "0", working_hours: vertex.timeOfWork, client_type: vertex.clientType}}
                        className='hover:bg-gray-100'
                        onDelete={(address : string) => {handleDelete(address)}}
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
                    onSubmit={(address: string, lunch: string, work: string, type: string, lat: number | undefined, lon: number | undefined) => {
                        addVertex(address, lunch, work, type, lat, lon)
                    }}
            />
            </div>
        </>
    )
}

export default MainPage
"use cleint"

import { useState } from "react";
import AddressInputWithSuggestions from "./inputFieldWithSuggestions";

interface AdressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: string, lunch: string, work: string, type: string) => void;
}

// const geocodeAddress = async (address: string): Promise<[number, number]> => {
//   return new Promise((resolve, reject) => {
//     window.ymaps.geocode(address, { results: 1 })
//       .then((result: any) => {
//         const firstGeoObject = result.geoObjects.get(0);
//         if (firstGeoObject) {
//           const coordinates = firstGeoObject.geometry.getCoordinates();
//           resolve(coordinates);
//         } else {
//           reject(new Error(`Адрес не найден: ${address}`));
//         }
//       })
//       .catch((error: any) => {
//         reject(new Error(`Ошибка геокодирования: ${error}`));
//       });
//   });
// };

const AdressPopup = function({isOpen, onClose, onSubmit} : AdressPopupProps) {
        const [formData, setFormData] = useState({
        address: '',
        workHours: '',
        lunchBreak: '',
        type: 'Стандарт',
    });
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
        const handleClose = () => {
        setFormData({
        address: '',
        workHours: '',
        lunchBreak: '',
        type: ''
        });
        onClose();
    };

    const handleAddressSelect = (address: string, coords?: { lat: number; lon: number }) => {
        setFormData(prev => ({ ...prev, address }));
        setCoordinates(coords || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData.address, formData.lunchBreak, formData.workHours, formData.type);
        onClose();
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    if (isOpen) {
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
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                        Сохранить
                    </button>
                </div>
                </form>
            </div>
            </div>
        );
    } else {
        return null;
    }
}

export default AdressPopup
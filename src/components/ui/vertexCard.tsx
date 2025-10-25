import { Vertex } from '@/src/types/vertex';

interface VertexCardProps {
  vertex: Vertex;
  onEdit?: (vertex: Vertex) => void;
  onDelete?: (vertex: Vertex) => void;
  className?: string;
}

const VertexCard = function({ vertex, onEdit, onDelete, className = '' }: VertexCardProps) {
  return (
    <div className={`transition-all duration-150 m-auto max-w-[80%] bg-white rounded-lg shadow-md border border-gray-200 p-[2rem] mb-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-[2rem] font-semibold text-gray-800 truncate">
              {vertex.address}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-[1.5rem] text-gray-600">
            <svg className="w-[1.5rem] h-[1.5rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Широта: {vertex.lt !== null ? vertex.lt.toFixed(6) : null}</span>
            <span>Долгота: {vertex.lg !== null ? vertex.lg.toFixed(6) : null}</span>
          </div>
          <div className="flex items-center space-x-4 text-[1.5rem] text-gray-600">
            <svg className="w-[1.5rem] h-[1.5rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            <span>Время работы: {vertex.timeOfWork}</span>
          </div>
        </div>
        <span className={`
              text-center p-[2rem] text-[2rem] font-medium rounded-full
              ${vertex.clientType === 'vip' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
              }
            `}>
              {vertex.clientType === 'vip' ? 'VIP' : 'Стандарт'}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex items-center flex-col space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(vertex)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Редактировать"
              >
                <svg className="w-[2rem] h-[2rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vertex)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Удалить"
              >
                <svg className="w-[2rem] h-[2rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VertexCard;
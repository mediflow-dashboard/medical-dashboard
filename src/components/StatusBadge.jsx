import React from 'react';
import { cn } from '../lib/utils';

const statusStyles = {
    scheduled: "bg-gray-100 text-gray-800 border-gray-200",
    waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
    called: "bg-indigo-100 text-indigo-800 border-indigo-200 animate-pulse",
    consulting: "bg-green-100 text-green-800 border-green-200",
    finished: "bg-blue-100 text-blue-800 border-blue-200",
    absent: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-500 border-gray-200 line-through",
};

const statusLabels = {
    scheduled: "Programado",
    waiting: "En Sala de Espera",
    called: "Llamando...",
    consulting: "En Consulta",
    finished: "Finalizado",
    absent: "Ausente",
    cancelled: "Cancelado",
};

export function StatusBadge({ status }) {
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            statusStyles[status] || statusStyles.scheduled
        )}>
            {statusLabels[status] || status}
        </span>
    );
}

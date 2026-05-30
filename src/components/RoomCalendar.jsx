import React from 'react';
import { cn } from '../lib/utils';
import { StatusBadge } from './StatusBadge';

export function RoomCalendar({ appointments, rooms }) {
    // Generate time slots from 08:00 to 14:00 (15 min intervals)
    const timeSlots = [];
    const startHour = 8;
    const endHour = 14;

    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hourStr = h.toString().padStart(2, '0');
            const minStr = m.toString().padStart(2, '0');
            timeSlots.push(`${hourStr}:${minStr}`);
        }
    }

    // Helper to find appointment for a specific time and room
    const getAppointment = (time, room) => {
        return appointments.find(app => app.time === time && app.room === room);
    };

    // Helper to check if we should show the doctor header
    // We show it if it's the first slot for this doctor in this room
    const shouldShowDoctorHeader = (time, room, currentDoctor) => {
        if (!currentDoctor) return false;

        // Find index of current time
        const currentIndex = timeSlots.indexOf(time);
        if (currentIndex === 0) return true; // Always show at start of day

        const prevTime = timeSlots[currentIndex - 1];
        const prevApp = getAppointment(prevTime, room);
        const prevDoctor = prevApp ? prevApp.doctorName : null;

        return currentDoctor !== prevDoctor;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-gray-200 bg-gray-50">
                        <div className="p-4 text-sm font-semibold text-gray-500 border-r border-gray-200 sticky left-0 bg-gray-50 z-10">
                            Horario
                        </div>
                        {rooms.map((room) => (
                            <div key={room} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-sm font-bold text-gray-900">Consultorio {room}</div>
                            </div>
                        ))}
                    </div>

                    {/* Body Rows */}
                    <div className="divide-y divide-gray-200">
                        {timeSlots.map((time) => (
                            <div key={time} className="grid grid-cols-[100px_repeat(6,1fr)] hover:bg-gray-50/50 transition-colors">
                                {/* Time Column */}
                                <div className="p-3 text-xs font-medium text-gray-500 border-r border-gray-200 flex items-center justify-center sticky left-0 bg-white group-hover:bg-gray-50/50">
                                    {time}
                                </div>

                                {/* Room Columns */}
                                {rooms.map((room) => {
                                    const app = getAppointment(time, room);
                                    const isAvailable = app?.status === 'available';
                                    const showHeader = app && shouldShowDoctorHeader(time, room, app.doctorName);

                                    return (
                                        <div key={`${time}-${room}`} className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px] relative">
                                            {/* In-Column Doctor Header */}
                                            {showHeader && (
                                                <div className="absolute top-0 left-0 right-0 -mt-3 flex justify-center z-10 px-2 pointer-events-none">
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-blue-200 uppercase tracking-wide">
                                                        {app.doctorName}
                                                    </span>
                                                </div>
                                            )}

                                            {app ? (
                                                <div className={cn(
                                                    "h-full rounded-lg p-2 text-xs border flex flex-col gap-1 shadow-sm transition-all hover:shadow-md",
                                                    isAvailable
                                                        ? "bg-gray-50 border-gray-200 border-dashed"
                                                        : "bg-white border-gray-200",
                                                    showHeader && "mt-2" // Add margin if header is present
                                                )}>
                                                    {isAvailable ? (
                                                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                                                            Disponible
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="font-bold text-gray-900 truncate" title={app.patientName}>
                                                                {app.patientName}
                                                            </div>
                                                            <div className="mt-auto pt-1">
                                                                <StatusBadge status={app.status} size="sm" />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

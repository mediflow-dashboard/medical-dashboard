import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function DoctorFilter({ doctors, selectedDoctor, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredDoctors = doctors.filter(doc =>
        doc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
            >
                <span className={cn("text-sm", selectedDoctor === 'all' ? "text-gray-500" : "text-gray-900 font-medium")}>
                    {selectedDoctor === 'all' ? 'Filtrar por Médico...' : selectedDoctor}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 w-[240px] bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 pb-2 border-b border-gray-100 mb-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar médico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto">
                        <button
                            onClick={() => {
                                onSelect('all');
                                setIsOpen(false);
                                setSearchTerm('');
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between group"
                        >
                            <span className={selectedDoctor === 'all' ? "text-blue-600 font-medium" : "text-gray-700"}>
                                Todos los Médicos
                            </span>
                            {selectedDoctor === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>

                        {filteredDoctors.map(doc => (
                            <button
                                key={doc}
                                onClick={() => {
                                    onSelect(doc);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between group"
                            >
                                <span className={selectedDoctor === doc ? "text-blue-600 font-medium" : "text-gray-700"}>
                                    {doc}
                                </span>
                                {selectedDoctor === doc && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </button>
                        ))}

                        {filteredDoctors.length === 0 && (
                            <div className="px-4 py-3 text-xs text-gray-400 text-center">
                                No se encontraron médicos
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

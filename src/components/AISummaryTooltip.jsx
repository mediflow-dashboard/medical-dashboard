
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, FileText, Activity, Pill, AlertTriangle } from 'lucide-react';

export function AISummaryTooltip({ children, patient, role }) {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const triggerRef = useRef(null);

    // Only show for medical role
    if (role !== 'medical') {
        return <>{children}</>;
    }

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const THRESHOLD = 500; // Approx max height of the card

            if (spaceBelow < THRESHOLD) {
                // Flip UP: Position above the trigger
                setTooltipStyle({
                    bottom: (window.innerHeight - rect.top) + 5,
                    left: rect.left
                });
            } else {
                // Default DOWN: Position below the trigger
                setTooltipStyle({
                    top: rect.bottom + 5,
                    left: rect.left
                });
            }
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    const tooltip = (
        <div
            className="fixed z-[9999] w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
            style={tooltipStyle}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{patient.patientName}</h3>
                    <p className="text-xs text-gray-500">Resumen generado por IA</p>
                </div>
            </div>

            <div className="p-4 space-y-5">

                {/* AI Summary Box */}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-sm text-gray-800 italic leading-relaxed">
                        "{patient.medicalHistorySummary}"
                    </p>
                </div>

                {/* Demographics Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs mb-0.5">Edad</p>
                        <p className="font-semibold text-gray-900">{patient.age} años</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-0.5">Género</p>
                        <p className="font-semibold text-gray-900">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-0.5">Grupo Sanguíneo</p>
                        <p className="font-semibold text-gray-900">{patient.bloodType}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-0.5">Última Visita</p>
                        <p className="font-semibold text-gray-900">{patient.lastVisit}</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-4">

                    {/* Reason for Visit */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <h4 className="font-semibold text-gray-900 text-sm">Motivo de Consulta</h4>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                            {patient.reasonForVisit}
                        </div>
                    </div>

                    {/* Chronic Conditions */}
                    {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-orange-500" />
                                <h4 className="font-semibold text-gray-900 text-sm">Condiciones Crónicas</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {patient.chronicConditions.map((condition, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                        {condition}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {patient.medications && patient.medications.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Pill className="w-4 h-4 text-green-500" />
                                <h4 className="font-semibold text-gray-900 text-sm">Medicación Actual</h4>
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {patient.medications.map((med, idx) => (
                                    <li key={idx}>{med}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Risk Factors */}
                    {patient.riskFactors && patient.riskFactors.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <h4 className="font-semibold text-yellow-800 text-sm">Factores de Riesgo</h4>
                            </div>
                            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                                {patient.riskFactors.map((risk, idx) => (
                                    <li key={idx}>{risk}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {isVisible && createPortal(tooltip, document.body)}
        </>
    );
}

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Stethoscope,
  Building2,
  AlertCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatusBadge } from './StatusBadge';

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
};

export function ReceptionModal({ isOpen, onClose, appointments, onUpdateAppointments }) {
  const [step, setStep] = useState(1);
  const [searchForm, setSearchForm] = useState({
    dni: '',
    name: '',
    dob: ''
  });
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  
  // Express booking state
  const [showExpressBooking, setShowExpressBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Extract unique patients from current appointments database
  const getUniquePatients = () => {
    const patientsMap = new Map();
    appointments.forEach(app => {
      if (app.patientName && !app.isAvailable && app.status !== 'available') {
        if (!patientsMap.has(app.patientName)) {
          patientsMap.set(app.patientName, {
            patientName: app.patientName,
            dni: app.dni,
            birthDate: app.birthDate,
            age: app.age,
            gender: app.gender,
            bloodType: app.bloodType,
            medicalHistorySummary: app.medicalHistorySummary,
            reasonForVisit: app.reasonForVisit,
            chronicConditions: app.chronicConditions,
            medications: app.medications,
            riskFactors: app.riskFactors,
            insurance: app.insurance
          });
        }
      }
    });
    return Array.from(patientsMap.values());
  };

  // Perform search and matching
  useEffect(() => {
    if (!searchForm.dni || !searchForm.name || !searchForm.dob) {
      setResults([]);
      return;
    }

    const uniquePatients = getUniquePatients();
    const scoredPatients = uniquePatients.map(patient => {
      let dniScore = 0;
      let matchedFields = [];

      // 1. DNI matching (up to 100 points)
      const searchDni = searchForm.dni.replace(/\D/g, '');
      const patientDni = (patient.dni || '').replace(/\D/g, '');
      if (searchDni && patientDni) {
        if (patientDni === searchDni) {
          dniScore = 100;
          matchedFields.push('DNI exacto');
        } else {
          const dist = levenshtein(searchDni, patientDni);
          const maxLength = Math.max(searchDni.length, patientDni.length);
          const sim = 1 - dist / maxLength;
          if (sim > 0.5) {
            dniScore = Math.round(sim * 80);
            matchedFields.push(`DNI similar (${Math.round(sim * 100)}%)`);
          }
        }
      }

      // 2. Name matching (up to 100 points)
      const cleanSearchName = normalizeString(searchForm.name);
      const cleanPatientName = normalizeString(patient.patientName);
      let nameScore = 0;

      if (cleanSearchName && cleanPatientName) {
        if (cleanPatientName === cleanSearchName) {
          nameScore = 100;
          matchedFields.push('Nombre exacto');
        } else {
          const searchTokens = cleanSearchName.split(/\s+/).filter(Boolean);
          const patientTokens = cleanPatientName.split(/\s+/).filter(Boolean);
          
          let tokenMatches = 0;
          searchTokens.forEach(st => {
            if (patientTokens.some(pt => pt.includes(st) || st.includes(pt))) {
              tokenMatches++;
            }
          });
          
          const tokenSim = searchTokens.length > 0 ? (tokenMatches / searchTokens.length) : 0;
          const dist = levenshtein(cleanSearchName, cleanPatientName);
          const maxLength = Math.max(cleanSearchName.length, cleanPatientName.length);
          const levSim = 1 - dist / maxLength;
          const combinedSim = Math.max(tokenSim, levSim);
          
          if (combinedSim > 0.3) {
            nameScore = Math.round(combinedSim * 90);
            matchedFields.push(`Nombre similar (${Math.round(combinedSim * 100)}%)`);
          }
        }
      }

      // 3. DOB matching (up to 100 points)
      let dobScore = 0;
      if (searchForm.dob && patient.birthDate) {
        let formattedSearchDob = searchForm.dob;
        if (searchForm.dob.includes('-')) {
          const [year, month, day] = searchForm.dob.split('-');
          formattedSearchDob = `${day}/${month}/${year}`;
        }
        
        if (patient.birthDate === formattedSearchDob) {
          dobScore = 100;
          matchedFields.push('F. Nac. exacta');
        } else {
          const [sDay, sMonth, sYear] = formattedSearchDob.split('/');
          const [pDay, pMonth, pYear] = patient.birthDate.split('/');
          
          if (sDay === pDay && sMonth === pMonth) {
            dobScore = 50;
            matchedFields.push('Cumpleaños coincidente');
          } else if (sYear === pYear) {
            dobScore = 30;
            matchedFields.push('Mismo año nac.');
          }
        }
      }

      // Weighted score out of 100%: DNI (40%), Name (40%), DOB (20%)
      const totalScore = Math.round((dniScore * 0.4) + (nameScore * 0.4) + (dobScore * 0.2));

      return {
        ...patient,
        matchScore: totalScore,
        matchedFields
      };
    });

    // Sort descending and keep candidates with at least some similarity
    const filteredResults = scoredPatients
      .filter(p => p.matchScore >= 10)
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(filteredResults);
  }, [searchForm, appointments]);

  // Load appointments when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const matches = appointments.filter(
        app => app.patientName === selectedPatient.patientName && app.status !== 'available'
      );
      setPatientAppointments(matches);
      setShowExpressBooking(false);
    } else {
      setPatientAppointments([]);
    }
  }, [selectedPatient, appointments]);

  // Load available slots for express booking
  useEffect(() => {
    if (selectedDoctor) {
      const slots = appointments.filter(
        app => app.doctorName === selectedDoctor && app.status === 'available'
      );
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, appointments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setStep(2);
  };

  const handleCheckIn = (appointmentId) => {
    const updated = appointments.map(app => {
      if (app.id === appointmentId) {
        return {
          ...app,
          status: 'waiting',
          checkInTime: new Date().toISOString()
        };
      }
      return app;
    });

    onUpdateAppointments(updated);
    setSuccessMessage('¡Paciente recepcionado con éxito!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      resetForm();
    }, 2000);
  };

  const handleCreateExpressBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot) return;

    // Find the available slot and occupy it
    const updated = appointments.map(app => {
      if (app.doctorName === selectedDoctor && app.time === selectedSlot) {
        return {
          ...app,
          patientName: selectedPatient.patientName,
          dni: selectedPatient.dni,
          birthDate: selectedPatient.birthDate,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
          bloodType: selectedPatient.bloodType,
          medicalHistorySummary: selectedPatient.medicalHistorySummary,
          reasonForVisit: "Consulta Express - Recepción Directa",
          chronicConditions: selectedPatient.chronicConditions || [],
          medications: selectedPatient.medications || [],
          riskFactors: selectedPatient.riskFactors || [],
          confirmed: true,
          status: 'waiting', // Recepcionar directamente
          checkInTime: new Date().toISOString()
        };
      }
      return app;
    });

    onUpdateAppointments(updated);
    setSuccessMessage('¡Turno Express agendado y recepcionado con éxito!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setSearchForm({ dni: '', name: '', dob: '' });
    setResults([]);
    setSelectedPatient(null);
    setPatientAppointments([]);
    setShowExpressBooking(false);
    setSelectedDoctor('');
    setSelectedSlot('');
    setStep(1);
  };

  const uniqueDoctors = [...new Set(appointments.map(a => a.doctorName))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-md text-white">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recepción Express</h2>
              <p className="text-xs text-gray-500 mb-2">Módulo de Admisión y Recepción de Pacientes</p>
              {step === 1 && (
                <div className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 flex flex-col gap-0.5 shadow-xs">
                  <span className="font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-500" /> Pacientes de prueba (copia para buscar):</span>
                  <span>• Juan Perez (DNI: 12.345.678 | F.Nac: 15/05/1980)</span>
                  <span>• Maria Lopez (DNI: 23.456.789 | F.Nac: 22/11/1962)</span>
                  <span>• Pedro Pascal (DNI: 99.111.222 | F.Nac: 02/04/1975)</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Overlay */}
        {successMessage && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 animate-bounce">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Operación Exitosa</h3>
            <p className="text-sm text-green-600 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Content Body */}
        {step === 1 ? (
          <div className="flex-1 overflow-hidden p-6 flex flex-col gap-5">
            {/* Horizontal Search Form */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 shrink-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Buscar Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* DNI Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">DNI</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="dni"
                      value={searchForm.dni}
                      onChange={handleInputChange}
                      placeholder="Ej. 12.345.678"
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre y Apellido</label>
                  <input
                    type="text"
                    name="name"
                    value={searchForm.name}
                    onChange={handleInputChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>

                {/* Date of Birth Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="dob"
                    value={searchForm.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Match Results Table (Full width) */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-500" />
                  Coincidencias Encontradas
                </h3>
                {results.length > 0 && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full">
                    {results.length} coincidencias
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                {results.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 font-semibold mb-1">Comienza tu búsqueda</p>
                    <p className="text-xs text-gray-400 max-w-md">
                      Completa los 3 campos de búsqueda de arriba para filtrar y seleccionar un paciente de nuestra base de datos.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl shadow-xs bg-white">
                    <table className="w-full text-left text-xs border-collapse table-fixed">
                      <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 sticky top-0 z-10 shadow-xs">
                        <tr>
                          <th className="px-4 py-3 w-[25%] bg-gray-50">Paciente</th>
                          <th className="px-4 py-3 w-[14%] bg-gray-50">DNI</th>
                          <th className="px-4 py-3 w-[16%] bg-gray-50">Edad / Género</th>
                          <th className="px-4 py-3 w-[18%] bg-gray-50">Cobertura Médica</th>
                          <th className="px-4 py-3 w-[12%] bg-gray-50">Grupo Sang.</th>
                          <th className="px-4 py-3 text-right w-[15%] bg-gray-50">Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.map((patient, index) => {
                          const initials = patient.patientName
                            ? patient.patientName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()
                            : 'P';
                          return (
                            <tr
                              key={index}
                              onClick={() => handleSelectPatient(patient)}
                              className="hover:bg-blue-50/30 cursor-pointer transition-all duration-150 text-gray-700 bg-white"
                            >
                              <td className="px-4 py-3.5 align-middle border-l-4 border-l-transparent">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-100 text-blue-700">
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-gray-900 truncate" title={patient.patientName}>
                                      {patient.patientName}
                                    </div>
                                    <div className="text-[10px] text-gray-400">Nac: {patient.birthDate}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 font-medium text-gray-600 align-middle truncate" title={patient.dni}>
                                {patient.dni}
                              </td>
                              <td className="px-4 py-3.5 text-gray-600 align-middle truncate">
                                {patient.age} años • {patient.gender}
                              </td>
                              <td className="px-4 py-3.5 font-medium text-gray-600 align-middle truncate" title={patient.insurance}>
                                {patient.insurance || 'Particular'}
                              </td>
                              <td className="px-4 py-3.5 text-gray-600 align-middle">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                  {patient.bloodType || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right align-middle">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 border",
                                    patient.matchScore >= 90
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : patient.matchScore >= 50
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                  )}>
                                    {Math.min(patient.matchScore, 100)}%
                                  </span>
                                  {/* Visual progress bar */}
                                  <div className="w-10 bg-gray-200 rounded-full h-1 overflow-hidden mt-0.5">
                                    <div 
                                      className={cn(
                                        "h-full rounded-full",
                                        patient.matchScore >= 90 
                                          ? "bg-emerald-500" 
                                          : patient.matchScore >= 50
                                            ? "bg-blue-500"
                                            : "bg-amber-500"
                                      )} 
                                      style={{ width: `${Math.min(patient.matchScore, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[9px] text-gray-400 font-normal truncate max-w-[80px]" title={patient.matchedFields.join(', ')}>
                                    {patient.matchedFields[0] || 'Similar'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden p-6 flex flex-col gap-5">
            {/* Back button */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a la búsqueda de pacientes
              </button>
            </div>

            {/* Selected Patient Micro-Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Paciente Seleccionado
                  </span>
                  <h3 className="text-xl font-bold mt-2">{selectedPatient.patientName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Grupo Sanguíneo</p>
                  <p className="text-lg font-bold text-blue-400">{selectedPatient.bloodType || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div>
                  <p className="text-slate-400 mb-0.5">DNI</p>
                  <p className="font-semibold text-white">{selectedPatient.dni}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">F. Nacimiento</p>
                  <p className="font-semibold text-white">{selectedPatient.birthDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Edad / Género</p>
                  <p className="font-semibold text-white">{selectedPatient.age} años • {selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Cobertura Médica</p>
                  <p className="font-semibold text-blue-300 truncate" title={selectedPatient.insurance}>{selectedPatient.insurance || 'Particular'}</p>
                </div>
              </div>
            </div>

            {/* Patient Appointments for Today */}
            {!showExpressBooking ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-3 shrink-0">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Turnos de Hoy
                  </h3>
                  <button
                    onClick={() => setShowExpressBooking(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Turno Express
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {patientAppointments.length === 0 ? (
                    <div className="text-center p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">Sin turnos para hoy</p>
                      <p className="text-xs text-gray-500 mb-4 max-w-xs">Este paciente no tiene turnos programados en el día de hoy.</p>
                      <button
                        onClick={() => setShowExpressBooking(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Agendar Turno Express
                      </button>
                    </div>
                  ) : (
                    patientAppointments.map((app) => {
                      const canCheckIn = app.status === 'scheduled' || app.status === 'absent' || app.status === 'cancelled';
                      const isWaiting = app.status === 'waiting' || app.status === 'called';

                      return (
                        <div
                          key={app.id}
                          className={cn(
                            "p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all bg-white",
                            canCheckIn ? "border-amber-200 bg-amber-50/20" : "border-gray-200"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-600 flex flex-col items-center justify-center shrink-0">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-bold mt-0.5">{app.time}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-900">{app.doctorName}</span>
                                <StatusBadge status={app.status} />
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  Cons: {app.room}
                                </span>
                                <span>•</span>
                                <span className="truncate max-w-[200px]" title={app.reasonForVisit}>
                                  Motivo: {app.reasonForVisit}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex justify-end">
                            {canCheckIn ? (
                              <button
                                onClick={() => handleCheckIn(app.id)}
                                className="w-full md:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                              >
                                <UserCheck className="w-4 h-4" />
                                Recepcionar
                              </button>
                            ) : (
                              <div className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                                {isWaiting ? "En sala de espera" : app.status === 'consulting' ? "En consulta" : "Consulta finalizada"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Express Booking Form */
              <form onSubmit={handleCreateExpressBooking} className="flex-1 bg-gray-50 p-4 border border-gray-200 rounded-xl flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-blue-500" />
                    Agendar Turno Express
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowExpressBooking(false)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doctor Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Médico</label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => {
                        setSelectedDoctor(e.target.value);
                        setSelectedSlot('');
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Seleccionar Médico...</option>
                      {uniqueDoctors.map((doc, idx) => (
                        <option key={idx} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Horario Disponible (Hoy)</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      required
                      disabled={!selectedDoctor}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedDoctor 
                          ? "Selecciona un médico primero..." 
                          : availableSlots.length === 0 
                            ? "Sin horarios disponibles hoy" 
                            : "Seleccionar Horario..."}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot.id} value={slot.time}>
                          {slot.time} (Consultorio {slot.room})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedDoctor || !selectedSlot}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Confirmar y Recepcionar
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-400">
          <span>MediFlow Reception Module</span>
          <span>Prototipo Maquetado v1.0</span>
        </div>

      </div>
    </div>
  );
}

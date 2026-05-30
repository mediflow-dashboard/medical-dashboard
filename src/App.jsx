import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  Stethoscope,
  MoreHorizontal,
  CheckCircle,
  Play,
  XCircle,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  UserCog,
  FileText,
  Building2,
  CalendarClock,
  Filter,
  Sparkles,
  UserX
} from 'lucide-react';
import { StatusBadge } from './components/StatusBadge';
import { AISummaryTooltip } from './components/AISummaryTooltip';
import { SearchableSelect } from './components/SearchableSelect';
import { RoomCalendar } from './components/RoomCalendar';
import { generateMockData, cn } from './lib/utils';
import { ReceptionModal } from './components/ReceptionModal';
import { PatientTimeline } from './components/PatientTimeline';

const STATUS_FILTER_MAP = {
  'Programado': 'scheduled',
  'En Sala de Espera': 'waiting',
  'Llamando': 'called',
  'En Consulta': 'consulting',
  'Finalizado': 'finished',
  'Ausente': 'absent',
  'Cancelado': 'cancelled',
  'Disponible': 'available'
};

const TOTAL_ROOMS = 6; // Fixed total for prototype
const MAX_WAITING_CAPACITY = 15; // Max capacity for waiting room
const MAX_WAIT_TIME_SLA = 20; // Max acceptable wait time in minutes

function App() {
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentRole, setCurrentRole] = useState('medical'); // 'medical', 'admin', 'coordinator'
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('all'); // For Admin filter
  const [selectedRoom, setSelectedRoom] = useState('all'); // For Admin filter
  const [selectedStatus, setSelectedStatus] = useState('all'); // For Status filter
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    setAppointments(generateMockData());
  }, []);

  // Fixed Demo Time: 10:30 AM
  useEffect(() => {
    const demoTime = new Date();
    demoTime.setHours(10, 30, 0, 0);
    setCurrentTime(demoTime);
  }, []);

  // Calculate wait times
  const getWaitTime = (appointment) => {
    if (appointment.status !== 'waiting' || !appointment.checkInTime) return appointment.waitTime;
    const checkIn = new Date(appointment.checkInTime);
    const diffMs = currentTime - checkIn;
    return Math.floor(diffMs / 60000);
  };

  // Calculate Medical Delay (KPI) - HU-Advanced
  const getMedicalDelay = (appointment) => {
    if (!appointment.time) return 0;

    // T_ref = max(Scheduled, Arrival)
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const scheduledDate = new Date(currentTime);
    scheduledDate.setHours(hours, minutes, 0, 0);

    let tRef = scheduledDate;

    if (appointment.checkInTime) {
      const checkInDate = new Date(appointment.checkInTime);
      if (checkInDate > scheduledDate) {
        tRef = checkInDate;
      }
    }

    // If T_ref is in the future, delay is 0
    if (tRef > currentTime) return 0;

    const diffMs = currentTime - tRef;
    return Math.floor(diffMs / 60000);
  };

  // Calculate Actual Doctor delay (both for waiting patients and completed/current consultations)
  const getActualMedicalDelay = (appointment) => {
    if (appointment.status === 'available' || appointment.status === 'cancelled') return 0;

    const [hours, minutes] = appointment.time.split(':').map(Number);
    const scheduledDate = new Date(currentTime);
    scheduledDate.setHours(hours, minutes, 0, 0);

    // 1. If currently waiting or called in the room
    if (appointment.status === 'waiting' || appointment.status === 'called') {
      return getMedicalDelay(appointment);
    }

    // 2. If scheduled but not checked in yet
    if (appointment.status === 'scheduled') {
      if (scheduledDate < currentTime) {
        return Math.floor((currentTime - scheduledDate) / 60000);
      }
      return 0;
    }

    // 3. If consulting or finished (was already attended)
    // We discount the patient's lateness from the doctor's delay
    let tRef = scheduledDate;
    if (appointment.checkInTime) {
      const checkInDate = new Date(appointment.checkInTime);
      if (checkInDate > scheduledDate) {
        tRef = checkInDate;
      }
    }

    if (appointment.attendedTime) {
      const attendedDate = new Date(appointment.attendedTime);
      return Math.max(0, Math.floor((attendedDate - tRef) / 60000));
    }

    if (appointment.checkInTime) {
      const checkInDate = new Date(appointment.checkInTime);
      const attendedDate = new Date(checkInDate.getTime() + (appointment.waitTime || 0) * 60000);
      return Math.max(0, Math.floor((attendedDate - tRef) / 60000));
    }

    return appointment.waitTime || 0;
  };

  // 1. Determine Base Data for View (Metrics Scope)
  // Medical: Only their patients. Admin/Coordinator: ALL patients (Global).
  const metricsData = appointments.filter(app => {
    if (currentRole === 'medical') {
      return app.doctorName === 'Dr. Smith';
    }
    return true;
  });

  // 2. Determine Table Data (Visual Scope)
  // Admin can filter the table further by doctor and room, but metrics remain global.
  const tableData = metricsData.filter(app => {
    // 1. Doctor Filter
    if (currentRole === 'admin' || currentRole === 'coordinator') {
      const doctorMatch = selectedDoctor === 'all' || app.doctorName === selectedDoctor;
      if (!doctorMatch) return false;
    }
    
    // 2. Room Filter (Admin only)
    if (currentRole === 'admin') {
      const roomMatch = selectedRoom === 'all' || app.room === selectedRoom;
      if (!roomMatch) return false;
    }
    
    // 3. Status Filter (Admin & Coordinator)
    if (currentRole === 'admin' || currentRole === 'coordinator') {
      const statusKey = STATUS_FILTER_MAP[selectedStatus];
      const statusMatch = selectedStatus === 'all' || app.status === statusKey;
      if (!statusMatch) return false;
    }
    
    return true;
  });

  // Unique doctors and rooms for filter
  const doctorsList = [...new Set(appointments.map(a => a.doctorName))];
  const roomsList = [...new Set(appointments.map(a => a.room).filter(Boolean))].sort();

  // Metrics (Calculated from metricsData - Global for Admin)
  const waitingPatients = metricsData.filter(a => a.status === 'waiting' || a.status === 'called').length;
  const activeConsultations = metricsData.filter(a => a.status === 'consulting').length;
  const absentPatients = metricsData.filter(a => a.status === 'absent').length;
  const totalPatients = metricsData.length;
  const availableSlots = metricsData.filter(a => a.status === 'available').length;
  const totalSlots = metricsData.length;

  // Coordinator Metrics
  const occupancyRate = Math.round(((totalSlots - availableSlots) / totalSlots) * 100);
  const absenteeismRate = Math.round((absentPatients / (totalSlots - availableSlots)) * 100);

  const confirmedAppointments = metricsData.filter(a => a.confirmed).length;
  const totalScheduled = totalSlots - availableSlots;
  const confirmedRate = totalScheduled > 0 ? Math.round((confirmedAppointments / totalScheduled) * 100) : 0;

  const totalWaitTime = metricsData
    .filter(a => a.status === 'waiting' || a.status === 'consulting' || a.status === 'finished')
    .reduce((acc, curr) => acc + getWaitTime(curr), 0);

  const countForAvg = metricsData.filter(a => a.status === 'waiting' || a.status === 'consulting' || a.status === 'finished').length;
  const avgWaitTime = countForAvg > 0 ? Math.floor(totalWaitTime / countForAvg) : 0;

  // Actions
  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev => prev.map(app => {
      if (app.id !== id) return app;
      const updates = { status: newStatus };
      if (newStatus === 'waiting' && app.status !== 'waiting') {
        updates.checkInTime = new Date().toISOString();
      }
      if ((app.status === 'waiting' || app.status === 'called') && (newStatus !== 'waiting' && newStatus !== 'called')) {
        updates.waitTime = getWaitTime(app);
        // Keep checkInTime in state so it remains available for the PatientTimeline
        updates.attendedTime = new Date().toISOString();
      }
      return { ...app, ...updates };
    }));
  };

  const roles = [
    { id: 'medical', label: 'Vista Médica', icon: Stethoscope },
    { id: 'admin', label: 'Vista Administrativa', icon: FileText },
    { id: 'coordinator', label: 'Vista Coordinador', icon: UserCog },
  ];

  const currentRoleLabel = roles.find(r => r.id === currentRole)?.label;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">MediFlow</h1>
              <p className="text-xs text-gray-500">Dashboard de Gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-gray-900">{currentTime.toLocaleDateString()}</div>
              <div className="text-xs text-gray-500">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                {currentRole === 'medical' && <Stethoscope className="w-4 h-4" />}
                {currentRole === 'admin' && <FileText className="w-4 h-4" />}
                {currentRole === 'coordinator' && <UserCog className="w-4 h-4" />}
                <span>{currentRoleLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isRoleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsRoleMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          setCurrentRole(role.id);
                          setIsRoleMenuOpen(false);
                          setSelectedDoctor('all'); // Reset filter on role change
                          setSelectedStatus('all'); // Reset status filter on role change
                          if (role.id === 'coordinator') {
                            setViewMode('calendar');
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors",
                          currentRole === role.id ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                        )}
                      >
                        <role.icon className="w-4 h-4" />
                        {role.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {currentRole === 'coordinator' ? (
            <>
              <MetricCard
                icon={<Building2 className="w-5 h-5 text-blue-600" />}
                title="Tasa de Ocupación"
                value={`${occupancyRate}%`}
                trend="OKR: > 85%"
                trendColor={occupancyRate > 85 ? "text-green-600" : "text-red-600"}
              />
              <MetricCard
                icon={<UserX className="w-5 h-5 text-purple-600" />}
                title="Tasa de Ausentismo"
                value={`${absenteeismRate}%`}
                trend="OKR: < 5%"
                trendColor={absenteeismRate < 5 ? "text-green-600" : "text-red-600"}
              />
              <MetricCard
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                title="Turnos Confirmados"
                value={`${confirmedRate}%`}
                trend="OKR: > 80%"
                trendColor={confirmedRate > 80 ? "text-green-600" : "text-red-600"}
              />
            </>
          ) : (
            <>
              <MetricCard
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title={currentRole === 'medical' ? "Mis Pacientes en Espera" : "Total Pacientes en Espera"}
                value={currentRole === 'medical' ? waitingPatients : `${waitingPatients} / ${MAX_WAITING_CAPACITY}`}
                trend={waitingPatients > 4 ? "Alta demanda" : "Normal"}
                trendColor={waitingPatients > 4 ? "text-red-600" : "text-green-600"}
              />
              <MetricCard
                icon={<Clock className="w-5 h-5 text-orange-600" />}
                title="Demora Promedio"
                value={`${avgWaitTime} min / ${MAX_WAIT_TIME_SLA} min`}
                trend={avgWaitTime > 20 ? "Crítico" : "Aceptable"}
                trendColor={avgWaitTime > 20 ? "text-red-600" : "text-green-600"}
              />
              <MetricCard
                icon={currentRole === 'medical' ? <UserX className="w-5 h-5 text-gray-600" /> : <Stethoscope className="w-5 h-5 text-green-600" />}
                title={currentRole === 'medical' ? "Ausentismo" : "Consultorios Ocupados"}
                value={currentRole === 'medical' ? `${absentPatients} / ${totalPatients}` : `${activeConsultations} / ${TOTAL_ROOMS}`}
                trend={currentRole === 'medical' ? "Pacientes Ausentes" : "En funcionamiento"}
                trendColor="text-gray-600"
              />
            </>
          )}
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentRole === 'medical' ? 'Mi Agenda del Día' : 'Agenda General'}
                </h2>
                <p className="text-sm text-gray-500">
                  {tableData.length} turnos mostrados {((currentRole === 'admin' || currentRole === 'coordinator') && (selectedDoctor !== 'all' || selectedStatus !== 'all')) && (
                    <span>
                      (Filtrado: {selectedDoctor !== 'all' && `Médico: ${selectedDoctor}`} {selectedStatus !== 'all' && ` Estado: ${selectedStatus}`})
                    </span>
                  )}
                </p>
              </div>

              {/* Filters for Admin & Coordinator */}
              {(currentRole === 'admin' || currentRole === 'coordinator') && (
                <div className="flex items-center gap-2 ml-4">
                  <SearchableSelect
                    items={doctorsList}
                    selectedItem={selectedDoctor}
                    onSelect={setSelectedDoctor}
                    placeholder="Filtrar Médico..."
                    label="Todos los Médicos"
                  />
                  
                  <SearchableSelect
                    items={Object.keys(STATUS_FILTER_MAP)}
                    selectedItem={selectedStatus}
                    onSelect={setSelectedStatus}
                    placeholder="Filtrar Estado..."
                    label="Todos los Estados"
                  />

                  {currentRole === 'admin' && (
                    <SearchableSelect
                      items={roomsList}
                      selectedItem={selectedRoom}
                      onSelect={setSelectedRoom}
                      placeholder="Filtrar Consultorio..."
                      label="Todos los Consultorios"
                    />
                  )}
                </div>
              )}

              {/* View Toggle for Coordinator */}
              {currentRole === 'coordinator' && (
                <div className="flex bg-gray-100 p-1 rounded-lg ml-4">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      viewMode === 'list' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      viewMode === 'calendar' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Calendario
                  </button>
                </div>
              )}
            </div>

            {currentRole === 'admin' && (
              <button
                onClick={() => setIsReceptionModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95 transition-transform"
              >
                Recepción
              </button>
            )}
          </div>

          {viewMode === 'calendar' && currentRole === 'coordinator' ? (
            <RoomCalendar appointments={tableData} rooms={['101', '205', '303', '404', '505', '606']} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Horario Turno</th>
                    <th className="px-6 py-3">Paciente</th>
                    {currentRole !== 'medical' && <th className="px-6 py-3">Profesional</th>}
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Hora Recepción</th>
                    <th className="px-6 py-3">Tiempo en Sala</th>
                    {currentRole === 'coordinator' && <th className="px-6 py-3">Estado Demora (KPI)</th>}
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableData.length === 0 ? (
                    <tr>
                      <td colSpan={currentRole === 'medical' ? 6 : (currentRole === 'admin' ? 7 : 8)} className="px-6 py-8 text-center text-gray-500">
                        No hay turnos para mostrar en esta vista.
                      </td>
                    </tr>
                  ) : (
                    tableData.map((app) => {
                      const currentWaitTime = getWaitTime(app); // Patient Experience (Time since check-in)
                      const medicalDelay = getActualMedicalDelay(app); // Improved Doctor Delay KPI

                      const isWaiting = app.status === 'waiting' || app.status === 'called';
                      const isCancelled = app.status === 'cancelled';
                      const isAvailable = app.status === 'available';
                      const isCheckedIn = app.status === 'waiting' || app.status === 'called' || app.status === 'consulting' || app.status === 'finished';

                      // Traffic Light Logic for Doctor Delay Scale
                      let delayColor = "bg-green-100 text-green-700 border-green-200"; 
                      let delayLabel = "En Tiempo";

                      if (!isAvailable && !isCancelled) {
                        const isAttended = app.status === 'consulting' || app.status === 'finished';
                        
                        if (medicalDelay <= 0) {
                          delayColor = "bg-green-100 text-green-700 border-green-200";
                          delayLabel = isAttended ? "Atendido a Tiempo" : "A Tiempo";
                        } else if (medicalDelay <= 10) {
                          delayColor = "bg-blue-100 text-blue-700 border-blue-200";
                          delayLabel = isAttended ? `Atraso Leve (+${medicalDelay}m)` : `Demora Leve (${medicalDelay}m)`;
                        } else if (medicalDelay <= 20) {
                          delayColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                          delayLabel = isAttended ? `Atraso Medio (+${medicalDelay}m)` : `Demora Media (${medicalDelay}m)`;
                        } else {
                          delayColor = "bg-red-100 text-red-700 border-red-200 animate-pulse";
                          delayLabel = isAttended ? `Atraso Crítico (+${medicalDelay}m)` : `Demora Crítica (${medicalDelay}m)`;
                        }
                      } else if (isCancelled) {
                        delayColor = "bg-gray-100 text-gray-500 border-gray-200";
                        delayLabel = "Cancelado";
                      } else if (isAvailable) {
                        delayColor = "bg-gray-50 text-gray-400 border-gray-100";
                        delayLabel = "Disponible";
                      }

                      // Row Background based on status
                      let rowBg = "";
                      if (isCancelled) rowBg = "bg-gray-50 opacity-60";
                      if (isAvailable) rowBg = "bg-gray-50/50";

                      return (
                        <tr key={app.id} className={cn("hover:bg-gray-50 transition-colors", rowBg)}>
                          {/* Horario Turno */}
                          <td className="px-6 py-4 font-medium text-gray-900">{app.time}</td>

                          {/* Paciente */}
                          <td className="px-6 py-4">
                            {isAvailable ? (
                              <span className="text-gray-400 italic">Disponible</span>
                            ) : (
                              <AISummaryTooltip patient={app} role={currentRole}>
                                <div className="cursor-help">
                                  <div className="flex items-center gap-2">
                                    <span className={cn("font-medium text-gray-900", isCancelled && "line-through text-gray-500")}>
                                      {app.patientName}
                                    </span>
                                    {currentRole === 'medical' && (
                                      <div className="bg-indigo-100 p-1 rounded text-indigo-600" title="Resumen IA Disponible">
                                        <Sparkles className="w-3 h-3" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {app.dni && `DNI: ${app.dni}`}
                                    {app.birthDate && ` • Nac: ${app.birthDate}`}
                                    {!app.dni && !app.birthDate && `ID: #${app.id}`}
                                  </div>
                                </div>
                              </AISummaryTooltip>
                            )}
                          </td>

                          {/* Profesional */}
                          {currentRole !== 'medical' && (
                            <td className="px-6 py-4 text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                  {app.doctorName.split(' ')[1][0]}
                                </div>
                                {app.doctorName}
                              </div>
                            </td>
                          )}

                          {/* Estado */}
                          <td className="px-6 py-4">
                            {isAvailable ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Disponible
                              </span>
                            ) : (
                              <StatusBadge status={app.status} />
                            )}
                          </td>

                          {/* Hora Recepción */}
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {app.checkInTime ? new Date(app.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                          </td>

                          {/* Tiempo en Sala (Experiencia Paciente) */}
                          <td className="px-6 py-4">
                            {isCheckedIn ? (
                              <PatientTimeline appointment={app} currentTime={currentTime} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          {/* Estado Demora (KPI Médico) - Hidden for Admin & Medical */}
                          {currentRole === 'coordinator' && (
                            <td className="px-6 py-4">
                              {!isAvailable && (
                                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold", delayColor)}>
                                  <CalendarClock className="w-3 h-3" />
                                  <span>{delayLabel}</span>
                                </div>
                              )}
                            </td>
                          )}

                          {/* Acciones */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {!isAvailable && (
                                <>
                                  {/* Check-in Removed per User Request */}
                                  {/* Medical Role Actions */}
                                  {currentRole === 'medical' && app.status === 'waiting' && (
                                    <ActionButton
                                      onClick={() => handleStatusChange(app.id, 'called')}
                                      icon={<Users className="w-4 h-4" />}
                                      label="Llamar"
                                      color="blue"
                                    />
                                  )}
                                  {currentRole === 'medical' && app.status === 'called' && (
                                    <ActionButton
                                      onClick={() => handleStatusChange(app.id, 'consulting')}
                                      icon={<Play className="w-4 h-4" />}
                                      label="Atender"
                                      color="green"
                                    />
                                  )}
                                  {currentRole === 'medical' && app.status === 'consulting' && (
                                    <ActionButton
                                      onClick={() => handleStatusChange(app.id, 'finished')}
                                      icon={<LogOut className="w-4 h-4" />}
                                      label="Finalizar"
                                      color="gray"
                                    />
                                  )}

                                  {/* Cancel Action */}
                                  {(app.status === 'scheduled' || (currentRole === 'admin' && app.status === 'waiting')) && (
                                    <ActionButton
                                      onClick={() => handleStatusChange(app.id, 'cancelled')}
                                      icon={<XCircle className="w-4 h-4" />}
                                      label="Cancelar"
                                      color="red"
                                      variant="ghost"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ReceptionModal
        isOpen={isReceptionModalOpen}
        onClose={() => setIsReceptionModalOpen(false)}
        appointments={appointments}
        onUpdateAppointments={setAppointments}
      />
    </div>
  );
}

function MetricCard({ icon, title, value, trend, trendColor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-gray-100", trendColor)}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ActionButton({ onClick, icon, label, color, variant = 'solid', className }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    gray: "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200",
  };

  const ghostColors = {
    red: "text-red-400 hover:text-red-600 hover:bg-red-50",
  };

  const baseClass = "p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-medium shadow-sm active:scale-95";
  const colorClass = variant === 'ghost' ? ghostColors[color] : colors[color];

  return (
    <button onClick={onClick} className={cn(baseClass, colorClass, className)} title={label}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export default App;

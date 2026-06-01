import React, { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Activity,
  Brain,
  AlertTriangle,
  TrendingUp,
  Tv,
  CheckCircle,
  Users,
  Clock,
  Stethoscope,
  Building2,
  UserCog,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SLIDES = [
  {
    id: 1,
    type: 'cover',
    tag: 'PRODUCT CHALLENGE',
    title: 'Orquestando la Experiencia Clínica',
    subtitle: 'Del Diagnóstico a la Solución',
    description: 'Propuesta para transformar la gestión de turnos y la experiencia del paciente en su red de 8 clínicas ambulatorias.',
    author: 'Marcos Caputo',
    role: 'Médico Informático'
  },
  {
    id: 2,
    type: 'kpis',
    tag: 'EL CONTEXTO',
    title: 'La Realidad de la Operación',
    subtitle: 'Un sistema bajo estrés crónico con ineficiencias sistémicas',
    kpis: [
      {
        value: '45 min',
        label: 'Espera Promedio',
        desc: 'Tiempo improductivo en sala de espera que deteriora la experiencia del paciente y genera estrés en el personal.',
        color: 'from-rose-500 to-amber-500',
        icon: Clock
      },
      {
        value: '30%',
        label: 'Tasa de Ausentismo',
        desc: 'Turnos perdidos sin aviso previo por falta de canales interactivos de confirmación y recordatorio.',
        color: 'from-amber-500 to-yellow-500',
        icon: Users
      },
      {
        value: '8 Clínicas',
        label: 'Operando en Silos',
        desc: 'Inexistencia de datos compartidos en tiempo real. Coordinación fragmentada y ceguera operativa macro.',
        color: 'from-blue-500 to-indigo-500',
        icon: Building2
      }
    ]
  },
  {
    id: 3,
    type: 'voices',
    tag: 'EMPATIZAR',
    title: 'Las Voces de la Operación',
    subtitle: 'Segmentación de actores para diseñar una solución con valor real',
    personas: [
      {
        role: 'Administrativo de Recepción',
        alias: 'La Torre de Control',
        pain: 'Dolor: Alta sobrecarga cognitiva. Gestiona simultáneamente teléfono, planillas Excel y pacientes presenciales enojados.',
        need: 'Necesidad: Agilidad extrema. Requiere registrar un arribo (check-in) en menos de 5 segundos.',
        color: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
        icon: FileText
      },
      {
        role: 'Médico Especialista',
        alias: 'El Ejecutor',
        pain: 'Dolor: Incertidumbre y tiempos muertos. No sabe si su próximo paciente llegó o si se ausentó.',
        need: 'Necesidad: Foco y flujo clínico. Quiere saber exactamente quién sigue y cuánto tiempo lleva en sala.',
        color: 'border-teal-500/20 bg-teal-500/5 text-teal-400',
        icon: Stethoscope
      },
      {
        role: 'Coordinador de Operaciones',
        alias: 'El Estratega',
        pain: 'Dolor: "Caja negra" operativa. Se entera de las demoras acumuladas al día siguiente a través de las quejas.',
        need: 'Necesidad: Visibilidad macro. Tableros en tiempo real y alertas de saturación para rebalancear recursos.',
        color: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
        icon: UserCog
      },
      {
        role: 'El Paciente',
        alias: 'El Usuario Final',
        pain: 'Dolor: Ansiedad por la espera indefinida, falta de comunicación y pérdida de tiempo.',
        need: 'Necesidad: Certidumbre y respeto. Transparencia sobre los tiempos reales de demora de su turno.',
        color: 'border-pink-500/20 bg-pink-500/5 text-pink-400',
        icon: Users
      }
    ]
  },
  {
    id: 4,
    type: 'methodology',
    tag: 'METODOLOGÍA',
    title: 'Metodología Diagnóstica',
    subtitle: 'Enfoque de Design Thinking adaptado a procesos médicos (BPMN)',
    steps: [
      {
        number: '01',
        title: 'Empatizar',
        desc: 'Mapeo detallado de dolores y necesidades mediante entrevistas con staff clínico y administrativo.'
      },
      {
        number: '02',
        title: 'Definir',
        desc: 'Modelado de procesos AS-IS en estándar BPMN para ubicar roturas de flujo y desperdicios (Mudas).'
      },
      {
        number: '03',
        title: 'Idear',
        desc: 'Diseño de backlog centrado en Historias de Usuario (HUs) priorizadas según su impacto en el MVP.'
      },
      {
        number: '04',
        title: 'Prototipar',
        desc: 'Desarrollo ágil de un dashboard unificado ("Single Screen") para probar interacciones en vivo.'
      }
    ]
  },
  {
    id: 5,
    type: 'mri',
    tag: 'EL DIAGNÓSTICO',
    title: 'El "MRI" Operativo: Flujo AS-IS',
    subtitle: 'Detección de puntos de dolor y desperdicios de proceso (Mudas) mediante BPMN',
    points: [
      {
        title: 'Silos de Información',
        desc: 'La agenda de turnos y la recepción presencial operan desconectadas. Los datos no fluyen de forma natural entre la admisión y el consultorio.',
        badge: 'Rotura de Flujo'
      },
      {
        title: 'Re-digitación y Burocracia',
        desc: 'Carga manual de datos de la agenda a planillas Excel locales por parte de la recepción, sumando fricción y margen de error.',
        badge: 'Desperdicio (Muda)'
      },
      {
        title: 'Ausencia de Feedback Loop',
        desc: 'El médico desconoce el arribo del paciente y el paciente desconoce el retraso del médico, operando de forma reactiva ante la incertidumbre.',
        badge: 'Gestión Reactiva'
      }
    ]
  },
  {
    id: 6,
    type: 'diagnosis',
    tag: 'DIAGNÓSTICO SISTÉMICO',
    title: 'Diagnóstico: Síntomas vs Causas Raíz',
    subtitle: 'El análisis de fondo para justificar el desarrollo del producto',
    table: [
      {
        symptom: 'Planillas manuales y agenda telefónica',
        cause: 'Silos de data clínica atrapada localmente (rotura de flujo en BPMN)',
        impact: 'Imposibilidad de tomar decisiones en tiempo real'
      },
      {
        symptom: 'Espera promedio de 45 minutos',
        cause: 'Inexistencia de feedback loops y visibilidad de cuellos de botella',
        impact: 'Ansiedad en pacientes y alta rotación/estrés de staff'
      },
      {
        symptom: '30% de ausentismo diario',
        cause: 'Baja fricción para faltar, sin recordatorios ni alertas proactivas',
        impact: 'Pérdida directa de facturación y horas médicas ociosas'
      },
      {
        symptom: 'Tiempos ociosos del consultorio',
        cause: 'Gestión reactiva de la llegada; el médico no sabe si el paciente está',
        impact: 'Menor rendimiento de la clínica y frustración profesional'
      }
    ]
  },
  {
    id: 7,
    type: 'treatment',
    tag: 'LA PROPUESTA',
    title: 'Tratamiento: Orquestador MediFlow',
    subtitle: 'Un Dashboard unificado de pantalla única para sincronizar la clínica',
    concepts: [
      {
        title: 'Recepción Fast-Track',
        desc: 'Búsqueda por DNI inteligente con datos precargados del paciente. Admisión presencial lista en menos de 5 segundos.',
        icon: FileText
      },
      {
        title: 'Flujo de Estados en Tiempo Real',
        desc: 'Motor centralizado de transiciones ágiles: Programado ➡️ En Espera ➡️ En Consulta ➡️ Finalizado.',
        icon: Activity
      },
      {
        title: 'Semáforo de Demoras Clínicas',
        desc: 'Cálculo algorítmico de demoras del médico para alertar proactivamente a coordinadores y pacientes.',
        icon: AlertTriangle
      }
    ]
  },
  {
    id: 8,
    type: 'demo',
    tag: 'SIMULACIÓN INTERACTIVA',
    title: 'Terapia Dirigida: Demo en Vivo',
    subtitle: 'Experimenta la solución recorriendo los 3 roles clínicos de punta a punta',
    description: 'Hemos preparado un flujo de simulación completo en el dashboard real. Vivirás la experiencia de los tres actores de la clínica:',
    roles: [
      {
        num: '1',
        title: 'Recepción Express',
        desc: 'Admite pacientes rápidamente, visualiza la línea de tiempo y alertas internacionales de identificación (Itaes).'
      },
      {
        num: '2',
        title: 'Vista Médica',
        desc: 'Visualiza la lista de espera, accede al resumen de ficha clínica por IA y atiende al paciente en un clic.'
      },
      {
        num: '3',
        title: 'Control de Coordinador',
        desc: 'Supervisa métricas de OKRs globales, el semáforo inteligente de demoras y la grilla de consultorios.'
      }
    ],
    cta: 'Iniciar Simulación en Vivo'
  },
  {
    id: 9,
    type: 'forecast',
    tag: 'PRONÓSTICO',
    title: 'Pronóstico de Impacto',
    subtitle: 'Los 3 pilares para la reducción efectiva de tiempos de espera',
    pillars: [
      {
        title: 'Optimización de Recepción',
        desc: 'Al estar integrado con el agendamiento, el recepcionista solo valida la identidad. Menos carga manual equivale a colas de espera más rápidas en el mostrador.',
        icon: CheckCircle
      },
      {
        title: 'Sincronización Activa',
        desc: 'El médico visualiza en tiempo real la llegada del paciente a la sala, reduciendo a cero el tiempo ocioso del consultorio por falta de aviso.',
        icon: TrendingUp
      },
      {
        title: 'Contexto Operativo en Vivo',
        desc: 'Los dashboards no son solo reportes estáticos; actúan como guías operativas en vivo que informan al staff qué hacer y a quién priorizar en el instante.',
        icon: UserCog
      }
    ]
  },
  {
    id: 10,
    type: 'roadmap',
    tag: 'PLAN DE VUELO',
    title: 'Implementación Gradual y Segura',
    subtitle: 'Hoja de ruta sugerida para mitigar el riesgo operativo en el rollout',
    phases: [
      {
        step: 'Fase 1',
        title: 'Piloto Controlado',
        duration: 'Semanas 1-3',
        desc: 'Implementación del MVP en la clínica de mayor volumen para validar UX y flujos operativos con staff real.'
      },
      {
        step: 'Fase 2',
        title: 'Ajuste y Capacitación',
        duration: 'Semana 4',
        desc: 'Corrección ágil de desvíos detectados en piloto y capacitación presencial a los líderes de las otras 7 sedes.'
      },
      {
        step: 'Fase 3',
        title: 'Rollout Secuencial',
        duration: 'Semanas 5-8',
        desc: 'Despliegue progresivo a razón de 2 clínicas por semana con monitoreo intensivo e hiper-care en sitio.'
      },
      {
        step: 'Fase 4',
        title: 'Optimización IA',
        duration: 'Semana 9+',
        desc: 'Análisis de datos históricos de demoras reales para reconfigurar la duración de turnos de manera inteligente.'
      }
    ]
  },
  {
    id: 11,
    type: 'risks',
    tag: 'ANTICIPAR COMPLICACIONES',
    title: 'Matriz de Riesgos y Mitigaciones',
    subtitle: 'Preparándonos para los desafíos comunes en implementaciones de salud',
    table: [
      {
        risk: 'Resistencia al cambio (Personal de Recepción)',
        prob: 'Alta',
        imp: 'Alto',
        mitigation: 'Involucrar a líderes en la fase de prototipado. UX optimizada con atajos de teclado y capacitación presencial.'
      },
      {
        risk: 'Integración técnica con EMRs/HIS existentes',
        prob: 'Alta',
        imp: 'Crítico',
        mitigation: 'Desarrollo de una capa middleware interoperable bajo estándares modernos HL7 FHIR para sincronización fluida.'
      },
      {
        risk: 'Inconsistencia de datos (Garbage In / Out)',
        prob: 'Media',
        imp: 'Alto',
        mitigation: 'Acciones de "un clic" que no exigen escritura adicional. Auditoría automatizada de marcas de tiempo.'
      }
    ]
  },
  {
    id: 12,
    type: 'ai',
    tag: 'INNOVACIÓN',
    title: 'Inteligencia Artificial Aplicada (Bonus Track)',
    subtitle: 'Capacidad predictiva y clínica para maximizar el tiempo médico',
    features: [
      {
        title: 'Resumen Clínico Contextual',
        desc: 'El sistema sintetiza mediante procesamiento de lenguaje natural (NLP) la ficha histórica del paciente, antecedentes críticos y alergias, presentándola en hover de forma inmediata al médico.',
        icon: Brain
      },
      {
        title: 'Asistente de Prescripciones',
        desc: 'Identificación inteligente de turnos destinados a renovación de recetas. El sistema pre-redacta la receta basándose en el historial para que el médico solo deba revisar y confirmar.',
        icon: Sparkles
      }
    ]
  },
  {
    id: 13,
    type: 'versus',
    tag: 'DIFERENCIADOR',
    title: 'MediFlow vs HIS Tradicional',
    subtitle: 'Por qué un software transaccional no resuelve problemas de flujo en sala',
    table: [
      {
        metric: 'Enfoque Principal',
        traditional: 'Facturación y auditoría administrativa rígida.',
        mediflow: 'Optimización de flujo en tiempo real y experiencia humana.'
      },
      {
        metric: 'Diseño de Interfaz',
        traditional: 'Sistemas con menús anidados y múltiples clics lentos.',
        mediflow: 'Pantalla Única (Single Screen) diseñada para agilidad operativa.'
      },
      {
        metric: 'Análisis de Datos',
        traditional: 'Estadísticas estáticas post-mortem (a mes vencido).',
        mediflow: 'Información del "ahora" para la toma de decisiones inmediatas.'
      },
      {
        metric: 'Curva de Aprendizaje',
        traditional: 'Semanas de entrenamiento y manuales de usuario complejos.',
        mediflow: 'Intuitivo y directo, requiere menos de 15 minutos de inducción.'
      }
    ]
  },
  {
    id: 14,
    type: 'conclusion',
    tag: 'CONCLUSIÓN',
    title: 'Listos para Orquestar el Cambio',
    subtitle: 'La transformación operativa de la red de clínicas comienza hoy',
    points: [
      'Validación de la propuesta de valor con un MVP funcional interactivo.',
      'Siguiente hito: Selección de la clínica piloto para la Fase 1 del Roadmap.',
      'Configuración de endpoints HL7 FHIR para asegurar la integración técnica limpia.'
    ],
    contact: {
      name: 'Marcos Caputo',
      role: 'Médico Informático',
      tagline: 'Optimizando procesos de salud a través de la tecnología centrada en las personas.'
    }
  }
];

export function PresentationView({ currentSlide, setCurrentSlide, onStartDemo, mode }) {
  const slide = SLIDES[currentSlide];

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode !== 'presentation') return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentSlide]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden select-none font-sans">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Slide Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-6 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-md shadow-blue-500/10">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-white flex items-center gap-2">
              MediFlow <span className="text-xs bg-slate-800 text-slate-400 font-medium px-2 py-0.5 rounded-md border border-slate-700/50">Pitch Deck</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentSlide < 7 && (
            <button
              onClick={() => setCurrentSlide(7)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all hover:bg-blue-500/20 active:scale-95 flex items-center gap-1"
            >
              Saltar a Demo
              <Play className="w-3 h-3" />
            </button>
          )}
          <span className="text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            Slide {currentSlide + 1} de {SLIDES.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-6xl w-full mx-auto h-1 bg-slate-900 rounded-full overflow-hidden mb-6 z-10 shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Slide Content Card */}
      <main className="max-w-6xl w-full mx-auto bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-6 md:p-12 flex-1 flex flex-col justify-center relative overflow-hidden z-10 transition-all duration-300">
        
        {/* Subtle slide type tag */}
        {slide.tag && (
          <div className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-2 bg-slate-800/40 border border-slate-700/30 px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
            {slide.tag}
          </div>
        )}

        {/* Dynamic Render based on slide type */}
        <div className="w-full flex-1 flex flex-col justify-center mt-6 md:mt-4">
          
          {/* COVER TYPE */}
          {slide.type === 'cover' && (
            <div className="text-center max-w-3xl mx-auto py-8">
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight leading-[1.1] mb-6 font-display">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-blue-400 mb-6 tracking-wide">
                {slide.subtitle}
              </p>
              <p className="text-slate-400 text-sm md:text-md mb-10 leading-relaxed">
                {slide.description}
              </p>
              <div className="inline-flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-4 px-6 rounded-2xl shadow-inner">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  MC
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{slide.author}</div>
                  <div className="text-xs text-slate-400 font-medium">{slide.role}</div>
                </div>
              </div>
            </div>
          )}

          {/* KPIS TYPE */}
          {slide.type === 'kpis' && (
            <div>
              <div className="mb-8 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slide.kpis.map((kpi, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/40 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                          <kpi.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className={cn("text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent mb-1 font-display", kpi.color)}>
                        {kpi.value}
                      </h3>
                      <h4 className="text-md font-bold text-white mb-2">{kpi.label}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{kpi.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOICES TYPE */}
          {slide.type === 'voices' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slide.personas.map((p, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-4 items-start relative overflow-hidden",
                      p.color
                    )}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{p.role}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">({p.alias})</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-1">{p.pain}</p>
                      <p className="text-xs text-slate-300 font-semibold leading-relaxed border-t border-white/5 pt-1.5 mt-1.5">{p.need}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* METHODOLOGY TYPE */}
          {slide.type === 'methodology' && (
            <div>
              <div className="mb-8 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {slide.steps.map((st, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                    <span className="text-4xl font-black text-slate-800 font-display mb-3 block group-hover:text-blue-500/40 transition-colors">
                      {st.number}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-2">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MRI TYPE */}
          {slide.type === 'mri' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {slide.points.map((pt, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-orange-500" />
                    <div>
                      <span className="inline-flex px-2 py-0.5 text-[9px] font-bold rounded-md bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider mb-4">
                        {pt.badge}
                      </span>
                      <h3 className="text-md font-bold text-white mb-2">{pt.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AS-IS flow drawing */}
              <div className="mt-8 p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-wrap md:flex-nowrap items-center justify-between gap-2 text-center text-xs">
                <div className="flex-1 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="font-bold text-white mb-1">1. Solicita Turno</div>
                  <div className="text-[10px] text-slate-500">Agenda estática</div>
                </div>
                <div className="text-slate-600 font-bold hidden md:block">➔</div>
                <div className="flex-1 p-3 bg-red-950/20 rounded-xl border border-red-900/30">
                  <div className="font-bold text-red-400 mb-1">2. Fila Admisión</div>
                  <div className="text-[10px] text-red-500/80">Carga manual lenta</div>
                </div>
                <div className="text-slate-600 font-bold hidden md:block">➔</div>
                <div className="flex-1 p-3 bg-red-950/20 rounded-xl border border-red-900/30">
                  <div className="font-bold text-red-400 mb-1">3. Sala de Espera</div>
                  <div className="text-[10px] text-red-500/80">Incertidumbre total</div>
                </div>
                <div className="text-red-900 font-bold animate-pulse text-lg py-1 px-2 shrink-0">⚡ Rotura</div>
                <div className="flex-1 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="font-bold text-white mb-1">4. Consulta</div>
                  <div className="text-[10px] text-slate-500">Tiempos muertos</div>
                </div>
              </div>
            </div>
          )}

          {/* DIAGNOSIS TYPE */}
          {slide.type === 'diagnosis' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-3">Síntoma Reportado</th>
                        <th className="px-6 py-3">Diagnóstico (Causa Raíz)</th>
                        <th className="px-6 py-3">Impacto Clínico / Operativo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {slide.table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-rose-400">{row.symptom}</td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{row.cause}</td>
                          <td className="px-6 py-4 text-slate-400">{row.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TREATMENT TYPE */}
          {slide.type === 'treatment' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {slide.concepts.map((conc, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/60 transition-all">
                    <div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl w-fit mb-4">
                        <conc.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-md font-bold text-white mb-2">{conc.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{conc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple graphic */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-slate-800/80 rounded-2xl text-center flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1.5">Arquitectura de Operación Sincronizada</span>
                <p className="text-[11px] text-slate-400 max-w-xl">
                  MediFlow unifica la admisión de la recepción, la agenda en sala del profesional y la supervisión en tiempo real del coordinador bajo una única base de datos reactiva.
                </p>
              </div>
            </div>
          )}

          {/* DEMO TYPE */}
          {slide.type === 'demo' && (
            <div className="text-center py-4">
              <div className="max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight mb-2">{slide.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{slide.subtitle}</p>
                <p className="text-slate-300 text-xs mt-3 leading-relaxed max-w-lg mx-auto">
                  {slide.description}
                </p>
              </div>

              {/* Step cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
                {slide.roles.map((r, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 text-left flex gap-3 relative">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {r.num}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{r.title}</h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Huge CTA button */}
              <div className="flex justify-center">
                <button
                  onClick={onStartDemo}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-md font-bold rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 relative group animate-pulse"
                >
                  <Play className="w-5 h-5 text-white" />
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity -z-10" />
                </button>
              </div>
            </div>
          )}

          {/* FORECAST TYPE */}
          {slide.type === 'forecast' && (
            <div>
              <div className="mb-8 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slide.pillars.map((pil, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-slate-700/60 transition-colors">
                    <div>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-4">
                        <pil.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-md font-bold text-white mb-2">{pil.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{pil.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROADMAP TYPE */}
          {slide.type === 'roadmap' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {slide.phases.map((ph, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{ph.step}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">{ph.duration}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">{ph.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{ph.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RISKS TYPE */}
          {slide.type === 'risks' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-3">Riesgo Identificado</th>
                        <th className="px-6 py-3 w-[15%]">Prob.</th>
                        <th className="px-6 py-3 w-[15%]">Impacto</th>
                        <th className="px-6 py-3">Estrategia de Mitigación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {slide.table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-200">{row.risk}</td>
                          <td className="px-6 py-4 font-bold text-orange-400">{row.prob}</td>
                          <td className="px-6 py-4 font-bold text-rose-500">{row.imp}</td>
                          <td className="px-6 py-4 text-slate-350 leading-relaxed">{row.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AI TYPE */}
          {slide.type === 'ai' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slide.features.map((feat, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700/60 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      {feat.icon === 'Brain' ? <Brain className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                      {feat.title}
                      <span className="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Generativa
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERSUS TYPE */}
          {slide.type === 'versus' && (
            <div>
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                <p className="text-slate-400 text-sm mt-1.5">{slide.subtitle}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-3 w-[25%]">Característica</th>
                        <th className="px-6 py-3">Software de Gestión Tradicional (HIS)</th>
                        <th className="px-6 py-3 text-blue-400">Orquestador MediFlow (Propuesto)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {slide.table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-300">{row.metric}</td>
                          <td className="px-6 py-4 text-slate-400">{row.traditional}</td>
                          <td className="px-6 py-4 text-blue-300 font-semibold bg-blue-500/5">{row.mediflow}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONCLUSION TYPE */}
          {slide.type === 'conclusion' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-4">{slide.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{slide.subtitle}</p>
                <div className="space-y-3.5">
                  {slide.points.map((pt, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-slate-300 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-indigo-500/5 rounded-bl-full" />
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-md shadow-md">
                      MC
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{slide.contact.name}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{slide.contact.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic mb-4 leading-relaxed border-t border-slate-850 pt-3">
                    "{slide.contact.tagline}"
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold py-2.5 px-4 rounded-xl text-center uppercase tracking-wider">
                    Listo para Piloto
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Slide Footer Navigation */}
      <footer className="max-w-6xl w-full mx-auto flex justify-between items-center mt-6 z-10 shrink-0">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-xl transition-all disabled:opacity-20 disabled:hover:text-slate-400 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        {/* Indicators */}
        <div className="hidden md:flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === idx 
                  ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500" 
                  : "w-2 bg-slate-800 hover:bg-slate-700"
              )}
              title={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-xl transition-all disabled:opacity-20 disabled:hover:text-slate-400 active:scale-95"
        >
          Siguiente
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}

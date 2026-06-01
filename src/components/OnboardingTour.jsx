import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function OnboardingTour({ isOpen, steps, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0, visible: false });

  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
    }
  }, [isOpen]);

  // Lock body scroll while tour is active
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Track target element dimensions and coordinates in real-time
  useEffect(() => {
    if (!isOpen || !steps || steps.length === 0) return;

    let animId;
    const step = steps[activeStep];

    const updateCoordinates = () => {
      if (!step || !step.selector) {
        setCoords(prev => ({ ...prev, visible: false }));
        return;
      }

      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        // If element is completely hidden or has 0 dimensions, fallback to center
        if (rect.width === 0 && rect.height === 0) {
          setCoords(prev => ({ ...prev, visible: false }));
        } else {
          setCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            visible: true
          });
        }
      } else {
        setCoords(prev => ({ ...prev, visible: false }));
      }

      animId = requestAnimationFrame(updateCoordinates);
    };

    updateCoordinates();

    // Scroll active element into view on step change
    if (step && step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isOpen, activeStep, steps]);

  if (!isOpen || !steps || steps.length === 0) return null;

  const currentStepData = steps[activeStep];
  const isCentered = !coords.visible;

  // Calculate Popover positioning
  const getTooltipPosition = () => {
    const gap = 12;
    const placement = currentStepData.placement || 'bottom';

    switch (placement) {
      case 'top':
        return {
          top: `${coords.top - gap}px`,
          left: `${coords.left + coords.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${coords.top + coords.height + gap}px`,
          left: `${coords.left + coords.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${coords.top + coords.height / 2}px`,
          left: `${coords.left - gap}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${coords.top + coords.height / 2}px`,
          left: `${coords.left + coords.width + gap}px`,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: `${coords.top + coords.height + gap}px`,
          left: `${coords.left + coords.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  const popoverStyle = isCentered
    ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    : getTooltipPosition();

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 select-none font-sans">
      {/* Cutout Overlay with single div trick (Large box shadow) */}
      <div 
        className={cn(
          "fixed pointer-events-none transition-all duration-300 ease-in-out z-40 rounded-xl",
          coords.visible 
            ? "border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.6),_0_0_15px_rgba(59,130,246,0.6)] animate-pulse" 
            : "fixed inset-0 bg-slate-900/60 pointer-events-auto cursor-default"
        )}
        style={coords.visible ? {
          top: `${coords.top - 4}px`,
          left: `${coords.left - 4}px`,
          width: `${coords.width + 8}px`,
          height: `${coords.height + 8}px`
        } : {}}
      />

      {/* Popover Card */}
      <div
        className="fixed bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-50/80 p-5 w-80 text-gray-800 z-50 transition-all duration-300 ease-in-out flex flex-col gap-3"
        style={popoverStyle}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Paso {activeStep + 1} de {steps.length}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            title="Cerrar Guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-snug">
            {currentStepData.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Benefit block */}
        {currentStepData.benefit && (
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-emerald-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-[10.5px] font-medium leading-normal">
              <span className="font-bold text-emerald-900">Beneficio:</span> {currentStepData.benefit}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Atrás
          </button>
          
          <button
            onClick={handleNext}
            className={cn(
              "px-3.5 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-sm flex items-center gap-1 active:scale-95",
              activeStep === steps.length - 1 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {activeStep === steps.length - 1 ? (
              <>
                Entendido
                <Check className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

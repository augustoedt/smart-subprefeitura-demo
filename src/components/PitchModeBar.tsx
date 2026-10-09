import React, { useState } from 'react';
import { 
  Sparkles, ChevronLeft, ChevronRight, X, Play, CheckCircle2, 
  ExternalLink, HelpCircle, ShieldCheck, Target, Award
} from 'lucide-react';
import { PitchTourStep } from '../types';
import { PITCH_TOUR_STEPS } from '../dataPitchTour';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';

interface PitchModeBarProps {
  currentSection: 'sala_situacao' | 'painel_admin' | 'app_campo' | 'simulacao_zap' | 'modulo_social';
  onNavigate: (section: 'sala_situacao' | 'painel_admin' | 'app_campo' | 'simulacao_zap' | 'modulo_social') => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchModeBar({ currentSection, onNavigate, isOpen, onClose }: PitchModeBarProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const currentStep = PITCH_TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < PITCH_TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigate(PITCH_TOUR_STEPS[nextIdx].moduloAlvo);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigate(PITCH_TOUR_STEPS[prevIdx].moduloAlvo);
    }
  };

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
    onNavigate(PITCH_TOUR_STEPS[index].moduloAlvo);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 pointer-events-none">
      <div className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md text-slate-200 p-3.5 sm:p-4 transition-all">
        {/* Top Header do Roteiro */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-800 text-sky-400 border border-slate-700">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white tracking-tight">
                  Roteiro de Demonstração Executiva
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                  Etapa {currentStepIndex + 1} de {PITCH_TOUR_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Público-Alvo: Gestores Públicos, Secretários Municipais e Lideranças Técnicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-md bg-slate-800 hover:bg-slate-750 transition-colors border border-slate-700"
            >
              {isMinimized ? 'Expandir' : 'Minimizar'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Encerrar roteiro"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Conteúdo do Passo Ativo */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center mb-3">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-emerald-400">
                    Perfil de Uso: {currentStep.ator}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {currentStep.titulo}
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-sky-400 block mb-0.5">Fundamentação de Gestão:</span>
                  {currentStep.argumentoVenda}
                </div>
                <p className="text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Ação na interface: </span>
                  {currentStep.acaoSugerida}
                </p>
              </div>

              {/* Botões de Ação e Navegação */}
              <div className="md:col-span-4 flex flex-col gap-2 justify-center">
                <button
                  onClick={() => onNavigate(currentStep.moduloAlvo)}
                  className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Ir para Tela deste Passo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Anterior
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStepIndex === PITCH_TOUR_STEPS.length - 1}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    Próximo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
              {PITCH_TOUR_STEPS.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleGoToStep(idx)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white shadow-xs'
                        : isPassed
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <span className="font-mono">{step.id}</span>}
                    <span className="hidden sm:inline">Passo {step.id}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

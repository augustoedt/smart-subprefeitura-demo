import React, { useMemo, useState } from 'react';
import { BibliotecaPublicaGeolocalizada, Chamado } from '../types';
import { calcularDiagnosticoEntornoBibliotecas } from '../dataLayerMapping';
import { 
  BookOpen, MapPin, Clock, Accessibility, ShieldCheck, 
  AlertTriangle, Wrench, CheckCircle2, Sparkles, ExternalLink,
  Layers, Compass, ArrowRight, Building2, Trees
} from 'lucide-react';

interface ModalBibliotecaPublicaProps {
  biblioteca: BibliotecaPublicaGeolocalizada | null;
  onClose: () => void;
  chamados: Chamado[];
  onPriorizarZeladoria?: (bibliotecaId: string, chamadosIds: string[]) => void;
}

export default function ModalBibliotecaPublica({
  biblioteca,
  onClose,
  chamados,
  onPriorizarZeladoria
}: ModalBibliotecaPublicaProps) {
  const [zeladoriaPriorizada, setZeladoriaPriorizada] = useState(false);

  // Calcular diagnóstico de chamados no entorno
  const diagnostico = useMemo(() => {
    if (!biblioteca) return null;
    const res = calcularDiagnosticoEntornoBibliotecas([biblioteca], chamados);
    return res[0] || null;
  }, [biblioteca, chamados]);

  if (!biblioteca) return null;

  const handlePriorizar = () => {
    if (diagnostico && onPriorizarZeladoria) {
      const ids = diagnostico.chamadosMaisProximos.map(p => p.chamado.id);
      onPriorizarZeladoria(biblioteca.id, ids);
    }
    setZeladoriaPriorizada(true);
    setTimeout(() => setZeladoriaPriorizada(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner com Destaque Cultural */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 sm:p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Fechar"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-200 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              Secretaria Municipal de Cultura (SMC / CSMB)
            </span>
            <span>• {biblioteca.distrito} / Subprefeitura {biblioteca.subprefeituraNome}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white shadow-lg">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
                {biblioteca.nome}
              </h2>
              <p className="text-xs text-rose-100 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {biblioteca.endereco}
              </p>
            </div>
          </div>
        </div>

        {/* Corpo do Prontuário com Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-300 text-xs">
          {/* Caixa de Análise do Papel Análogo às Imagens Anexadas */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Papel Análogo aos Anexos (Reims • CiaoBudapest • Masterplan • AIRlab)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {biblioteca.papelAnalogoAnexo}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-800/40 text-[10px]">
              <div className="p-2 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="font-bold text-slate-900 dark:text-white block">Équipement Majeur</span>
                <span className="text-slate-500 dark:text-slate-400">Anexo 3 Reims</span>
              </div>
              <div className="p-2 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="font-bold text-slate-900 dark:text-white block">Culture / Landmark</span>
                <span className="text-slate-500 dark:text-slate-400">Anexo 4 Budapest</span>
              </div>
              <div className="p-2 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="font-bold text-slate-900 dark:text-white block">Polo Cívico 3D</span>
                <span className="text-slate-500 dark:text-slate-400">Anexo 2 Masterplan</span>
              </div>
              <div className="p-2 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="font-bold text-slate-900 dark:text-white block">Built Form Fatia 4</span>
                <span className="text-slate-500 dark:text-slate-400">Anexo 1 Site Analysis</span>
              </div>
            </div>
          </div>

          {/* Atributos Institucionais da Biblioteca */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Acervo e Especialidade</span>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{biblioteca.acervoEspecialidade}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Funcionamento e Acesso</span>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{biblioteca.horarioFuncionamento}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <Accessibility className="w-3.5 h-3.5" />
                <span>Acessibilidade Universal PCD Garantida</span>
              </div>
            </div>
          </div>

          {/* Diagnóstico de Zeladoria no Raio de Proteção da Biblioteca */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Raio de Proteção & Acessibilidade da Zeladoria ({biblioteca.raioProtecaoZeladoriaMetros}m)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-extrabold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                {diagnostico?.totalChamadosNoRaio || 0} chamados no entorno
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Para assegurar o acesso seguro de pedestres, estudantes e idosos à biblioteca, os chamados de tapa-buraco, calçada acessível, poda de árvore e iluminação pública no raio de 500m recebem fator multiplicador de urgência.
            </p>

            {diagnostico && diagnostico.chamadosMaisProximos.length > 0 ? (
              <div className="space-y-2">
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider block">
                  Ocorrências mais próximas à entrada da biblioteca:
                </span>
                <div className="space-y-1.5">
                  {diagnostico.chamadosMaisProximos.map(({ chamado, distanciaMetros }) => (
                    <div 
                      key={chamado.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          chamado.prioridade === 'URGENTE' ? 'bg-red-500 animate-ping' :
                          chamado.prioridade === 'ALTA' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                            {chamado.categoria}: {chamado.endereco}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Protocolo: {chamado.protocolo} • Prioridade: {chamado.prioridade}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {distanciaMetros}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Nenhuma ocorrência crítica aberta no raio imediato de 500m desta biblioteca.</span>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé com Ações Operacionais */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Compass className="w-4 h-4 text-slate-400" />
            <span className="font-mono">Lat: {biblioteca.lat.toFixed(4)}, Lng: {biblioteca.lng.toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handlePriorizar}
              disabled={zeladoriaPriorizada || !diagnostico || diagnostico.totalChamadosNoRaio === 0}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
                zeladoriaPriorizada
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {zeladoriaPriorizada ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ordens Priorizadas com Sucesso!</span>
                </>
              ) : (
                <>
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Priorizar Zeladoria no Entorno</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

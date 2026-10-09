import React, { useState } from 'react';
import { User, Building2, MapPin, ArrowRight, ShieldCheck, HardHat, Users, Award } from 'lucide-react';
import { UserSession, UserRole } from '../LoginTypes';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';

export default function LoginScreen({ onLogin }: { onLogin: (session: UserSession) => void }) {
  const [role, setRole] = useState<UserRole>('GESTOR');
  const [matricula, setMatricula] = useState('SP-842.190');

  const handleLogin = () => {
    onLogin({
      role,
      subprefeituraId: role === 'GESTOR' ? '2' : undefined,
      matricula: role === 'FUNCIONARIO' ? matricula : undefined
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 relative z-10">
        
        {/* Header Institucional PMSP / Subprefeitura Vila Mariana */}
        <div className="bg-slate-900 p-6 text-white border-b border-slate-800 relative">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <BrasaoSaoPaulo size={44} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block leading-tight">
                Prefeitura da Cidade de São Paulo
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white leading-snug">
                Subprefeitura Vila Mariana
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">
                Secretaria Municipal das Subprefeituras • SMSUB
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Jurisdição: Vila Mariana • Moema • Saúde</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium text-[11px]">
              SUB-VM
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 font-medium">
            Selecione o perfil funcional para acessar a plataforma:
          </div>

          <div className="space-y-2.5">
            <label 
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                role === 'GESTOR' ? 'border-slate-900 bg-slate-50/80 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setRole('GESTOR')}
            >
               <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                 role === 'GESTOR' ? 'border-slate-900' : 'border-slate-300'
               }`}>
                  {role === 'GESTOR' && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
               </div>
               <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-700"/> Gestor Territorial (Subprefeito / Coordenador)
                    </h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Padrão
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Acesso pleno à jurisdição territorial da Subprefeitura, aprovação de O.S. e despacho de campo.
                  </p>
                  
                  {role === 'GESTOR' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-medium text-slate-700 block mb-1">
                        Jurisdição de Atuação
                      </span>
                      <div className="w-full text-xs font-semibold border-slate-300 rounded-md p-2 bg-white border text-slate-800">
                        Subprefeitura Vila Mariana • Vila Mariana, Moema e Saúde
                      </div>
                    </div>
                  )}
               </div>
            </label>

            <label 
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                role === 'CENTRAL' ? 'border-slate-900 bg-slate-50/80 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setRole('CENTRAL')}
            >
               <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                 role === 'CENTRAL' ? 'border-slate-900' : 'border-slate-300'
               }`}>
                  {role === 'CENTRAL' && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
               </div>
               <div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-700"/> Gabinete Central (SMSUB / Supervisão SUB-VM)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supervisão estratégica da SUB-VM, comparativo entre distritos e auditoria operacional.
                  </p>
               </div>
            </label>

            <label 
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                role === 'FUNCIONARIO' ? 'border-slate-900 bg-slate-50/80 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setRole('FUNCIONARIO')}
            >
               <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                 role === 'FUNCIONARIO' ? 'border-slate-900' : 'border-slate-300'
               }`}>
                  {role === 'FUNCIONARIO' && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
               </div>
               <div className="w-full">
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <HardHat className="w-3.5 h-3.5 text-slate-700"/> Encarregado de Equipe de Campo (CPO / SUB-VM)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Smartphone operacional, checklist técnico, upload de fotos antes/depois e trava de risco.
                  </p>
                  
                  {role === 'FUNCIONARIO' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <input 
                        type="text" 
                        placeholder="Matrícula Funcional (Ex: SP-842.190)" 
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        className="w-full text-xs font-medium border-slate-300 rounded-md p-2 border outline-none focus:border-slate-900"
                      />
                    </div>
                  )}
               </div>
            </label>

            <label 
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                role === 'ASSISTENTE_SOCIAL' ? 'border-slate-900 bg-slate-50/80 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setRole('ASSISTENTE_SOCIAL')}
            >
               <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                 role === 'ASSISTENTE_SOCIAL' ? 'border-slate-900' : 'border-slate-300'
               }`}>
                  {role === 'ASSISTENTE_SOCIAL' && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
               </div>
               <div className="w-full">
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-700"/> Equipe Social / SEAS (CRAS Vila Mariana)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atendimento humanizado para pessoas em situação de vulnerabilidade nos distritos da jurisdição.
                  </p>
               </div>
            </label>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs text-sm"
          >
            Iniciar Expediente na Subprefeitura <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="text-[11px] text-center text-slate-400 font-normal">
            Sistema Integrado de Zeladoria Urbana • Decreto Municipal nº 59.775 • PMSP
          </div>
        </div>
      </div>
    </div>
  );
}

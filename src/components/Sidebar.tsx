import React from 'react';
import { Map, LayoutDashboard, Smartphone, Users, MessageSquare, ChevronRight, Info, X, MapPin, Building, Award } from 'lucide-react';
import { UserSession } from '../LoginTypes';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { useApp } from '../context/AppContext';

export type Section = 'sala_situacao' | 'painel_admin' | 'app_campo' | 'modulo_social' | 'simulacao_zap';

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onOpenAbout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  session: UserSession;
}

export function Sidebar({ 
  currentSection, 
  onSectionChange, 
  onOpenAbout,
  isMobileOpen = false,
  onCloseMobile,
  session
}: SidebarProps) {
  const menuItems: { id: Section; label: string; icon: React.ReactNode; badge?: string; roles: string[] }[] = [
    { id: 'sala_situacao', label: 'Sala de Situação', icon: <Map className="w-5 h-5" />, roles: ['CENTRAL', 'GESTOR'] },
    { id: 'painel_admin', label: 'Painel Administrativo', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['CENTRAL', 'GESTOR'] },
    { id: 'app_campo', label: 'App de Campo', icon: <Smartphone className="w-5 h-5" />, roles: ['CENTRAL', 'FUNCIONARIO'] },
    { id: 'simulacao_zap', label: 'Simulação Zap (SP156)', icon: <MessageSquare className="w-5 h-5 text-emerald-400" />, badge: 'Bot 156', roles: ['CENTRAL', 'FUNCIONARIO'] },
    { id: 'modulo_social', label: 'Módulo Social', icon: <Users className="w-5 h-5" />, roles: ['CENTRAL', 'ASSISTENTE_SOCIAL'] },
  ];

  const allowedItems = menuItems.filter(item => session.role && item.roles.includes(session.role));

  const { isPitchTourOpen, setIsPitchTourOpen } = useApp();

  const handleSelect = (id: Section) => {
    onSectionChange(id);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col gap-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BrasaoSaoPaulo size={34} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
                Cidade de São Paulo
              </span>
              <span className="text-sm font-bold text-white tracking-tight leading-snug">
                Subprefeitura Vila Mariana
              </span>
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                SMSUB
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="text-slate-300 font-mono text-[10px]">SUB-VM</span>
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Badge de Jurisdição Territorial */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400">
          <span className="text-slate-500 font-normal">Distritos: </span>
          <span className="text-slate-200 font-medium">Vila Mariana</span> • <span className="text-slate-200 font-medium">Moema</span> • <span className="text-slate-200 font-medium">Saúde</span>
        </div>
      </div>
      
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {/* Roteiro de Demonstração Executiva */}
        <button
          onClick={() => {
            setIsPitchTourOpen(!isPitchTourOpen);
            onCloseMobile?.();
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all min-h-[42px] border ${
            isPitchTourOpen
              ? 'bg-slate-850 bg-slate-800 text-white font-medium border-slate-700 shadow-xs'
              : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border-slate-800'
          }`}
          title="Abrir roteiro de apresentação institucional"
        >
          <div className="flex items-center gap-2.5">
            <Award className={`w-4 h-4 ${isPitchTourOpen ? 'text-sky-400' : 'text-slate-400'}`} />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-slate-200">Roteiro Guiado</span>
              <span className="text-[10px] text-slate-400">Apresentação Executiva</span>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
            isPitchTourOpen ? 'bg-sky-950 text-sky-300 border-sky-800/60' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isPitchTourOpen ? 'Ativo' : '5 etapas'}
          </span>
        </button>

        <div className="my-2 border-t border-slate-800/80" />
        {allowedItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all min-h-[40px] text-xs sm:text-sm ${
                isActive 
                  ? 'bg-slate-900 text-white font-medium shadow-xs border border-slate-800' 
                  : 'hover:bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-3.5 border-t border-slate-800/80 flex flex-col gap-2.5 bg-slate-950">
        <button 
          onClick={onOpenAbout}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 hover:bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors text-xs font-medium min-h-[38px] border border-slate-800"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Sobre a Subprefeitura Vila Mariana
        </button>
        
        {/* Endereço e Dados Oficiais da Sede */}
        <div className="text-[11px] text-slate-500 text-center font-normal leading-relaxed">
          <div className="text-slate-400 font-medium flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> Sede: R. José de Magalhães, 500
          </div>
          <div className="text-slate-500 text-[10px] mt-0.5">
            Prefeitura de São Paulo • SMSUB • SP156
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop Fixa */}
      <aside className="hidden lg:flex w-64 h-screen bg-slate-950 text-slate-300 flex-col shrink-0 border-r border-slate-800/80 shadow-sm">
        {sidebarContent}
      </aside>

      {/* Drawer Mobile com Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <aside className="relative w-72 max-w-[80vw] h-full bg-slate-950 text-slate-300 flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

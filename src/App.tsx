/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Sidebar, Section } from './components/Sidebar';
import { mockChamados, subprefeituras } from './data';
import SalaSituacao from './components/SalaSituacao';
import PainelAdmin from './components/PainelAdmin';
import AppCampo from './components/AppCampo';
import ModuloSocial from './components/ModuloSocial';
import SimulacaoZap from './components/SimulacaoZap';
import { X, Info, LogOut, User, Building2, HardHat, MessageSquare, Menu, Map, LayoutDashboard, Smartphone, Users, ShieldCheck, MapPin } from 'lucide-react';
import { UserSession } from './LoginTypes';
import LoginScreen from './components/LoginScreen';
import ModalSobreProjeto from './components/ModalSobreProjeto';
import { ZapChatSession, Chamado, PainelAdminTab } from './types';
import { MOCK_CONVERSA_INICIAL, gerarTimestampAtual } from './dataZap';
import { AppProvider } from './context/AppContext';
import BrasaoSaoPaulo from './components/BrasaoSaoPaulo';
import AppOverlays from './components/AppOverlays';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentSection, setCurrentSection] = useState<Section>('sala_situacao');
  const [painelAdminTab, setPainelAdminTab] = useState<PainelAdminTab>('COCKPIT');
  const [chamados, setChamados] = useState<Chamado[]>(mockChamados);
  const [zapSession, setZapSession] = useState<ZapChatSession>(MOCK_CONVERSA_INICIAL);
  const previousChamadosRef = useRef<Chamado[]>(mockChamados);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Garante o recorte territorial mesmo durante Fast Refresh de uma sessão local antiga.
  useEffect(() => {
    setChamados((prev) => prev.filter((chamado) => chamado.subprefeituraId === '2'));
  }, []);

  useEffect(() => {
    const previousChamados = previousChamadosRef.current;
    const recemConcluido = chamados.find((chamado) => {
      const anterior = previousChamados.find((item) => item.id === chamado.id);
      return anterior && anterior.status !== 'CONCLUIDO' && chamado.status === 'CONCLUIDO';
    });

    previousChamadosRef.current = chamados;

    if (!recemConcluido) return;

    setZapSession((zapPrev) => ({
      ...zapPrev,
      mensagens: [
        ...zapPrev.mensagens,
        {
          id: `push-conclusao-${crypto.randomUUID()}`,
          remetente: 'BOT_SP156',
          texto: recemConcluido.fotoDepois
            ? `🔔 **Aviso Oficial SP156**: A ordem de serviço referente ao protocolo **${recemConcluido.protocolo}** foi CONCLUÍDA com evidência fotográfica registrada pela equipe técnica.`
            : `🔔 **Aviso Oficial SP156**: A ordem de serviço referente ao protocolo **${recemConcluido.protocolo}** foi encerrada no fluxo operacional.`,
          timestamp: gerarTimestampAtual(),
          statusEnvio: 'LIDO',
          tipoAnexo: recemConcluido.fotoDepois ? 'FOTO' : 'TEXTO',
          anexoUrl: recemConcluido.fotoDepois,
          opcoesRespostaRapida: [
            '⭐ Avaliar este Atendimento',
            '✅ Confirmar Recebimento',
            '🚨 Reabrir se não resolvido'
          ]
        }
      ]
    }));
  }, [chamados]);

  const updateChamadosComNotificacao: React.Dispatch<React.SetStateAction<Chamado[]>> = (action) => {
    setChamados((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      return next.filter((chamado) => chamado.subprefeituraId === '2');
    });
  };

  const handleCriarChamadoViaZap = (novoChamado: Chamado) => {
    if (novoChamado.subprefeituraId !== '2') return;
    setChamados(prev => [novoChamado, ...prev]);
  };

  const handleNavigateToSection = (section: Section, adminTab?: PainelAdminTab): boolean => {
    const allowedSectionsByRole: Record<Exclude<UserSession['role'], null>, Section[]> = {
      CENTRAL: ['sala_situacao', 'painel_admin', 'app_campo', 'simulacao_zap', 'modulo_social'],
      GESTOR: ['sala_situacao', 'painel_admin'],
      FUNCIONARIO: ['app_campo', 'simulacao_zap'],
      ASSISTENTE_SOCIAL: ['modulo_social'],
    };

    if (!session?.role || !allowedSectionsByRole[session.role].includes(section)) return false;

    if (section === 'painel_admin' && adminTab) {
      setPainelAdminTab(adminTab);
    }
    setCurrentSection(section);
    return true;
  };

  if (!session) {
    return <LoginScreen onLogin={(s) => {
      setSession(s);
      setPainelAdminTab('COCKPIT');
      if (s.role === 'FUNCIONARIO') {
        setCurrentSection('app_campo');
      } else if (s.role === 'ASSISTENTE_SOCIAL') {
        setCurrentSection('modulo_social');
      } else {
        setCurrentSection('sala_situacao');
      }
    }} />;
  }

  const roleLabels = {
    CENTRAL: 'Central (Secretaria)',
    GESTOR: 'Gestor de Subprefeitura',
    FUNCIONARIO: 'Funcionário de Campo',
    ASSISTENTE_SOCIAL: 'Assistente Social'
  };

  const getRoleIcon = () => {
    if (session.role === 'CENTRAL') return <Building2 className="w-4 h-4 text-blue-100" />;
    if (session.role === 'GESTOR') return <User className="w-4 h-4 text-emerald-100" />;
    if (session.role === 'ASSISTENTE_SOCIAL') return <Users className="w-4 h-4 text-purple-100" />;
    return <HardHat className="w-4 h-4 text-amber-100" />;
  };

  const activeSubName = session.role === 'GESTOR' 
    ? subprefeituras.find(s => s.id === session.subprefeituraId)?.nome 
    : 'Todas (Visão Global)';

  return (
    <AppProvider>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative pt-10">
        {/* Global Institutional & Role Header */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-slate-950 border-b border-slate-800 text-slate-300 flex items-center justify-between px-3 sm:px-5 z-50 text-xs font-medium">
          <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <BrasaoSaoPaulo size={22} />
              <span className="text-[11px] font-bold tracking-tight text-white hidden md:inline">
                Prefeitura de São Paulo
              </span>
            </div>

            <div className="w-px h-3.5 bg-slate-800 shrink-0 hidden sm:block" />

            <div className="flex items-center gap-1.5 shrink-0 text-slate-300">
              {getRoleIcon()}
              <span className="font-medium text-slate-200">{roleLabels[session.role || 'CENTRAL']}</span>
            </div>

            <div className="w-px h-3.5 bg-slate-800 shrink-0" />

            {session.role !== 'FUNCIONARIO' && (
              <div className="text-slate-400 shrink-0 flex items-center gap-1.5">
                <span>Jurisdição:</span>
                <span className="text-slate-200 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {activeSubName}
                  {session.role === 'GESTOR' && session.subprefeituraId === '2' && (
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">SUB-VM</span>
                  )}
                </span>
              </div>
            )}

            {session.role === 'FUNCIONARIO' && (
              <div className="text-slate-400 shrink-0">
                Matrícula: <span className="text-white font-mono font-medium">{session.matricula}</span>
                <span className="ml-1 text-[11px] text-slate-400">(CPO / Vila Mariana)</span>
              </div>
            )}

            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500">
              <span>•</span>
              <span>Distritos: Vila Mariana • Moema • Saúde</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Canal SP156 Ativo
            </div>
            <button 
              onClick={() => setSession(null)} 
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 text-xs"
              title="Alterar perfil de acesso"
            >
              Trocar Perfil <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={(sec) => {
            handleNavigateToSection(sec);
            setIsMobileMenuOpen(false);
          }} 
          onOpenAbout={() => setIsAboutOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          session={session}
        />
        
        <main className="flex-1 flex flex-col relative overflow-y-auto pb-20 lg:pb-0">
          <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-10 shrink-0 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1 border border-slate-200"
                title="Abrir navegação"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
                    {currentSection === 'sala_situacao' && 'Sala de Situação & Inteligência Territorial'}
                    {currentSection === 'painel_admin' && 'Painel Administrativo & Operações'}
                    {currentSection === 'app_campo' && 'Aplicativo de Campo (Ordens de Serviço)'}
                    {currentSection === 'simulacao_zap' && 'Canal Cidadão WhatsApp SP156'}
                    {currentSection === 'modulo_social' && 'Módulo de Acolhimento Social (SEAS / SISRUA)'}
                  </h2>
                  <span className="hidden md:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    SUB-VM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Subprefeitura Vila Mariana • Supervisão Técnica de Limpeza e Obras Públicas • PMSP
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 tabular-nums">
                  {chamados.filter(c => c.subprefeituraId === '2').length} Chamados SUB-VM
                </div>
                <div className="text-[10px] text-slate-500 tabular-nums">
                  Total SUB-VM: {chamados.length} OS
                </div>
              </div>
            </div>
          </header>

        {currentSection === 'sala_situacao' ? (
          <SalaSituacao chamados={chamados} session={session} />
        ) : currentSection === 'painel_admin' ? (
          <PainelAdmin
            chamados={chamados}
            setChamados={updateChamadosComNotificacao}
            session={session}
            activeTab={painelAdminTab}
            onActiveTabChange={setPainelAdminTab}
          />
        ) : currentSection === 'app_campo' ? (
          <AppCampo
            chamados={chamados}
            setChamados={updateChamadosComNotificacao}
            session={session}
            onNavigateToTriagem={() => handleNavigateToSection('painel_admin', 'KANBAN')}
          />
        ) : currentSection === 'simulacao_zap' ? (
          <SimulacaoZap 
            chamados={chamados} 
            setChamados={updateChamadosComNotificacao}
            onCriarChamado={handleCriarChamadoViaZap}
            zapSession={zapSession}
            setZapSession={setZapSession}
            session={session}
            onNavigateToSection={handleNavigateToSection}
          />
        ) : currentSection === 'modulo_social' ? (
          <ModuloSocial session={session} />
        ) : (
          <div className="p-8 max-w-7xl w-full mx-auto flex-1">
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm h-full flex flex-col items-center justify-center">
              <h3 className="text-xl font-medium text-slate-700 mb-2">Base de Dados Simulada Carregada</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                A tela interna de <strong>{currentSection}</strong> será construída nos próximos passos, conforme instruído.
              </p>
            </div>
          </div>
        )}

        {/* Barra Inferior de Navegação Rápida para Smartphones (Mobile Bottom Bar) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 py-1.5 shadow-2xl">
          {[
            { id: 'sala_situacao' as Section, label: 'Mapa', icon: Map, roles: ['CENTRAL', 'GESTOR'] },
            { id: 'painel_admin' as Section, label: 'Admin', icon: LayoutDashboard, roles: ['CENTRAL', 'GESTOR'] },
            { id: 'app_campo' as Section, label: 'Campo', icon: Smartphone, roles: ['CENTRAL', 'FUNCIONARIO'] },
            { id: 'simulacao_zap' as Section, label: 'Zap 156', icon: MessageSquare, highlight: true, roles: ['CENTRAL', 'FUNCIONARIO'] },
            { id: 'modulo_social' as Section, label: 'Social', icon: Users, roles: ['CENTRAL', 'ASSISTENTE_SOCIAL'] },
          ].filter(tab => session.role && tab.roles.includes(session.role)).map((tab) => {
            const IconComp = tab.icon;
            const isActive = currentSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleNavigateToSection(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-h-[44px] min-w-[56px] ${
                  isActive 
                    ? 'text-blue-400 font-bold bg-blue-950/60' 
                    : tab.highlight
                    ? 'text-emerald-400 font-semibold hover:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] leading-none tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </main>

        {/* Modal Sobre o Projeto */}
        <ModalSobreProjeto 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
        />

        {/* Global Toasts and Pitch Tour Overlays */}
        <AppOverlays
          currentSection={currentSection}
          onNavigateToSection={handleNavigateToSection}
        />
      </div>
    </AppProvider>
  );
}

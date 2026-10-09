import React, { useState } from 'react';
import { 
  Info, X, Database, History, Sparkles, Building2, Shield, Users, 
  Car, Calendar, CheckCircle2, FileText, ArrowRight, ExternalLink,
  Map, Layers, BarChart3, Radio, Check, SlidersHorizontal, Hexagon, Globe, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';

interface ModalSobreProjetoProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'VISAO_GERAL' | 'FONTES_DADOS' | 'MOTORES_MAPA' | 'CHANGELOG';

export default function ModalSobreProjeto({ isOpen, onClose }: ModalSobreProjetoProps) {
  const [activeTab, setActiveTab] = useState<TabType>('VISAO_GERAL');
  const { 
    publicSources, 
    togglePublicSource, 
    changelog,
    activeMapEngine,
    setActiveMapEngine,
    availableEngines,
    crossAnalysisActive,
    setCrossAnalysisActive
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[88vh]">
        {/* Header com Brasão Oficial e Fechar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-[#07162C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-1.5 bg-slate-800/90 border border-amber-500/40 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <BrasaoSaoPaulo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Prefeitura da Cidade de São Paulo • SMSUB
                </span>
                <span className="text-[9px] bg-blue-900 text-blue-200 border border-blue-700 px-1.5 py-0.2 rounded font-bold">
                  SUB-VM
                </span>
              </div>
              <h3 className="font-bold text-white text-base leading-tight">
                Subprefeitura Vila Mariana — Plataforma GovTech SP156
              </h3>
              <p className="text-xs text-slate-300">
                Documentação do ecossistema territorial integrado, zeladoria urbana e assistência social
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-slate-700"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Navegação das Abas */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/40 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('VISAO_GERAL')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'VISAO_GERAL'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            Visão Geral
          </button>

          <button
            onClick={() => setActiveTab('FONTES_DADOS')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'FONTES_DADOS'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-purple-500" />
            Fontes Públicas
            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[10px] rounded-full font-extrabold">
              {publicSources.filter(s => s.ativa).length}/{publicSources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MOTORES_MAPA')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'MOTORES_MAPA'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4 text-sky-500" />
            Motores & Cruzamento
            <span className="px-1.5 py-0.2 bg-sky-100 text-sky-700 text-[10px] rounded-full font-extrabold">
              4 Motores
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CHANGELOG')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'CHANGELOG'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-500" />
            Changelog Global
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-extrabold">
              {changelog.length} Sprints
            </span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-sm">
          {activeTab === 'VISAO_GERAL' && (
            <div className="space-y-4 leading-relaxed animate-in fade-in duration-200">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-950 text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Missão do Ecossistema Smart Subprefeituras
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed">
                  O <strong>Smart Subprefeituras</strong> é um protótipo operacional GovTech concebido para centralizar e otimizar a zeladoria urbana, o acolhimento social humanizado e a operação das equipes de campo na capital paulista através da integração de dados em tempo real e análise espacial multi-camada.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Pilares de Arquitetura e Governança
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="font-bold text-slate-800 text-xs mb-1">🗺️ Sala de Situação Geoespacial</p>
                    <p className="text-[11px] text-slate-600">
                      Motores múltiplos de visualização (Leaflet, D3.js vetorial, Deck Hexbin 2.5D, Radar de Proximidade) e cruzamento analítico com dados públicos.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="font-bold text-slate-800 text-xs mb-1">📊 Painel Admin & Kanban Executivo</p>
                    <p className="text-[11px] text-slate-600">
                      Triagem em 5 fases com monitoramento contínuo de SLA, infográfico de risco e módulo comparativo entre subprefeituras.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="font-bold text-slate-800 text-xs mb-1">🤝 Módulo de Acolhimento Social</p>
                    <p className="text-[11px] text-slate-600">
                      Triagem humanizada para população em situação de rua integrada às equipes do SEAS e CRAS municipal.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="font-bold text-slate-800 text-xs mb-1">📱 App de Campo & Trava de Risco</p>
                    <p className="text-[11px] text-slate-600">
                      Evidências fotográficas antes/depois com marca d'água georreferenciada e bloqueio estrito em caso de risco não solucionado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                Desenvolvido como referência interativa para a Prefeitura Municipal de São Paulo • Formato compatível com ecossistema de dados abertos SP156.
              </div>
            </div>
          )}

          {activeTab === 'FONTES_DADOS' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Fontes de Dados Públicos Conectadas (Mock)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gerencie o estado das camadas ativas em tempo real no mapa da Sala de Situação
                  </p>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  {publicSources.filter(s => s.ativa).length} Ativas
                </span>
              </div>

              <div className="space-y-3">
                {publicSources.map((source) => (
                  <div key={source.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: source.corHex }} />
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {source.nome}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white border border-slate-200 text-slate-700">
                          {source.atualizacao}
                        </span>
                        <button
                          onClick={() => togglePublicSource(source.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            source.ativa
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {source.ativa ? 'Ativa no Mapa' : 'Ativar Camada'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium mb-1">
                      Órgão Oficial: <strong className="text-slate-800">{source.orgao}</strong>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug mb-2">
                      {source.descricao}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[10px]">
                      <span className="font-mono text-slate-500">
                        Volumetria: <strong>{source.totalRegistros.toLocaleString('pt-BR')} registros simulados</strong> ({source.unidadeMedida})
                      </span>
                      <span className="font-bold italic text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {source.rotuloFixo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Sincronização Bidirecional Global:</strong> Ativar ou desativar uma camada neste modal atualiza instantaneamente a Sala de Situação e recalcula a matriz de cruzamento geoespacial em segundo plano.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'MOTORES_MAPA' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Motores de Visualização Cartográfica & Cruzamento Geoespacial
                </h4>
                <p className="text-xs text-slate-500">
                  Arquitetura multi-motor que permite analisar os mesmos dados sob diferentes paradigmas espaciais
                </p>
              </div>

              {/* Grid de Motores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableEngines.map((eng) => (
                  <div 
                    key={eng.id}
                    className={`p-4 rounded-xl border transition-all ${
                      activeMapEngine === eng.id
                        ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/30'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {eng.id === 'LEAFLET' && <Layers className="w-4 h-4 text-blue-600" />}
                        {eng.id === 'MAPLIBRE_GL' && <Globe className="w-4 h-4 text-sky-600" />}
                        {eng.id === 'DECK_GL' && <Layers className="w-4 h-4 text-purple-600" />}
                        {eng.id === 'D3_CHOROPLETH' && <BarChart3 className="w-4 h-4 text-indigo-600" />}
                        {eng.id === 'DECK_HEXBIN' && <Hexagon className="w-4 h-4 text-amber-600" />}
                        {eng.id === 'BUFFER_RADAR' && <Radio className="w-4 h-4 text-emerald-600" />}
                        <h5 className="font-bold text-xs text-slate-900">{eng.nome}</h5>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        {eng.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug mb-2.5">
                      {eng.descricao}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500 font-medium">Biblioteca: {eng.biblioteca}</span>
                      <button
                        onClick={() => setActiveMapEngine(eng.id)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          activeMapEngine === eng.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {activeMapEngine === eng.id ? 'Ativo Agora' : 'Selecionar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seção Explicativa de Cruzamento de Camadas */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h5 className="font-bold text-purple-950 text-xs">
                      Cruzamento Geoespacial Interno × Externo
                    </h5>
                  </div>
                  <button
                    onClick={() => setCrossAnalysisActive(!crossAnalysisActive)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      crossAnalysisActive
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                    }`}
                  >
                    {crossAnalysisActive ? 'Cruzamento Ativo' : 'Ativar Análise'}
                  </button>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  O sistema correlaciona chamados do SP156 com dados externos públicos através da <strong>Fórmula Haversine</strong> para cálculo esférico de distâncias. Áreas com sobreposição dentro do raio selecionado (300m a 1.500m) recebem classificação automática de risco operacional, permitindo antecipar impactos em drenagem, segurança pública, saúde e tráfego.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'CHANGELOG' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Linha do Tempo de Entregas & Changelog Centralizado
                </h4>
                <p className="text-xs text-slate-500">
                  Histórico de evolução contínua da plataforma gerenciado via Context API global
                </p>
              </div>

              <div className="relative border-l-2 border-slate-200 pl-4 space-y-6 ml-2">
                {changelog.map((item, index) => (
                  <div key={item.fase} className="relative group">
                    {/* Marcador na linha */}
                    <div className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      index === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-400'
                    }`} />

                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.fase}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.data}
                      </span>
                      {index === 0 && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full uppercase">
                          Recente
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                      {item.titulo}
                    </h5>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {item.resumo}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {item.destaques.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Remix Smart Subprefeituras • Versão 2.5-GovTech
          </span>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

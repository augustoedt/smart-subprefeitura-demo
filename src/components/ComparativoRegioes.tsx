import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowUpDown, 
  Medal, 
  MapPin, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { METRICAS_SUBPREFEITURAS_SP } from '../dataRegioes';
import { MetricasRegionais, Chamado } from '../types';
import { UserSession } from '../LoginTypes';

interface ComparativoRegioesProps {
  chamados: Chamado[];
  session: UserSession | null;
}

type OrdenacaoColuna = 'tmaHoras' | 'slaCumpridoPercentual' | 'demandasPor10k' | 'taxaResolucaoPercentual' | 'totalDemandas';

export default function ComparativoRegioes({ chamados, session }: ComparativoRegioesProps) {
  const [zonaFiltro, setZonaFiltro] = useState<string>('TODAS');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoColuna>('slaCumpridoPercentual');
  const [ordemDescendente, setOrdemDescendente] = useState(true);

  const subprefeituraUsuario = session?.subprefeituraId;

  // Filtragem e ordenação dos dados das regiões
  const dadosFiltrados = useMemo(() => {
    return METRICAS_SUBPREFEITURAS_SP
      .filter(reg => {
        const bateZona = zonaFiltro === 'TODAS' || reg.zona === zonaFiltro;
        const bateBusca = reg.nome.toLowerCase().includes(buscaTexto.toLowerCase());
        return bateZona && bateBusca;
      })
      .sort((a, b) => {
        const valA = a[ordenarPor];
        const valB = b[ordenarPor];

        if (ordenarPor === 'tmaHoras') {
          // Menor TMA é melhor!
          return ordemDescendente ? valA - valB : valB - valA;
        }

        return ordemDescendente ? valB - valA : valA - valB;
      });
  }, [zonaFiltro, buscaTexto, ordenarPor, ordemDescendente]);

  const handleOrdenar = (coluna: OrdenacaoColuna) => {
    if (ordenarPor === coluna) {
      setOrdemDescendente(!ordemDescendente);
    } else {
      setOrdenarPor(coluna);
      setOrdemDescendente(true);
    }
  };

  // Top 3 Melhores desempenhos gerais (baseado em SLA)
  const topPerformers = useMemo(() => {
    return [...METRICAS_SUBPREFEITURAS_SP]
      .sort((a, b) => b.slaCumpridoPercentual - a.slaCumpridoPercentual)
      .slice(0, 3);
  }, []);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-8">
      {/* Cabeçalho da Matriz Comparativa */}
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
            Matriz Comparativa de Índices por Subprefeitura
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Análise multidimensional das 32 jurisdições territoriais de São Paulo com normalização por 10.000 habitantes.
          </p>
        </div>

        {/* Pílulas de filtro por Zona */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto scrollbar-none max-w-full">
          {['TODAS', 'CENTRO', 'NORTE', 'SUL', 'LESTE', 'OESTE'].map((z) => (
            <button
              key={z}
              onClick={() => setZonaFiltro(z)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap min-h-[32px] ${
                zonaFiltro === z
                  ? 'bg-white text-indigo-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {z === 'TODAS' ? 'Todas as Zonas' : `Zona ${z}`}
            </button>
          ))}
        </div>
      </div>

      {/* Destaque: Top 3 Subprefeituras em Eficiência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
        {topPerformers.map((sub, idx) => (
          <div 
            key={sub.subprefeituraId}
            className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                  {idx === 0 ? '🥇 1º Lugar Geral' : idx === 1 ? '🥈 2º Lugar Geral' : '🥉 3º Lugar Geral'}
                </span>
                <h4 className="text-base font-bold text-slate-800 mt-0.5">{sub.nome}</h4>
                <span className="text-xs text-slate-500">Zona {sub.zona} • {(sub.populacao / 1000).toFixed(0)}k hab.</span>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl shrink-0">
                <Medal className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block">SLA Cumprido:</span>
                <span className="font-bold text-emerald-700 text-sm">{sub.slaCumpridoPercentual}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">TMA Médio:</span>
                <span className="font-bold text-slate-800 text-sm">{sub.tmaHoras}h</span>
              </div>
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-600"></div>
          </div>
        ))}
      </div>

      {/* Tabela Analítica Completa com Ordenação */}
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs overflow-hidden">
        {/* Barra de Busca e Legendas */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
              placeholder="Buscar por subprefeitura..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-[11px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-2.5 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              SLA ≥ 90% (Excelente)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              SLA 80-89% (Regular)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              SLA &lt; 80% (Atenção)
            </span>
          </div>
        </div>

        {/* Tabela Responsiva com Scroll Suave */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subprefeitura / Zona</th>
                <th 
                  onClick={() => handleOrdenar('demandasPor10k')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Demandas / 10k Hab.</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleOrdenar('totalDemandas')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Total de Demandas</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleOrdenar('tmaHoras')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>TMA (Horas)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleOrdenar('slaCumpridoPercentual')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>SLA Cumprido</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleOrdenar('taxaResolucaoPercentual')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Resolução</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dadosFiltrados.map((item) => {
                const isSuaJurisdicao = subprefeituraUsuario === item.subprefeituraId;

                return (
                  <tr 
                    key={item.subprefeituraId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSuaJurisdicao ? 'bg-indigo-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            {item.nome}
                            {isSuaJurisdicao && (
                              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-normal">
                                Sua Região
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal">
                            Zona {item.zona} • {(item.populacao).toLocaleString('pt-BR')} habitantes
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {item.demandasPor10k.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {item.totalDemandas}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {item.tmaHoras}h
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono ${
                          item.slaCumpridoPercentual >= 90 
                            ? 'text-emerald-700' 
                            : item.slaCumpridoPercentual >= 80 
                            ? 'text-amber-700' 
                            : 'text-red-700'
                        }`}>
                          {item.slaCumpridoPercentual}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.slaCumpridoPercentual >= 90 ? 'bg-emerald-500' : item.slaCumpridoPercentual >= 80 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.slaCumpridoPercentual}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {item.taxaResolucaoPercentual}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.slaCumpridoPercentual >= 90 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Alta Eficiência
                        </span>
                      ) : item.slaCumpridoPercentual >= 80 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                          Normal / Estável
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-100 text-red-800 px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Requer Reforço
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Chamado, Subprefeitura, CategoriaChamado } from '../types';
import { UserSession } from '../LoginTypes';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  GitCompare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  Globe2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';

interface BlocoComparativoProps {
  chamados: Chamado[];
  session: UserSession;
  subprefeituras: Subprefeitura[];
}

type PeriodPreset = '7D' | '15D' | '30D' | 'CUSTOM';

const CATEGORIA_LABELS: Record<CategoriaChamado, string> = {
  ARVORE_CAIDA: 'Árvore Caída',
  BUEIRO: 'Bueiro / Drenagem',
  MORADOR_RUA: 'Acolhimento Social',
  BARULHO_PSIU: 'Barulho (PSIU)',
  CALCADA: 'Calçada Irregular',
  TAPA_BURACO: 'Tapa-Buraco',
  FISCALIZACAO_POSTURA: 'Fiscalização de Postura',
  DESFAZIMENTO: 'Desfazimento',
};

// SLA base de referência por categoria (em horas)
const TMA_BASE_HORAS: Record<CategoriaChamado, { atual: number; anterior: number }> = {
  ARVORE_CAIDA: { atual: 42, anterior: 48 },
  BUEIRO: { atual: 30, anterior: 28 },
  MORADOR_RUA: { atual: 14, anterior: 18 },
  BARULHO_PSIU: { atual: 19, anterior: 24 },
  CALCADA: { atual: 52, anterior: 60 },
  TAPA_BURACO: { atual: 21, anterior: 26 },
  FISCALIZACAO_POSTURA: { atual: 34, anterior: 36 },
  DESFAZIMENTO: { atual: 39, anterior: 44 },
};

export function BlocoComparativo({ chamados, session, subprefeituras }: BlocoComparativoProps) {
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('7D');
  const [customDates, setCustomDates] = useState({
    atualInicio: '2026-09-05',
    atualFim: '2026-09-11',
    anteriorInicio: '2026-08-29',
    anteriorFim: '2026-09-04',
  });

  // Seletor de duas subprefeituras para perfil Central
  const [subIdA, setSubIdA] = useState<string>(
    session.role === 'GESTOR' && session.subprefeituraId ? session.subprefeituraId : '1' // Sé
  );
  const [subIdB, setSubIdB] = useState<string>('4'); // Pinheiros

  // Subprefeituras selecionadas
  const subA = useMemo(() => subprefeituras.find(s => s.id === subIdA) || subprefeituras[0], [subprefeituras, subIdA]);
  const subB = useMemo(() => subprefeituras.find(s => s.id === subIdB) || subprefeituras[1] || subprefeituras[0], [subprefeituras, subIdB]);

  // Se perfil for GESTOR, filtra chamados apenas para a sua subprefeitura
  const baseChamados = useMemo(() => {
    if (session.role === 'GESTOR' && session.subprefeituraId) {
      return chamados.filter(c => c.subprefeituraId === session.subprefeituraId);
    }
    return chamados;
  }, [chamados, session]);

  // Rótulos descritivos dos períodos
  const periodLabel = useMemo(() => {
    switch (periodPreset) {
      case '7D':
        return { atual: 'Últimos 7 dias', anterior: '7 dias anteriores' };
      case '15D':
        return { atual: 'Últimos 15 dias', anterior: '15 dias anteriores' };
      case '30D':
        return { atual: 'Últimos 30 dias', anterior: '30 dias anteriores' };
      case 'CUSTOM':
        return { 
          atual: `${customDates.atualInicio} a ${customDates.atualFim}`, 
          anterior: `${customDates.anteriorInicio} a ${customDates.anteriorFim}` 
        };
    }
  }, [periodPreset, customDates]);

  // Fator multiplicador de escala de acordo com o preset para simular dados proporcionais consistentes
  const multiplier = periodPreset === '7D' ? 1 : periodPreset === '15D' ? 1.9 : periodPreset === '30D' ? 3.6 : 1.2;

  // KPIs de Período Atual vs Anterior
  const metricasPeriodo = useMemo(() => {
    // Chamados abertos/pendentes (não concluídos)
    const abertosAtual = Math.round((baseChamados.filter(c => c.status !== 'CONCLUIDO').length * 0.9) * multiplier);
    const abertosAnterior = Math.round((abertosAtual * 1.14) + 4);
    const deltaAbertos = abertosAtual - abertosAnterior;
    const deltaAbertosPct = abertosAnterior > 0 ? (deltaAbertos / abertosAnterior) * 100 : 0;
    // Redução de chamados abertos é positivo (melhora = verde)
    const abertosMelhorou = deltaAbertos < 0;

    // Chamados resolvidos / concluídos
    const concluidosAtual = Math.round((baseChamados.filter(c => c.status === 'CONCLUIDO').length * 1.1) * multiplier);
    const concluidosAnterior = Math.round(concluidosAtual * 0.85);
    const deltaConcluidos = concluidosAtual - concluidosAnterior;
    const deltaConcluidosPct = concluidosAnterior > 0 ? (deltaConcluidos / concluidosAnterior) * 100 : 0;
    // Aumento de concluídos é positivo (melhora = verde)
    const concluidosMelhorou = deltaConcluidos > 0;

    // TMA Geral
    const tmaAtual = Math.round(28.4);
    const tmaAnterior = Math.round(34.2);
    const deltaTma = tmaAtual - tmaAnterior;
    const deltaTmaPct = ((deltaTma / tmaAnterior) * 100);
    // Redução de TMA é positivo (melhora = verde)
    const tmaMelhorou = deltaTma < 0;

    // Taxa dentro do prazo
    const taxaPrazoAtual = 88.5;
    const taxaPrazoAnterior = 81.2;
    const deltaTaxaPrazo = taxaPrazoAtual - taxaPrazoAnterior;
    const taxaPrazoMelhorou = deltaTaxaPrazo > 0;

    return {
      abertos: { atual: abertosAtual, anterior: abertosAnterior, delta: deltaAbertos, deltaPct: deltaAbertosPct, melhorou: abertosMelhorou },
      concluidos: { atual: concluidosAtual, anterior: concluidosAnterior, delta: deltaConcluidos, deltaPct: deltaConcluidosPct, melhorou: concluidosMelhorou },
      tma: { atual: tmaAtual, anterior: tmaAnterior, delta: deltaTma, deltaPct: deltaTmaPct, melhorou: tmaMelhorou },
      taxaPrazo: { atual: taxaPrazoAtual, anterior: taxaPrazoAnterior, delta: deltaTaxaPrazo, melhorou: taxaPrazoMelhorou },
    };
  }, [baseChamados, multiplier]);

  // TMA detalhado por Categoria (Período Atual vs Anterior)
  const tmaPorCategoria = useMemo(() => {
    return (Object.keys(TMA_BASE_HORAS) as CategoriaChamado[]).map(cat => {
      const base = TMA_BASE_HORAS[cat];
      const delta = base.atual - base.anterior;
      const deltaPct = ((delta / base.anterior) * 100);
      // Tempo menor = melhora (verde)
      const melhorou = delta <= 0;
      return {
        categoria: cat,
        label: CATEGORIA_LABELS[cat],
        atual: base.atual,
        anterior: base.anterior,
        delta,
        deltaPct,
        melhorou
      };
    });
  }, []);

  // Comparação entre duas subprefeituras (A vs B)
  const comparacaoSubprefeituras = useMemo(() => {
    if (session.role === 'GESTOR') return null;

    const chamadosA = chamados.filter(c => c.subprefeituraId === subIdA);
    const chamadosB = chamados.filter(c => c.subprefeituraId === subIdB);

    const totalA = chamadosA.length;
    const totalB = chamadosB.length;

    const abertosA = chamadosA.filter(c => c.status !== 'CONCLUIDO').length;
    const abertosB = chamadosB.filter(c => c.status !== 'CONCLUIDO').length;

    const concluidosA = chamadosA.filter(c => c.status === 'CONCLUIDO').length;
    const concluidosB = chamadosB.filter(c => c.status === 'CONCLUIDO').length;

    const atrasadosA = chamadosA.filter(c => c.isAtrasado).length;
    const atrasadosB = chamadosB.filter(c => c.isAtrasado).length;

    const pctPrazoA = totalA > 0 ? Math.round(((totalA - atrasadosA) / totalA) * 100) : 0;
    const pctPrazoB = totalB > 0 ? Math.round(((totalB - atrasadosB) / totalB) * 100) : 0;

    // TMA estimado (horas)
    const tmaMedioA = Math.round(26 + (totalA % 12));
    const tmaMedioB = Math.round(29 + (totalB % 10));

    // Dados por categoria para o gráfico comparativo lado a lado
    const chartData = (Object.keys(CATEGORIA_LABELS) as CategoriaChamado[]).map(cat => {
      const countA = chamadosA.filter(c => c.categoria === cat).length;
      const countB = chamadosB.filter(c => c.categoria === cat).length;
      return {
        categoria: CATEGORIA_LABELS[cat],
        [subA?.nome || 'Região A']: countA,
        [subB?.nome || 'Região B']: countB,
      };
    });

    return {
      totalA,
      totalB,
      abertosA,
      abertosB,
      concluidosA,
      concluidosB,
      atrasadosA,
      atrasadosB,
      pctPrazoA,
      pctPrazoB,
      tmaMedioA,
      tmaMedioB,
      chartData
    };
  }, [chamados, subIdA, subIdB, subA, subB, session.role]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
      
      {/* 1. SELETOR DE PERÍODOS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Comparativo Temporal de Desempenho</h3>
                <p className="text-xs text-slate-500">
                  Avalie o avanço dos indicadores operacionais comparando o período atual com a janela anterior.
                </p>
              </div>
            </div>
          </div>

          {/* Presets de Período */}
          <div className="flex flex-wrap items-center gap-2">
            {(['7D', '15D', '30D', 'CUSTOM'] as PeriodPreset[]).map(preset => (
              <button
                key={preset}
                onClick={() => setPeriodPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  periodPreset === preset
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {preset === '7D' && 'Últimos 7 dias'}
                {preset === '15D' && 'Últimos 15 dias'}
                {preset === '30D' && 'Últimos 30 dias'}
                {preset === 'CUSTOM' && 'Personalizado'}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs se customizado */}
        {periodPreset === 'CUSTOM' && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-2">Período Atual (Alvo)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={customDates.atualInicio} 
                  onChange={e => setCustomDates(p => ({ ...p, atualInicio: e.target.value }))}
                  className="bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700" 
                />
                <span className="text-xs text-slate-400">até</span>
                <input 
                  type="date" 
                  value={customDates.atualFim} 
                  onChange={e => setCustomDates(p => ({ ...p, atualFim: e.target.value }))}
                  className="bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700" 
                />
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-2">Período Anterior (Comparação)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={customDates.anteriorInicio} 
                  onChange={e => setCustomDates(p => ({ ...p, anteriorInicio: e.target.value }))}
                  className="bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700" 
                />
                <span className="text-xs text-slate-400">até</span>
                <input 
                  type="date" 
                  value={customDates.anteriorFim} 
                  onChange={e => setCustomDates(p => ({ ...p, anteriorFim: e.target.value }))}
                  className="bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Legenda de períodos aplicados */}
        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Período Atual: <strong className="text-slate-800">{periodLabel.atual}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            Período Anterior: <strong className="text-slate-800">{periodLabel.anterior}</strong>
          </span>
        </div>
      </div>

      {/* 2. CARDS DE KPIS COM DELTA (VALOR ATUAL, ANTERIOR E DELTA COM COR DE MELHORA/PIORA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Variação dos Indicadores Principais (Deltas)
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Verde = melhora operacional • Vermelho = atenção/piora
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1: Chamados Abertos / Pendentes */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Chamados em Aberto
            </p>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {metricasPeriodo.abertos.atual}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Ant.: <strong className="text-slate-600">{metricasPeriodo.abertos.anterior}</strong>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Delta acumulado:</span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                metricasPeriodo.abertos.melhorou 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {metricasPeriodo.abertos.melhorou ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {metricasPeriodo.abertos.delta > 0 ? `+${metricasPeriodo.abertos.delta}` : metricasPeriodo.abertos.delta} ({metricasPeriodo.abertos.deltaPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* KPI 2: Chamados Resolvidos */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Chamados Resolvidos
            </p>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {metricasPeriodo.concluidos.atual}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Ant.: <strong className="text-slate-600">{metricasPeriodo.concluidos.anterior}</strong>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Delta acumulado:</span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                metricasPeriodo.concluidos.melhorou 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {metricasPeriodo.concluidos.melhorou ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {metricasPeriodo.concluidos.delta > 0 ? `+${metricasPeriodo.concluidos.delta}` : metricasPeriodo.concluidos.delta} ({metricasPeriodo.concluidos.deltaPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* KPI 3: TMA Geral */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              TMA Médio Geral
            </p>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {metricasPeriodo.tma.atual}<span className="text-lg font-bold text-slate-500">h</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Ant.: <strong className="text-slate-600">{metricasPeriodo.tma.anterior}h</strong>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Delta resposta:</span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                metricasPeriodo.tma.melhorou 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {metricasPeriodo.tma.melhorou ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {metricasPeriodo.tma.delta}h ({metricasPeriodo.tma.deltaPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* KPI 4: Dentro do Prazo */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Conclusão no Prazo (SLA)
            </p>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {metricasPeriodo.taxaPrazo.atual}%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Ant.: <strong className="text-slate-600">{metricasPeriodo.taxaPrazo.anterior}%</strong>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Evolução de conformidade:</span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                metricasPeriodo.taxaPrazo.melhorou 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {metricasPeriodo.taxaPrazo.melhorou ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {metricasPeriodo.taxaPrazo.delta > 0 ? `+${metricasPeriodo.taxaPrazo.delta.toFixed(1)}` : metricasPeriodo.taxaPrazo.delta.toFixed(1)} p.p.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABELA DE TMA DETALHADA POR CATEGORIA */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Tempo Médio de Atendimento (TMA) por Categoria
            </h4>
            <p className="text-xs text-slate-500">
              Comparativo em horas entre {periodLabel.atual} e {periodLabel.anterior}. Menor tempo representa melhora no atendimento.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            Metas 156 SP
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Categoria Operacional</th>
                <th className="px-4 py-3 text-center">TMA Anterior</th>
                <th className="px-4 py-3 text-center">TMA Atual</th>
                <th className="px-4 py-3 text-center">Variação (Delta)</th>
                <th className="px-4 py-3 text-center">Tendência</th>
                <th className="px-5 py-3 text-right">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {tmaPorCategoria.map((item) => (
                <tr key={item.categoria} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {item.label}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-500">
                    {item.anterior}h
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-900">
                    {item.atual}h
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border ${
                      item.melhorou 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {item.melhorou ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {item.delta > 0 ? `+${item.delta}h` : `${item.delta}h`} ({item.deltaPct.toFixed(1)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-[11px] font-semibold ${item.melhorou ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.melhorou ? 'Melhoria no fluxo' : 'Aumento de fila'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider ${
                      item.melhorou ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.melhorou ? 'Dentro da Meta' : 'Ação Necessária'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. COMPARAÇÃO POR REGIÃO (DUAS SUBPREFEITURAS) - REQUISITO EXCLUSIVO DO PERFIL 'CENTRAL' */}
      {session.role === 'CENTRAL' ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-600" />
                Comparativo Territorial: Subprefeitura A vs. Subprefeitura B
              </h4>
              <p className="text-xs text-slate-500">
                Comparação cruzada de volume, backlog e eficiência entre duas regiões municipais no mesmo período.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 self-start sm:self-auto">
              Acesso Coordenação Central
            </span>
          </div>

          {/* Seletores das duas Subprefeituras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Região A */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                Região A:
              </label>
              <select
                value={subIdA}
                onChange={e => setSubIdA(e.target.value)}
                className="w-full bg-white border border-slate-200 text-sm font-semibold text-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {subprefeituras.map(sub => (
                  <option key={sub.id} value={sub.id} disabled={sub.id === subIdB}>
                    Subprefeitura {sub.nome} {sub.id === subIdB ? '(já selecionada em B)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Região B */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                Região B:
              </label>
              <select
                value={subIdB}
                onChange={e => setSubIdB(e.target.value)}
                className="w-full bg-white border border-slate-200 text-sm font-semibold text-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {subprefeituras.map(sub => (
                  <option key={sub.id} value={sub.id} disabled={sub.id === subIdA}>
                    Subprefeitura {sub.nome} {sub.id === subIdA ? '(já selecionada em A)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Comparativos Lado a Lado */}
          {comparacaoSubprefeituras && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total de Chamados</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg font-bold gap-1 sm:gap-0">
                    <span className="text-blue-700">{subA.nome}: {comparacaoSubprefeituras.totalA}</span>
                    <span className="text-slate-300 hidden sm:inline">vs</span>
                    <span className="text-teal-700">{subB.nome}: {comparacaoSubprefeituras.totalB}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Concluídos</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg font-bold gap-1 sm:gap-0">
                    <span className="text-blue-700">{comparacaoSubprefeituras.concluidosA}</span>
                    <span className="text-slate-300 hidden sm:inline">vs</span>
                    <span className="text-teal-700">{comparacaoSubprefeituras.concluidosB}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">TMA Médio Geral</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg font-bold gap-1 sm:gap-0">
                    <span className="text-blue-700">{comparacaoSubprefeituras.tmaMedioA}h</span>
                    <span className="text-slate-300 hidden sm:inline">vs</span>
                    <span className="text-teal-700">{comparacaoSubprefeituras.tmaMedioB}h</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dentro do Prazo</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg font-bold gap-1 sm:gap-0">
                    <span className="text-blue-700">{comparacaoSubprefeituras.pctPrazoA}%</span>
                    <span className="text-slate-300 hidden sm:inline">vs</span>
                    <span className="text-teal-700">{comparacaoSubprefeituras.pctPrazoB}%</span>
                  </div>
                </div>
              </div>

              {/* Gráfico Comparativo de Barras Lado a Lado */}
              <div className="p-4 sm:p-5 bg-slate-50/70 rounded-xl border border-slate-200 overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h5 className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-500 shrink-0" />
                    Distribuição de Chamados por Categoria
                  </h5>
                  <div className="flex items-center gap-4 text-[10px] sm:text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> {subA.nome}
                    </span>
                    <span className="flex items-center gap-1.5 text-teal-700">
                      <span className="w-2.5 h-2.5 rounded bg-teal-600"></span> {subB.nome}
                    </span>
                  </div>
                </div>

                <div className="h-64 w-[600px] sm:w-full min-w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparacaoSubprefeituras.chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="categoria" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        angle={-15} 
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '8px', 
                          border: '1px solid #e2e8f0', 
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                      />
                      <Bar 
                        dataKey={subA.nome} 
                        fill="#2563eb" 
                        radius={[4, 4, 0, 0]} 
                        isAnimationActive={true}
                        animationDuration={700}
                      />
                      <Bar 
                        dataKey={subB.nome} 
                        fill="#0d9488" 
                        radius={[4, 4, 0, 0]} 
                        isAnimationActive={true}
                        animationDuration={700}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Aviso de Restrição para Perfil Gestor de Subprefeitura */
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Comparação Entre Subprefeituras Restrita
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              O seu perfil de acesso é de <strong>Gestor Territorial ({subA.nome})</strong>. Por governança institucional, a comparação cruzada entre diferentes subprefeituras é reservada à Coordenação Central. Você tem acesso integral ao comparativo de períodos históricos da sua própria unidade.
            </p>
          </div>
        </div>
      )}

      {/* 5. RESTRIÇÃO / PLACEHOLDER DE BENCHMARK EXTERNO */}
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-700">Benchmark Federativo & Outras Cidades</h4>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                  Em Planejamento
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Benchmark externo — depende de integração futura com dados públicos de outras prefeituras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 opacity-60 pointer-events-none">
            <span className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-500 font-medium">
              Curitiba 156 (Em breve)
            </span>
            <span className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-500 font-medium">
              Rio 1746 (Em breve)
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

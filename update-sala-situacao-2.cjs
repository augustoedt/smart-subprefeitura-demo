const fs = require('fs');
let code = fs.readFileSync('./src/components/SalaSituacao.tsx', 'utf8');

// We need to add the analysis panel logic
const analysisCode = `
  // Analytics
  const subprefeituraStats = useMemo(() => {
    if (selectedSubId === 'ALL') return [];
    
    const stats: Record<string, number> = {};
    filteredChamados.forEach(c => {
      stats[c.categoria] = (stats[c.categoria] || 0) + 1;
    });
    
    return Object.entries(stats).map(([name, count]) => ({
      name: name.replace('_', ' ').substring(0, 10),
      count
    }));
  }, [filteredChamados, selectedSubId]);
`;

code = code.replace(
  "const selectedSubprefeitura = useMemo(() => {",
  analysisCode + "\n  const selectedSubprefeitura = useMemo(() => {"
);


const mapAreaCode = `
      {/* Main Map Area */}
      <div className="flex-1 relative flex overflow-hidden p-6 gap-6">
        {viewMode === 'COMPARACAO' ? (
          <>
            <div className="flex-1 rounded-xl flex flex-col shadow-sm border border-slate-200 bg-slate-100 relative">
              <div className="bg-white p-2 border-b border-slate-200 text-sm font-bold text-center text-slate-600">
                Mapa Principal: {selectedSubprefeitura?.nome || 'São Paulo (Geral)'}
              </div>
              <div className="flex-1 relative">
                <MapComponent
                  chamados={filteredChamados}
                  viewMode="CLUSTER"
                  showPontosCegos={showPontosCegos}
                  onMarkerClick={handleMarkerClick}
                  selectedSubprefeitura={selectedSubprefeitura}
                />
              </div>
            </div>
            
            <div className="flex-1 rounded-xl flex flex-col shadow-sm border border-slate-200 bg-slate-100 relative">
              <div className="bg-white p-2 border-b border-slate-200 flex justify-center items-center gap-2">
                <span className="text-sm font-bold text-slate-600">Comparar com:</span>
                <select
                  className="bg-slate-100 border border-slate-200 text-sm font-medium rounded outline-none px-2 py-1"
                  value={compareSubId}
                  onChange={(e) => setCompareSubId(e.target.value)}
                >
                  <option value="ALL">Todas as Subprefeituras</option>
                  {subprefeituras.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative">
                <MapComponent
                  chamados={chamados.filter(c => (compareSubId === 'ALL' || c.subprefeituraId === compareSubId) && LAYER_MAPPING[activeLayer].includes(c.categoria))}
                  viewMode="CLUSTER"
                  showPontosCegos={showPontosCegos}
                  onMarkerClick={handleMarkerClick}
                  selectedSubprefeitura={subprefeituras.find(s => s.id === compareSubId) || null}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 relative">
            <MapComponent
              chamados={filteredChamados}
              viewMode={viewMode}
              showPontosCegos={showPontosCegos}
              onMarkerClick={handleMarkerClick}
              selectedSubprefeitura={selectedSubprefeitura}
            />
            
            {/* Floating Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur px-4 py-3 rounded-xl border border-slate-200 shadow-sm pointer-events-none">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status (Cores)</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-xs text-slate-700 font-medium">Concluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                  <span className="text-xs text-slate-700 font-medium">Em Andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-xs text-slate-700 font-medium">Aberto / Urgente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <span className="text-xs text-slate-700 font-medium">Atrasado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View Side Panel */}
        {viewMode === 'LISTA' && !selectedChamado && (
           <div className="w-80 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col shrink-0 overflow-hidden z-10">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <List className="w-4 h-4 text-slate-400" />
                  Lista Sincronizada
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {filteredChamados.slice(0, 50).map(c => (
                    <div key={c.id} onClick={() => handleMarkerClick(c)} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                       <p className="text-xs text-slate-500 font-mono mb-1">{c.protocolo}</p>
                       <p className="text-sm font-semibold text-slate-800">{c.categoria.replace('_', ' ')}</p>
                       <p className="text-xs text-slate-600 mt-1 line-clamp-1">{c.endereco}</p>
                    </div>
                 ))}
                 {filteredChamados.length > 50 && <p className="text-xs text-center text-slate-500 mt-2">+ {filteredChamados.length - 50} chamados ocultos</p>}
              </div>
           </div>
        )}

        {/* Region Analysis Side Panel */}
        {selectedSubId !== 'ALL' && !selectedChamado && viewMode !== 'LISTA' && viewMode !== 'COMPARACAO' && (
           <div className="w-96 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col shrink-0 overflow-hidden z-10">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Análise da Região: {selectedSubprefeitura?.nome}
                </h3>
              </div>
              <div className="p-5 flex-1 overflow-y-auto">
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                       <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Total de Chamados</p>
                       <p className="text-2xl font-bold text-slate-800">{filteredChamados.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                       <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Atrasados</p>
                       <p className="text-2xl font-bold text-red-600">{filteredChamados.filter(c => c.isAtrasado).length}</p>
                    </div>
                 </div>

                 <h4 className="text-sm font-bold text-slate-700 mb-4">Volume por Categoria</h4>
                 <div className="h-48 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={subprefeituraStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                          <YAxis tick={{fontSize: 10}} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>

                 <h4 className="text-sm font-bold text-slate-700 mb-3">Status Operacional</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                       <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Concluídos</span>
                       <span className="font-semibold">{filteredChamados.filter(c => c.status === 'CONCLUIDO').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>Em Andamento</span>
                       <span className="font-semibold">{filteredChamados.filter(c => ['ENCAMINHADO', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO'].includes(c.status)).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>Novos / Abertos</span>
                       <span className="font-semibold">{filteredChamados.filter(c => c.status === 'NOVO').length}</span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Side Panel for Chamado Details */}
`;

code = code.replace(
  /\{\/\* Main Map Area \*\/\}[^]+?\{\/\* Side Panel for Chamado Details \*\/\}/,
  mapAreaCode
);

fs.writeFileSync('./src/components/SalaSituacao.tsx', code);
console.log('done');

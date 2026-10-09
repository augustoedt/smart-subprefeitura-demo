const fs = require('fs');

// 1. Update PainelAdmin.tsx
let painel = fs.readFileSync('./src/components/PainelAdmin.tsx', 'utf8');

painel = painel.replace(
  /{isForaAlcada && col\.id !== 'CONCLUIDO' && \(/,
  `const isPendente2Dias = col.id === 'AGUARDANDO_APROVACAO' && (new Date().getTime() - new Date(chamado.dataAbertura).getTime() > 48 * 60 * 60 * 1000);

                        {/* Regra de Lembrete 48h */}
                        {isPendente2Dias && (
                          <div className="bg-red-50 border border-red-200 p-2.5 rounded-md flex flex-col gap-2">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                               <Clock className="w-3.5 h-3.5" />
                               Pendente há 2 dias
                             </div>
                             <p className="text-[10px] text-red-600 leading-tight">Lembrete automático enviado no chat de IA para a equipe responsável.</p>
                          </div>
                        )}

                        {/* Regra de Fora da Alçada */}
                        {isForaAlcada && col.id !== 'CONCLUIDO' && (`
);

fs.writeFileSync('./src/components/PainelAdmin.tsx', painel);

// 2. Update CanalWhatsApp.tsx
let whatsapp = fs.readFileSync('./src/components/CanalWhatsApp.tsx', 'utf8');

whatsapp = whatsapp.replace(
  "isMapRequest?: boolean;",
  "isMapRequest?: boolean;\n  isReminder?: boolean;"
);

const useEffectCode = `
  // Automatically add reminder for 48h pending chamados
  useEffect(() => {
    const pendingOld = chamados.filter(c => c.status === 'AGUARDANDO_APROVACAO' && (new Date().getTime() - new Date(c.dataAbertura).getTime() > 48 * 60 * 60 * 1000));
    
    if (pendingOld.length > 0) {
      setMessages(prev => {
        if (prev.some(m => m.isReminder)) return prev;
        
        // Take the oldest one to show the reminder
        const oldest = pendingOld.sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime())[0];
        
        return [
          {
            id: 'reminder-' + oldest.id,
            sender: 'bot',
            text: \`⚠️ *Lembrete Automático do Sistema*\n\nO chamado *\${oldest.protocolo}* (\${oldest.categoria.replace('_', ' ')}) está aguardando aprovação na fila administrativa há mais de 48 horas.\n\nPor favor, notifique o supervisor para revisar a foto de conclusão no Painel Administrativo.\`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isReminder: true
          },
          ...prev
        ];
      });
    }
  }, [chamados]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);`;

whatsapp = whatsapp.replace(
  /useEffect\(\(\) => \{\n\s*messagesEndRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);\n\s*\}, \[messages\]\);/,
  useEffectCode
);

fs.writeFileSync('./src/components/CanalWhatsApp.tsx', whatsapp);

console.log('done');

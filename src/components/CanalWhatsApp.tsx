import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Check, CheckCheck, Camera, FileText, X, MapPin, Loader2, Info } from 'lucide-react';
import { Chamado, Subprefeitura } from '../types';
import { subprefeituras } from '../data';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  image?: string;
  isMapRequest?: boolean;
  isReminder?: boolean;
}

interface CanalWhatsAppProps {
  chamados: Chamado[];
  setChamados: React.Dispatch<React.SetStateAction<Chamado[]>>;
}

const customIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-red-500"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function LocationPicker({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<[number, number]>([-23.5505, -46.6333]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
      }
    });
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="h-48 w-full rounded-lg overflow-hidden border border-slate-300 relative z-0">
        <MapContainer center={pos} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <MapEvents />
          <Marker position={pos} icon={customIcon} />
        </MapContainer>
      </div>
      <button 
        onClick={() => onSelectLocation(pos[0], pos[1])}
        className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors shadow-sm w-full"
      >
        Confirmar Localização
      </button>
    </div>
  );
}

export default function CanalWhatsApp({ chamados, setChamados }: CanalWhatsAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Olá! Sou o assistente virtual da Subprefeitura. Envie a foto do serviço executado ou do problema identificado.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadType, setPendingUploadType] = useState<'photo' | 'document' | null>(null);
  
  // Keep track of pending state for AI flow
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  
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
            text: `⚠️ *Lembrete Automático do Sistema*

O chamado *${oldest.protocolo}* (${oldest.categoria.replace('_', ' ')}) está aguardando aprovação na fila administrativa há mais de 48 horas.

Por favor, notifique o supervisor para revisar a foto de conclusão no Painel Administrativo.`,
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
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'id' | 'time'>) => {
    setMessages(prev => [
      ...prev,
      {
        ...msg,
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    addMessage({ sender: 'user', text: inputText.trim() });
    setInputText('');
  };

  const handleFileClick = (type: 'photo' | 'document') => {
    setPendingUploadType(type);
    setShowAttachMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      addMessage({
        sender: 'user',
        text: pendingUploadType === 'photo' ? '📷 Foto enviada (Galeria)' : '📄 Arquivo enviado (Documento)',
        image: base64String
      });

      setIsProcessing(true);
      addMessage({ sender: 'bot', text: 'Analisando imagem com IA...' });

      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String })
        });
        
        let category = 'FISCALIZACAO_POSTURA';
        if (response.ok) {
          const data = await response.json();
          category = data.category;
        }

        if (pendingUploadType === 'document') {
          // Has GPS
          const mockLat = -23.5855 + (Math.random() - 0.5) * 0.05;
          const mockLng = -46.6341 + (Math.random() - 0.5) * 0.05;
          
          addMessage({ 
            sender: 'bot', 
            text: `✅ Imagem analisada!\nCategoria detectada: *${category.replace('_', ' ')}*\n\n📍 *Localização verificada automaticamente* via metadados do arquivo (GPS preservado).\n\nProtocolo criado e encaminhado para aprovação administrativa.`
          });
          
          createNewChamado(category, mockLat, mockLng);
        } else {
          // Photo mode - no GPS
          setPendingCategory(category);
          addMessage({ 
            sender: 'bot', 
            text: `✅ Imagem analisada!\nCategoria detectada: *${category.replace('_', ' ')}*\n\n⚠️ *Localização não verificada.* O WhatsApp removeu o GPS da foto padrão.\n\nPor favor, confirme no mapa o local exato da ocorrência:`,
            isMapRequest: true
          });
        }
      } catch (error) {
        addMessage({ sender: 'bot', text: '❌ Erro ao analisar a imagem.' });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const createNewChamado = (categoria: string, lat: number, lng: number) => {
    const protocol = `WAPP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
    const newChamado: Chamado = {
      id: protocol,
      protocolo: protocol,
      categoria: categoria as any,
      subprefeituraId: subprefeituras[Math.floor(Math.random() * subprefeituras.length)].id,
      lat,
      lng,
      status: 'AGUARDANDO_APROVACAO',
      prioridade: 'MEDIA',
      dataAbertura: new Date().toISOString(),
      endereco: 'Localização via WhatsApp',
      isAtrasado: false
    };
    
    setChamados(prev => [newChamado, ...prev]);
  };

  const handleMapConfirm = (lat: number, lng: number) => {
    if (pendingCategory) {
      createNewChamado(pendingCategory, lat, lng);
      setPendingCategory(null);
      // Remove map request message and add success
      setMessages(prev => {
        const newMsgs = prev.filter(m => !m.isMapRequest);
        return [...newMsgs, {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'bot',
          text: `📍 Localização confirmada manualmente!\n\nProtocolo criado e encaminhado para aprovação administrativa.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative overflow-hidden rounded-xl border border-slate-200">
      <div className="bg-[#005c4b] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white/20">
             <img src="https://ui-avatars.com/api/?name=SP+156&background=1E3A8A&color=fff" alt="Avatar" />
          </div>
          <div>
            <h2 className="font-semibold text-base leading-tight">Agente IA - Subprefeitura</h2>
            <p className="text-xs text-emerald-100">Simulação de Triagem via WhatsApp</p>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-100 border-b border-amber-200 p-2 text-xs text-amber-800 text-center flex items-center justify-center gap-2 shrink-0">
        <Info className="w-4 h-4 shrink-0" />
        <span>
          <strong>Simulação:</strong> Em produção, o envio "Foto padrão" perderá o GPS (restrição do WhatsApp). Apenas envio como "Documento" preserva o EXIF de localização da foto original.
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat bg-opacity-20 bg-[length:400px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-lg p-2 shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#d9fdd3] rounded-tr-none text-slate-900' 
                  : 'bg-white rounded-tl-none text-slate-800'
              }`}
            >
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-slate-200 max-h-64">
                  <img src={msg.image} alt="Upload" className="w-full object-cover" />
                </div>
              )}
              
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text.split('*').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
              </div>

              {msg.isMapRequest && (
                <div className="mt-3 mb-1">
                   <LocationPicker onSelectLocation={handleMapConfirm} />
                </div>
              )}

              <div className={`text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-1 ${msg.sender === 'user' ? 'min-w-[60px]' : ''}`}>
                {msg.time}
                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start">
             <div className="bg-white rounded-lg p-3 shadow-sm rounded-tl-none flex items-center gap-2">
               <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
               <span className="text-sm text-slate-500">IA analisando...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-4 py-3 flex items-end gap-2 relative shrink-0">
        {showAttachMenu && (
          <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button 
              onClick={() => handleFileClick('document')}
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">Documento/Arquivo</p>
                <p className="text-xs text-slate-500">Preserva metadados GPS</p>
              </div>
            </button>
            <button 
              onClick={() => handleFileClick('photo')}
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">Foto da Galeria</p>
                <p className="text-xs text-slate-500">Remove GPS nativamente</p>
              </div>
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-3 rounded-full transition-colors ${showAttachMenu ? 'bg-slate-200 text-slate-700' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          {showAttachMenu ? <X className="w-6 h-6" /> : <Paperclip className="w-6 h-6" />}
        </button>
        
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="Digite uma mensagem"
          className="flex-1 bg-white border-none focus:ring-0 rounded-lg px-4 py-3 text-slate-700 shadow-sm outline-none"
        />
        
        <button 
          onClick={handleSendText}
          disabled={!inputText.trim()}
          className={`p-3 rounded-full transition-colors ${
            inputText.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400'
          }`}
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}

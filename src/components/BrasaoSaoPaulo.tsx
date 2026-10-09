import React from 'react';

interface BrasaoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'full' | 'compact' | 'monochrome' | 'gold';
}

/**
 * Brasão de Armas Oficial da Cidade de São Paulo
 * Instituído pela Lei Municipal nº 1.038 de 1917
 * Lema: NON DVCOR DVCO ("Não sou conduzido, conduzo")
 * Coroa mural, escudo em goles com braço armado e bandeira da Ordem de Cristo
 */
export default function BrasaoSaoPaulo({ 
  className = '', 
  size = 40,
  showText = false,
  variant = 'full'
}: BrasaoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-label="Brasão da Cidade de São Paulo"
      >
        {/* Fundo do emblema circular sutil para destaque */}
        <circle cx="50" cy="50" r="48" fill={variant === 'monochrome' ? 'transparent' : '#0B1F38'} stroke={variant === 'monochrome' ? 'currentColor' : '#D4AF37'} strokeWidth="2" opacity={variant === 'monochrome' ? 0.3 : 1} />

        {/* Coroa Mural (5 torres visíveis com ameias e portas) */}
        <g id="coroa-mural">
          {/* Base da muralha */}
          <path d="M26 32 L74 32 L71 36 L29 36 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          
          {/* Torres com ameias */}
          {/* Torre Esquerda Extrema */}
          <path d="M28 22 H34 V32 H28 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
          <rect x="29.5" y="26" width="3" height="4" rx="1" fill="#1E293B" />
          <path d="M27 20 H35 V22 H27 Z" fill="#E2E8F0" />
          
          {/* Torre Esquerda Média */}
          <path d="M38 20 H44 V32 H38 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
          <rect x="39.5" y="24" width="3" height="5" rx="1" fill="#1E293B" />
          <path d="M37 18 H45 V20 H37 Z" fill="#E2E8F0" />

          {/* Torre Central (Principal - Mais Alta) */}
          <path d="M47 17 H53 V32 H47 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.8" />
          <rect x="48.5" y="21" width="3" height="6" rx="1" fill="#1E293B" />
          <path d="M46 15 H54 V17 H46 Z" fill="#CBD5E1" />

          {/* Torre Direita Média */}
          <path d="M56 20 H62 V32 H56 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
          <rect x="57.5" y="24" width="3" height="5" rx="1" fill="#1E293B" />
          <path d="M55 18 H63 V20 H55 Z" fill="#E2E8F0" />

          {/* Torre Direita Extrema */}
          <path d="M66 22 H72 V32 H66 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
          <rect x="67.5" y="26" width="3" height="4" rx="1" fill="#1E293B" />
          <path d="M65 20 H73 V22 H65 Z" fill="#E2E8F0" />
        </g>

        {/* Ramos Laterais: Café e Cana-de-Açúcar */}
        <g id="ramos" opacity="0.9">
          {/* Ramo Esquerdo */}
          <path d="M22 42 C18 52 20 66 28 76" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="21" cy="46" r="2" fill="#DC2626" />
          <circle cx="19" cy="54" r="2" fill="#DC2626" />
          <circle cx="21" cy="62" r="2" fill="#DC2626" />
          <circle cx="25" cy="70" r="2" fill="#DC2626" />
          {/* Folhas de café */}
          <ellipse cx="19" cy="42" rx="3.5" ry="2" transform="rotate(-30 19 42)" fill="#15803D" />
          <ellipse cx="16" cy="50" rx="3.5" ry="2" transform="rotate(-20 16 50)" fill="#15803D" />
          <ellipse cx="18" cy="58" rx="3.5" ry="2" transform="rotate(-15 18 58)" fill="#15803D" />

          {/* Ramo Direito */}
          <path d="M78 42 C82 52 80 66 72 76" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="79" cy="46" r="2" fill="#EAB308" />
          <circle cx="81" cy="54" r="2" fill="#EAB308" />
          <circle cx="79" cy="62" r="2" fill="#EAB308" />
          <circle cx="75" cy="70" r="2" fill="#EAB308" />
          {/* Folhas de cana */}
          <ellipse cx="81" cy="42" rx="3.5" ry="2" transform="rotate(30 81 42)" fill="#15803D" />
          <ellipse cx="84" cy="50" rx="3.5" ry="2" transform="rotate(20 84 50)" fill="#15803D" />
          <ellipse cx="82" cy="58" rx="3.5" ry="2" transform="rotate(15 82 58)" fill="#15803D" />
        </g>

        {/* Escudo Vermelho (Goles) com Borda Dourada */}
        <g id="escudo">
          {/* Contorno Dourado Externo */}
          <path 
            d="M32 36 H68 C68 36 68 56 68 64 C68 74 50 82 50 82 C50 82 32 74 32 64 C32 56 32 36 32 36 Z" 
            fill="#B45309" 
            stroke="#D4AF37" 
            strokeWidth="1.5"
          />
          {/* Campo Vermelho do Escudo */}
          <path 
            d="M34 38 H66 C66 38 66 55 66 63 C66 72 50 79.5 50 79.5 C50 79.5 34 72 34 63 C34 55 34 38 34 38 Z" 
            fill="#B91C1C" 
          />

          {/* Braço Armado em Prata com Bandeira da Ordem de Cristo */}
          {/* Haste da Bandeira */}
          <line x1="42" y1="70" x2="57" y2="43" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
          <circle cx="57.5" cy="42" r="1.5" fill="#F59E0B" />

          {/* Bandeira Branca */}
          <path d="M57 43 L45 46 L47 54 L54 50 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          {/* Cruz da Ordem de Cristo na Bandeira */}
          <path d="M48 48.5 H52 M50 46.5 V50.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="square" />

          {/* Braço Blindado / Armadura Prateada */}
          <path d="M38 66 C42 63 46 64 50 61 L46 58 C43 61 40 62 38 66 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <circle cx="48" cy="62" r="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.6" />
        </g>

        {/* Listel / Faixa com o Lema Latino "NON DVCOR DVCO" */}
        <g id="listel">
          {/* Fita Vermelha com Pontas Bífidas */}
          <path 
            d="M16 83 L25 80 L32 84 L68 84 L75 80 L84 83 L80 88 L74 85 L68 88 L32 88 L26 85 L20 88 Z" 
            fill="#991B1B" 
            stroke="#D4AF37" 
            strokeWidth="1"
          />
          {/* Dobras da fita */}
          <path d="M25 80 V84 M75 80 V84" stroke="#7F1D1D" strokeWidth="1" />
          
          {/* Texto do Lema: NON DVCOR DVCO */}
          <text 
            x="50" 
            y="87" 
            textAnchor="middle" 
            fill="#FFFFFF" 
            fontSize="4.2" 
            fontWeight="bold" 
            letterSpacing="0.8"
            fontFamily="serif"
          >
            NON DVCOR DVCO
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
            Prefeitura da Cidade de São Paulo
          </span>
          <span className="text-sm font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
            SUBPREFEITURA VILA MARIANA
            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded border border-blue-200">
              SUB-VM
            </span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Secretaria Municipal das Subprefeituras • SMSUB
          </span>
        </div>
      )}
    </div>
  );
}

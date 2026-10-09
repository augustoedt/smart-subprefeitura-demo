import { Subprefeitura, Chamado, CategoriaChamado, StatusChamado, PrioridadeChamado } from './types';

export const SUBPREFEITURA_VILA_MARIANA_ID = '2' as const;

// A demonstração é territorialmente restrita à SUB-VM. Os GeoJSONs das demais
// subprefeituras permanecem preservados em public/data, mas não entram no runtime.
export const subprefeituras: Subprefeitura[] = [
  { id: SUBPREFEITURA_VILA_MARIANA_ID, nome: 'Vila Mariana', lat: -23.5855, lng: -46.6323 },
];

const categorias: CategoriaChamado[] = [
  'MORADOR_RUA', 'ARVORE_CAIDA', 'BUEIRO', 'BARULHO_PSIU', 
  'CALCADA', 'TAPA_BURACO', 'FISCALIZACAO_POSTURA', 'DESFAZIMENTO'
];

const statuses: StatusChamado[] = ['NOVO', 'ENCAMINHADO', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO', 'CONCLUIDO'];
const prioridades: PrioridadeChamado[] = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface BairroDistrito {
  id: string;
  nome: string;
  distrito: 'Vila Mariana' | 'Moema' | 'Saúde';
  lat: number;
  lng: number;
  populacaoEstimada: number;
}

export const BAIRROS_SUB_VILA_MARIANA: BairroDistrito[] = [
  // Distrito Vila Mariana
  { id: 'vm-centro', nome: 'Vila Mariana (Centro)', distrito: 'Vila Mariana', lat: -23.5855, lng: -46.6323, populacaoEstimada: 42000 },
  { id: 'vm-paraiso', nome: 'Paraíso', distrito: 'Vila Mariana', lat: -23.5730, lng: -46.6430, populacaoEstimada: 38000 },
  { id: 'vm-clementino', nome: 'Vila Clementino', distrito: 'Vila Mariana', lat: -23.5960, lng: -46.6450, populacaoEstimada: 35000 },
  { id: 'vm-klabin', nome: 'Chácara Klabin', distrito: 'Vila Mariana', lat: -23.5890, lng: -46.6260, populacaoEstimada: 28000 },
  
  // Distrito Moema
  { id: 'moema-passaros', nome: 'Moema (Pássaros)', distrito: 'Moema', lat: -23.5980, lng: -46.6660, populacaoEstimada: 36000 },
  { id: 'moema-indios', nome: 'Moema (Índios)', distrito: 'Moema', lat: -23.6080, lng: -46.6600, populacaoEstimada: 39000 },
  { id: 'moema-indianopolis', nome: 'Indianópolis', distrito: 'Moema', lat: -23.6120, lng: -46.6530, populacaoEstimada: 25000 },
  { id: 'moema-conceicao', nome: 'Vila Nova Conceição', distrito: 'Moema', lat: -23.5910, lng: -46.6710, populacaoEstimada: 29000 },

  // Distrito Saúde
  { id: 'saude-centro', nome: 'Saúde (Centro)', distrito: 'Saúde', lat: -23.6160, lng: -46.6380, populacaoEstimada: 48000 },
  { id: 'saude-planalto', nome: 'Planalto Paulista', distrito: 'Saúde', lat: -23.6150, lng: -46.6500, populacaoEstimada: 32000 },
  { id: 'saude-mirandopolis', nome: 'Mirandópolis', distrito: 'Saúde', lat: -23.6040, lng: -46.6420, populacaoEstimada: 31000 },
  { id: 'saude-judas', nome: 'São Judas', distrito: 'Saúde', lat: -23.6260, lng: -46.6390, populacaoEstimada: 34000 }
];

const LOGRADOUROS_EXEMPLO: Record<string, string[]> = {
  'Vila Mariana': ['Rua Vergueiro', 'Rua Domingos de Morais', 'Rua França Pinto', 'Rua Joaquim Távora', 'Av. Conselheiro Rodrigues Alves'],
  'Moema': ['Alameda dos Maracatins', 'Av. Moema', 'Alameda dos Arapanés', 'Av. Ibirapuera', 'Av. Lavandisca', 'Av. Rouxinol'],
  'Saúde': ['Av. Jabaquara', 'Av. Indianópolis', 'Rua Domingos de Soto', 'Av. dos Bandeirantes', 'Rua Carneiro da Cunha']
};

function generateDataAbertura(status: StatusChamado, isAtrasado: boolean): string {
  const now = new Date();
  let d = new Date();
  
  if (isAtrasado) {
    d = new Date(now.getTime() - (15 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000); // 15 to 45 days ago
  } else if (status === 'CONCLUIDO') {
    d = new Date(now.getTime() - (5 + Math.floor(Math.random() * 20)) * 24 * 60 * 60 * 1000);
  } else {
    d = new Date(now.getTime() - (Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
  }
  return d.toISOString();
}

function generateChamados(): Chamado[] {
  const chamados: Chamado[] = [];
  
  for (const sub of subprefeituras) {
    const numChamados = 42;
    for (let i = 0; i < numChamados; i++) {
      const status = randomElement(statuses);
      const isAtrasado = status !== 'CONCLUIDO' && Math.random() > 0.8; // 20% chance of being late if not concluded
      const dataAbertura = generateDataAbertura(status, isAtrasado);
      
      const ano = new Date(dataAbertura).getFullYear();
      const protocolo = `${ano}-SP156-${Math.floor(Math.random() * 90000) + 10000}`;
      
      const bairroObj = randomElement(BAIRROS_SUB_VILA_MARIANA);
      const distritoNome = bairroObj.distrito;
      const bairroNome = bairroObj.nome;
      
      const logradouroLista = LOGRADOUROS_EXEMPLO[distritoNome] || LOGRADOUROS_EXEMPLO['Vila Mariana'];
      const logradouro = randomElement(logradouroLista);
      const numPredio = Math.floor(Math.random() * 2400) + 50;
      const enderecoCompleto = `${logradouro}, ${numPredio} - ${bairroNome}`;

      chamados.push({
        id: crypto.randomUUID(),
        protocolo,
        categoria: randomElement(categorias),
        subprefeituraId: sub.id,
        distrito: distritoNome,
        bairro: bairroNome,
        status,
        prioridade: randomElement(prioridades),
        lat: bairroObj.lat + (Math.random() - 0.5) * 0.008,
        lng: bairroObj.lng + (Math.random() - 0.5) * 0.008,
        dataAbertura,
        isAtrasado,
        endereco: enderecoCompleto,
        origem: Math.random() > 0.4 ? 'WHATSAPP_SP156' : 'SP156_WEB'
      });
    }
  }
  
  return chamados.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
}

// Generate data once so it persists during hot reloads in development
export const mockChamados = generateChamados();

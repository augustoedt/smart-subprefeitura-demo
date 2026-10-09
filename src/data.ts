import { Subprefeitura, Chamado, CategoriaChamado, StatusChamado, PrioridadeChamado } from './types';

export const subprefeituras: Subprefeitura[] = [
  { id: '1', nome: 'Sé', lat: -23.5505, lng: -46.6333 },
  { id: '2', nome: 'Vila Mariana', lat: -23.5855, lng: -46.6323 },
  { id: '3', nome: 'Mooca', lat: -23.5564, lng: -46.5936 },
  { id: '4', nome: 'Pinheiros', lat: -23.5615, lng: -46.6975 },
  { id: '5', nome: 'Lapa', lat: -23.5226, lng: -46.7029 },
  { id: '6', nome: 'Butantã', lat: -23.5714, lng: -46.7087 },
  { id: '7', nome: 'Campo Limpo', lat: -23.6447, lng: -46.7629 },
  { id: '8', nome: 'Capela do Socorro', lat: -23.7381, lng: -46.7153 },
  { id: '9', nome: 'Itaquera', lat: -23.5385, lng: -46.4562 },
  { id: '10', nome: 'Santana / Tucuruvi', lat: -23.4984, lng: -46.6234 },
  { id: '11', nome: 'Freguesia / Brasilândia', lat: -23.4862, lng: -46.6953 },
  { id: '12', nome: 'Santo Amaro', lat: -23.6528, lng: -46.7032 },
  { id: '13', nome: 'Ipiranga', lat: -23.5925, lng: -46.6025 },
  { id: '14', nome: 'Penha', lat: -23.5255, lng: -46.5455 },
  { id: '15', nome: 'São Miguel Paulista', lat: -23.4965, lng: -46.4422 },
  { id: '16', nome: 'Pirituba / Jaraguá', lat: -23.4735, lng: -46.7325 },
  { id: '17', nome: 'Jabaquara', lat: -23.6482, lng: -46.6432 },
  { id: '18', nome: 'Vila Prudente', lat: -23.5823, lng: -46.5742 },
  { id: '19', nome: 'Ermelino Matarazzo', lat: -23.4952, lng: -46.4862 },
  { id: '20', nome: 'Cidade Tiradentes', lat: -23.5935, lng: -46.3985 },
  { id: '21', nome: 'São Mateus', lat: -23.6125, lng: -46.4782 },
  { id: '22', nome: 'Guaianases', lat: -23.5482, lng: -46.4155 },
  { id: '23', nome: 'Itaim Paulista', lat: -23.5025, lng: -46.3982 },
  { id: '24', nome: 'Cidade Ademar', lat: -23.6725, lng: -46.6625 },
  { id: '25', nome: 'Parelheiros', lat: -23.8252, lng: -46.7285 },
  { id: '26', nome: "M'Boi Mirim", lat: -23.6925, lng: -46.7652 },
  { id: '27', nome: 'Casa Verde / Cachoeirinha', lat: -23.4952, lng: -46.6652 },
  { id: '28', nome: 'Jaçanã / Tremembé', lat: -23.4625, lng: -46.5825 },
  { id: '29', nome: 'Perus', lat: -23.4082, lng: -46.7552 },
  { id: '30', nome: 'Vila Maria / Vila Guilherme', lat: -23.5125, lng: -46.6025 },
  { id: '31', nome: 'Aricanduva / Formosa / Carrão', lat: -23.5682, lng: -46.5282 },
  { id: '32', nome: 'Sapopemba', lat: -23.6082, lng: -46.5125 },
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

function randomOffset() {
  return (Math.random() - 0.5) * 0.04; // aprox 2-4km
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
    // Para a Vila Mariana (id 2), geramos mais ocorrências detalhadas por bairro
    const numChamados = sub.id === '2' ? 42 : Math.floor(Math.random() * 6) + 12;
    for (let i = 0; i < numChamados; i++) {
      const status = randomElement(statuses);
      const isAtrasado = status !== 'CONCLUIDO' && Math.random() > 0.8; // 20% chance of being late if not concluded
      const dataAbertura = generateDataAbertura(status, isAtrasado);
      
      const ano = new Date(dataAbertura).getFullYear();
      const protocolo = `${ano}-SP156-${Math.floor(Math.random() * 90000) + 10000}`;
      
      const bairroObj = randomElement(BAIRROS_SUB_VILA_MARIANA);
      const distritoNome = sub.id === '2' ? bairroObj.distrito : (sub.nome.includes('Moema') ? 'Moema' : (sub.nome.includes('Saúde') ? 'Saúde' : 'Vila Mariana'));
      const bairroNome = sub.id === '2' ? bairroObj.nome : sub.nome;
      
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
        lat: sub.id === '2' ? bairroObj.lat + (Math.random() - 0.5) * 0.008 : sub.lat + randomOffset(),
        lng: sub.id === '2' ? bairroObj.lng + (Math.random() - 0.5) * 0.008 : sub.lng + randomOffset(),
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

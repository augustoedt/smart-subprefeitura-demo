import fs from 'fs';

const subprefeituras = [
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
  { id: '18', nome: 'Vila Prudente', lat: -23.5862, lng: -46.5815 },
  { id: '19', nome: 'Ermelino Matarazzo', lat: -23.4938, lng: -46.4842 },
  { id: '20', nome: 'Cidade Tiradentes', lat: -23.5888, lng: -46.4022 },
  { id: '21', nome: 'São Mateus', lat: -23.6065, lng: -46.4855 },
  { id: '22', nome: 'Guaianases', lat: -23.5485, lng: -46.4172 },
  { id: '23', nome: 'Itaim Paulista', lat: -23.4995, lng: -46.3985 },
  { id: '24', nome: 'Cidade Ademar', lat: -23.6785, lng: -46.6625 },
  { id: '25', nome: 'Parelheiros', lat: -23.8322, lng: -46.7215 },
  { id: '26', nome: 'M\'Boi Mirim', lat: -23.6932, lng: -46.7585 },
  { id: '27', nome: 'Casa Verde / Cachoeirinha', lat: -23.4925, lng: -46.6545 },
  { id: '28', nome: 'Jaçanã / Tremembé', lat: -23.4455, lng: -46.5822 },
  { id: '29', nome: 'Perus', lat: -23.4115, lng: -46.7585 },
  { id: '30', nome: 'Vila Maria / Vila Guilherme', lat: -23.5135, lng: -46.5825 },
  { id: '31', nome: 'Aricanduva / Formosa / Carrão', lat: -23.5655, lng: -46.5332 },
  { id: '32', nome: 'Sapopemba', lat: -23.6125, lng: -46.5185 }
];

function generateDetailedPolygon(lat, lng, radius) {
    const points = [];
    const steps = 180; // Millimetric detail
    for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        // add multiple noise frequencies to simulate rugged real-world borders
        const noise = Math.sin(angle * 5) * 0.15 + Math.cos(angle * 13) * 0.08 + Math.sin(angle * 37) * 0.03;
        let r = radius * (0.8 + noise);
        
        let dLat = Math.sin(angle) * r;
        let dLng = Math.cos(angle) * r;
        
        // Add "city block" Manhattan-like orthogonal edges 
        if (i % 3 === 0) dLat = Math.round(dLat * 800) / 800;
        if (i % 4 === 0) dLng = Math.round(dLng * 800) / 800;

        points.push([Number((lat + dLat).toFixed(5)), Number((lng + dLng).toFixed(5))]);
    }
    return points;
}

const detailedPolygons = {};

subprefeituras.forEach(sub => {
    // Determine a dynamic radius based on population density or just randomize a bit
    const radius = 0.035 + (Math.random() * 0.015); 
    detailedPolygons[sub.id] = generateDetailedPolygon(sub.lat, sub.lng, radius);
});

const output = `// Auto-generated millimetric mock of subprefecture borders
export const SUBPREFEITURAS_POLIGONOS_DETALHADOS: Record<string, [number, number][]> = ${JSON.stringify(detailedPolygons, null, 2)};
`;

fs.writeFileSync('src/dataPoligonosDetalhados.ts', output);
console.log('Detailed polygons generated.');

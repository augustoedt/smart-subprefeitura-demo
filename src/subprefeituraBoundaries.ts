export type SubprefeituraPolygons = Record<string, [number, number][]>;

const BOUNDARY_FILES: Record<string, string> = {
  '1': 'se.geojson',
  '2': 'vila-mariana.geojson',
  '3': 'mooca.geojson',
  '4': 'pinheiros.geojson',
  '5': 'lapa.geojson',
  '6': 'butanta.geojson',
  '7': 'campo-limpo.geojson',
  '8': 'capela-do-socorro.geojson',
  '9': 'itaquera.geojson',
  '10': 'santana-tucuruvi.geojson',
  '11': 'freguesia-do-o-brasilandia.geojson',
  '12': 'santo-amaro.geojson',
  '13': 'ipiranga.geojson',
  '14': 'penha.geojson',
  '15': 'sao-miguel.geojson',
  '16': 'pirituba-jaragua.geojson',
  '17': 'jabaquara.geojson',
  '18': 'vila-prudente.geojson',
  '19': 'ermelino-matarazzo.geojson',
  '20': 'cidade-tiradentes.geojson',
  '21': 'sao-mateus.geojson',
  '22': 'guaianazes.geojson',
  '23': 'itaim-paulista.geojson',
  '24': 'cidade-ademar.geojson',
  '25': 'parelheiros.geojson',
  '26': 'm-boi-mirim.geojson',
  '27': 'casa-verde.geojson',
  '28': 'jacana-tremembe.geojson',
  '29': 'perus.geojson',
  '30': 'vila-maria-vila-guilherme.geojson',
  '31': 'aricanduva-vila-formosa.geojson',
  '32': 'sapopemba.geojson',
};

type BoundaryGeoJson = {
  type: 'FeatureCollection';
  features: Array<{
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][][];
    };
  }>;
};

let cachedPolygons: SubprefeituraPolygons | null = null;

export async function loadSubprefeituraPolygons(signal?: AbortSignal): Promise<SubprefeituraPolygons> {
  if (cachedPolygons) return cachedPolygons;

  const entries = await Promise.all(
    Object.entries(BOUNDARY_FILES).map(async ([internalId, fileName]) => {
      const baseUrl = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
      const response = await fetch(`${baseUrl}data/subprefeituras/${fileName}`, { signal });

      if (!response.ok) {
        throw new Error(`Falha ao carregar ${fileName}: HTTP ${response.status}`);
      }

      const geoJson = await response.json() as BoundaryGeoJson;
      const geometry = geoJson.features[0]?.geometry;
      const outerRing = geometry?.type === 'Polygon' ? geometry.coordinates[0] : undefined;

      if (!outerRing?.length) {
        throw new Error(`O arquivo ${fileName} não contém um polígono válido.`);
      }

      const leafletCoordinates = outerRing.map(
        ([longitude, latitude]) => [latitude, longitude] as [number, number]
      );

      return [internalId, leafletCoordinates] as const;
    })
  );

  cachedPolygons = Object.fromEntries(entries);
  return cachedPolygons;
}

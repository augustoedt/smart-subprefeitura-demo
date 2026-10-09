export type SubprefeituraPolygons = Record<string, [number, number][]>;

// Somente o contorno da SUB-VM é carregado pela demonstração. Os demais
// arquivos continuam preservados em public/data/subprefeituras para uso futuro.
const BOUNDARY_FILES: Record<string, string> = {
  '2': 'vila-mariana.geojson',
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

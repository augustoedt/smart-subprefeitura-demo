export interface DistrictBoundary {
  id: 'vila-mariana' | 'moema' | 'saude';
  name: 'Vila Mariana' | 'Moema' | 'Saúde';
  coordinates: [number, number][];
}

const DISTRICT_FILES: Array<Pick<DistrictBoundary, 'id' | 'name'> & { fileName: string }> = [
  { id: 'vila-mariana', name: 'Vila Mariana', fileName: 'vila-mariana.geojson' },
  { id: 'moema', name: 'Moema', fileName: 'moema.geojson' },
  { id: 'saude', name: 'Saúde', fileName: 'saude.geojson' }
];

type DistrictGeoJson = {
  type: 'FeatureCollection';
  features: Array<{
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][][];
    };
  }>;
};

let cachedDistricts: DistrictBoundary[] | null = null;

export async function loadDistrictBoundaries(signal?: AbortSignal): Promise<DistrictBoundary[]> {
  if (cachedDistricts) return cachedDistricts;

  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  cachedDistricts = await Promise.all(
    DISTRICT_FILES.map(async ({ id, name, fileName }) => {
      const response = await fetch(`${baseUrl}data/distritos/${fileName}`, { signal });
      if (!response.ok) {
        throw new Error(`Falha ao carregar ${fileName}: HTTP ${response.status}`);
      }

      const geoJson = await response.json() as DistrictGeoJson;
      const geometry = geoJson.features[0]?.geometry;
      const outerRing = geometry?.type === 'Polygon' ? geometry.coordinates[0] : undefined;
      if (!outerRing?.length) {
        throw new Error(`O arquivo ${fileName} não contém um polígono válido.`);
      }

      return {
        id,
        name,
        coordinates: outerRing.map(
          ([longitude, latitude]) => [latitude, longitude] as [number, number]
        )
      };
    })
  );

  return cachedDistricts;
}

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(rootDir, 'appdata', 'distritos.geojson');
const outputDirectories = [
  path.join(rootDir, 'appdata', 'distritos'),
  path.join(rootDir, 'public', 'data', 'distritos')
];

const districts = new Map([
  ['VILA MARIANA', 'vila-mariana.geojson'],
  ['MOEMA', 'moema.geojson'],
  ['SAUDE', 'saude.geojson']
]);

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const sourceCrs = source.crs?.properties?.name;
if (source.type !== 'FeatureCollection' || !Array.isArray(source.features)) {
  throw new Error('appdata/distritos.geojson não é uma FeatureCollection válida.');
}
if (sourceCrs !== 'urn:ogc:def:crs:EPSG::31983') {
  throw new Error(`SRC inesperado: ${sourceCrs || 'não informado'}. Esperado EPSG:31983.`);
}

for (const directory of outputDirectories) {
  await mkdir(directory, { recursive: true });
}

for (const [districtName, fileName] of districts) {
  const feature = source.features.find(
    (candidate) => candidate.properties?.nm_distrito_municipal === districtName
  );
  if (!feature) throw new Error(`Distrito não encontrado: ${districtName}`);
  if (feature.geometry?.type !== 'Polygon') {
    throw new Error(`Geometria inesperada para ${districtName}: ${feature.geometry?.type}`);
  }

  const convertedFeature = {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map((ring) => ring.map(convertUtm23SToWgs84))
    }
  };
  const featureCollection = {
    type: 'FeatureCollection',
    name: districtName,
    features: [convertedFeature]
  };
  const serialized = `${JSON.stringify(featureCollection)}\n`;

  await Promise.all(
    outputDirectories.map((directory) => writeFile(path.join(directory, fileName), serialized))
  );
}

console.log('Distritos SUB-VM separados e convertidos de EPSG:31983 para WGS84: Vila Mariana, Moema e Saúde.');

function convertUtm23SToWgs84(coordinate) {
  const [easting, northing, ...extraDimensions] = coordinate;
  const semiMajorAxis = 6378137;
  const flattening = 1 / 298.257222101;
  const eccentricitySquared = flattening * (2 - flattening);
  const eccentricityPrimeSquared = eccentricitySquared / (1 - eccentricitySquared);
  const scaleFactor = 0.9996;

  const x = easting - 500000;
  const y = northing - 10000000;
  const meridionalArc = y / scaleFactor;
  const mu = meridionalArc / (
    semiMajorAxis * (
      1 - eccentricitySquared / 4
      - 3 * eccentricitySquared ** 2 / 64
      - 5 * eccentricitySquared ** 3 / 256
    )
  );
  const e1 = (1 - Math.sqrt(1 - eccentricitySquared)) / (1 + Math.sqrt(1 - eccentricitySquared));
  const footprintLatitude = mu
    + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu)
    + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);

  const sinFootprint = Math.sin(footprintLatitude);
  const cosFootprint = Math.cos(footprintLatitude);
  const tanFootprint = Math.tan(footprintLatitude);
  const radiusOfCurvature = semiMajorAxis / Math.sqrt(1 - eccentricitySquared * sinFootprint ** 2);
  const meridionalRadius = semiMajorAxis * (1 - eccentricitySquared)
    / (1 - eccentricitySquared * sinFootprint ** 2) ** 1.5;
  const tangentSquared = tanFootprint ** 2;
  const secondEccentricity = eccentricityPrimeSquared * cosFootprint ** 2;
  const d = x / (radiusOfCurvature * scaleFactor);

  const latitude = footprintLatitude - (
    radiusOfCurvature * tanFootprint / meridionalRadius
  ) * (
    d ** 2 / 2
    - (5 + 3 * tangentSquared + 10 * secondEccentricity - 4 * secondEccentricity ** 2 - 9 * eccentricityPrimeSquared) * d ** 4 / 24
    + (61 + 90 * tangentSquared + 298 * secondEccentricity + 45 * tangentSquared ** 2 - 252 * eccentricityPrimeSquared - 3 * secondEccentricity ** 2) * d ** 6 / 720
  );
  const centralMeridian = -45 * Math.PI / 180;
  const longitude = centralMeridian + (
    d
    - (1 + 2 * tangentSquared + secondEccentricity) * d ** 3 / 6
    + (5 - 2 * secondEccentricity + 28 * tangentSquared - 3 * secondEccentricity ** 2 + 8 * eccentricityPrimeSquared + 24 * tangentSquared ** 2) * d ** 5 / 120
  ) / cosFootprint;

  return [longitude * 180 / Math.PI, latitude * 180 / Math.PI, ...extraDimensions];
}

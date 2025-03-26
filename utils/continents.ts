interface ContinentMap {
  [key: string]: string[];
}

const continentMapping: ContinentMap = {
  'Europe': [
    'England', 'France', 'Germany', 'Spain', 'Italy', 'Portugal', 'Netherlands',
    'Belgium', 'Norway', 'Croatia', 'Serbia', 'Denmark', 'Sweden', 'Switzerland',
    'Poland', 'Austria', 'Ukraine', 'Scotland', 'Wales', 'Ireland'
  ],
  'South America': [
    'Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Paraguay',
    'Ecuador', 'Peru', 'Venezuela', 'Bolivia'
  ],
  'North America': [
    'United States', 'Mexico', 'Canada', 'Costa Rica', 'Jamaica',
    'Trinidad and Tobago', 'Honduras', 'Panama'
  ],
  'Africa': [
    'Senegal', 'Nigeria', 'Egypt', 'Morocco', 'Algeria', 'Tunisia',
    'Cameroon', 'Ghana', 'Ivory Coast', 'Mali'
  ],
  'Asia': [
    'Japan', 'South Korea', 'Iran', 'Saudi Arabia', 'Australia',
    'China', 'Qatar', 'UAE', 'Iraq', 'Vietnam'
  ]
};

export function getContinent(country: string): string {
  for (const [continent, countries] of Object.entries(continentMapping)) {
    if (countries.includes(country)) {
      return continent;
    }
  }
  return 'Unknown';
}

export function areInSameContinent(country1: string, country2: string): boolean {
  const continent1 = getContinent(country1);
  const continent2 = getContinent(country2);
  return continent1 !== 'Unknown' && continent1 === continent2;
} 
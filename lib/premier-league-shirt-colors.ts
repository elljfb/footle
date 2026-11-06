const clubShirtColors: Record<string, string> = {
  'AFC Bournemouth': '#D71920',
  Arsenal: '#EF0107',
  'Aston Villa': '#670E36',
  Barnsley: '#D71920',
  'Birmingham City': '#0000FF',
  'Blackburn Rovers': '#009EE0',
  Blackpool: '#F68712',
  'Bolton Wanderers': '#FFFFFF',
  'Bradford City': '#B91C1C',
  Brentford: '#E30613',
  'Brighton & Hove Albion': '#0057B8',
  Burnley: '#6C1D45',
  'Cardiff City': '#0070B5',
  'Charlton Athletic': '#D71920',
  Chelsea: '#034694',
  'Coventry City': '#87CEEB',
  'Crystal Palace': '#1B458F',
  'Derby County': '#FFFFFF',
  Everton: '#003399',
  Fulham: '#FFFFFF',
  'Huddersfield Town': '#0057B8',
  'Hull City': '#F4A900',
  Ipswich: '#0057B8',
  'Ipswich Town': '#0057B8',
  'Leeds United': '#FFFFFF',
  'Leicester City': '#003090',
  Liverpool: '#C8102E',
  'Luton Town': '#F78F1E',
  'Manchester City': '#6CABDD',
  'Manchester United': '#DA291C',
  Middlesbrough: '#E31B23',
  'Newcastle United': '#111827',
  'Norwich City': '#FFF200',
  'Nottingham Forest': '#DD0000',
  'Oldham Athletic': '#0046AD',
  Portsmouth: '#005DAA',
  'Queens Park Rangers': '#0054A6',
  Reading: '#005DAA',
  'Sheffield United': '#EE2737',
  'Sheffield Wednesday': '#0057B8',
  Southampton: '#D71920',
  Stoke: '#E03A3E',
  'Stoke City': '#E03A3E',
  Sunderland: '#EB172B',
  Swansea: '#FFFFFF',
  'Swansea City': '#FFFFFF',
  'Swindon Town': '#D71920',
  'Tottenham Hotspur': '#FFFFFF',
  Watford: '#FBEE23',
  'West Bromwich Albion': '#122F67',
  'West Ham United': '#7A263A',
  'Wigan Athletic': '#005DAA',
  Wimbledon: '#0054A6',
  'Wolverhampton Wanderers': '#FDB913',
};

const clubShirtDesigns: Record<string, string> = {
  'AFC Bournemouth': 'stripes-red-black-football-shirt.svg',
  Arsenal: 'sleeves-red-white-football-shirt.svg',
  'Aston Villa': 'sleeves-maroon-skyblue-football-shirt.svg',
  Barnsley: 'hoops-red-white-football-shirt.svg',
  'Birmingham City': 'plain-blue-football-shirt.svg',
  'Blackburn Rovers': 'hoops-blue-white-football-shirt.svg',
  Blackpool: 'plain-orange-football-shirt.svg',
  'Bolton Wanderers': 'band-white-navy-skyblue-football-shirt.svg',
  'Bradford City': 'stripes-red-black-football-shirt.svg',
  Brentford: 'hoops-red-white-football-shirt.svg',
  'Brighton & Hove Albion': 'stripes-white-skyblue-football-shirt.svg',
  Burnley: 'sleeves-maroon-skyblue-football-shirt.svg',
  'Cardiff City': 'plain-blue-football-shirt.svg',
  'Charlton Athletic': 'plain-red-football-shirt.svg',
  Chelsea: 'plain-blue-football-shirt.svg',
  'Coventry City': 'plain-skyblue-football-shirt.svg',
  'Crystal Palace': 'halves-red-blue-football-shirt.svg',
  'Derby County': 'sleeves-white-black-football-shirt.svg',
  Everton: 'plain-blue-football-shirt.svg',
  Fulham: 'sleeves-white-black-football-shirt.svg',
  'Huddersfield Town': 'hoops-blue-white-football-shirt.svg',
  'Hull City': 'stripes-yellow-black-football-shirt.svg',
  Ipswich: 'plain-blue-football-shirt.svg',
  'Ipswich Town': 'plain-blue-football-shirt.svg',
  'Leeds United': 'plain-white-football-shirt.svg',
  'Leicester City': 'plain-blue-football-shirt.svg',
  Liverpool: 'plain-red-football-shirt.svg',
  'Luton Town': 'plain-orange-football-shirt.svg',
  'Manchester City': 'plain-skyblue-football-shirt.svg',
  'Manchester United': 'plain-red-football-shirt.svg',
  Middlesbrough: 'plain-red-football-shirt.svg',
  'Newcastle United': 'stripes-white-black-football-shirt.svg',
  'Norwich City': 'plain-yellow-football-shirt.svg',
  'Nottingham Forest': 'plain-red-football-shirt.svg',
  'Oldham Athletic': 'plain-blue-football-shirt.svg',
  Portsmouth: 'plain-blue-football-shirt.svg',
  'Queens Park Rangers': 'hoops-blue-white-football-shirt.svg',
  Reading: 'hoops-blue-white-football-shirt.svg',
  'Sheffield United': 'hoops-red-white-football-shirt.svg',
  'Sheffield Wednesday': 'stripes-white-blue-football-shirt.svg',
  Southampton: 'hoops-red-white-football-shirt.svg',
  Stoke: 'hoops-red-white-football-shirt.svg',
  'Stoke City': 'hoops-red-white-football-shirt.svg',
  Sunderland: 'hoops-red-white-football-shirt.svg',
  Swansea: 'plain-white-football-shirt.svg',
  'Swansea City': 'plain-white-football-shirt.svg',
  'Swindon Town': 'plain-red-football-shirt.svg',
  'Tottenham Hotspur': 'sleeves-white-navy-football-shirt.svg',
  Watford: 'stripes-yellow-black-football-shirt.svg',
  'West Bromwich Albion': 'stripes-white-navy-football-shirt.svg',
  'West Ham United': 'sleeves-maroon-skyblue-football-shirt.svg',
  'Wigan Athletic': 'plain-blue-football-shirt.svg',
  Wimbledon: 'plain-blue-football-shirt.svg',
  'Wolverhampton Wanderers': 'plain-gold-football-shirt.svg',
};

const darkNumberClubs = new Set([
  'Blackburn Rovers',
  'Brighton & Hove Albion',
  'Manchester City',
]);

export function getShirtDesign(club: string): string {
  return `/football-shirts-svg/${clubShirtDesigns[club] ?? 'plain-blue-football-shirt.svg'}`;
}

export function getShirtColor(club: string): string {
  return clubShirtColors[club] ?? '#374151';
}

export function getShirtNumberColor(shirtColor: string, club: string): string {
  if (darkNumberClubs.has(club)) {
    return '#111827';
  }

  const color = shirtColor.replace('#', '');
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 160 ? '#111827' : '#FFFFFF';
}

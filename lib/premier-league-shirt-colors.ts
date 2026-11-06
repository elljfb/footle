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

export function getShirtColor(club: string): string {
  return clubShirtColors[club] ?? '#374151';
}

export function getShirtNumberColor(shirtColor: string): string {
  const color = shirtColor.replace('#', '');
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 160 ? '#111827' : '#FFFFFF';
}

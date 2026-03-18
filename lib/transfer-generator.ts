export const playerNames = [
  'Erling Haaland', 'Mohamed Salah', 'Bukayo Saka', 'Phil Foden', 'Cole Palmer',
  'Bruno Fernandes', 'Heung-Min Son', 'Martin Odegaard', 'Kevin De Bruyne', 'Alexander Isak',
  'Ollie Watkins', 'Darwin Nunez', 'Declan Rice', 'Rodri', 'William Saliba',
  'Virgil van Dijk', 'Trent Alexander-Arnold', 'Gabriel Magalhaes', 'Reece James', 'Kyle Walker',
  'Vinicius Junior', 'Jude Bellingham', 'Robert Lewandowski', 'Lamine Yamal', 'Pedri',
  'Kylian Mbappe', 'Rodrygo', 'Joao Felix', 'Antoine Griezmann', 'Frenkie de Jong',
  'Raphinha', 'Nico Williams', 'Federico Valverde', 'Eduardo Camavinga', 'Aurelien Tchouameni',
  'Victor Osimhen', 'Rafael Leao', 'Lautaro Martinez', 'Khvicha Kvaratskhelia', 'Dusan Vlahovic',
  'Marcus Thuram', 'Paulo Dybala', 'Nicolo Barella', 'Alessandro Bastoni', 'Mike Maignan',
  'Harry Kane', 'Jamal Musiala', 'Florian Wirtz', 'Victor Boniface', 'Serge Gnabry',
  'Leroy Sane', 'Joshua Kimmich', 'Alphonso Davies', 'Karim Adeyemi', 'Gregor Kobel',
  'Randal Kolo Muani', 'Bradley Barcola', 'Ousmane Dembele', 'Achraf Hakimi', 'Marquinhos',
  'Gianluigi Donnarumma', 'Goncalo Ramos', 'Warren Zaire-Emery', 'Alexandre Lacazette', 'Nemanja Matic',
  'Cristiano Ronaldo', 'Neymar Jr.', 'Lionel Messi', 'Karim Benzema', "N'Golo Kante",
  'Luis Diaz', 'Cody Gakpo', 'Dominik Szoboszlai', 'Alexis Mac Allister', 'Moises Caicedo',
  'Julian Alvarez', 'Mateo Kovacic', 'Enzo Fernandez', 'Mykhailo Mudryk', 'Pedro Neto',
  'Jarrod Bowen', 'James Maddison', 'Dejan Kulusevski', 'Brennan Johnson', 'Anthony Gordon',
  'Eberechi Eze', 'Michael Olise', 'Matheus Cunha', 'Hwang Hee-chan', 'Ivan Toney',
];

export const interestedClubs = [
  'Manchester United', 'FC Barcelona', 'Real Madrid', 'Bayern Munich', 'Liverpool',
  'Paris Saint-Germain', 'Chelsea', 'Borussia Dortmund', 'Juventus', 'Tottenham Hotspur',
  'Manchester City', 'Inter Milan', 'Atletico Madrid', 'Arsenal', 'AC Milan',
  'Ajax', 'FC Porto', 'Napoli', 'Benfica', 'Sevilla',
  'RB Leipzig', 'Bayer Leverkusen', 'Roma', 'Valencia', 'Olympique Lyon',
  'Everton', 'Leicester City', 'Wolverhampton Wanderers', 'West Ham United', 'Villarreal',
  'Lazio', 'AS Monaco', 'Leeds United', 'Atalanta', 'Al Nassr', 'Al Hilal', 'Al Ittihad', 'Al Ahli',
  'Sporting CP', 'Marseille', 'PSV Eindhoven', 'Feyenoord', 'Celtic', 'Rangers',
  'Boca Juniors', 'River Plate', 'Flamengo', 'Palmeiras', 'Aston Villa', 'Newcastle United',
];

export const phrases = [
  'is rumoured to be moving to',
  'linked with a move to',
  'attracts interest from',
  'in advanced talks with',
  'set to join',
  'could be heading to',
  'on the verge of signing for',
  'reportedly close to joining',
  'has agreed personal terms with',
  'being monitored by',
  'subject of a bid from',
  'wanted by',
  'eyed by',
  'a target for',
  'pursued by',
  'edging closer to',
  'in negotiations with',
  'expected to complete a move to',
  'undergoing a medical at',
  'spotted at the training ground of',
];

export const sources = [
  'according to reports',
  'reports suggest',
  'sources claim',
  'insiders reveal',
  'as per reliable sources',
  'multiple outlets report',
];

const currencies = ['£', '€', '$'] as const;

export interface TransferRumour {
  player: string;
  club: string;
  phrase: string;
  fee: string;
  source: string;
  fullText: string;
}

export const generateTransferRumour = (): TransferRumour => {
  const randomPlayerName = playerNames[Math.floor(Math.random() * playerNames.length)];
  const randomClub = interestedClubs[Math.floor(Math.random() * interestedClubs.length)];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  const fee = Math.floor(Math.random() * 120) + 5;
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const feeText = `${currency}${fee}M`;

  return {
    player: randomPlayerName,
    club: randomClub,
    phrase: randomPhrase,
    fee: feeText,
    source: randomSource,
    fullText: `${randomPlayerName} ${randomPhrase} ${randomClub} for ${feeText}, ${randomSource}.`,
  };
};

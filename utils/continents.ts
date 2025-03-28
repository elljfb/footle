interface ContinentMap {
  [key: string]: string[];
}

const continentMapping: ContinentMap = {
  'Europe': [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 
    'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'England', 
    'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 
    'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 
    'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 
    'North Macedonia', 'Northern Ireland', 'Norway', 'Poland', 'Portugal', 
    'Romania', 'Russia', 'San Marino', 'Scotland', 'Serbia', 'Slovakia', 
    'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Türkiye', 'Ukraine', 
    'Wales',
  ],
  'South America': [
    'Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Paraguay',
    'Ecuador', 'Peru', 'Venezuela', 'Bolivia', 'Suriname', 'Guyana'
  ],
  'North America': [
    'United States', 'Mexico', 'Canada', 'Costa Rica', 'Jamaica',
    'Trinidad and Tobago', 'Honduras', 'Panama'
  ],
  'Africa': [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 
    'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 
    'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 
    'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 
    'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 
    'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 
    'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 
    'Senegal', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 
    'Sudan', 'Swaziland', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 
    'Zambia', 'Zimbabwe'
  ],
  'Asia': [
    'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 
    'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia', 
    'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 
    'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 
    'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 
    'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 
    'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 
    'Yemen'
  ],
  'Oceania': [
    'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 
    'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 
    'Tonga', 'Tuvalu', 'Vanuatu'
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
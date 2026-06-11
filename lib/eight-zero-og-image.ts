import sharp from 'sharp';
import type { EightZeroShareRow } from '../services/eightZeroShareService';
import { getEightZeroDisplaySummary, getEightZeroOutcomeTitle } from './eight-zero-share-format';

const WIDTH = 1200;
const HEIGHT = 630;

function escapeSvg(value: string | number | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripUnsupportedCharacters(value: string): string {
  return value.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').replace(/\s+/g, ' ').trim();
}

function wrapText(value: string, maxLineLength: number, maxLines: number): string[] {
  const words = stripUnsupportedCharacters(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLineLength) {
      current = candidate;
      return;
    }

    if (current) {
      lines.push(current);
    }
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines && clipped.length) {
    clipped[clipped.length - 1] = `${clipped[clipped.length - 1].replace(/[.,;:!?]$/, '')}...`;
  }

  return clipped;
}

export async function createEightZeroOgImage(share: EightZeroShareRow): Promise<Buffer> {
  const record = `${share.record.wins}-${share.record.draws}-${share.record.losses}`;
  const titleLines = wrapText(getEightZeroDisplaySummary(share), 43, 3);
  const topPlayers = (share.result.playerStats ?? []).slice(0, 3);
  const outcome = getEightZeroOutcomeTitle(share);

  const playerCards = topPlayers
    .map((player, index) => {
      const x = 72 + index * 338;
      return `
        <rect x="${x}" y="432" width="304" height="104" rx="20" fill="#0b1220" stroke="#22304a" stroke-width="1"/>
        <text x="${x + 24}" y="464" fill="#93a4bb" font-size="18" font-weight="700">${escapeSvg(player.slot)}</text>
        <text x="${x + 24}" y="496" fill="#ffffff" font-size="24" font-weight="800">${escapeSvg(player.name)}</text>
        <text x="${x + 24}" y="524" fill="#9ca3af" font-size="18">${escapeSvg(player.goals)} G - ${escapeSvg(player.assists)} A - ${escapeSvg(player.rating)} OVR</text>
      `;
    })
    .join('');

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#07111f"/>
          <stop offset="46%" stop-color="#10233d"/>
          <stop offset="100%" stop-color="#050816"/>
        </linearGradient>
        <radialGradient id="glow" cx="78%" cy="18%" r="48%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
      <rect x="44" y="44" width="1112" height="542" rx="34" fill="none" stroke="#1f3d57" stroke-width="2"/>

      <text x="72" y="104" fill="#34d399" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" letter-spacing="5">8-0 WORLD CUP RUN</text>
      <text x="72" y="158" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900">${escapeSvg(outcome)}</text>

      ${titleLines
        .map(
          (line, index) =>
            `<text x="72" y="${226 + index * 48}" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800">${escapeSvg(line)}</text>`
        )
        .join('')}

      <rect x="72" y="350" width="194" height="56" rx="16" fill="#10b981" fill-opacity="0.18" stroke="#34d399" stroke-opacity="0.6"/>
      <text x="96" y="386" fill="#d1fae5" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800">Record ${escapeSvg(record)}</text>

      <rect x="290" y="350" width="174" height="56" rx="16" fill="#38bdf8" fill-opacity="0.14" stroke="#38bdf8" stroke-opacity="0.55"/>
      <text x="314" y="386" fill="#e0f2fe" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800">${escapeSvg(share.team_overall)} OVR</text>

      ${playerCards}

      <text x="72" y="574" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">footle.club/eight-zero</text>
      <text x="1128" y="574" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="18" text-anchor="end">Inspired by 38-0.app</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export function createPngResponse(image: Buffer): Response {
  const body = new Uint8Array(image.byteLength);
  body.set(image);

  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

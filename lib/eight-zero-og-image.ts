import { ImageResponse } from 'next/og';
import { createElement, type CSSProperties, type ReactNode } from 'react';
import type { EightZeroShareRow } from '../services/eightZeroShareService';
import { getEightZeroDisplaySummary, getEightZeroOutcomeTitle } from './eight-zero-share-format';

const WIDTH = 1200;
const HEIGHT = 630;

function el(type: string, style: CSSProperties, children?: ReactNode, key?: string | number) {
  return createElement(type, { style, key }, children);
}

function stripUnsupportedCharacters(value: string): string {
  return value
    .replace(/(\d+) ⚽/g, (_match, count) => `${count} ${Number(count) === 1 ? 'goal' : 'goals'}`)
    .replace(/[\u2600-\u27BF\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
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

export function createEightZeroOgImageResponse(share: EightZeroShareRow): ImageResponse {
  const record = `${share.record.wins}-${share.record.draws}-${share.record.losses}`;
  const titleLines = wrapText(getEightZeroDisplaySummary(share), 43, 3);
  const topPlayers = (share.result.playerStats ?? []).slice(0, 3);
  const outcome = getEightZeroOutcomeTitle(share);

  return new ImageResponse(
    el(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 44,
        background: 'linear-gradient(135deg, #07111f 0%, #10233d 46%, #050816 100%)',
        color: '#ffffff',
        fontFamily: 'Arial',
      },
      el(
        'div',
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '2px solid #1f3d57',
          borderRadius: 34,
          padding: '40px 28px 10px',
          backgroundColor: 'rgba(5, 14, 28, 0.32)',
        },
        [
          el(
            'div',
            { display: 'flex', flexDirection: 'column' },
            [
              el(
                'div',
                {
                  color: '#34d399',
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 5,
                  lineHeight: 1.1,
                  marginBottom: 26,
                },
                '8-0 WORLD CUP RUN',
                'eyebrow'
              ),
              el(
                'div',
                {
                  color: '#ffffff',
                  fontSize: 64,
                  fontWeight: 900,
                  lineHeight: 0.95,
                  marginBottom: 44,
                },
                outcome,
                'outcome'
              ),
              el(
                'div',
                { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 },
                titleLines.map((line, index) =>
                  el(
                    'div',
                    {
                      color: '#e5e7eb',
                      fontSize: 38,
                      fontWeight: 800,
                      lineHeight: 1.05,
                    },
                    line,
                    index
                  )
                ),
                'summary'
              ),
              el(
                'div',
                { display: 'flex', gap: 24 },
                [
                  el(
                    'div',
                    {
                      display: 'flex',
                      alignItems: 'center',
                      height: 56,
                      padding: '0 24px',
                      border: '1px solid rgba(52, 211, 153, 0.6)',
                      borderRadius: 16,
                      backgroundColor: 'rgba(16, 185, 129, 0.18)',
                      color: '#d1fae5',
                      fontSize: 24,
                      fontWeight: 800,
                    },
                    `Record ${record}`,
                    'record'
                  ),
                  el(
                    'div',
                    {
                      display: 'flex',
                      alignItems: 'center',
                      height: 56,
                      padding: '0 24px',
                      border: '1px solid rgba(56, 189, 248, 0.55)',
                      borderRadius: 16,
                      backgroundColor: 'rgba(56, 189, 248, 0.14)',
                      color: '#e0f2fe',
                      fontSize: 24,
                      fontWeight: 800,
                    },
                    `${share.team_overall} OVR`,
                    'overall'
                  ),
                ],
                'badges'
              ),
            ],
            'top'
          ),
          el(
            'div',
            { display: 'flex', flexDirection: 'column' },
            [
              el(
                'div',
                { display: 'flex', gap: 32, marginBottom: 22 },
                topPlayers.map((player, index) =>
                  el(
                    'div',
                    {
                      width: 304,
                      height: 104,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: '1px solid #22304a',
                      borderRadius: 20,
                      backgroundColor: '#0b1220',
                      padding: '14px 24px',
                    },
                    [
                      el(
                        'div',
                        { color: '#93a4bb', fontSize: 18, fontWeight: 700, lineHeight: 1.1, marginBottom: 10 },
                        player.slot,
                        'slot'
                      ),
                      el(
                        'div',
                        { color: '#ffffff', fontSize: 24, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 },
                        player.name,
                        'name'
                      ),
                      el(
                        'div',
                        { color: '#9ca3af', fontSize: 18, lineHeight: 1.1 },
                        `${player.goals} G - ${player.assists} A - ${player.rating} OVR`,
                        'stats'
                      ),
                    ],
                    index
                  )
                ),
                'players'
              ),
              el(
                'div',
                {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  color: '#94a3b8',
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1,
                },
                [
                  el('div', {}, 'footle.club/eight-zero', 'url'),
                  el('div', { color: '#64748b', fontSize: 18 }, 'Inspired by 38-0.app', 'credit'),
                ],
                'footer'
              ),
            ],
            'bottom'
          ),
        ]
      )
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}

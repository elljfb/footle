import type { EightZeroShareRow } from '../services/eightZeroShareService';

function getOrdinal(value: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = value % 100;
  return `${value}${suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0]}`;
}

export function getEightZeroOutcomeTitle(share: EightZeroShareRow): string {
  if (share.result.wonWorldCup) {
    return 'Won the World Cup';
  }

  if (share.eliminated_at) {
    return `Knocked out at ${share.eliminated_at}`;
  }

  if (share.medal) {
    return `${share.medal} medal finish`;
  }

  return `Finished ${getOrdinal(share.finish)}`;
}

export function getEightZeroDisplaySummary(share: EightZeroShareRow): string {
  const withoutPlayLink = share.share_text.split(/\n\s*\nPlay:/)[0];
  const withoutChallenge = withoutPlayLink.split(/\s+Can you build better on 8-0\?/)[0];
  return withoutChallenge.trim();
}


import type { EightZeroShareRow } from '../services/eightZeroShareService';
import type { SimulatedMatch, TournamentResult } from './eight-zero';

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
    const penaltyMatch = getPenaltyEliminationMatch(share.result);
    if (penaltyMatch) {
      return `Knocked out at ${share.eliminated_at} on penalties`;
    }

    return `Knocked out at ${share.eliminated_at}`;
  }

  if (share.medal) {
    return `${share.medal} medal finish`;
  }

  return `Finished ${getOrdinal(share.finish)}`;
}

export function formatEightZeroMatchScore(match: SimulatedMatch): string {
  const score = `${match.goalsFor}-${match.goalsAgainst}`;
  if (match.penaltyOutcome) {
    return `${score} (${getEightZeroPenaltyLabel(match)?.toLowerCase()})`;
  }

  return score;
}

export function getEightZeroPenaltyLabel(match: SimulatedMatch): string | null {
  if (!match.penaltyOutcome) {
    return null;
  }

  return match.penaltyOutcome === 'W' ? 'Won pens' : 'Lost pens';
}

function getPenaltyEliminationMatch(result: TournamentResult): SimulatedMatch | null {
  if (!result.eliminatedAt) {
    return null;
  }

  for (let index = result.matches.length - 1; index >= 0; index -= 1) {
    const match = result.matches[index];
    if (match.stage === result.eliminatedAt && match.outcome === 'D' && match.penaltyOutcome === 'L') {
      return match;
    }
  }

  return null;
}

export function getEightZeroOutcomePhrase(result: TournamentResult): string {
  if (result.wonWorldCup) {
    return 'won the World Cup';
  }

  if (result.medal && !result.eliminatedAt) {
    return `earned a ${result.medal.toLowerCase()} medal`;
  }

  if (result.eliminatedAt) {
    const penaltyMatch = getPenaltyEliminationMatch(result);
    if (penaltyMatch) {
      return `was knocked out at ${result.eliminatedAt} on penalties after a ${penaltyMatch.goalsFor}-${penaltyMatch.goalsAgainst} draw against ${penaltyMatch.opponent}`;
    }

    return `was knocked out at ${result.eliminatedAt}`;
  }

  if (result.medal) {
    return `earned a ${result.medal.toLowerCase()} medal`;
  }

  return `finished ${result.finish}`;
}

export function getEightZeroResultSummary(input: {
  result: TournamentResult;
  teamOverall: number;
  topScorer?: string | null;
  topScorerGoals?: number;
}): string {
  const record = `${input.result.record.wins}-${input.result.record.draws}-${input.result.record.losses}`;
  const outcomeText = getEightZeroOutcomePhrase(input.result);
  const scorerGoals = input.topScorerGoals ?? 0;
  const bestPlayerText = input.topScorer && scorerGoals > 0
    ? ` ${input.topScorer} scored ${scorerGoals} ${scorerGoals === 1 ? 'goal' : 'goals'}.`
    : '';

  return `My ${input.teamOverall}-rated World Cup XI ${outcomeText} with a ${record} record.${bestPlayerText}`;
}

export function getEightZeroDisplaySummary(share: EightZeroShareRow): string {
  const topPlayer = share.result.playerStats[0];

  return getEightZeroResultSummary({
    result: share.result,
    teamOverall: share.team_overall,
    topScorer: share.top_scorer ?? topPlayer?.name ?? null,
    topScorerGoals: share.top_scorer_goals ?? topPlayer?.goals ?? 0,
  });
}


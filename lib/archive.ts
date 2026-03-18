const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
export const ARCHIVE_DAY_COUNT = 30;

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatArchiveDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getArchiveBounds(today = new Date()): { newest: Date; oldest: Date } {
  const newest = startOfLocalDay(today);
  newest.setDate(newest.getDate() - 1);

  const oldest = new Date(newest);
  oldest.setDate(oldest.getDate() - (ARCHIVE_DAY_COUNT - 1));

  return { newest, oldest };
}

export function getArchiveDates(today = new Date()): Date[] {
  const { newest } = getArchiveBounds(today);

  return Array.from({ length: ARCHIVE_DAY_COUNT }, (_, index) => {
    const date = new Date(newest);
    date.setDate(newest.getDate() - index);
    return date;
  });
}

export function isArchiveDateKey(dateKey: string, today = new Date()): boolean {
  const { newest, oldest } = getArchiveBounds(today);
  const date = startOfLocalDay(parseDateKey(dateKey));

  return date >= oldest && date <= newest;
}

export function clampArchiveDateKey(dateKey: string | null | undefined, today = new Date()): string {
  if (dateKey && isArchiveDateKey(dateKey, today)) {
    return dateKey;
  }

  return toDateKey(getArchiveBounds(today).newest);
}

export function getPreviousArchiveDateKey(dateKey: string): string | null {
  const current = startOfLocalDay(parseDateKey(dateKey));
  const previous = new Date(current);
  previous.setDate(current.getDate() - 1);

  return isArchiveDateKey(toDateKey(previous)) ? toDateKey(previous) : null;
}

export function getArchivePuzzleNumber(date: Date): number {
  return Math.floor(startOfLocalDay(date).getTime() / MILLISECONDS_IN_DAY);
}

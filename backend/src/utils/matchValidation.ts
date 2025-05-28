import { Types } from 'mongoose';
import Match, { IMatch } from '../models/Match';

/**
 * Checks if a ground is available for a match at the given datetime (ISO string).
 * No other match should be scheduled on the same ground within 1 hour before or after.
 */
export async function isGroundAvailable(
  ground: string,
  datetime: string,
  username: string,
  excludeMatchId?: string
): Promise<boolean> {
  const matchStart = new Date(datetime);
  const oneHour = 60 * 60 * 1000;
  const windowStart = new Date(matchStart.getTime() - oneHour);
  const windowEnd = new Date(matchStart.getTime() + oneHour);

  const query: any = { ground, username };
  if (excludeMatchId) {
    query._id = { $ne: new Types.ObjectId(excludeMatchId) };
  }

  const matches: IMatch[] = await Match.find(query);

  for (const m of matches) {
    const existingStart = new Date(m.datetime);
    if (existingStart >= windowStart && existingStart <= windowEnd) {
      return false;
    }
  }
  return true;
}
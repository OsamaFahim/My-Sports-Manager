import { Types } from 'mongoose';
import Match, { IMatch } from '../models/Match';

/**
 * Checks if a ground is available for a match at the given datetime (ISO string).
 * Returns an object with availability and error info for better reusability.
 */
export type GroundAvailabilityResult =
  | { available: true }
  | { available: false; reason: 'time' | 'ground'; message: string };

export async function isGroundAvailable(
  ground: string,
  datetime: string,
  username: string,
  excludeMatchId?: string
): Promise<GroundAvailabilityResult> {
  //Not available if less than 2 hours in the future
  const matchStart = new Date(datetime);
  const now = new Date(); //By default gives current date and time
  //converts to milliseconds
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  if (matchStart < twoHoursLater) {
    //not available less than 2 hours in the future
    return {
      available: false,
      reason: 'time',
      message: 'Match time must be at least 2 hours in the future.',
    };
  }

  // No other match should be scheduled on the same ground within 1 hour before or after.
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
      return {
        available: false,
        reason: 'ground',
        message: 'This ground is not available within 1 hour of the selected time.',
      };
    }
  }
  return { available: true };
}
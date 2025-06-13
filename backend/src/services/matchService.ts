import Match, { IMatch } from '../models/Match';
import Order from '../models/Order';
import Ground from '../models/Ground';
import { addNotification } from './notificationService'; 


export async function getAllMatches(): Promise<IMatch[]> {
  return Match.find().lean();
}

export async function getMatchesByUsername(username: string): Promise<IMatch[]> {
  return Match.find({ username });
}

export async function createMatch(username: string, data: any): Promise<IMatch> {
  //return Match.create({ ...data, username });
  const match = await Match.create({ ...data, username });

  await addNotification(
    `Your match between ${match.teamA} and ${match.teamB} at ${match.ground} on ${new Date(match.datetime).toLocaleString()} has been scheduled successfully.`,
    [username]
  );

  return match;
}

export async function updateMatch(id: string, data: any): Promise<IMatch | null> {
  return Match.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return Match.findByIdAndDelete(id);
}

export async function checkTicketAvailability(matchId: string) {
  const match = await Match.findById(matchId);
  if (!match) return { available: false, message: 'Match not found' };

  const ground = await Ground.findOne({ name: match.ground });
  if (!ground) return { available: false, message: 'Ground not found' };

  // Count tickets sold for this match (sum of quantities in orders for this match)
  const orders = await Order.find({ 'items.productId': matchId, 'items.category': 'ticket' });
  let ticketsSold = 0;
  for (const order of orders) {
    for (const item of order.items) {
      if (item.productId.toString() === matchId && item.category === 'ticket') {
        ticketsSold += item.quantity;
      }
    }
  }

  const available = ticketsSold < ground.capacity;
  return { available, ticketsSold, capacity: ground.capacity };
}
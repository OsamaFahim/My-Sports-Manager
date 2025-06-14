import Ground from '../models/Ground';
import Match from '../models/Match';
import { addNotification } from './notificationService';


export async function getAllGrounds() {
  return Ground.find().lean();
}

export async function getGroundsByUsername(username: string) {
  return Ground.find({ username }).lean();
}

export async function createGround(username: string, data: any) {
  const ground = new Ground({ ...data, username });
  await ground.save();
  return ground.toObject();
}

export async function updateGround(id: string, data: any) {
  const ground = await Ground.findById(id);
  if (!ground) throw new Error('Ground not found');

  await Ground.findByIdAndUpdate(id, data);

  // Only update ground name in matches (since matches reference ground by name)
  if ('name' in data && data.name !== ground.name) {
    await Match.updateMany(
      { ground: ground.name },
      { $set: { ground: data.name } }
    );
  }

  // Notification
  let message = `Your ground "${ground.name}" has been updated.`;
  if ('name' in data && data.name !== ground.name) {
    message += ` New name: "${data.name}".`;
  }
  await addNotification(message, [ground.username]);

  return { success: true };
}

export async function deleteGround(id: string) {
  const ground = await Ground.findById(id);
  if (!ground) throw new Error('Ground not found');

  // Delete all matches that reference this ground by name
  await Match.deleteMany({ ground: ground.name });

  await Ground.findByIdAndDelete(id);

  const message = `Your ground "${ground.name}" has been deleted. All related matches have also been removed.`;
  await addNotification(message, [ground.username]);

  return { success: true };
}
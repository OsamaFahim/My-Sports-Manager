import Ground from '../models/Ground';

export async function getGroundsByUsername(username: string) {
  return Ground.find({ username }).lean();
}

export async function createGround(username: string, data: any) {
  const ground = new Ground({ ...data, username });
  await ground.save();
  return ground.toObject();
}

export async function updateGround(id: string, data: any) {
  await Ground.findByIdAndUpdate(id, data);
  return { success: true };
}

export async function deleteGround(id: string) {
  await Ground.findByIdAndDelete(id);
  return { success: true };
}
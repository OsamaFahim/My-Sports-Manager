import Team from '../models/Team';

// These services functions are for anonymous and logged out users
export async function getAllTeams() {
  return Team.find().lean();
}

// These services functions are for logged in users only
export async function getTeamsByUsername(username: string) {
  return Team.find({ username }).lean();
}

export async function createTeam(username: string, name: string) {
  const team = new Team({ username, name, players: [] });
  await team.save();
  return team.toObject();
}

export async function updateTeam(teamId: string, name: string) {
  await Team.findByIdAndUpdate(teamId, { name });
  return { success: true };
}

export async function deleteTeam(teamId: string) {
  await Team.findByIdAndDelete(teamId);
  return { success: true };
}

export async function addPlayer(teamId: string, player: any) {
  await Team.findByIdAndUpdate(teamId, { $push: { players: player } });
  return { success: true };
}

export async function updatePlayer(teamId: string, playerId: string, player: any) {
  await Team.updateOne(
    { _id: teamId, 'players._id': playerId },
    { $set: { 'players.$': player } }
  );
  return { success: true };
}

export async function deletePlayer(teamId: string, playerId: string) {
  await Team.findByIdAndUpdate(teamId, { $pull: { players: { _id: playerId } } });
  return { success: true };
}
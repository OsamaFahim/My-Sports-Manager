import cron from 'node-cron';
import Match from '../models/Match';

async function cleanupOutdatedMatches() {
  const now = new Date();
  const nowISOString = now.toISOString();
  try {
    // Delete matches where datetime < now (ISO string comparison works for ISO dates)
    const result = await Match.deleteMany({ datetime: { $lt: nowISOString } });
    if (result.deletedCount && result.deletedCount > 0) {
      console.log(`[Match Cleanup] Deleted ${result.deletedCount} outdated matches at ${nowISOString}`);
    } else {
      console.log(`[Match Cleanup] No outdated matches found at ${nowISOString}`);
    }
  } catch (error) {
    console.error('[Match Cleanup] Error deleting outdated matches:', error);
  }
}

// Run every 2 hours
cron.schedule('0 */2 * * *', cleanupOutdatedMatches);

// Also run once immediately on startup
cleanupOutdatedMatches();
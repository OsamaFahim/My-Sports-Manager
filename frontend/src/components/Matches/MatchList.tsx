import React from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useMatches } from '../../contexts/MatchContext';

interface MatchListProps {
  setEditingMatchId: (id: string | null) => void;
}

const MatchList: React.FC<MatchListProps> = ({ setEditingMatchId }) => {
  const { matches, deleteMatch } = useMatches();

  if (matches.length === 0) return <p>No matches scheduled yet.</p>;

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {matches.map(match => {
        const dt = new Date(match.datetime);
        const dateStr = dt.toLocaleDateString();
        const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return (
          <li
            key={match._id}
            className={styles.formGroup}
            style={{
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              <strong>{match.teamA}</strong> vs <strong>{match.teamB}</strong> | Venue: {match.ground} | {dateStr} at {timeStr}
            </span>
            <span>
              <button
                className={styles.authLink}
                style={{ marginRight: 8 }}
                onClick={() => setEditingMatchId(match._id!)}
              >
                Edit
              </button>
              <button
                className={styles.authLink}
                style={{ color: '#ff4d4d' }}
                onClick={() => deleteMatch(match._id!)}
              >
                Delete
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default MatchList;
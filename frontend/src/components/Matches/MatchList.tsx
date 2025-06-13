import React from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useMatches } from '../../contexts/MatchContext';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';

const TICKET_PRICE = 500; // Set your ticket price here

const MatchList: React.FC<{ setEditingMatchId: (id: string | null) => void }> = ({ setEditingMatchId }) => {
  const { matches, deleteMatch, isPublicView } = useMatches();
  const { addToCart } = useCart();

  const handleBuyTicket = async (match: any) => {
    try {
      // Check capacity before adding
      const res = await api.get(`/matches/${match._id}/tickets/availability`);
      if (!res.data.available) {
        alert('This match is fully booked!');
        return;
      }
      // Add ticket to cart as a product
      addToCart({
        _id: match._id,
        name: `${match.teamA} vs ${match.teamB}`,
        price: TICKET_PRICE,
        category: 'ticket',
        ground: match.ground,
        date: new Date(match.datetime).toLocaleDateString(),
        time: new Date(match.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: '',
        productImage: '',
        quantity: 1,
        username: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, 1);
    } catch (err) {
      alert('Could not check ticket availability. Please try again.');
    }
  };

  if (matches.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚽</div>
        <h3 className={styles.emptyTitle}>No Matches Scheduled</h3>
        <p className={styles.emptyDescription}>
          Schedule your first match to get started with match management.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {matches.map(match => {
        const dt = new Date(match.datetime);
        const dateStr = dt.toLocaleDateString();
        const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return (
          <div key={match._id} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <h3 className={styles.listItemTitle}>
                {match.teamA} vs {match.teamB}
              </h3>
              <div className={styles.listItemActions}>
                {!isPublicView ? (
                  <>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => setEditingMatchId(match._id!)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteMatch(match._id!)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                ) : (
                  <button
                    className={`${styles.actionButton} ${styles.buyTicketButton}`}
                    onClick={() => handleBuyTicket(match)}
                  >
                    🎟️ Buy Ticket
                  </button>
                )}
              </div>
            </div>
            <div className={styles.listItemInfo}>
              <p><strong>🏟️ Venue:</strong> {match.ground}</p>
              <p><strong>📅 Date:</strong> {dateStr}</p>
              <p><strong>⏰ Time:</strong> {timeStr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;
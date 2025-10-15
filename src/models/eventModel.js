const db = require('../config/database');

class EventModel {

  static async create(eventData) {
    const { title, date_time, location, capacity } = eventData;
    
    const query = `
      INSERT INTO events (title, date_time, location, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, date_time, location, capacity, created_at
    `;
    
    const result = await db.query(query, [title, date_time, location, capacity]);
    return result.rows[0];
  }

  static async findById(eventId) {
    const eventQuery = `
      SELECT id, title, date_time, location, capacity, created_at
      FROM events
      WHERE id = $1
    `;
    
    const eventResult = await db.query(eventQuery, [eventId]);
    
    if (eventResult.rows.length === 0) {
      return null;
    }
    
    const event = eventResult.rows[0];
    
    const usersQuery = `
      SELECT u.id, u.name, u.email, r.registered_at
      FROM users u
      INNER JOIN registrations r ON u.id = r.user_id
      WHERE r.event_id = $1
      ORDER BY r.registered_at ASC
    `;
    
    const usersResult = await db.query(usersQuery, [eventId]);
    
    return {
      ...event,
      registered_users: usersResult.rows,
      current_registrations: usersResult.rows.length,
    };
  }


  static async findUpcoming() {
    const query = `
      SELECT 
        e.id, 
        e.title, 
        e.date_time, 
        e.location, 
        e.capacity,
        COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.date_time > NOW()
      GROUP BY e.id
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  static async isFull(eventId) {
    const query = `
      SELECT 
        e.capacity,
        COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.capacity
    `;
    
    const result = await db.query(query, [eventId]);
    
    if (result.rows.length === 0) {
      return null; // Event not found
    }
    
    const { capacity, current_registrations } = result.rows[0];
    return parseInt(current_registrations) >= capacity;
  }


  static async isPastEvent(eventId) {
    const query = `
      SELECT date_time < NOW() as is_past
      FROM events
      WHERE id = $1
    `;
    
    const result = await db.query(query, [eventId]);
    
    if (result.rows.length === 0) {
      return null; // Event not found
    }
    
    return result.rows[0].is_past;
  }


  static async registerUser(userId, eventId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Lock the event row to prevent race conditions
      const lockQuery = `
        SELECT capacity
        FROM events
        WHERE id = $1
        FOR UPDATE
      `;
      await client.query(lockQuery, [eventId]);
      
      // Check current registration count
      const countQuery = `
        SELECT COUNT(*) as count
        FROM registrations
        WHERE event_id = $1
      `;
      const countResult = await client.query(countQuery, [eventId]);
      const currentCount = parseInt(countResult.rows[0].count);
      
      // Get event capacity
      const capacityQuery = `SELECT capacity FROM events WHERE id = $1`;
      const capacityResult = await client.query(capacityQuery, [eventId]);
      const capacity = capacityResult.rows[0].capacity;
      
      if (currentCount >= capacity) {
        throw new Error('Event is full');
      }
      
      const insertQuery = `
        INSERT INTO registrations (user_id, event_id)
        VALUES ($1, $2)
        RETURNING id, user_id, event_id, registered_at
      `;
      const result = await client.query(insertQuery, [userId, eventId]);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async cancelRegistration(userId, eventId) {
    const query = `
      DELETE FROM registrations
      WHERE user_id = $1 AND event_id = $2
      RETURNING id, user_id, event_id
    `;
    
    const result = await db.query(query, [userId, eventId]);
    return result.rows[0];
  }


  static async isUserRegistered(userId, eventId) {
    const query = `
      SELECT id FROM registrations
      WHERE user_id = $1 AND event_id = $2
    `;
    
    const result = await db.query(query, [userId, eventId]);
    return result.rows.length > 0;
  }


  static async getStats(eventId) {
    const query = `
      SELECT 
        e.capacity,
        COUNT(r.id) as total_registrations,
        e.capacity - COUNT(r.id) as remaining_capacity,
        CASE 
          WHEN e.capacity > 0 THEN ROUND((COUNT(r.id)::numeric / e.capacity::numeric) * 100, 2)
          ELSE 0
        END as percentage_filled
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id, e.capacity
    `;
    
    const result = await db.query(query, [eventId]);
    return result.rows[0];
  }
}

module.exports = EventModel;
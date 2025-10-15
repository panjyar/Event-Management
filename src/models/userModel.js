const db = require('../config/database');

class UserModel {
  static async create(userData) {
    const { name, email } = userData;
    
    const query = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, created_at
    `;
    
    const result = await db.query(query, [name, email]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, name, email, created_at
      FROM users
      WHERE email = $1
    `;
    
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, name, email, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  static async getUserEvents(userId) {
    const query = `
      SELECT 
        e.id,
        e.title,
        e.date_time,
        e.location,
        e.capacity,
        r.registered_at
      FROM events e
      INNER JOIN registrations r ON e.id = r.event_id
      WHERE r.user_id = $1
      ORDER BY e.date_time ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async exists(userId) {
    const query = `
      SELECT EXISTS(SELECT 1 FROM users WHERE id = $1) as exists
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0].exists;
  }
}

module.exports = UserModel;
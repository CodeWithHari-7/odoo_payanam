const pool = require('../config/db');

const getNotes = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const notes = await pool.query(`
      SELECT n.*, u.name as author_name 
      FROM notes n
      JOIN users u ON n.author_id = u.id
      WHERE n.trip_id = $1
      ORDER BY n.created_at DESC
    `, [tripId]);
    res.status(200).json({ success: true, data: notes.rows });
  } catch (error) { next(error); }
};

const createNote = async (req, res, next) => {
  try {
    const { trip_id, content } = req.body;
    const author_id = req.user.id;
    const newNote = await pool.query(
      'INSERT INTO notes (trip_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
      [trip_id, author_id, content]
    );
    res.status(201).json({ success: true, data: newNote.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { getNotes, createNote };

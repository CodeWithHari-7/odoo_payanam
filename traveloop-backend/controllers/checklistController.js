const pool = require('../config/db');

const getChecklist = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const checklist = await pool.query('SELECT * FROM checklist WHERE trip_id = $1 ORDER BY id ASC', [tripId]);
    res.status(200).json({ success: true, data: checklist.rows });
  } catch (error) { next(error); }
};

const createChecklistTask = async (req, res, next) => {
  try {
    const { trip_id, task, assigned_to } = req.body;
    const newTask = await pool.query(
      'INSERT INTO checklist (trip_id, task, assigned_to) VALUES ($1, $2, $3) RETURNING *',
      [trip_id, task, assigned_to]
    );
    res.status(201).json({ success: true, data: newTask.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { getChecklist, createChecklistTask };

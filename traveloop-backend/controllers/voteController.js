const pool = require('../config/db');

const castVote = async (req, res, next) => {
  try {
    const { trip_id, subject_type, subject_id, vote_value } = req.body;
    const user_id = req.user.id;

    // UPSERT logic: Insert vote, or update if user already voted on this subject
    const voteQuery = await pool.query(`
      INSERT INTO votes (trip_id, user_id, subject_type, subject_id, vote_value)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, subject_type, subject_id)
      DO UPDATE SET vote_value = EXCLUDED.vote_value
      RETURNING *
    `, [trip_id, user_id, subject_type, subject_id, vote_value]);

    res.status(200).json({ success: true, data: voteQuery.rows[0] });
  } catch (error) { next(error); }
};

module.exports = { castVote };

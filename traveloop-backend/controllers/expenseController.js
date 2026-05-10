const pool = require('../config/db');

// @desc    Get expenses for a trip
// @route   GET /api/expenses/:tripId
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const expensesQuery = await pool.query(`
      SELECT e.*, u.name as paid_by_name 
      FROM expenses e
      JOIN users u ON e.paid_by = u.id
      WHERE e.trip_id = $1
      ORDER BY e.created_at DESC
    `, [tripId]);

    res.status(200).json({ success: true, data: expensesQuery.rows });
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense and automatically split costs
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { trip_id, description, amount, date } = req.body;
    const paid_by = req.user.id;

    if (!trip_id || !description || !amount) {
      res.status(400);
      throw new Error('Please provide trip_id, description, and amount');
    }

    await pool.query('BEGIN');

    // Insert Expense
    const expenseRes = await pool.query(
      'INSERT INTO expenses (trip_id, paid_by, description, amount, date) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE)) RETURNING *',
      [trip_id, paid_by, description, amount, date]
    );
    const newExpense = expenseRes.rows[0];

    // Get all trip members
    const membersRes = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = $1', [trip_id]);
    const members = membersRes.rows;

    if (members.length > 0) {
      // Split logic: equal split among all members
      const splitAmount = amount / members.length;

      for (let member of members) {
        // If the member is the one who paid, they don't owe themselves (or owed amount is effectively 0 for tracking owed-to-others)
        // For simplicity, we just record everyone's share.
        await pool.query(
          'INSERT INTO expense_splits (expense_id, user_id, amount_owed) VALUES ($1, $2, $3)',
          [newExpense.id, member.user_id, splitAmount]
        );
      }
    }

    await pool.query('COMMIT');

    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

module.exports = { getExpenses, createExpense };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getRoutes = async (req, res, next) => {
  try {
    const routes = await prisma.route.findMany();
    res.status(200).json(routes);
  } catch (error) {
    next(error);
  }
};

// @desc    Search for routes based on 'from' and 'to'
// @route   GET /api/routes/search
// @access  Public
const searchRoutes = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400);
      throw new Error('Please provide from and to destinations');
    }

    const routes = await prisma.route.findMany({
      where: {
        from: { contains: from, mode: 'insensitive' },
        to: { contains: to, mode: 'insensitive' }
      },
      include: {
        schedules: {
          include: { bus: true }
        }
      }
    });

    res.status(200).json(routes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get schedules for a specific route
// @route   GET /api/routes/:routeId/schedules
// @access  Public
const getSchedules = async (req, res, next) => {
  try {
    const routeId = parseInt(req.params.routeId);
    const { date } = req.query;

    let whereClause = { routeId };
    
    // Optional: Filter by specific date
    if (date) {
      const searchDate = new Date(date);
      whereClause.date = searchDate;
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        bus: true,
        route: true
      },
      orderBy: { departureTime: 'asc' }
    });

    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoutes,
  searchRoutes,
  getSchedules
};

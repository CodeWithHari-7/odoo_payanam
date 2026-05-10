const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { scheduleId, seats } = req.body;
    const userId = req.user.id;

    if (!scheduleId || !seats || seats <= 0) {
      res.status(400);
      throw new Error('Please provide valid schedule ID and number of seats');
    }

    // Use Prisma transaction to ensure seat availability and booking creation are atomic
    const booking = await prisma.$transaction(async (prisma) => {
      // 1. Find schedule
      const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: { route: true }
      });

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // 2. Check seat availability
      if (schedule.availableSeats < seats) {
        throw new Error(`Only ${schedule.availableSeats} seats available`);
      }

      // 3. Calculate total amount
      const totalAmount = schedule.route.price * seats;

      // 4. Create booking
      const newBooking = await prisma.booking.create({
        data: {
          userId,
          scheduleId,
          seats,
          totalAmount,
          status: 'CONFIRMED',
          paymentStatus: 'PENDING'
        }
      });

      // 5. Deduct available seats
      await prisma.schedule.update({
        where: { id: scheduleId },
        data: { availableSeats: schedule.availableSeats - seats }
      });

      return newBooking;
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error.message.includes('seats available') || error.message.includes('not found')) {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Make sure user owns the booking or is admin
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    // Cancel booking and restore seats
    const updatedBooking = await prisma.$transaction(async (prisma) => {
      const cancelled = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      });

      const schedule = await prisma.schedule.findUnique({ where: { id: booking.scheduleId } });
      
      await prisma.schedule.update({
        where: { id: booking.scheduleId },
        data: { availableSeats: schedule.availableSeats + booking.seats }
      });

      return cancelled;
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        schedule: { include: { route: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
};

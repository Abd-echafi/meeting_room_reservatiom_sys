const cron = require('node-cron');
const Booking = require('../models/bookingModel');

cron.schedule('0 2 * * 1', async () => {
  console.log('Running weekly cleanup...');

  const now = new Date();
  const updated = await Booking.updateMany(
    { status: 'pending', endTime: { $lt: now } },
    { $set: { status: 'cancelled' } }
  );
});
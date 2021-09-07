const { Booking } = require("../../Models/booking");
const { Event } = require("../../Models/event");
const { transformBooking, transformEvent } = require("./merge");
module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const fetchedEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        event: fetchedEvent,
        user: req.userId,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = (await Booking.findById(args.bookingId).populate("event"))
        .event;
      await Booking.findByIdAndDelete(args.bookingId);
      return transformEvent(event);
    } catch (err) {
      console.log("Error is here -> in cancelBooking");
      throw err;
    }
  },
};

const { User } = require("../../Models/user");
const { Event } = require("../../Models/event");
const { dateToString } = require("../../helpers/date");

const transformEvent = (e) => {
  return {
    ...e._doc,
    date: new Date(e._doc.date).toISOString(),
    creator: user.bind(this, e.creator),
  };
};

const transformBooking = (booking) => ({
  ...booking._doc,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

async function user(userId) {
  try {
    const user1 = await User.findById(userId);
    return {
      ...user1._doc,
      password: null,
      createdEvents: events.bind(this, user1.createdEvents),
    };
  } catch (err) {
    throw err;
  }
}

async function events(eventsIds) {
  try {
    let events = (await Event.find({ _id: { $in: eventsIds } })).map(
      (event) => {
        return transformEvent(event);
      }
    );
    return events;
  } catch (err) {
    throw err;
  }
}

async function singleEvent(eventId) {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  transformEvent,
  transformBooking,
};

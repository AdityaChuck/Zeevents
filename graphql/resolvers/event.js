const { Event } = require("../../Models/event");
const { transformEvent } = require("./merge");
const { User } = require("../../Models/user");
module.exports = {
  events: async () => {
    try {
      // .populate("creator")
      return (await Event.find()).map((e) => transformEvent(e));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    try {
      let dbRes = await event.save();
      let user1 = await User.findById(req.userId);
      if (user1) {
        user1.createdEvents.push(event);
        let userDBRes = await user1.save();
        if (userDBRes) {
          return transformEvent(dbRes);
        }
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

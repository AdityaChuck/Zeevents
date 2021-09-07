const authResolvers = require("./auth");
const eventResolvers = require("./event");
const bookingResolvers = require("./booking");

module.exports = {
  ...authResolvers,
  ...eventResolvers,
  ...bookingResolvers,
};

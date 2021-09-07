export const formatData = (data) => {
  return data.map((datum) => ({
    bookingId: datum._id,
    eventId: datum.event._id,
    description: datum.event.description,
    eventTitle: datum.event.title,
    eventDate: new Date(datum.event.date).toLocaleString(),
    eventPrice: datum.event.price,
    creator: datum.user.email,
    key: datum._id,
  }));
};

export const formatData = (data) => {
  return data.map((datum) => ({
    eventId: datum._id,
    creatorId: datum.creator._id,
    creator: datum.creator.email,
    date: new Date(datum.date).toLocaleString(),
    title: datum.title,
    price: datum.price,
    description: datum.description,
    key: datum._id,
  }));
};

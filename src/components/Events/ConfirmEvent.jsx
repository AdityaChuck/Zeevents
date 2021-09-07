import React from "react";
import { Modal, message, Typography } from "antd";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { GET_BOOKINGS } from "../Bookings/Bookings";
const BOOK_EVENT = gql`
  mutation BookEvent($eventId: ID!) {
    bookEvent(eventId: $eventId) {
      _id
      event {
        _id
        title
        description
        price
        date
      }
      user {
        _id
        email
      }
      createdAt
      updatedAt
    }
  }
`;

const ConfirmEvent = ({ visible, handleCancel, record }) => {
  const { push } = useHistory();

  const [bookEvent, { error, loading }] = useMutation(BOOK_EVENT, {
    variables: {
      eventId: record.eventId,
    },
    update(cache, result) {
      const data = cache.readQuery({
        query: GET_BOOKINGS,
      });
      if (data && data.bookings) {
        cache.writeQuery({
          query: GET_BOOKINGS,
          data: { bookings: [result.data.bookEvent, ...data.bookings] },
        });
      }
    },
  });

  const handleOk = async () => {
    await bookEvent();
    push("/bookings");
  };

  if (error) {
    message.error(error.message);
    handleCancel();
  }

  return (
    <Modal
      title="Confirm Booking"
      visible={visible}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
    >
      <Typography.Title level={4}>
        Confirm booking for {record.title} on{" "}
        {new Date(record.date).toLocaleString()}
      </Typography.Title>
    </Modal>
  );
};

export default ConfirmEvent;

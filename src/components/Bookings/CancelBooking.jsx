import React from "react";
import { message, Modal, Typography } from "antd";
// import { GET_BOOKINGS } from "./Bookings";
import { gql, useMutation } from "@apollo/client";

const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      _id
    }
  }
`;

const CancelBooking = ({ visible, handleCancel, record }) => {
  const [cancelBooking, { error, loading }] = useMutation(CANCEL_BOOKING, {
    variables: {
      bookingId: record.bookingId,
    },
    //works but gives warning
    // update(cache) {
    //   const data = cache.readQuery({
    //     query: GET_BOOKINGS,
    //   });
    //   if (data && data.bookings) {
    //     cache.writeQuery({
    //       query: GET_BOOKINGS,
    //       data: {
    //         bookings: data.bookings.filter(
    //           (booking) => booking._id !== record.bookingId
    //         ),
    //       },
    //     });
    //   }
    // },
    update(cache) {
      cache.modify({
        fields: {
          bookings(existingBookingsRefs, { readField }) {
            return existingBookingsRefs.filter(
              (bookingRef) => record.bookingId !== readField("_id", bookingRef)
            );
          },
        },
      });
    },
  });

  const handleOk = async () => {
    await cancelBooking();
    handleCancel();
  };

  if (error) {
    message.error(error.message);
    handleCancel();
  }

  return (
    <Modal
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okButtonProps={{ danger: true }}
      visible={visible}
    >
      <Typography.Title level={4}>
        {" "}
        Are you sure you want to cancel your booking for event -{" "}
        {record.eventTitle} on {new Date(record.eventDate).toLocaleString()}?{" "}
      </Typography.Title>
    </Modal>
  );
};

export default CancelBooking;

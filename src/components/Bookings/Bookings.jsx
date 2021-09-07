import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { message, Button } from "antd";
import Loader from "../../shared/Loader/Loader";
import useColumnProps from "../../Util/hooks/getColumnProps";
import { formatData } from "./util";
import TableComp from "../../shared/Table/TableComp";
import { useHistory } from "react-router-dom";
import useSelectors from "../../Util/hooks/selector";
import CancelBooking from "./CancelBooking";

export const GET_BOOKINGS = gql`
  query Bookings {
    bookings {
      _id
      event {
        _id
        title
        description
        date
        price
      }
      user {
        email
      }
    }
  }
`;

const Bookings = () => {
  const { push } = useHistory();

  const { isLoggedIn } = useSelectors();

  useEffect(() => {
    if (!isLoggedIn) {
      push("/authentication/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const { loading, error, data } = useQuery(GET_BOOKINGS);

  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const showModal = (r) => {
    setRecord(r);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setRecord(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "eventTitle",
      key: "eventTitle",
      // width: "20%",
      sorter: (a, b) => a.eventTitle.length - b.eventTitle.length,
      ...useColumnProps("eventTitle"),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Date",
      dataIndex: "eventDate",
      key: "eventDate",
      // width: "20%",
      sorter: (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
      ...useColumnProps("eventDate"),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price($)",
      dataIndex: "eventPrice",
      key: "eventPrice",
      // width: "20%",
      ...useColumnProps("eventPrice"),
      sorter: (a, b) => a.eventPrice - b.eventPrice,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      // width: "20%",
      ...useColumnProps("creator"),
      sorter: (a, b) => a.creator.length - b.creator.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "bookingId",
      key: "bookingId",
      // width: "20%",
      render: (_, record) => (
        <Button
          type="primary"
          //   className={isLoggedIn ? "btn-primary" : "btn-disabled"}
          danger
          onClick={(_) => showModal(record)}
          disabled={!isLoggedIn}
        >
          Cancel Booking
        </Button>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) {
    message.error(error.message);
    return <Loader />;
  }
  if (data) {
    return (
      <>
        {" "}
        <TableComp columns={columns} data={formatData(data.bookings)} />
        {visible && (
          <CancelBooking
            handleCancel={handleCancel}
            record={record}
            visible={visible}
          />
        )}
      </>
    );
  }
};

export default Bookings;

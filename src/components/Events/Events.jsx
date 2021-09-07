import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { message, Button } from "antd";
import Loader from "../../shared/Loader/Loader";
import useColumnProps from "../../Util/hooks/getColumnProps";
import { formatData } from "./util";
import TableComp from "../../shared/Table/TableComp";
// import { useHistory } from "react-router-dom";
import useSelectors from "../../Util/hooks/selector";
import "./Events.css";
import ConfirmEvent from "./ConfirmEvent";

export const GET_EVENTS = gql`
  query Events {
    events {
      _id
      title
      description
      price
      date
      creator {
        _id
        email
      }
    }
  }
`;

const Events = () => {
  // const { push } = useHistory();
  const { isLoggedIn } = useSelectors();

  const { loading, error, data } = useQuery(GET_EVENTS);

  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const showModal = (r) => {
    setRecord(r);
    setVisible(true);
  };

  const handleCancel = () => {
    setRecord(null);
    setVisible(false);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // width: "20%",
      sorter: (a, b) => a.title.length - b.title.length,
      ...useColumnProps("title"),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // width: "20%",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ...useColumnProps("date"),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price($)",
      dataIndex: "price",
      key: "price",
      // width: "20%",
      ...useColumnProps("price"),
      sorter: (a, b) => a.price - b.price,
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
      dataIndex: "eventId",
      key: "eventId",
      // width: "20%",
      render: (_, record) => (
        <Button
          // type="default"
          // className={isLoggedIn ? "btn-primary" : "btn-disabled"}
          type="primary"
          onClick={(_) => showModal(record)}
          disabled={!isLoggedIn}
        >
          Book Event
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
        <TableComp columns={columns} data={formatData(data.events)} />
        {visible && (
          <ConfirmEvent
            handleCancel={handleCancel}
            record={record}
            visible={visible}
          />
        )}
      </>
    );
  }
};

export default Events;

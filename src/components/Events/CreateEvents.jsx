import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, message } from "antd";
import { useMutation, gql } from "@apollo/client";
import { GET_EVENTS } from "./Events";
import Loader from "../../shared/Loader/Loader";
import { useHistory } from "react-router";
import useSelector from "../../Util/hooks/selector";
const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $price: Float!
    $date: String!
  ) {
    createEvent(
      eventInput: {
        title: $title
        description: $description
        price: $price
        date: $date
      }
    ) {
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

const CreateEvents = () => {
  const { isLoggedIn } = useSelector();
  const { push } = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      push("/authentication/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
    update(cache, result) {
      const data = cache.readQuery({
        query: GET_EVENTS,
      });
      if (data && data.events) {
        cache.writeQuery({
          query: GET_EVENTS,
          data: { events: [result.data.createEvent, ...data.events] },
        });
      }
    },
  });

  const onFinish = async (values) => {
    await createEvent({
      variables: {
        title: values.title,
        description: values.description,
        price: values.price,
        date: values.date.toISOString(),
      },
    });

    push("/events");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    message.error(error.message);
  }

  return (
    <Form
      name="eventCreation"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: "Title is required",
          },
        ]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Description is required",
          },
        ]}
      >
        <Input.TextArea style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Price($)"
        name="price"
        rules={[
          {
            required: true,
            message: "Price is required",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[
          {
            required: true,
            message: "Date is required",
          },
        ]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{ width: "100%" }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateEvents;

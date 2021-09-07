import React from "react";
import { Form, Input, Button, Space, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { useMutation, gql } from "@apollo/client";
import Loader from "../../shared/Loader/Loader";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
    }
  }
`;

const Authentication = () => {
  //Store setup
  const login = useAuthStore((state) => state.login);

  //login mutation
  const [loginUser, { loading1 }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      console.log(userData);
      login(userData);
      push("/events");
    },
    onError(err) {
      message.error(err.message);
    },
  });

  //createUser mutation
  const [createUser, { loading2 }] = useMutation(CREATE_USER, {
    update(_, { data: { createUser: userData } }) {
      console.log(userData);
      login(userData);
      push("/events");
    },
    onError(err) {
      message.error(err.message);
    },
  });

  const { page } = useParams();
  const { push } = useHistory();
  const onFinish = (values) => {
    if (page === "signin") {
      loginUser({
        variables: {
          email: values.email,
          password: values.password,
        },
        // fetchPolicy: "no-cache",
      });
    } else {
      createUser({
        variables: {
          email: values.email,
          password: values.password,
        },
        // fetchPolicy: "no-cache",
      });
    }
  };
  if (loading1 || loading2) return <Loader />;
  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter a valid Email!",
              pattern:
                //eslint-disable-next-line
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className="mt20"
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Password is required!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          className="mt20"
          wrapperCol={{
            offset: 10,
            span: 6,
          }}
        >
          <Space>
            <Button type="primary" htmlType="submit">
              {page === "signin" ? "Sign in" : "Sign up"}
            </Button>
            <Button
              htmlType="button"
              onClick={() =>
                push(
                  `/authentication/${page === "signin" ? "signup" : "signin"}`
                )
              }
            >
              {page === "signin" ? "Sign up" : "Sign in"} instead
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default Authentication;

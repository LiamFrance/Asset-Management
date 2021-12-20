import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export const validateInput = (str = "") => str.length > 0;

const LoginPage = ({ setToken }) => {
  const [message1, setMessage] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    setMessage("");
    axios
      .post(`http://${process.env.REACT_APP_API_URL}:8080/authenticate`, values)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setToken(response.data.jwtToken);
          localStorage.setItem("TOKEN", response.data.jwtToken);
          navigate("/home");
        } else {
          console.log("hihi");
          setMessage("Invalid username or password");
        }
        // axios.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${response.data.jwtToken}`;
      })
      .catch((error) => {
        console.log(error);
        setMessage("Invalid username or password");
      });
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Submit Failed !");
  };

  return (
    <div className="content__box--right">
      <div className="user__list__title" style={{ textAlign: "center" }}>
        Login
      </div>
      {message1 && (
        <div className="message">
          Invalid Username or password{" "}
          <span
            onClick={() => setMessage("")}
            style={{ float: "right", fontStyle: "normal" }}
          >
            X
          </span>
        </div>
      )}
      <div className="login__box">
        <Form
          className="login__form"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 9,
          }}
          initialValues={{
            remember: true,
          }}
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            className="lable__box"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            className="lable__box"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password data-testid="password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="lable__box"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            className="lable__box"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              className="login__btn"
              type="danger"
              htmlType="submit"
              data-testid="signInButton"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginPage;

import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, message, Radio, Select } from "antd";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import jwt_decode from "jwt-decode";

const axios = require("axios");

const validateMessages = {
  required: "${label} is required!",
};

const User = ({ token }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }

  const onFinish = (values) => {
    message.success("Submit success!").then((r) => {
      let formatData = {
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        dob: form.getFieldValue("dob").format("YYYY-MM-DD"),
        gender: form.getFieldValue("gender"),
        joinedDate: form
          .getFieldValue("joinedDate")
          .format("YYYY-MM-DD HH:mm:ss"),
        type: form.getFieldValue("type"),
        //location: jwt_decode(token).location,
      };
      //alert(JSON.stringify(formatData, null, 1))
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post(`http://${process.env.REACT_APP_API_URL}:8080/users`, formatData)
        .then(function (response) {
          if (response.status === 200) {
            message.success("Create Success");
            localStorage.setItem("TOP", response.data.id);
            navigate("/user");
          }
        })
        .catch(function (error) {});
    });
  };

  const onFinishFailed = () => {
    message.error("Submit failed!").then();
  };

  function underAgeValidate(birthday) {
    // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
    let optimizedBirthday = birthday.replace(/-/g, "/");

    //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
    let myBirthday = new Date(optimizedBirthday);

    // set current day on 01:00:00 hours GMT+0100 (CET)
    let currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";

    // calculate age comparing current date and borthday
    let myAge = ~~((Date.now(currentDate) - myBirthday) / 31557600000);

    if (myAge < 18) {
      return false;
    } else {
      return true;
    }
  }

  const configJoinedDate = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Joined date is required",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (
            value &&
            (moment(value).format("dddd") === "Saturday" ||
              moment(value).format("dddd") === "Sunday")
          ) {
            return Promise.reject(
              new Error(
                "Joined date is Saturday or Sunday. Please select a different date"
              )
            );
          } else if (value && !moment(value).isAfter(getFieldValue("dob"))) {
            return Promise.reject(
              new Error(
                "Joined date is not later than Date of Birth. Please select a different date"
              )
            );
          } else {
            return Promise.resolve();
          }
        },
      }),
    ],
  };

  const configDob = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Please select time!",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || underAgeValidate(String(value))) {
            return Promise.resolve();
          } else {
            return Promise.reject(
              new Error("User is under 18. Please select a different date")
            );
          }
        },
      }),
    ],
  };

  function removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  function allLetter(string) {
    var letters = "^[a-zA-Z]+( [a-zA-Z]+)*$";
    if (string.match(letters)) {
      return true;
    } else {
      return false;
    }
  }

  const configName = {
    rules: [
      {
        required: true,
        message: "Name is required",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || allLetter(removeAccents(value))) {
            return Promise.resolve();
          } else {
            return Promise.reject(
              new Error("Name is not valid, only letters accepted")
            );
          }
        },
      }),
    ],
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  };

  const checkTouched = () => {
    if (form.isFieldTouched("firstName")) {
      if (form.isFieldTouched("lastName")) {
        if (form.isFieldTouched("dob")) {
          if (form.isFieldTouched("joinedDate")) {
            if (form.isFieldTouched("type")) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage User > Create New User")}
      <div className="user__list__title">Create New User</div>
      <div className="user__create">
        {/* edit o day nay */}
        <Form
          className="edit__form"
          initialValues={{ gender: "female" }}
          form={form}
          colon={false}
          {...layout}
          validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          hideRequiredMark
          name="time_related_controls"
        >
          <Form.Item label="First Name" name="firstName" {...configName}>
            <Input style={{ width: "500px" }} placeholder="Enter first name" />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" {...configName}>
            <Input placeholder="Enter last name" style={{ width: "500px" }} />
          </Form.Item>
          <Form.Item label="Date of Birth" name="dob" {...configDob}>
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "500px" }}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="female">Female</Radio>
              <Radio value="male">Male</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Joined Date"
            name="joinedDate"
            {...configJoinedDate}
          >
            <DatePicker
              style={{ width: "500px" }}
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "please choose one a type" }]}
          >
            <Select
              style={{ width: "500px" }}
              placeholder="Please choose a type"
            >
              <Select.Option value="staff">Staff</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <div className="button__box">
            <Form.Item
              shouldUpdate
              className="submit"
              style={{ display: "inline-block" }}
            >
              {() => (
                <Button
                  danger
                  type="primary"
                  htmlType="submit"
                  disabled={
                    checkTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                >
                  Save
                </Button>
              )}
            </Form.Item>
            <Button
              color="white"
              style={{ marginLeft: "2rem" }}
              onClick={() => navigate("/user")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default User;

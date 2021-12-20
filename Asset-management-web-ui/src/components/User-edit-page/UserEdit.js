import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Radio, Select } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import jwt_decode from "jwt-decode";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const { Option } = Select;

const UserEdit = ({ token }) => {
  const navigate = useNavigate();

  let { staffCode } = useParams();
  const [user, setUser] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    joinedDate: "",
    type: "",
    disable: "",
  });
  const [form] = Form.useForm();
  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }

  //get user by assetCode
  useEffect(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/users/${staffCode}`)
      .then(function (response) {
        setUser(response.data);
      })
      .catch(function (error) {
        if (error.message === "Network Error") {
          navigate("/server-500");
        } else if (error.response.status === 401) {
          navigate("/unauthorized");
        }
      });
  }, []);
  //update data to  form
  useEffect(() => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      dob: moment(user.dob),
      gender: user.gender,
      joinedDate: moment(user.joinedDate),
      type: user.type,
    });
  }, [user, form]);

  const onFinishFailed = () => {
    message.error("Update failed!").then();
  };

  const onFinish = () => {
    message.success("Submit success!").then((r) => {
      let formatData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        ...form.getFieldsValue(),
        dob: form.getFieldsValue().dob.format("YYYY-MM-DD"),
        joinedDate: form
          .getFieldsValue()
          .joinedDate.format("YYYY-MM-DD HH:mm:ss"),
        //location: user.location,
        disable: user.disable,
      };
      // alert(JSON.stringify(formatData, null, 1))
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .put(`http://${process.env.REACT_APP_API_URL}:8080/users`, formatData)
        .then(function (response) {
          if (response.status === 200) {
            message.success("Edit Success");
            localStorage.setItem("TOP", response.data.id);
            navigate("/user");
          }
        })
        .catch(function (error) {});
    });
  };

  const onValuesChange = ({ fieldName }) => {
    if (!user && fieldName) {
      setUser(fieldName);
    }
  };

  function underAgeValidate(birthday) {
    // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
    var optimizedBirthday = birthday.replace(/-/g, "/");

    //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
    var myBirthday = new Date(optimizedBirthday);

    // set current day on 01:00:00 hours GMT+0100 (CET)
    var currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";

    // calculate age comparing current date and birthday
    var myAge = ~~((Date.now(currentDate) - myBirthday) / 31557600000);

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
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage User > Edit User")}
      <div className="user__list__title">Edit User</div>
      <div className="user__edit">
        {/* edit o day nay */}
        <Form
          {...layout}
          key={user.id}
          colon={false}
          className="edit__form"
          validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="create-form"
          hideRequiredMark
          form={form}
          onValuesChange={onValuesChange}
        >
          <Form.Item label="First Name" name="firstName">
            <Input style={{ width: "500px" }} disabled />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input style={{ width: "500px" }} disabled />
          </Form.Item>
          <Form.Item label="Date of Birth" name="dob" {...configDob}>
            <DatePicker style={{ width: "500px" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Gender is required" }]}
          >
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
            <DatePicker style={{ width: "500px" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
            allowClear
          >
            <Select style={{ width: "500px" }}>
              <Option value="staff">Staff</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <div className="button__box">
            <Button type="primary" htmlType="submit" danger>
              Save
            </Button>
            <Button
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

export default UserEdit;

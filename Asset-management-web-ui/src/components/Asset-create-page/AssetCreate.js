import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Radio, Select } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import moment from "moment";

const validateMessages = {
  required: "${label} is required!",
};

const AssetCreate = ({ token }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    prefix: "",
  });

  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }
  //getAsset
  useEffect(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/category`)
      .then(function (response) {
        if (response.status === 200) {
          setCategory(response.data);
        }
      })
      .catch(function (error) {
        if (error === 401) {
        }
      });
  }, []);
  const { TextArea } = Input;

  function removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  function allLetter(string, pattern) {
    if (string.match(pattern)) {
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
          if (
            !value ||
            allLetter(removeAccents(value), "^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$")
          ) {
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
  const onFinish = (values) => {
    setIsDisabled(true);
    let formatAsset = {
      assetName: form.getFieldValue("assetName"),
      specification: form.getFieldValue("specification"),
      installedDate: moment(form.getFieldValue("installedDate")).format(
        "YYYY-MM-DD"
      ),
      state: form.getFieldValue("state"),
      category: form.getFieldValue("category"),
      //location: jwt_decode(token).location,
    };
    message.success("Create success!").then((r) => {
      //alert(JSON.stringify(formatAsset, null, 2))
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post(
          `http://${process.env.REACT_APP_API_URL}:8080/assets`,
          formatAsset
        )
        .then(function (response) {
          if (response.status === 200) {
            message.success("Create Success");
            setIsDisabled(false);
            localStorage.setItem("TOP", response.data.assetCode);
            navigate("/asset");
          }
        })
        .catch(function (error) {
          setIsDisabled(false);
        });
    });
  };
  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Installed Date is required",
      },
    ],
  };

  const onFinishFailed = () => {
    message.error("Update failed!").then();
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [formCategory] = Form.useForm();
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  useEffect(() => {
    setIsDisable(true);
  }, [isDisable]);

  const checkTouched = () => {
    if (form.isFieldTouched("assetName")) {
      if (form.isFieldTouched("category")) {
        if (form.isFieldTouched("specification")) {
          if (form.isFieldTouched("installedDate")) {
            return false;
          }
        }
      }
    }
    return true;
  };
  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage Asset > Create New Asset")}
      <div className="user__list__title">Create New Asset</div>
      <div className="user__edit">
        {/* edit o day nay */}
        <Form
          colon={false}
          form={form}
          className="edit__form"
          {...layout}
          validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="create-form"
          hideRequiredMark
          initialValues={{
            state: "Available",
          }}
        >
          <Form.Item label="Asset Name" name="assetName" {...configName}>
            <Input style={{ width: "500px" }} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: "Category is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === "add") {
                    return Promise.reject(new Error("Category is required "));
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Select
              style={{ width: "500px" }}
              onChange={(value) => {
                if (value === "add") {
                  setIsVisible(true);
                }
              }}
            >
              {Array.from(category).map((c) => (
                <Select.Option value={c.name}>{c.name}</Select.Option>
              ))}
              <Select.Option value="add">Add New Category</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Specification"
            name="specification"
            rules={[
              {
                required: true,
                max: 255,
              },
            ]}
          >
            <TextArea
              style={{ width: "500px" }}
              className="input_area"
              placeholder="Enter specification"
            />
          </Form.Item>
          <Form.Item label="Installed Date" name="installedDate" {...config}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "500px" }} />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "State is required" }]}
          >
            <Radio.Group className="input_area" value="Available">
              <Radio value="Available">Available</Radio>
              <div>
                <Radio value="Not available">Not available</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <div className="button__box">
            <Form.Item shouldUpdate style={{ display: "inline-block" }}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    checkTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                  danger
                >
                  Save
                </Button>
              )}
            </Form.Item>
            <Button
              htmlType="cancel"
              style={{ marginLeft: "2rem" }}
              onClick={() => navigate("/asset")}
            >
              Cancel
            </Button>
          </div>
        </Form>

        {/*Modal*/}
        <Modal
          title="Create new category"
          centered
          visible={isVisible}
          onCancel={() => {
            formCategory.resetFields();
            form.resetFields();
            setIsVisible(false);
          }}
          onOk={() => {
            formCategory
              .validateFields()
              .then((values) => {
                let formatDataCa = {
                  name: values.name,
                  prefix: values.prefix.toUpperCase(),
                };
                axios.defaults.headers.post["Content-Type"] =
                  "application/json;charset=utf-8";
                axios.defaults.headers.post["Access-Control-Allow-Origin"] =
                  "*";
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;
                axios
                  .post(
                    `http://${process.env.REACT_APP_API_URL}:8080/category`,
                    formatDataCa
                  )
                  .then(function (response) {
                    if (response.status === 200) {
                      message.success("Create Success");
                      formCategory.resetFields();
                      form.resetFields();
                      axios
                        .get(
                          `http://${process.env.REACT_APP_API_URL}:8080/category`
                        )
                        .then((r) => {
                          setCategory(r.data);
                        });
                      setIsVisible(false);
                    }
                  })
                  .catch(function (error) {});
              })
              .catch((info) => {});
          }}
        >
          <Form form={formCategory} layout="vertical" name="form_in_modal">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  message: "Name is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !Array.from(category)
                        .map((c) => c.name)
                        .includes(value) &&
                      allLetter(
                        removeAccents(value),
                        "^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$"
                      )
                    ) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(
                          "Name already exists, please choose another one"
                        )
                      );
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prefix"
              label="Prefix"
              rules={[
                {
                  message: "Prefix is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error("Prefix is required"));
                    } else if (
                      Array.from(category)
                        .map((c) => c.prefix)
                        .includes(value)
                    ) {
                      return Promise.reject(
                        new Error(
                          "Prefix is already existed. Please enter a different prefix"
                        )
                      );
                    } else if (!allLetter(value, /^[A-Z]{2}$/)) {
                      return Promise.reject(
                        new Error(
                          "Prefix is 2 capital letters only. Please try again"
                        )
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AssetCreate;

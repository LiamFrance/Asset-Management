import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Select,
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

const validateMessages = {
  required: "${label} is required!",
};
const { TextArea } = Input;
const AssetEdit = ({ token }) => {
  const navigate = useNavigate();
  let { assetCode } = useParams();
  const [asset, setAsset] = useState({
    assetCode: "",
    assetName: " ",
    specification: "",
    installedDate: "",
    state: "",
    location: "",
    category: "",
  });

  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }
  //get asset by assetCode
  useEffect(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/assets/${assetCode}`)
      .then(function (response) {
        setAsset(response.data);
      })
      .catch(function (error) {});
  }, []);
  const [form] = Form.useForm();
  //update data to  form
  useEffect(() => {
    form.setFieldsValue({
      assetName: asset.assetName,
      specification: asset.specification,
      category: asset.category,
      state: asset.state,
      installedDate: moment(asset.installedDate),
    });
  }, [asset, form]);
  //
  const onValuesChange = ({ fieldName }) => {
    if (!asset && fieldName) {
      setAsset(fieldName);
    }
  };
  const onFinish = () => {
    let formatAsset = {
      assetCode: asset.assetCode,
      ...form.getFieldsValue(),
      installedDate: form.getFieldsValue().installedDate.format("YYYY-MM-DD"),
      location: asset.location,
    };
    message.success("Edit success!").then((r) => {
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .put(`http://${process.env.REACT_APP_API_URL}:8080/assets`, formatAsset)
        .then(function (response) {
          if (response.status === 200) {
            message.success("Edit Success");
            localStorage.setItem("TOP", assetCode);
            navigate("/asset");
          }
        })
        .catch(function (error) {});
    });
  };

  const onFinishFailed = () => {
    message.error("Update failed!").then();
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  function removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  function allLetter(string) {
    const letters = "^[a-zA-Z0-9_]+([a-zA-Z0-9_\\s-])*$";
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

  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage Asset > Edit Asset")}
      <div className="user__list__title">Edit Asset</div>
      <div className="user__edit">
        {/* edit o day nay */}
        <Form
          className="edit__form"
          colon={false}
          {...layout}
          key={asset.assetCode}
          validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="create-form"
          form={form}
          hideRequiredMark
          onValuesChange={onValuesChange}
        >
          <Form.Item label="Asset Name" name="assetName" {...configName}>
            <Input style={{ width: "500px" }} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select style={{ width: "500px" }} disabled>
              <Select.Option value="add">Add Category</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Specification"
            name="specification"
            rules={[{ required: true, max: 255 }]}
          >
            <TextArea style={{ width: "500px" }} rows={3} />
          </Form.Item>
          <Form.Item
            label="Installed Date"
            name="installedDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "500px" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Tooltip
            title={
              "assignments" in asset &&
              Object.values(asset.assignments).includes(
                "Waiting for acceptance"
              )
                ? 'Editing state is disabled due to existence of "Waiting for acceptance" assignment for this asset'
                : ""
            }
          >
            <Form.Item label="State" name="state" rules={[{ required: true }]}>
              <Radio.Group
                className="input_area"
                disabled={
                  "assignments" in asset
                    ? Object.values(asset.assignments).includes(
                        "Waiting for acceptance"
                      )
                    : false
                }
              >
                <Radio value="Available">Available</Radio>
                <div>
                  <Radio value="Not available">Not available</Radio>
                </div>

                <div>
                  <Radio value="Waiting for recycling">
                    Waiting for recycling
                  </Radio>
                </div>
                <div>
                  <Radio value="Recycled">Recycled</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Tooltip>

          <div className="button__box">
            <Button type="primary" htmlType="submit" danger>
              Save
            </Button>
            <Button
              onClick={() => navigate("/asset")}
              style={{ marginLeft: "2rem" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetEdit;

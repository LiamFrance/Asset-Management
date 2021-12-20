import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Table,
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import jwtDecode from "jwt-decode";
import moment, { now } from "moment";

const AssignmentCreate = ({ token }) => {
  //let location = jwt_decode(token).location;

  const { TextArea } = Input;
  const [isDisabledBtn, setIsDisabledBtn] = useState(false);
  const [selectedRowKeyUser, setSelectedRowKeyUser] = useState("");
  const [selectedRowKeyAsset, setSelectedRowKeyAsset] = useState("");
  const navigate = useNavigate();
  const [visibleSearchUser, setVisibleSearchUser] = useState(false);
  const [visibleSearchAsset, setVisibleSearchAsset] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [listAsset, setListAsset] = useState([]);
  const [userBackup, setUserBackup] = useState([]);
  const [assetBackup, setAssetBackup] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    fullname: "",
    username: "",
    id: "",
  });
  const [selectedAsset, setSelectedAsset] = useState({
    assetCode: "",
    asset_Name: "",
  });
  const [selectedAssetBU, setSelectedAssetBU] = useState({});
  const [selectedUserBU, setSelectedUserBU] = useState({});

  const role = jwtDecode(token).type;
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }
  // select user
  const columnsUser = [
    {
      title: "Staff Code",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => (a.id > b.id ? 1 : -1),
      },
      render: (id) => `${id}`,
      shouldCellUpdate: ({ id: current }, { id: prev }) => prev !== current,
    },
    {
      title: "Full Name",
      dataIndex: ["firstName", "lastName"],
      sorter: {
        compare: (a, b) => (a.firstName > b.firstName ? 1 : -1),
      },
      render: (text, row) => `${row["firstName"]} ${row["lastName"]} `,
      width: "55%",
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => (a.type > b.type ? 1 : -1),
    },
  ];

  // select asset
  const columnsAsset = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: {
        compare: (a, b) => (a.assetCode > b.assetCode ? 1 : -1),
      },
      render: (assetCode) => `${assetCode}`,
      shouldCellUpdate: ({ assetCode: current }, { assetCode: prev }) =>
        prev !== current,
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sorter: {
        compare: (a, b) => (a.assetName > b.assetName ? 1 : -1),
      },
      render: (assetName) => `${assetName}`,
      width: "55%",
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => (a.category > b.category ? 1 : -1),
    },
  ];

  const onFinishFailed = () => {
    message.error("Update failed!").then();
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  //get user
  useEffect(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/users`)
      .then(function (response) {
        if (response.status === 200) {
          setListUser(response.data);
          setUserBackup(response.data);
        }
      })
      .catch(function (error) {});
  }, []);

  //get Asset
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/assets?state=Available`
      )
      .then(function (response) {
        if (response.status === 200) {
          setListAsset(response.data);
          setAssetBackup(response.data);
        }
      })
      .catch(function (error) {});
  }, []);

  // search User
  const searchUser = (e) => {
    let resData = userBackup;
    let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (e.trim().length > 0 || !e.match(format)) {
      resData = Array.from(resData).filter(
        (a) =>
          a.id.toLowerCase().includes(e.trim().toLowerCase()) ||
          (a.lastName.toLowerCase() + " " + a.firstName.toLowerCase()).includes(
            e.trim().toLowerCase()
          )
      );
      if (resData.length === 0) {
        setListUser([]);
      } else {
        setListUser(resData);
      }
    } else {
      setListUser([]);
    }
  };
  //searchAsset
  const searchAsset = (e) => {
    let resData = assetBackup;
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (e.trim().length > 0 || !e.match(format)) {
      resData = Array.from(resData).filter(
        (a) =>
          a.assetCode.toLowerCase().includes(e.trim().toLowerCase()) ||
          a.assetName.toLowerCase().includes(e.trim().toLowerCase())
      );
      if (resData.length === 0) {
        setListAsset([]);
      } else {
        setListAsset(resData);
      }
    } else {
      setListUser([]);
    }
  };

  const handleSaveUser = () => {
    setVisibleSearchUser(false);
    setSelectedUserBU(selectedUser);
    form.setFieldsValue({
      user: selectedUser.fullname,
    });
  };
  const handleSaveAsset = () => {
    setVisibleSearchAsset(false);
    setSelectedAssetBU(selectedAsset);
    form.setFieldsValue({
      asset: selectedAsset.asset_Name,
    });
  };

  const selectedRowKeyUsers =
    Object.keys(selectedUser).length === 0 ? [] : [selectedUser.id];
  // set selected user
  const rowUserSelection = {
    selectedRowKeys: selectedRowKeyUsers,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeyUser(selectedRowKeys);
      setSelectedUser({
        fullname: `${selectedRows[0].firstName} ${selectedRows[0].lastName}`,
        username: `${selectedRows[0].username}`,
        id: `${selectedRows[0].id}`,
      });
    },
  };

  const selectedRowKeyAssets =
    Object.keys(selectedAsset).length === 0 ? [] : [selectedAsset.assetCode];
  //set selected asset
  const rowAssetSelection = {
    selectedRowKeys: selectedRowKeyAssets,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeyAsset(selectedRowKeys);
      setSelectedAsset({
        assetCode: `${selectedRows[0].assetCode}`,
        asset_Name: `${selectedRows[0].assetName}`,
      });
    },
  };
  const [form] = Form.useForm();
  const disabledDate = (current) => {
    return current && current < moment().add(-1, "day");
  };

  const checkTouched = () => {
    // if (isUser) {
    //   if (isAsset) {
    //     return false;
    //   }
    // }
    // return true;
    if (
      form.getFieldValue("user").length > 0 &&
      form.getFieldValue("asset").length > 0
    ) {
      return false;
    }
    return true;
  };

  //submit
  const onFinish = () => {
    setIsDisabledBtn(true);
    message.success("Submit success!").then((r) => {
      let assetCode = { assetCode: selectedAsset.assetCode };
      let formatData = {
        asset: assetCode,
        assignedTo: selectedUser.username,
        assignedBy: jwtDecode(token).sub,
        assignedDate: moment(form.getFieldValue("assignedDate")).format(
          "YYYY-MM-DD"
        ),
        text: form.getFieldValue("note"),
      };
      //alert(JSON.stringify(formatData, null, 1))
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post(
          `http://${process.env.REACT_APP_API_URL}:8080/assignments`,
          formatData
        )
        .then(function (response) {
          if (response.status === 200) {
            localStorage.setItem("TOP", response.data.id);
            message.success("Create Assignment Success");
            navigate("/assignment");
          }
        })
        .catch(function (error) {
          if (error.status === 500) {
            navigate("/server-500");
          }
        });
    });
  };
  return (
    <div className="content__box--right">
      <div className="user__list__title">Create New Assignment</div>
      <div className="assignment__form__create">
        <Form
          colon={false}
          hideRequiredMark
          initialValues={{
            asset: "",
            user: "",
            assignedDate: moment(now()),
          }}
          {...layout}
          layout="horizontal"
          //validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          autoComplete="off"
          name="create-form"
          // onValuesChange={onValuesChange}
        >
          <Form.Item>
            <Form.Item
              className="assignment__input"
              name="user"
              label="User"
              rules={[
                {
                  required: true,
                  message: "User is required",
                },
              ]}
            >
              <Search
                style={{ width: "500px" }}
                placeholder="Select User"
                allowClear
                onSearch={() => {
                  setVisibleSearchUser(true);
                }}
                readOnly
              />
            </Form.Item>

            <Form.Item
              className="assignment__input"
              name="asset"
              label="Asset"
              rules={[
                {
                  required: true,
                  message: "Asset is required",
                },
              ]}
            >
              <Search
                style={{ width: "500px" }}
                placeholder="Select Asset"
                allowClear
                onSearch={() => {
                  setVisibleSearchAsset(true);
                }}
                readOnly
              />
            </Form.Item>

            <Form.Item
              className="assignment__input"
              label="Assigned Date"
              name="assignedDate"
              rules={[{ required: true, message: "Assigned Date is required" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "500px" }}
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              className="assignment__input"
              label="Note"
              name={"note"}
              rules={[
                {
                  max: 255,
                  message: "Note should not longer than 255 characters",
                },
              ]}
            >
              <TextArea rows={3} style={{ width: "500px" }} />
            </Form.Item>
          </Form.Item>
          <div className="button__box-asm" shouldUpdate>
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
                    isDisabledBtn ||
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
              onClick={() => navigate("/assignment")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>

      {/* search user */}
      <Modal
        width={700}
        visible={visibleSearchUser}
        onCancel={() => {
          setSelectedUser(
            Object.keys(selectedUser).length > 0 ? selectedUserBU : {}
          );
          setVisibleSearchUser(false);
        }}
        footer={null}
      >
        <div className="Modal__header-asm">
          <label className="Modal__header-label">Select User</label>
          <Search
            className="Search__box-asm"
            width={100}
            placeholder=""
            allowClear
            onChange={(e) => {
              if (e.target.value === 0) {
                searchUser(e.target.value);
              } else {
                searchUser(e.target.value);
              }
            }}
          />
        </div>
        <Divider />
        <Table
          className="table__modal-asm"
          rowKey="id"
          dataSource={listUser.filter((u) => u.disable === false)}
          columns={columnsUser}
          rowSelection={{
            ...rowUserSelection,
            type: "radio",
          }}
        />
        {/* <Pagination defaultCurrent={1} total={5} /> */}

        <div className="btn__box-modal">
          <Tooltip
            title={
              selectedRowKeyUsers[0] === "" ? "Please select 1 record" : ""
            }
          >
            <Button
              disabled={selectedRowKeyUsers[0] === "" ? true : false}
              onClick={handleSaveUser}
              style={{
                backgroundColor: "#CF2338",
                color: "white",
                marginRight: 20,
                borderRadius: 5,
              }}
            >
              Save
            </Button>
          </Tooltip>
          <Button
            onClick={() => {
              setSelectedUser(
                Object.keys(selectedUser).length > 0 ? selectedUserBU : {}
              );
              setVisibleSearchUser(false);
            }}
            style={{
              backgroundColor: "#f1f1f1",
              color: "black",
              borderRadius: 5,
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* search Asset */}
      <Modal
        width={700}
        visible={visibleSearchAsset}
        onCancel={() => {
          setSelectedAsset(
            Object.keys(selectedAsset).length > 0 ? selectedAssetBU : {}
          );
          setVisibleSearchAsset(false);
        }}
        footer={null}
      >
        <div className="Modal__header-asm">
          <label className="Modal__header-label">Select Asset</label>
          <Search
            className="Search__box-asm"
            width={100}
            placeholder=""
            allowClear
            onChange={(e) => {
              if (e.target.value.length === 0) {
                searchAsset(e.target.value);
              } else {
                searchAsset(e.target.value);
              }
            }}
          />
        </div>
        <Divider />
        <Table
          className="table__modal-asm"
          rowKey="assetCode"
          columns={columnsAsset}
          dataSource={listAsset.filter((a) => a.state === "Available")}
          rowSelection={{
            type: "radio",
            ...rowAssetSelection,
          }}
        />
        <div className="btn__box-modal">
          <Tooltip
            title={
              selectedRowKeyAssets[0] === "" ? "Please select 1 record" : ""
            }
          >
            <Button
              disabled={selectedRowKeyAssets[0] === "" ? true : false}
              htmlType="submit"
              onClick={handleSaveAsset}
              style={{
                backgroundColor: "#CF2338",
                color: "white",
                marginRight: 20,
                borderRadius: 5,
              }}
            >
              Save
            </Button>
          </Tooltip>
          <Button
            onClick={() => {
              setSelectedAsset(
                Object.keys(selectedAsset).length > 0 ? selectedAssetBU : {}
              );
              setVisibleSearchAsset(false);
            }}
            style={{
              backgroundColor: "#f1f1f1",
              color: "black",
              borderRadius: 5,
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default AssignmentCreate;

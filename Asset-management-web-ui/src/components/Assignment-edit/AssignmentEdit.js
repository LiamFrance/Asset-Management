import React, { useEffect, useState } from "react";
import { Button, DatePicker, Divider, Form, Input, message, Table } from "antd";
import "antd/dist/antd.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import Search from "antd/es/input/Search";
import jwtDecode from "jwt-decode";
import moment from "moment";

const AssignmentEdit = ({ token }) => {
  //let location = jwt_decode(token).location;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [saveUser, setSaveUser] = useState(false);
  const [saveAsset, setSaveAsset] = useState(false);
  const navigate = useNavigate();
  const [visibleSearchUser, setVisibleSearchUser] = useState(false);
  const [visibleSearchAsset, setVisibleSearchAsset] = useState(false);
  const [selectedAssetBU, setSelectedAssetBU] = useState("");
  const [selectedRowKeyAsset, setSelectedRowKeyAsset] = useState("");
  const [selectedRowKeyAssetBU, setSelectedRowKeyAssetBU] = useState("");
  const [listUser, setListUser] = useState([]);
  const [listAsset, setListAsset] = useState([]);
  const [userBackup, setUserBackup] = useState([]);
  const [assetBackup, setAssetBackup] = useState([]);
  let { assignmentID } = useParams();

  const [user, setUser] = useState({});

  const [assignment, setAssignment] = useState({
    asset: {},
    assignedTo: "",
    state: "",
    assignedBy: "",
    assignedDate: "",
    text: "",
  });

  const [selectedUser, setSelectedUser] = useState({});
  const [selectedAsset, setSelectedAsset] = useState({});

  const role = jwtDecode(token).type;
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }
  const disabledDate = (current) => {
    return current && current < moment().add(-1, "day");
  };

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
  //get assignment id
  useEffect(async () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/assignments/${assignmentID}`
      )
      .then(function (response) {
        setAssignment(response.data);
        axios
          .get(
            `http://${process.env.REACT_APP_API_URL}:8080/users?username=${response.data.assignedTo}`
          )
          .then(function (r) {
            setUser(r.data[0]);
          })
          .catch(function (error) {});
      })
      .catch(function (error) {});
  }, []);

  //get user fill to table
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/users`)
      .then(function (response) {
        if (response.status === 200) {
          setListUser(response.data);
          setUserBackup(response.data);
          //setSelectedRowKeyUser(response.data.filter(a=>a.username === selectedRowKeyUser))
        }
      })
      .catch(function (error) {});
  }, []);

  //get Asset fill to table
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/assets`)
      .then(function (response) {
        if (response.status === 200) {
          setListAsset(response.data);
          setAssetBackup(response.data);
        }
      })
      .catch(function (error) {});
  }, []);

  // set value input
  useEffect(() => {
    form.setFieldsValue({
      user: `${user.firstName} ${user.lastName}`,
      asset: assignment.asset.assetName,
      assignedDate: moment(assignment.assignedDate),
      note: assignment.text,
    });
  }, [form, user]);

  const handleSave = () => {
    setVisibleSearchUser(false);
    setVisibleSearchAsset(false);
  };

  // search User
  const searchUser = (e) => {
    let resData = userBackup;
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

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
      setListUser(resData);
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
      setListAsset(resData);
    }
  };

  const selectedRowKeyUsers = [
    Object.keys(selectedUser).length === 0 ? user.id : selectedUser.id,
  ];
  // set selected user
  const rowUserSelection = {
    selectedRowKeys: selectedRowKeyUsers,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUser(selectedRows[0]);
    },
  };
  //set selected asset
  const rowAssetSelection = {
    selectedRowKeys: selectedRowKeyAsset,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeyAsset(selectedRowKeys);
      setSelectedAsset(selectedRows[0]);
    },
  };

  //submit
  const onFinish = () => {
    message.success("Submit success!").then(async (r) => {
      let abc = {
        assetCode:
          selectedAsset.assetCode === undefined
            ? assignment.asset.assetCode
            : selectedAsset.assetCode,
      };
      let formatData = {
        id: assignment.id,
        asset: abc,
        assignedTo:
          selectedUser.username === undefined
            ? user.username
            : selectedUser.username,
        assignedBy: jwtDecode(token).sub,
        assignedDate: moment(form.getFieldValue("assignedDate")).format(
          "YYYY-MM-DD"
        ),
        text: form.getFieldValue("note"),
      };
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      //alert(JSON.stringify(formatData, null, 1))
      await axios
        .put(
          `http://${process.env.REACT_APP_API_URL}:8080/assignments`,
          formatData
        )
        .then(function (response) {
          if (response.status === 200) {
            message.success("Edit Success");
            localStorage.setItem("TOP", assignmentID);
            navigate("/assignment");
          }
        })
        .catch(function (error) {
          if (500) {
            navigate("/server-500");
          }
        });
    });
  };

  //after selected user
  useEffect(() => {
    saveUser
      ? form.setFieldsValue({
          user: `${selectedUser.firstName}  ${selectedUser.firstName}`,
        })
      : form.setFieldsValue({ user: `${user.firstName} ${user.lastName} ` });
  }, [saveUser, selectedUser, form]);

  //after selected asset
  useEffect(() => {
    saveAsset
      ? form.setFieldsValue({ asset: selectedAsset.assetName })
      : form.setFieldsValue({ asset: assignment.asset.assetName });
  }, [saveAsset, selectedAsset, form]);

  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage Assignment > Edit Assignment")}
      <div className="user__list__title asm__edit__title">Edit Assignment</div>
      <div className="assignment__edit">
        <Form
          form={form}
          colon={false}
          {...layout}
          //validateMessages={validateMessages}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          hideRequiredMark
          autoComplete="off"
          name="create-form"
          // onValuesChange={onValuesChange}
        >
          <Form.Item>
            <Form.Item
              className="assignment__input"
              name="user"
              label="User"
              rules={[{ required: true, message: "User is required" }]}
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
              rules={[{ required: true, message: "Asset is required" }]}
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
              name={"assignedDate"}
              rules={[{ required: true, message: "Assigned Date is required" }]}
            >
              <DatePicker
                style={{ width: "500px" }}
                format="DD/MM/YYYY"
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
          <div className="button__box-asm">
            <Button
              className="button__box-asm-save"
              type="primary"
              htmlType="submit"
            >
              Save
            </Button>
            <Button onClick={() => navigate("/assignment")}>Cancel</Button>
          </div>
        </Form>
      </div>

      {/* search user */}
      <Modal
        width={700}
        visible={visibleSearchUser}
        onCancel={() => {
          setSelectedUser({});
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
          //a={console.log(selectedRowKeys)}
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
          <Button
            onClick={() => {
              setUser(
                Object.keys(selectedUser).length === 0 ? user : selectedUser
              );
              handleSave();
            }}
            style={{
              backgroundColor: "#CF2338",
              color: "white",
              marginRight: 20,
              borderRadius: 5,
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setSelectedUser({});
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
          setSelectedRowKeyAsset(
            Object.keys(selectedUser).length > 0 ? selectedRowKeyAssetBU : ""
          );
          setSelectedAsset(
            Object.keys(selectedAsset).length === 0
              ? assignment.asset
              : selectedUser
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
          <Button
            htmlType="submit"
            onClick={() => {
              setSelectedRowKeyAssetBU(selectedRowKeyAsset);
              setSelectedAssetBU(
                Object.keys(selectedAsset).length === 0
                  ? assignment.asset
                  : selectedAsset
              );
              setSelectedAsset(
                Object.keys(selectedAsset).length === 0
                  ? assignment.asset
                  : selectedAsset
              );
              setSaveAsset(true);
              console.log("hihi");
              handleSave();
            }}
            style={{
              backgroundColor: "#CF2338",
              color: "white",
              marginRight: 20,
              borderRadius: 10,
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setSelectedRowKeyAsset(
                Object.keys(selectedAsset).length > 0
                  ? selectedRowKeyAssetBU
                  : ""
              );
              setSelectedAsset(
                Object.keys(selectedAsset).length > 0 ? selectedAssetBU : {}
              );
              setVisibleSearchAsset(false);
            }}
            style={{
              backgroundColor: "#f1f1f1",
              color: "black",
              borderRadius: 10,
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default AssignmentEdit;

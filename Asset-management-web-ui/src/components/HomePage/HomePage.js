import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Table, Tooltip } from "antd";
import Modal from "antd/es/modal/Modal";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import moment, { now } from "moment";
import { BsArrowCounterclockwise, BsCheckLg, BsXLg } from "react-icons/all";

const HomePage = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [visibleFirstLogin, setVisibleFirstLogin] = useState(
    jwt_decode(token).firstTime
  );
  const [password, setPassword] = useState("");
  //console.log("firstTime", visibleFirstLogin);

  let [data, setData] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [visibleRequest, setVisibleReq] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModalAccept, setLoadingModalAccept] = useState(false);
  const [loadingModalDelete, setLoadingModalDelete] = useState(false);
  const [selecting, setSelecting] = useState({
    asset: {},
  });
  const [assignment, setAssignment] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [checked, setChecked] = useState(true);

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: {
        compare: (a, b) => (a.asset.assetCode > b.asset.assetCode ? 1 : -1),
      },
      width: "12%",
      render: (assetCode, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {record.asset.assetCode}
        </p>
      ),
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sorter: {
        compare: (a, b) => (a.asset.assetName > b.asset.assetName ? 1 : -1),
      },
      render: (assetName, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {record.asset.assetName}
        </p>
      ),
      width: "20%",
    },
    {
      title: "Assigned to",
      dataIndex: "assignedTo",
      sorter: (a, b) => (a.assignedTo > b.assignedTo ? 1 : -1),
      width: "13%",
      render: (assignedTo, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {assignedTo}
        </p>
      ),
    },
    {
      title: "Assigned by",
      dataIndex: "assignedBy",
      sorter: (a, b) => (a.assignedBy > b.assignedBy ? 1 : -1),
      width: "13%",
      render: (assignedBy, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {assignedBy}
        </p>
      ),
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      sorter: {
        compare: (a, b) => new Date(a.assignedDate) - new Date(b.assignedDate),
        multiple: 1,
      },
      width: "13%",
      render: (assignedDate, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {assignedDate}
        </p>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: (a, b) => (a.state > b.state ? 1 : -1),
      render: (state, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {state}
        </p>
      ),
    },
    {
      key: "action",
      width: "3%",
      render: (index, record) => (
        <span>
          <Space size="middle">
            <Button
              type="text"
              disabled={
                record.state === "Waiting for acceptance" ? false : true
              }
              onClick={() => {
                showModalAccept(record);
              }}
            >
              <BsCheckLg
                style={{
                  fontSize: 17,
                  color: `${
                    record.state === "Waiting for acceptance"
                      ? "red"
                      : "#777777"
                  }`,
                }}
              />
            </Button>
            <Button
              type="text"
              disabled={
                record.state === "Waiting for acceptance" ? false : true
              }
            >
              <BsXLg
                style={{ color: "#333333", fontWeight: "bold", fontSize: 17 }}
                onClick={() => {
                  showModalDeclined(record);
                }}
              />
            </Button>
            <Tooltip
              title={
                Object.values(record.returns).includes("Waiting for returning")
                  ? "There's pending request of returning for this assignment"
                  : ""
              }
            >
              <Button
                type="text"
                disabled={
                  record.state === "Accepted" &&
                  !Object.values(record.returns).includes(
                    "Waiting for returning"
                  )
                    ? false
                    : true
                }
              >
                <BsArrowCounterclockwise
                  style={{
                    color: record.state === "Accepted" ? "#0b53e5" : "#777777",
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                  onClick={() => {
                    showModalRequest(record);
                  }}
                />
              </Button>
            </Tooltip>
          </Space>
        </span>
      ),
    },
  ];
  const showModalAccept = (record) => {
    // console.log("r", record);
    setSelecting(record);
    setLoadingModalAccept(true);
  };
  const showModalDeclined = (record) => {
    setSelecting(record);
    setLoadingModalDelete(true);
  };

  const loadData = useCallback(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/my-info`)
      .then((data) => {
        console.log("data", data.data);
        setData(data.data);
        setAssignment(data.data.assignments);
        setLoading(false);
        setPagination({
          total: data.totalCount,
        });
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          navigate("/server-500");
        } else if (error.response.status === 401) {
          navigate("/unauthorized");
        }
      });
  }, []);
  const clickColumn = (record) => {
    // console.log("record", record.asset);
    setSelecting(record);
    setVisibleDetail(true);
  };

  useEffect(async () => {
    await loadData();
  }, [loadData]);
  const handleOk = () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .put(
        `http://${process.env.REACT_APP_API_URL}:8080/assignments/${selecting.id}?state=Accepted`
      )
      .then(function (response) {
        if (response.status === 200) {
          message.success("Accepted Success");
          window.location.reload();
          setLoadingModalAccept(false);
        }
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const handleCancel = () => {
    setLoadingModalAccept(false);
  };

  const declinedMyAssignment = () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .put(
        `http://${process.env.REACT_APP_API_URL}:8080/assignments/${selecting.id}?state=Declined`
      )
      .then(function (response) {
        if (response.status === 200) {
          message.success("Declined Success");
          window.location.reload();
          setLoadingModalDelete(false);
        }
      })
      .catch(function (error) {
        //console.log(error);
      });
  };
  const showModalRequest = (record) => {
    setVisibleReq(true);
    setSelecting(record);
  };

  const handleCreateRequest = (record) => {
    let assId = { id: selecting.id };
    let formatData = {
      assignment: assId,
    };
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .post(`http://${process.env.REACT_APP_API_URL}:8080/returns`, formatData)
      .then(function (response) {
        console.log("hihi");
        message.success("Create New Request Success");
        window.location.reload();
      })
      .catch(function (error) {
        //console.log(error);
      });
    setVisibleReq(false);
  };
  const [form] = Form.useForm();
  return (
    <div>
      {localStorage.getItem("loading")
        ? `${window.location.reload()} ${localStorage.removeItem("loading")}`
        : ""}

      <div className="content__box--right">
        <div className="user__list__top">My Assignment</div>
        <div className="user__list__features"></div>
        <Table
          // scroll={{ x: 'calc(700px + 50%)', y: 240 }}
          className="homeList__table"
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={assignment.filter(
            (a) =>
              moment(a.assignedDate).isSameOrBefore(moment(now())) &&
              a.state !== "Declined" &&
              a.state !== "Completed"
          )}
          pagination={pagination}
          loading={loading}
        />

        <Modal
          visible={loadingModalAccept}
          className="Modal__disable-user"
          title="Are you sure?"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
              style={{ backgroundColor: "#CF2338", color: "white" }}
            >
              Accept
            </Button>,
            <Button
              key="back"
              onClick={handleCancel}
              className="Modal__logout__btn-cancel"
            >
              Cancel
            </Button>,
          ]}
        >
          <p>Do you want to accept this assignment?</p>
        </Modal>
        {/* edit o day nay */}
        <Modal
          visible={loadingModalDelete}
          title="Are you sure?"
          className="Modal__disable-user"
          onCancel={() => setLoadingModalDelete(false)}
          onOk={declinedMyAssignment}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={declinedMyAssignment}
              style={{ backgroundColor: "#CF2338", color: "white" }}
            >
              Decline
            </Button>,
            <Button
              className="Modal__logout__btn-cancel"
              key="back"
              onClick={() => setLoadingModalDelete(false)}
            >
              Cancel
            </Button>,
          ]}
        >
          <p>Do you want to decline this assignment?</p>
        </Modal>
      </div>

      <Modal
        //a={console.log("checked",checked)}
        className="Modal__style"
        title="Change password"
        visible={visibleFirstLogin}
        footer={[
          <Button
            disabled={checked}
            style={{ borderRadius: 5 }}
            onClick={() => {
              if (checked === false) {
                let formatData = { newPassword: password };
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;
                axios
                  .put(
                    `http://${process.env.REACT_APP_API_URL}:8080/users/cpwd`,
                    formatData
                  )
                  .then((response) => {
                    if (response.status === 200) {
                      setVisibleFirstLogin(false);
                      localStorage.removeItem("TOKEN");
                      window.location.replace("/login");
                    }
                  });
              } else {
                message.error("Submit failed");
              }
            }}
          >
            Save
          </Button>,
          <Button
            style={{ borderRadius: 5 }}
            onClick={() => {
              localStorage.clear();
              setToken(null);
              navigate("/login");
            }}
          >
            Logout
          </Button>,
        ]}
      >
        <div className="repassword__content">
          <div className="repassword__desc">
            <p style={{ fontSize: 14.5 }}>
              This is the first time you logged in.
            </p>
            <p style={{ fontSize: 14.5 }}>
              You have to change your password to continue.
            </p>
          </div>
          <div className="repassword__input">
            <span style={{ width: 200, marginTop: 20 }}>New password</span>
            <Form form={form}>
              <Form.Item
                name="newPw"
                rules={[
                  {
                    message: "Please enter password for first time login",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      let pattern = /\s/g;
                      let format =
                        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!<>()*]).{8,}$";
                      if (!value.match(format)) {
                        setChecked(true);
                        return Promise.reject(
                          new Error(
                            "Password should be 8-characters minimum, including upper/lowercase, digit and special character."
                          )
                        );
                      } else if (pattern.test(value)) {
                        // console.log("hh");
                        setChecked(true);
                        return Promise.reject(
                          new Error("Password cannot have space")
                        );
                      } else {
                        setChecked(false);
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="input password"
                  style={{ width: 200, marginTop: 10 }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      {/*Modal detail*/}
      <Modal
        // edited here
        className="Modal__Detail-asm"
        title="Detailed Assignment Information"
        visible={visibleDetail}
        footer={null}
        onCancel={() => {
          setVisibleDetail(false);
        }}
      >
        <div>
          <div className="row">
            <div className="asm-detail">
              <div className="asm-detail-row">
                <span style={{ marginRight: 37 }}>Asset Code</span>
                <span>{selecting.asset.assetCode}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 32 }}>Asset Name</span>
                <span>{selecting.asset.assetName}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 27 }}>Specification</span>
                <span>{selecting.asset.specification}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 33 }}>Assigned to</span>
                <span>{selecting.assignedTo}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 32 }}>Assigned by</span>
                <span>{selecting.assignedBy}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 19 }}>Assigned Date</span>
                <span>{selecting.assignedDate}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 77 }}>State</span>
                <span>{selecting.state}</span>
              </div>
              <div className="asm-detail-row">
                <span style={{ marginRight: 76 }}>Note</span>
                <span>{selecting.text}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* modal request return */}
      <Modal
        visible={visibleRequest}
        className="Modal__disable-user"
        title="Are you sure?"
        onCancel={() => setVisibleReq(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={(record) => handleCreateRequest(record)}
            style={{ backgroundColor: "#CF2338", color: "white" }}
          >
            Yes
          </Button>,
          <Button
            key="back"
            onClick={() => setVisibleReq(false)}
            className="Modal__logout__btn-cancel"
          >
            No
          </Button>,
        ]}
      >
        <p>Do you want to create returning request for this asset? </p>
      </Modal>
      {/* modal pending request of returning */}
    </div>
  );
};

export default HomePage;

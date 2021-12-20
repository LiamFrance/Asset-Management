import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
  Button,
  DatePicker,
  message,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import Modal from "antd/es/modal/Modal";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  BsArrowCounterclockwise,
  BsPencilFill,
  BsXCircle,
} from "react-icons/all";

const { Option } = Select;
const AssignmentList = ({ token }) => {
    const navigate = useNavigate()
  //state's list
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleRequest, setVisibleReq] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [textDate, setTextDate] = useState("");
  const [textState, setTextState] = useState("");
  const [visibleDisable, setVisibleDisable] = useState(false);
  const [isDetailAss, setIsDetailAss] = useState(false);
  const [visiblePending, setVisiblePending] = useState(false);
  const [selecting, setSelecting] = useState({
    asset: {},
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    onChange: (page, pageSize) => {
      setPagination({ ...pagination, current: page, pageSize: pageSize });
    },
  });

  //Authorization
  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }

  //Get filtered data
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/assignments?state=${textState}&assignedDate=${textDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        let dataAfterUpdate = r.data;
        if (localStorage.getItem("TOP") !== null) {
          dataAfterUpdate = [
            ...r.data.filter(
              (u) => u.id.toString() === localStorage.getItem("TOP")
            ),
            ...r.data.filter(
              (u) => u.id.toString() !== localStorage.getItem("TOP")
            ),
          ];
        }
        setData(dataAfterUpdate);
        setLoading(false);
        setPagination({ ...pagination, total: r.totalCount, current: 1 });
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          navigate("/server-500");
        } else if (error.response.status === 401) {
          navigate("/unauthorized");
        }
      });
  }, [textState, textDate]);

  //set paging =1 when search
  useEffect(() => {
    setPagination({
      current: 1,
    });
  }, [textState, textDate]);
  //show delete assignment's modal
  const showModal = (record) => {
    setVisible(true);
    setSelecting(record);
  };

  //Handle refresh page event
  window.onbeforeunload = function () {
    localStorage.removeItem("TOP");
    this.onunload();
    return "";
  }.bind(this);

  //show assignment's detail
  const clickColumn = (record) => {
    setSelecting(record);
    setIsDetailAss(true);
  };

  //send delete assignment req
  const handleOk = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .delete(
        `http://${process.env.REACT_APP_API_URL}:8080/assignments/${selecting.id}`
      )
      .then(function (response) {
        if (response.status === 200) {
          message.success("Deleted Success");
          window.location.reload();
        }
      })
      .catch(function (error) {});
  };

  const handleCancel = () => {
    setVisible(false);
  };
  //handle search
  const onSearch = (inputData) => {
    return inputData.filter(
      (u) =>
        u.asset.assetName
          .toLowerCase()
          .includes(searchText.trim().toLowerCase()) ||
        u.asset.assetCode
          .toLowerCase()
          .includes(searchText.trim().toLowerCase()) ||
        u.assignedTo.toLowerCase().includes(searchText.trim().toLowerCase())
    );
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => (a.id > b.id ? 1 : -1),
      },
      render: (id, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {id}
        </p>
      ),
    },
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: {
        compare: (a, b) => (a.asset.assetCode > b.asset.assetCode ? 1 : -1),
      },
      width: "20%",
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
      width: "20%",
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
      width: "20%",
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
      width: "20%",
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
      render: (record) => (
        <span>
          <Space size="middle">
            <Button
              type="text"
              disabled={
                record.state === "Waiting for acceptance" ? false : true
              }
            >
              <Link to={`/edit-assignment/${record.id}`}>
                {" "}
                <BsPencilFill style={{ fontSize: 17 }} />
              </Link>
            </Button>
            <Button
              type="text"
              disabled={record.state === "Accepted" ? true : false}
            >
              <BsXCircle
                style={{
                  fontSize: 17,
                  color: record.state === "Accepted" ? "#777777" : "#CF2338",
                }}
                onClick={() => {
                  showModal(record);
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
                    fontSize: "x-large",
                    color:
                      record.state === "Accepted" &&
                      !Object.values(record.returns).includes(
                        "Waiting for returning"
                      )
                        ? "#43A4FF"
                        : "#777777",
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
  const showModalRequest = (record) => {
    setVisibleReq(true);
    setSelecting(record);
  };
  const handleCreateRequest = () => {
    let assignment = { id: selecting.id };
    let formatData = {
      assignment: assignment,
    };

    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .post(`http://${process.env.REACT_APP_API_URL}:8080/returns`, formatData)
      .then(function (response) {
        if (response.data !== "") {
          message.success("Create New Request Success");
          window.location.reload();
        }
      })
      .catch(function (error) {});
    setVisibleReq(false);
  };
  return (
    <div className="content__box--right">
      <div className="user__list__top">Assignment List</div>
      <div className="user__list__features">
        <div className="filter__box">
          <Select
            className="user__filter__input"
            defaultValue=""
            style={{ width: 200 }}
            onChange={(value) => {
              setTextState(value);
            }}
          >
            <Option value="">State</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Waiting for acceptance">
              Waiting for acceptance
            </Option>
            <Option value="Declined">Declined</Option>
          </Select>
        </div>
        <div className="filter__box">
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: 200 }}
            placeholder="Assigned Date"
            onChange={(value) => {
              const formattedValue =
                value !== null ? moment(value).format("DD/MM/YYYY") : "";
              setTextDate(formattedValue);
            }}
          />
        </div>
        <div className="search__create__box">
          <div className="search__box">
            <Search
              placeholder="input search text"
              allowClear
              onChange={(e) => {
                setPagination({ ...pagination, current: 1 });
                setSearchText(e.target.value);
              }}
            />
          </div>
          <Link to="/create-assignment">
            <button className="user__list__features--create">
              Create new Assignment
            </button>
          </Link>
        </div>
      </div>
      <Table
        className="asmList__table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={onSearch(
          data.filter((a) => a.state !== "Deleted" && a.state !== "Completed")
        )}
        pagination={pagination}
        loading={loading}
      />
      {/* Modal show detail */}
      <Modal
        // edited here
        className="Modal__Detail-asm"
        title="Detailed Assignment Information"
        visible={isDetailAss}
        footer={null}
        onCancel={() => {
          setIsDetailAss(false);
        }}
      >
          <div>
              <div className="row">
                  <div className="asm-detail">
                      <div className="asm-detail-row">
                          <span style={{marginRight:37}}>Asset Code</span>
                          <span >{selecting.asset.assetCode}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:32}}>Asset Name</span>
                          <span >{selecting.asset.assetName}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:27}}>Specification</span>
                          <span >{selecting.asset.specification}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:33}}>Assigned to</span>
                          <span >{selecting.assignedTo}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:32}}>Assigned by</span>
                          <span >{selecting.assignedBy}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:19}}>Assigned Date</span>
                          <span >{selecting.assignedDate}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:77}}>State</span>
                          <span >{selecting.state}</span>
                      </div>
                      <div className="asm-detail-row">
                          <span style={{marginRight:76}}>Note</span>
                          <span >{selecting.text}</span>
                      </div>
                  </div>
              </div>
          </div>
      </Modal>

      {/* modal delete */}
      {/* edit o day nay */}
      <Modal
        visible={visible}
        className="Modal__disable-user"
        title="Are you sure?"
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => handleOk()}
            style={{ backgroundColor: "#CF2338", color: "white" }}
          >
            Delete
          </Button>,
          <Button
            key="back"
            onClick={() => handleCancel()}
            className="Modal__logout__btn-cancel"
          >
            Cancel
          </Button>,
        ]}
      >
        <p>Do you want to delete this assignment? </p>
      </Modal>

      <Modal
        width={400}
        title="Cannot Delete Assignment"
        visible={visibleDisable}
        onCancel={() => {
          setVisibleDisable(false);
        }}
        footer={null}
      >
        <p>Cannot delete the asset because it belongs to one or</p>
        <p>more historical assignments.</p>
        <p>If the asset is not able to be used anymore, please</p>
        <p>
          update it state in{" "}
          <a
            href={`/edit-asset/${selecting.assetCode}`}
            style={{ textDecoration: "underline" }}
          >
            Edit Asset Page
          </a>
        </p>
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
      <Modal
        width={400}
        title="Cannot create request of returning for this assignment"
        visible={visiblePending}
        onCancel={() => {
          setVisiblePending(false);
        }}
        footer={null}
      >
        <p>Cannot create request of returning for this assignment</p>
        <p>because there's some pending request for it already.</p>
        <p>If the asset is not able to be used anymore, please</p>
        <p>
          check it in{" "}
          <a href={`/request_return`} style={{ textDecoration: "underline" }}>
            Request of Returning page.
          </a>
        </p>
      </Modal>
    </div>
  );
};
export default AssignmentList;

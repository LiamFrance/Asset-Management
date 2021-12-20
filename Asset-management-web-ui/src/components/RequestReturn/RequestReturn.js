import React from "react";
import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Button, DatePicker, message, Select, Space, Table } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import Modal from "antd/es/modal/Modal";
import axios from "axios";
import moment from "moment";
import {BsCheckLg, BsXLg} from "react-icons/all";
import {useNavigate} from "react-router-dom";

const RequestReturn = ({ token }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visibleDisable, setVisibleDisable] = useState(false);
  const [visibleTickIcon, setVisibleTickIcon] = useState(false);
  const [selecting, setSelecting] = useState({});
  const [searchText, setSearchText] = useState("");
  const [textDate, setTextDate] = useState("");
  const [textState, setTextState] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    onChange: (page, pageSize) => {
      setPagination({ ...pagination, current: page, pageSize: pageSize });
    },
  });
  const { Option } = Select;
  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }

  //get data
  useEffect(() => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/returns?state=${textState}&returnedDate=${textDate}`
      )
      .then(function (response) {
        setData(response.data);
        setLoading(false);
        setPagination({
          ...pagination,
          total: response.totalCount,
          current: 1,
        });
      })
      .catch(function (error) {
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
  }, [textDate, textState]);
  //handle search
  const onSearchReq = (inputData) => {
    return inputData.filter(
      (r) =>
        (r.requestedBy
          .toLowerCase()
          .includes(searchText.trim().toLowerCase()) ||
          r.assignment.asset.assetCode
            .toLowerCase()
            .includes(searchText.trim().toLowerCase()) ||
          r.assignment.asset.assetName
            .toLowerCase()
            .includes(searchText.trim().toLowerCase())) &&
        r.state !== "Cancelled"
    );
  };
  //check role
  if (role !== "ROLE_ADMIN")
    return (
      <div>
        You're {role.toLowerCase().substring(5)}, You are not allowed here!
      </div>
    );

  //columns data table
  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => (a.id > b.id ? 1 : -1),
      },
      render: (id, record) => <p>{record.id}</p>,
    },
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: {
        compare: (a, b) => (a.assetCode > b.assetCode ? 1 : -1),
      },
      width: "15%",
      render: (assetCode, record) => <p>{record.assignment.asset.assetCode}</p>,
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sorter: {
        compare: (a, b) => (a.assetName > b.assetName ? 1 : -1),
      },
      render: (assetName, record) => <p>{record.assignment.asset.assetName}</p>,
      width: "15%",
    },
    {
      title: "Requested by",
      dataIndex: "requestedBy",
      sorter: (a, b) => (a.requestedBy > b.requestedBy ? 1 : -1),
      width: "15%",
      render: (requestedBy, record) => <p>{record.requestedBy}</p>,
    },

    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      sorter: {
        compare: (a, b) =>
            new Date(a.assignment.assignedDate) -
            new Date(b.assignment.assignedDate),
      },
      width: "15%",
      render: (assignedDate, record) => <p>{record.assignment.assignedDate}</p>,
    },
    {
      title: "Accepted by",
      dataIndex: "acceptedBy",
      sorter: (a, b) => (a.acceptedBy > b.acceptedBy ? 1 : -1),
      width: "15%",
      render: (acceptedBy, record) => <p>{record.acceptedBy}</p>,
    },
    {
      title: "Returned Date",
      dataIndex: "returnedDate",
      sorter: {
        compare: (a, b) => new Date(a.returnedDate) - new Date(b.returnedDate),
      },
      width: "15%",
      render: (returnedDate, record) => <p>{returnedDate}</p>,
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: (a, b) => (a.state > b.state ? 1 : -1),
      width: "20%",
      render: (state, record) => <p>{record.state}</p>,
    },
    {
      key: "action",
      render: (record) => (
          <span>
          <Space size="small">
            <Button
                type="text"
                disabled={record.state === "Waiting for returning" ? false : true}
                onClick={() => showModalTickIcon(record)}
            >
              <BsCheckLg style={{color: record.state === "Waiting for returning" ? "#cf2338" : "#777777", border: "none"}}/>
            </Button>
            <Button
                type="text"
                disabled={record.state === "Waiting for returning" ? false : true}
                onClick={() => showModalCloseIcon(record)}
            >
              <BsXLg style={{color: record.state === "Waiting for returning" ? "#000" : "#777777", border: "none"}}/>
            </Button>
          </Space>
        </span>
      ),
    },
  ];
  //when completed req
  const showModalTickIcon = (record) => {
    setSelecting(record);
    setVisibleTickIcon(true);
  };
  //when cancel req
  const showModalCloseIcon = (record) => {
    setSelecting(record);
    setVisibleDisable(true);
  };
  //cancel modal
  const handleCancel = () => {
    setVisibleDisable(false);
  };
  // cancel req
  const handleCancelReq = () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .put(
        `http://${process.env.REACT_APP_API_URL}:8080/returns/${selecting.id}?action=cancel`
      )
      .then(function (response) {
        message.success("Cancel Request Success !");
        window.location.replace("/request_return");
      })
      .catch(function (error) {});
  };
  //completed req
  const handleCompletedReq = () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .put(
        `http://${process.env.REACT_APP_API_URL}:8080/returns/${selecting.id}?action=complete`
      )
      .then(function (response) {
        message.success("Completed Request Success !");
        window.location.replace("/request_return");
      })
      .catch(function (error) {});
  };
  return (
    <div className="content__box--right">
      <div className="user__list__top">Request List</div>
      <div className="user__list__features">
        <div className="user__list__features--left">
          <div className="filter__box" style={{ marginRight: 20 }}>
            <Select
              className="user__filter__input"
              defaultValue=""
              style={{ width: 200 }}
              onChange={(value) => {
                setTextState(value);
              }}
            >
              <Option value="">State</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Waiting for returning">
                Waiting for returning
              </Option>
            </Select>
          </div>
          <div className="filter__box">
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: 200 }}
              placeholder="Returned Date"
              onChange={(value) => {
                const formattedValue =
                  value !== null ? moment(value).format("YYYY-MM-DD") : "";
                setTextDate(formattedValue);
              }}
            />
          </div>
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
        </div>
      </div>
      <Table
      className="reqList__table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={onSearchReq(data)}
        // dataSource={data.filter(
        //   (a) =>
        //     a.state !== "Deleted" &&
        //     moment(a.assignedDate).format("YYYY-MM-DD") <=
        //       moment().format("YYYY-MM-DD")
        // )}
        pagination={pagination}
        loading={loading}
      />
      {/* modal disable */}
      <Modal
        visible={visibleDisable}
        className="Modal__disable-user"
        title="Are you sure?"
        onOk={() => handleCancelReq()}
        onCancel={() => handleCancel()}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => handleCancelReq()}
            style={{ backgroundColor: "#CF2338", color: "white" }}
          >
            Yes
          </Button>,
          <Button
            key="back"
            onClick={() => handleCancel()}
            className="Modal__logout__btn-cancel"
          >
            No
          </Button>,
        ]}
      >
        <p>Do you want to cancel this returning request? </p>
      </Modal>
      {/* modal ticky */}
      <Modal
        visible={visibleTickIcon}
        className="Modal__disable-user"
        title="Are you sure?"
        onCancel={() => setVisibleTickIcon(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => handleCompletedReq()}
            style={{ backgroundColor: "#CF2338", color: "white" }}
          >
            Yes
          </Button>,
          <Button
            key="back"
            onClick={() => setVisibleTickIcon(false)}
            className="Modal__logout__btn-cancel"
          >
            No
          </Button>,
        ]}
      >
        <p>Do you want to mark this returning request as Completed? </p>
      </Modal>
    </div>
  );
};

export default RequestReturn;

import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, message, Select, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import Modal from "antd/es/modal/Modal";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserList.css";
import moment from "moment";

import jwt_decode from "jwt-decode";
import {BsPencilFill, BsXCircle} from "react-icons/all";

const { Option } = Select;
const UserList = ({ token }) => {
  //State's list
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selecting, setSelecting] = useState({});
  const [isDisableUser, setIsDisableUser] = useState(false);
  const [textFilter, setTextFilter] = useState("");
  const [searchText, setSearchText] = useState("");
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
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/users?type=${textFilter}`,
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
            ...r.data.filter((u) => u.id === localStorage.getItem("TOP")),
            ...r.data.filter((u) => u.id !== localStorage.getItem("TOP")),
          ];
        }
        setLoading(false);
        setData(dataAfterUpdate);
        setPagination({ ...pagination, total: r.totalCount, current: 1 });
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          navigate("/server-500");
        } else if (error.response.status === 401) {
          navigate("/unauthorized");
        }
      });
  }, [textFilter]);

  //Show user's detail
  const clickColumn = (record) => {
    setSelecting(record);
    setVisibleDetail(true);
  };

  //Show disable user confirmation's modal
  const showModal = (record) => {
    setVisible(true);
    setSelecting(record);
  };

  //Send disable user req
  const handleOk = () => {
    setVisible(false);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .delete(
        `http://${process.env.REACT_APP_API_URL}:8080/users/${selecting.id}`
      )
      .then(function (response) {
        if (response.status === 200) {
          message.success("Disable Success");
          window.location.reload(true);
        }
      })
      .catch(function (error) {});
  };

  //Click cancel on disable user modal
  const handleCancel = () => {
    setVisible(false);
  };

  //set paging =1 when search

  //Filter data by search input
  const onSearch = (data) => {
    return data.filter(
      (u) =>
        (u.firstName.toLowerCase() + " " + u.lastName.toLowerCase()).includes(
          searchText.trim().toLowerCase()
        ) || u.id.toLowerCase().includes(searchText.trim().toLowerCase())
    );
  };

  //Handle refresh page event
  window.onbeforeunload = function () {
    localStorage.removeItem("TOP");
    this.onunload();
    return "";
  }.bind(this);

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => (a.id > b.id ? 1 : -1),
        multiple: 4,
      },
      render: (staffCode, record) => (
          <p
              onClick={() => {
                clickColumn(record);
              }}
          >
            {staffCode}
          </p>
      ),
      width: "20%",
    },
    {
      title: "Full Name",
      dataIndex: ["firstName", "lastName"],
      sorter: {
        compare: (a, b) => (a.firstName > b.firstName ? 1 : -1),
        multiple: 3,
      },
      render: (text, row) => (
          <p onClick={() => clickColumn(row)}>
            {row["firstName"]} {row["lastName"]}
          </p>
      ),
      width: "20%",
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: {
        compare: (a, b) => (a.username > b.username ? 1 : -1),
        multiple: 2,
      },
      render: (index, record) => (
          <p onClick={() => clickColumn(record)}>{index}</p>
      ),
      width: "20%",
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      sorter: {
        compare: (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
        multiple: 1,
      },
      render: (joinedDate, record) => (
          <p onClick={() => clickColumn(record)}>
            {moment(joinedDate).format("DD/MM/YYYY")}
          </p>
      ),
      width: "20%",
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: {
        compare: (a, b) => (a.type > b.type ? 1 : -1),
      },
      render: (value, record) => (
          <p onClick={() => clickColumn(record)}>{value}</p>
      ),
    },
    {
      key: "action",
      fixed: "right",
      render: (index, record) => (
          <Space size="middle">
            <Link to={`/edit-user/${record.id}`}>
              <BsPencilFill style={{color: "#333333",fontSize:17}}/>
            </Link>
            <Button type="text"
                    onClick={() => {
                      if (record.assignments.length !== 0) {
                        setIsDisableUser(true);
                      } else {
                        showModal(record);
                      }
                    }}
            >
              <BsXCircle
                  style={{color: "#CF2338",fontSize:17}}
              />
            </Button>
          </Space>
      ),
    },
  ];

  return (
    <div className="content__box--right">
      <div className="user__list__top">User List</div>
      <div className="user__list__features">
        <div className="filter__box">
          <Select
            className="user__filter__input"
            defaultValue=""
            style={{ width: 120 }}
            onChange={(value) => {
              setTextFilter(value);
            }}
          >
            <Option value="">Type</Option>
            <Option value="staff">Staff</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </div>
        <div className="search__create__box">
          <div className="search__box">
            <Search
              className="search_box"
              defaultValue={searchText}
              placeholder="input search text"
              onChange={(e) => {
                setPagination({ ...pagination, current: 1 });
                setSearchText(e.target.value);
              }}
            />
          </div>
          <Link to="/create-user">
            <button className="user__list__features--create">
              Create new user
            </button>
          </Link>
        </div>
      </div>
      <Table
      className="userList__table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={onSearch(data.filter((a) => a.disable === false))}
        pagination={pagination}
        loading={loading}
      />
      {/*Modal*/}
      <Modal
        className="Modal__disable-user"
        visible={visible}
        title="Are you sure?"
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        footer={[
          <div className="footer">
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => handleOk()}
              style={{ backgroundColor: "#CF2338", color: "white" }}
            >
              Disable
            </Button>
            ,
            <Button
              key="back"
              style={{
                backgroundColor: "white",
                color: "black",
                border: "2px solid gray",
              }}
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </div>,
        ]}
      >
        <p>Do you want to disable this user?</p>
      </Modal>

      {/*Modal Detail*/}

      <Modal
        width={911}
        visible={visibleDetail}
        title="User Detail"
        onCancel={() => setVisibleDetail(false)}
        footer={null}
      >
        <table className="styled-table">
          <thead>
            <tr>
              <th>Staff Code</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Username</th>
              <th>Date of birth</th>
              <th>Joined Date</th>
              <th>Location</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="active-row">
              <td>{selecting.id}</td>
              <td>{selecting.firstName}</td>
              <td>{selecting.lastName}</td>
              <td>{selecting.gender}</td>
              <td>{selecting.username}</td>
              <td>{moment(selecting.dob).format("DD/MM/YYYY")}</td>
              <td>{moment(selecting.joinedDate).format("DD/MM/YYYY")}</td>
              <td>{selecting.location}</td>
              <td>{selecting.type}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
      {/*Modal cannot disable user*/}
      <Modal
        className="Modal__Detail-asm"
        styleTitle={{ color: "red" }}
        width={500}
        title="Can not disable user"
        visible={isDisableUser}
        onCancel={() => {
          setIsDisableUser(false);
        }}
        footer={null}
      >
        <p>There are valid assignments belonging to this user.</p>
        <p>Please close all assignments before disabling user.</p>
      </Modal>
    </div>
  );
};
export default UserList;

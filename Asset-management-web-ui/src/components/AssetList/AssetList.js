import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, message, Select, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import Modal from "antd/es/modal/Modal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BsPencilFill, BsXCircle } from "react-icons/all";

const { Option } = Select;
const AssetList = ({ token }) => {
  const navigate = useNavigate();
  //state's list
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [textCate, setTextCate] = useState("");
  const [textState, setTextState] = useState("");
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleDisable, setVisibleDisable] = useState(false);
  const [selecting, setSelecting] = useState({});
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

  //Get category
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/category`)
      .then((r) => {
        if (r.status === 200) {
          setCategory(r.data);
        }
      });
  }, []);

  //Get filtered data
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://${process.env.REACT_APP_API_URL}:8080/assets?state=${textState}&category=${textCate}`,
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
              (u) => u.assetCode === localStorage.getItem("TOP")
            ),
            ...r.data.filter(
              (u) => u.assetCode !== localStorage.getItem("TOP")
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
  }, [textCate, textState]);

  //Handle refresh page event
  window.onbeforeunload = function () {
    localStorage.removeItem("TOP");
    this.onunload();
    return "";
  }.bind(this);

  //Handle onClick delete icon event
  const showModal = (record) => {
    setSelecting(record);
    if (Object.keys(record.assignments).length === 0) {
      setVisible(true);
    } else {
      showModalDeleteAsset();
    }
  };

  //Show asset's detail
  const clickColumn = (record) => {
    setVisibleDetail(true);
    setSelecting(record);
  };

  //Send delete asset req
  const handleOk = () => {
    setVisible(false);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .delete(
        `http://${process.env.REACT_APP_API_URL}:8080/assets/${selecting.assetCode}`
      )
      .then(function (response) {
        if (response.status === 200) {
          message.success("Delete Success");
          window.location.reload();
        }
      })
      .catch(function (error) {});
  };

  const handleCancel = () => {
    setVisible(false);
  };

  //Handle search
  const onSearch = () => {
    return data.filter(
      (u) =>
        u.assetName.toLowerCase().includes(searchText.trim().toLowerCase()) ||
        u.assetCode.toLowerCase().includes(searchText.trim().toLowerCase())
    );
  };

  const showModalDeleteAsset = () => {
    setVisibleDisable(true);
  };

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: {
        compare: (a, b) => (a.id > b.id ? 1 : -1),
      },
      render: (assetCode, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {assetCode}
        </p>
      ),
      width: "13%",
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sorter: {
        compare: (a, b) => (a.assetName > b.assetName ? 1 : -1),
      },
      render: (assetName, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {assetName}
        </p>
      ),
      width: "20%",
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => (a.category > b.category ? 1 : -1),
      render: (category, record) => (
        <p
          onClick={() => {
            clickColumn(record);
          }}
        >
          {category}
        </p>
      ),
      width: "15%",
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
      width: "15%",
    },
    {
      key: "action",
      width: "5%",
      render: (record) => (
        <span>
          <Space size="middle">
            <Button
              type="text"
              disabled={record.state === "Assigned" ? true : false}
            >
              <Link to={`/edit-asset/${record.assetCode}`}>
                {" "}
                <BsPencilFill
                  style={{
                    color: record.state === "Assigned" ? "#777777" : "#CF2338",
                    fontSize: 17,
                  }}
                />
              </Link>
            </Button>
            <Button
              type="text"
              disabled={record.state === "Assigned" ? true : false}
            >
              <BsXCircle
                style={{
                  color: record.state === "Assigned" ? "#777777" : "#CF2338",
                  fontSize: 17,
                }}
                onClick={() => {
                  showModal(record);
                }}
              />
            </Button>
          </Space>
        </span>
      ),
    },
  ];

  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Manage Asset")}
      <div className="user__list__top">Asset List</div>
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
            <Option value="Available">Available</Option>
            <Option value="Not available">Not available</Option>
            <Option value="Waiting for recycling">Waiting for recycling</Option>
            <Option value="Recycled">Recycled</Option>
            <Option value="Assigned">Assigned</Option>
          </Select>
        </div>
        <div className="filter__box">
          <Select
            className="user__filter__input"
            style={{ width: 200 }}
            defaultValue="Category"
            onChange={(value) => {
              setTextCate(value);
            }}
          >
            <Option value="">Category</Option>
            {category.map((c) => (
              <Option key={c.name} value={c.name}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="search__create__box">
          <div className="search__box">
            <Search
              placeholder="input search text"
              onChange={(e) => {
                setPagination({ ...pagination, current: 1 });
                setSearchText(e.target.value);
              }}
            />
          </div>
          <Link to="/create-asset">
            <button className="user__list__features--create">
              Create new Asset
            </button>
          </Link>
        </div>
      </div>
      <Table
        className="assetList__table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={onSearch()}
        pagination={pagination}
        loading={loading}
      />

      <Modal
        width={911}
        visible={visibleDetail}
        title="Asset Detail"
        onCancel={() => setVisibleDetail(false)}
        footer={null}
      >
        <table className="styled-table">
          <thead>
            <tr>
              <th>Asset Code</th>
              <th>Asset Name</th>
              <th>Installed Date</th>
              <th>Location</th>
              <th>Specification</th>
              <th>State</th>
              <th>Category</th>
              <th>Assignments Id</th>
            </tr>
          </thead>
          <tbody>
            <tr className="active-row">
              <td>{selecting.assetCode}</td>
              <td>{selecting.assetName}</td>
              <td>{moment(selecting.installedDate).format("DD/MM/YYYY")}</td>
              <td>{selecting.location}</td>
              <td>{selecting.specification}</td>
              <td>{selecting.state}</td>
              <td>{selecting.category}</td>
              <td>{!visibleDetail ? "" : Object.keys(selecting.assignments).toString()}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
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
        <p>Do you want to delete this asset? </p>
      </Modal>

      <Modal
        width={400}
        title="Cannot Delete Asset"
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
    </div>
  );
};

export default AssetList;

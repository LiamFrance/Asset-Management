import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ReportList = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
const navigate = useNavigate()
  //Authorization
  const role = token ? jwt_decode(token).type : "";
  if (role !== "ROLE_ADMIN") {
    navigate("/unauthorized");
  }

  //Get filtered data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://${process.env.REACT_APP_API_URL}:8080/assets/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        setData(
          r.data.map((record) => {
            const { category, ...statistic } = record;
            return {
              category: record.category,
              total: calcSum(record),
              ...statistic,
            };
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          navigate("/server-500");
        }
      });
  }, []);

  //Get data to export
  function getSheetData(data, header) {
    var fields = Object.keys(data[0]);
    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData.unshift(header);
    return sheetData;
  }

  //Export data
  const saveAsExcel = () => {
    let header = [
      "Category",
      "Total",
      "Available",
      "Not available",
      "Recycled",
      "Assigned",
      "Waiting for recycling",
    ];
    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
      const sheet1 = workbook.sheet(0);
      const sheetData = getSheetData(data, header);
      sheetData.map((item) => {
        Object.keys(item).forEach((key) => {
          item[key] = item[key].length === 0 ? 0 : item[key];
        });
        return item;
      });
      const totalColumns = sheetData[0].length;
      sheet1.cell("A1").value(sheetData);
      const range = sheet1.usedRange();
      const endColumn = String.fromCharCode(64 + totalColumns);
      sheet1.row(1).style("bold", true);
      sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
      range.style("border", true);
      return workbook.outputAsync().then((res) => {
        saveAs(res, `${jwt_decode(token).location}.xlsx`);
      });
    });
  };

  const calcSum = (record) => {
    const { category, ...statistic } = record;
    return Object.values(statistic).reduce((a, b) => a + b);
  };
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      sorter: {
        compare: (a, b) => (a.category > b.category ? 1 : -1),
      },
      render: (category, record) => <p>{record.category}</p>,
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: {
        compare: (a, b) => (a.total > b.total ? 1 : -1),
      },
      width: "10%",
      render: (total, record) => <p>{record.total}</p>,
    },
    {
      title: "Assigned",
      dataIndex: "assigned",
      sorter: {
        compare: (a, b) => (a.Assigned > b.Assigned ? 1 : -1),
      },
      render: (assigned, record) => <p>{record.assigned}</p>,
      width: "12%",
    },
    {
      title: "Available",
      dataIndex: "available",
      sorter: (a, b) => (a.Available > b.Available ? 1 : -1),
      width: "12%",
      render: (available, record) => <p>{record.available}</p>,
    },
    {
      title: "Not available",
      dataIndex: "",
      sorter: (a, b) => (a["notAvailable"] > b["notAvailable"] ? 1 : -1),
      width: "15%",
      render: (notAvailable, record) => <p>{record.notAvailable}</p>,
    },
    {
      title: "Waiting for recycling",
      dataIndex: "",
      sorter: (a, b) =>
        a["waitingForRecycling"] > b["waitingForRecycling"] ? 1 : -1,
      width: "20%",
      render: (waitingForRecycling, record) => (
        <p>{record.waitingForRecycling}</p>
      ),
    },
    {
      title: "Recycled",
      dataIndex: "recycled",
      width: "10%",
      sorter: (a, b) => (a.Recycled > b.Recycled ? 1 : -1),
      render: (recycled, record) => <p>{record.recycled}</p>,
    },
  ];
  return (
    <div className="content__box--right">
      {localStorage.setItem("page", "Report ")}
      <div className="report__list__top">Report</div>
      <div className="report__list__features">
        <div className="search__create__box">
          <button
            className="report__list__features--export"
            onClick={saveAsExcel}
          >
            Export
          </button>
        </div>
      </div>
      <Table
        className="reportList__table"
        columns={columns}
        rowKey={(record) => record.category}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};

export default ReportList;

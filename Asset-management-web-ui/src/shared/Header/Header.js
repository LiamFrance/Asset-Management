import React, { useState } from "react";
import "./Header.css";
import {
  CaretDownOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import Modal from "antd/es/modal/Modal";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

const validateMessages = {
  required: "${label} is required!",
};
const Header = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setVisible(true);
  };
  const showModalChangePassword = () => {
    setVisiblePassword(true);
  };
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setVisible(false);
    navigate("/login");
  };
  //trigger event browser
  window.onpopstate = (e) => {
    setVisible(false);
    setVisiblePassword(false);
    setVisibleSuccess(false);
  };
  // let checked = true;
  const handleCheckPassword = () => {
    let formatData = {
      oldPassword: oldPassword,
    };
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .post(
        `http://${process.env.REACT_APP_API_URL}:8080/users/cpwd`,
        formatData
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data === false) {
            form.setFields([
              {
                name: "oldPassword",
                errors: ["Password is incorrect"],
              },
            ]);
          } else {
            handleChangePassword();
          }
          // response.data ? handleChangePassword() : setError("Password is incorrect")
        }
      })
      .catch((err) => {});
  };

  const handleChangePassword = () => {
    let formatData = { newPassword: newPassword };
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios
      .put(
        `http://${process.env.REACT_APP_API_URL}:8080/users/cpwd`,
        formatData
      )
      .then((response) => {
        if (response.status === 200) {
          message.success("Change Password Success");
          setVisiblePassword(false);
          setVisibleSuccess(true);
        }
      });
  };

  const configOld = {
    rules: [
      {
        message: "Please input your old password!",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          let pattern = /\s/g;
          if (pattern.test(value)) {
            return Promise.reject(new Error("Password cannot have space"));
          } else if (newPassword !== undefined) {
            if (newPassword === oldPassword) {
              form.setFields([
                {
                  name: "newPassword",
                  errors: ["Current password and new password can't be same"],
                },
              ]);
            } else {
              form.setFields([
                {
                  name: "newPassword",
                  errors: [],
                },
              ]);
            }
          } else {
            return Promise.resolve();
          }
        },
      }),
    ],
  };
  const pathname = useLocation();
  const headerTitle = () => {
    if (pathname.pathname.split("/")[1] === "/home") {
      return "Home";
    } else if (pathname.pathname.split("/")[1] === "user") {
      return "Manage User";
    } else if (pathname.pathname.split("/")[1] === "asset") {
      return "Manage Asset";
    } else if (pathname.pathname.split("/")[1] === "assignment") {
      return "Manage Assignment";
    } else if (pathname.pathname.split("/")[1] === "request_return") {
      return "Request for Returning";
    } else if (pathname.pathname.split("/")[1] === "report") {
      return "Report";
    }
    if (pathname.pathname.split("/")[1] === "create-user") {
      return "Manage User > Create New User";
    } else if (pathname.pathname.split("/")[1] === "edit-user") {
      return "Manage User > Edit User";
    } else if (pathname.pathname.split("/")[1] === "create-asset") {
      return "Manage Asset > Create New Asset";
    } else if (pathname.pathname.split("/")[1] === "edit-asset") {
      return "Manage Asset > Edit Asset";
    } else if (pathname.pathname.split("/")[1] === "create-assignment") {
      return "Manage Assignment > Create New Assignment";
    } else if (pathname.pathname.split("/")[1] === "edit-assignment") {
      return "Manage Assignment > Edit Assignment";
    } else if (pathname.pathname.split("/")[1] === "") {
      return "My Assignment";
    } else {
      return "";
    }
  };

  const checkHeader = token === null;
  return (
    <header>
      <div className="header__box">
        <div className="header__title">
          <div className="dropdown">
            <button className="dropbtn">
              <MenuOutlined />
            </button>
            <div className="dropdown-content">
              <a href="/">Home</a>
              <a href="/user">Manage User</a>
              <a href="/asset">Manage Asset</a>
              <a href="/assignment">Manage Assignment</a>
              <a href="/request_return">Request for Returning</a>
              <a href="/report">Report</a>
            </div>
          </div>
          <span className="header-title">{headerTitle()}</span>
        </div>
        {checkHeader ? (
          ""
        ) : (
          <div className="header__user">
            <div className="user-box">
              <button className="user-icon">
                <div>
                  <div className="div_left">
                    {token && jwt_decode(token).sub}
                  </div>

                  <div className="div_right">
                    <CaretDownOutlined />
                  </div>
                </div>
              </button>
              <div className="user-content">
                <a href="/profile">Profile</a>
                <a
                  onClick={() => {
                    showModalChangePassword();
                  }}
                >
                  Change Password
                </a>
                <a
                  onClick={() => {
                    showModal();
                  }}
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        style={{ paddingLeft: 20 }}
        className="Modal__logout--short Modal__logout"
        headerStyle={{ marginLeft: 10 }}
        title="Are you sure?"
        visible={visible}
        footer={[
          <Button
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>,
          <Button
            className="Modal__logout__btn-cancel"
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <div className="repassword__content-logout">
          <div className="repassword__desc repassword__desc-logout">
            <p>Do you want to logout?</p>
          </div>
        </div>
      </Modal>
      {/* Modal Change Password */}
      <Modal
        onCancel={() => setVisible(false)}
        className="Modal__logout Modal__logout--changePW "
        title="Change Password"
        visible={visiblePassword}
        footer={null}
      >
        <div className="repassword__content" style={{ height: 325 }}>
          <Form form={form} validateMessages={validateMessages}>
            <div className="repassword__input repassword__input-old">
              {/*<span>Old password</span>*/}
              <Form.Item
                className="repassword__input--OldPW"
                label="Old password"
                name="oldPassword"
                {...configOld}
              >
                <Input.Password
                  placeholder="input old password"
                  style={{ width: 200, marginLeft: 73 }}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </div>

            <div className="repassword__input">
              {/*<span>New password</span>*/}
              <Form.Item
                className="repassword__input--NewPW"
                label="New password"
                name="newPassword"
                rules={[
                  {
                    message: "Please input your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      let pattern = /\s/g;
                      let format =
                        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\]).{8,}$/g;
                      if (!format.test(value)) {
                        return Promise.reject(
                          new Error(
                            "Password should be 8-characters minimum, including upper/lowercase, digit and special character."
                          )
                          //Password should contain number, lowercase letter, uppercase letter, special character with at least 8 characters in length, please try again.
                        );
                      } else if (value === oldPassword) {
                        return Promise.reject(
                          new Error(
                            "Current password and new password can't be same"
                          )
                        );
                      } else if (pattern.test(value)) {
                        return Promise.reject(
                          new Error("Password cannot have space")
                        );
                      } else if (reEnterPassword.length > 0) {
                        if (value !== reEnterPassword) {
                          form.setFields([
                            {
                              name: "reEnterPassword",
                              errors: [
                                "The password and confirmation password do not match",
                              ],
                              value: "",
                            },
                          ]);
                        } else {
                          form.resetFields([reEnterPassword]);
                        }
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="input new password"
                  style={{ width: 200, marginLeft: 68 }}
                  onChange={(e) => setNewPassword(e.target.value)}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </div>
            {/* re-enter password */}
            <div className="repassword__input">
              <Form.Item
                className="repassword__input--rePW"
                label="Re-enter password"
                name="reEnterPassword"
                rules={[
                  {
                    message: "Please input your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value !== newPassword) {
                        return Promise.reject(
                          new Error(
                            "The password and confirmation password do not match."
                          )
                        );
                      } else if (value === newPassword) {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="input password"
                  style={{ width: 200, marginLeft: 40.5 }}
                  onChange={(e) => setReEnterPassword(e.target.value)}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </div>

            {/*button save change pw*/}
            <Form.Item style={{ marginRight: 8, marginTop: "-13px" }}>
              <Button
                className="Modal__btn-cancel"
                onClick={() => {
                  form.resetFields();
                  setVisiblePassword(false);
                }}
              >
                Cancel
              </Button>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length > 0
                    }
                    //htmlType="submit"
                    className="Modal__btn-save"
                    onClick={() => {
                      handleCheckPassword();
                    }}
                  >
                    Save
                  </Button>
                )}
              </Form.Item>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        className="Modal__success"
        title="Change password"
        visible={visibleSuccess}
        footer={[
          <Button
            style={{ float: "right", marginTop: 20 }}
            className="Modal__logout__btn-cancel"
            onClick={() => {
              setVisibleSuccess(false);
              localStorage.clear();
              window.location.reload(true);
            }}
          >
            Close
          </Button>,
        ]}
      >
        <div className="repassword__content-logout">
          <div className="repassword__desc repassword__desc-logout">
            <p>Your password has been changed successfully!</p>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;

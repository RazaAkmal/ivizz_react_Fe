import React, { Component } from 'react';
import "../globalStyles.css";
import { Form, Input, Button, Card,Select, Row, Col, notification } from 'antd';
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import apiService from "../../services/api";
import { withRouter } from 'react-router-dom'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 7 },
};

class Login extends Component {
  
  constructor(props){
    super();
    this.state = {
      email: "",
      password: ""
    }
  }

  login = async (email, password) => {
    try{
      const response = await apiService.login(email, password)
      
      if (response.error) {
        this.openNotification('topRight', 'error', 'Invalid credentials');
        return
      } else if(response.data.token && response.data.site) {
        const { token, subdomain, logo, site } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('subdomain', subdomain)
        localStorage.setItem('orgLogo', logo)
        localStorage.setItem('site', JSON.stringify(site) )
        this.props.history.push("/")
      } else {
        this.openNotification('topRight', 'error', 'User does not belong to any Organization');
      }
    }catch(err) {
      console.log('-----err: ', err)
      this.openNotification('topRight', 'error', 'Something went wrong. Please try again');
    }
  }

  openNotification = (placement, type, msg) => {
    notification[type]({
      message: `Error`,
      description: `${msg}!`,
      placement,
      duration: 3,
      style: {backgroundColor: '#FFF2F0'}
    });
  };

  
  render() {
    let { email, password } = this.state;

    return (
      <div className="siteCardBorder flexCenter">
        <Card title="Welcome To Ivizz" style={{ minWidth: 700}}>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" onClick={e => this.login(email, password)}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(Login);

"use client";

import React from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// Reusable container style
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
};

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    // values contains tenant, email, and password
    console.log("Logging in with:", values);
    // Call your API here, and on success navigate to the dashboard.
    messageApi.success("Login successful!");
    router.push("/dashboard");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {contextHolder}
      {/* Header */}
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          height: "64px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={containerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "64px",
            }}
          >
            <Link href="/">
              <img
                src="/logo.png"
                alt="Enterprise HRMS Logo"
                style={{ height: "40px", marginRight: "16px", display: "block" }}
              />
            </Link>
            <Title
              level={3}
              style={{ margin: 0, lineHeight: "64px", color: "#000" }}
            >
              Enterprise HRMS
            </Title>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: "40px 20px" }}>
        <div style={containerStyle}>
          <Row justify="center">
            <Col xs={24} md={8} style={{ marginTop: "80px" }}>
              <Card>
                <Title level={3} style={{ textAlign: "center" }}>
                  Login
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
                  <Form.Item
                    label="Tenant Identifier"
                    name="tenant"
                    rules={[
                      { required: true, message: "Please enter your tenant ID" },
                    ]}
                  >
                    <Input placeholder="Your company domain or tenant ID" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="yourname@company.com" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password" }]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      style={{ marginTop: "12px" }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
                <Paragraph style={{ textAlign: "center", marginTop: "16px" }}>
                  Don't have an account? <Link href="/signup">Sign Up Now</Link>
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#fff",
          borderTop: "1px solid #e8e8e8",
        }}
      >
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
    </Layout>
  );
}

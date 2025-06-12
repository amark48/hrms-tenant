"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
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

  // Use environment variable with fallback.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Debug logging to verify API URL.
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Using API URL:", apiUrl);

  // State for tenant options and selected tenant.
  const [tenantOptions, setTenantOptions] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  // Tenant detection: when email loses focus.
  const handleEmailBlur = async () => {
    const email = form.getFieldValue("email");
    if (!email) return;
    const parts = email.split("@");
    if (parts.length < 2) return;
    const domain = parts[1].trim();
    if (!domain) return;
    console.log("Extracted domain:", domain);

    try {
      const res = await fetch(
        `${apiUrl}/api/tenants/by-domain?domain=${encodeURIComponent(domain)}`
      );
      if (!res.ok) {
        setTenantOptions([]);
        form.resetFields(["tenant"]);
        setSelectedTenant(null);
        messageApi.error(`Tenant not found for domain "${domain}"`);
        return;
      }
      const data = await res.json();
      console.log("Tenant API response:", data);

      if (Array.isArray(data) && data.length > 0) {
        setTenantOptions(data);
        form.setFieldValue("tenant", data[0].id);
        setSelectedTenant(data[0].id);
      } else if (data && data.tenants && Array.isArray(data.tenants) && data.tenants.length > 0) {
        setTenantOptions(data.tenants);
        form.setFieldValue("tenant", data.tenants[0].id);
        setSelectedTenant(data.tenants[0].id);
      } else {
        setTenantOptions([]);
        form.resetFields(["tenant"]);
        setSelectedTenant(null);
        messageApi.error(`No tenants found for domain "${domain}"`);
      }
    } catch (err) {
      console.error("Error fetching tenant by domain", err);
      messageApi.error("Error retrieving tenant information.");
    }
  };

  // Clear tenant options on email change.
  const handleEmailChange = () => {
    setTenantOptions([]);
    setSelectedTenant(null);
    form.resetFields(["tenant"]);
  };

  // onFinish: Call /auth/login and send tenant as companyID.
  const onFinish = async (values: any) => {
    console.log("Login values:", values);
    // Extract and rename tenant to companyID.
    const { email, tenant, password } = values;
    const payload = { email, companyID: tenant, password };

    try {
      const loginEndpoint = `${apiUrl}/api/auth/login`;
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed. Please check your credentials.");
      }
      const data = await response.json();
      messageApi.success("Login successful!");
      
      // Store the token and user information in localStorage so that Dashboard can read them.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Stored token:", data.token);
      console.log("Stored user:", data.user);
      
      // Redirect to the dashboard page
      router.push("/dashboard");
    } catch (error: any) {
      let errorMessage = error.message;
      // Attempt to parse error message as JSON.
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.message) {
          errorMessage = parsed.message;
        }
      } catch (e) {
        // If parsing fails, continue with original message.
      }
      messageApi.error("Login error: " + errorMessage);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {contextHolder}
      {/* Static Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
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
              justifyContent: "space-between",
              alignItems: "center",
              height: "64px",
            }}
          >
            {/* Left: Logo & Title */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Enterprise HRMS Logo"
                  style={{ height: "40px", marginRight: "16px", display: "block" }}
                />
              </Link>
              <Title level={3} style={{ margin: 0, lineHeight: "64px", color: "#000" }}>
                Enterprise HRMS
              </Title>
            </div>
            {/* Right: Get Started Button */}
            <div>
              <Button type="primary" onClick={() => router.push("/")}>Get Started</Button>
            </div>
          </div>
        </div>
      </Header>
      {/* Main Content (with top margin to prevent header overlap) */}
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div style={containerStyle}>
          <Row justify="center">
            <Col xs={24} md={8} style={{ marginTop: "80px" }}>
              <Card>
                <Title level={3} style={{ textAlign: "center" }}>
                  Login
                </Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  requiredMark="optional"
                >
                  {/* Email Field */}
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      placeholder="yourname@company.com"
                      onBlur={handleEmailBlur}
                      onChange={handleEmailChange}
                    />
                  </Form.Item>
                  {/* Tenant Dropdown */}
                  <Form.Item
                    label="Tenant"
                    name="tenant"
                    rules={[
                      { required: true, message: "Please select your tenant" },
                    ]}
                  >
                    <Select
                      placeholder="Tenant auto-detected from email"
                      disabled={tenantOptions.length === 0}
                      options={tenantOptions.map((tenant) => ({
                        value: tenant.id,
                        label: tenant.name,
                      }))}
                      onChange={(value) => setSelectedTenant(value)}
                    />
                  </Form.Item>
                  {/* Password Field */}
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
                  Don't have an account? <Link href="/">Sign Up Now</Link>
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

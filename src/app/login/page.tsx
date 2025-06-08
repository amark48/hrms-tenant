"use client";

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

// Helper function for safe logging of objects with potential circular references.
function safeStringify(obj: any) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key.
        return;
      }
      cache.add(value);
    }
    return value;
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Use environment variable with a fallback.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Debug logging to verify the API URL.
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Using API URL:", apiUrl);

  // State for tenant options and selected tenant.
  const [tenantOptions, setTenantOptions] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  // Log tenant options whenever they update.
  useEffect(() => {
    console.log("Updated Tenant Options:", safeStringify(tenantOptions));
  }, [tenantOptions]);

  // Called when the email input loses focus.
  const handleEmailBlur = async () => {
    const email = form.getFieldValue("email");
    if (!email) return;
    const parts = email.split("@");
    if (parts.length < 2) return;
    const domain = parts[1].trim();
    if (!domain) return;
    console.log("Extracted domain:", domain);

    try {
      // Build the request URL using your environment variable.
      const res = await fetch(
        `${apiUrl}/tenants/by-domain?domain=${encodeURIComponent(domain)}`
      );

      if (!res.ok) {
        // If the API did not return 2xx, clear tenant state and show error.
        setTenantOptions([]);
        form.resetFields(["tenant"]);
        setSelectedTenant(null);
        messageApi.error(`Tenant not found for domain "${domain}"`);
        return;
      }

      const data = await res.json();
      console.log("Tenant API response:", safeStringify(data));

      // Check if the response is an array (as seen in your logs) or wrapped in an object.
      if (Array.isArray(data) && data.length > 0) {
        setTenantOptions(data);
        form.setFieldValue("tenant", data[0].id);
        setSelectedTenant(data[0].id);
      } else if (
        data &&
        data.tenants &&
        Array.isArray(data.tenants) &&
        data.tenants.length > 0
      ) {
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

  // Clear tenant options when the email field changes.
  const handleEmailChange = () => {
    setTenantOptions([]);
    setSelectedTenant(null);
    form.resetFields(["tenant"]);
  };

  // When the form submits.
  const onFinish = async (values: any) => {
    console.log("Login values:", safeStringify(values));
    // Here, pass the login credentials (including tenant and password) to your authentication API.
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
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="yourname@company.com"
                      onBlur={handleEmailBlur} // Triggers tenant lookup on blur.
                      onChange={handleEmailChange} // Clears previous tenant options on change.
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
                    rules={[
                      { required: true, message: "Please enter your password" },
                    ]}
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

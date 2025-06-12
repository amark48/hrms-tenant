"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layout, Button, Typography, Steps, Space, Form, Input, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function SecureLoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const currentStep = 1; // Secure Login is the second step

  const stepsList = [
    "Welcome",
    "Secure Login",
    "Company Info",
    "Upload Logo",
    "Subscription",
    "Enhance Security",
    "Billing Info",
    "Review Info",
  ];

  const stepIconStyle: React.CSSProperties = {
    display: "inline-block",
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "#1890ff",
    color: "#fff",
    lineHeight: "24px",
    textAlign: "center",
    fontSize: 12,
  };

  const renderStepIcon = (index: number) => {
    if (index < currentStep) {
      return (
        <div style={{ position: "relative", ...stepIconStyle }}>
          {index + 1}
          <CheckOutlined
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              backgroundColor: "#fff",
              borderRadius: "50%",
              fontSize: 10,
              color: "#52c41a",
              padding: "0 1px",
            }}
          />
        </div>
      );
    }
    return <span style={stepIconStyle}>{index + 1}</span>;
  };

  const onFinish = (values: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("registrationEmail", values.email);
      localStorage.setItem("registrationPhone", values.phone);
      localStorage.setItem("token", "placeholder-token");
    }
    message.success("Secure login info saved!");
    router.push("/dashboard/onboarding/upload-logo");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <style jsx global>{`
        .ant-steps-item {
          white-space: normal !important;
          flex: 1;
          min-width: 80px !important;
          text-align: center;
        }
        .ant-steps-item-title {
          white-space: normal !important;
          font-size: 12px !important;
          word-break: break-word;
        }
      `}</style>

      <Layout.Header
        style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img src="/logo.png" alt="Enterprise HRMS Logo" style={{ height: "40px", marginRight: "16px" }} />
          <Title level={3} style={{ margin: 0, color: "#000" }}>
            Enterprise HRMS
          </Title>
        </div>
      </Layout.Header>

      <Layout.Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <Steps current={currentStep} size="small">
              {stepsList.map((title, index) => (
                <Steps.Step key={index} title={title} icon={renderStepIcon(index)} />
              ))}
            </Steps>
          </div>

          <Title level={2} style={{ textAlign: "center", marginBottom: "16px" }}>
            Secure Login Setup
          </Title>
          <Paragraph style={{ textAlign: "center", marginBottom: "24px" }}>
            Provide a corporate email and phone number. We'll send a verification code to confirm your identity.
          </Paragraph>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Corporate Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="you@company.com" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="+1 555 123 4567" />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => router.push("/dashboard/onboarding/welcome")}>Back</Button>
                <Button type="primary" htmlType="submit">
                  Next: Upload Company Logo
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

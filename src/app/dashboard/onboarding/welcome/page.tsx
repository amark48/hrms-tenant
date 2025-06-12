"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layout, Button, Typography, Steps, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function WelcomePage() {
  const router = useRouter();
  const currentStep = 0; // For Welcome, the current step index is 0

  // Array of step titles (consistent across onboarding),
  // with step 7 labeled "Billing Info" so its text can wrap if needed.
  const stepsList = [
    "Welcome",
    "Secure Login",
    "Company Info",
    "Upload Logo",
    "Subscription",
    "Enhance Security",
    "Billing Info",
    "Review",
  ];

  // Style for the custom step number icon
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

  // Helper function: Render step icon, showing the step number.
  // If the step is completed (index < currentStep), overlay a check mark.
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Global CSS overrides to allow text wrapping in Steps */}
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

      {/* Header */}
      <Layout.Header
        style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img
            src="/logo.png"
            alt="Enterprise HRMS Logo"
            style={{ height: "40px", marginRight: "16px" }}
          />
          <Title level={3} style={{ margin: 0, color: "#000" }}>
            Enterprise HRMS
          </Title>
        </div>
      </Layout.Header>

      {/* Main Content */}
      <Layout.Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Steps Container: one row */}
          <div style={{ marginBottom: "24px" }}>
            <Steps current={currentStep} size="small">
              {stepsList.map((title, index) => (
                <Steps.Step key={index} title={title} icon={renderStepIcon(index)} />
              ))}
            </Steps>
          </div>

          {/* Main Heading */}
          <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
            Welcome to Enterprise HRMS Onboarding
          </Title>

          {/* Welcome Content */}
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" onClick={() => router.push("/dashboard/onboarding/secure-login")}>
              Get Started
            </Button>
          </Space>
        </div>
      </Layout.Content>

      {/* Footer */}
      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

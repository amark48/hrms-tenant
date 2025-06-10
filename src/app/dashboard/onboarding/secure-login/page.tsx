"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layout, Button, Typography, Steps, Space, Form, Input } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function CompanyInfoPage() {
  const router = useRouter();
  const currentStep = 2; // "Company Info" is the third step (0-indexed 2)

  // Common steps array; labels should match across pages.
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

  // Style for the custom step number icon.
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

  // Helper function to render the custom step icon.
  // For steps with index less than the currentStep, a check mark is overlaid.
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
      {/* Global CSS Overrides for the Steps so that text can wrap */}
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

      {/* Global Header */}
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
          {/* Steps Header */}
          <div style={{ marginBottom: "24px" }}>
            <Steps current={currentStep} size="small">
              {stepsList.map((title, index) => (
                <Steps.Step key={index} title={title} icon={renderStepIcon(index)} />
              ))}
            </Steps>
          </div>

          {/* Page Main Heading */}
          <Title level={2} style={{ textAlign: "center", marginBottom: "16px" }}>
            Company Information
          </Title>

          {/* Instructional Text */}
          <Paragraph style={{ textAlign: "center", marginBottom: "24px" }}>
            Please provide your company’s details so we can tailor your HRMS experience to your unique needs.
          </Paragraph>

          {/* Sample Form for Company Information */}
          <Form layout="vertical">
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Please enter your company name" }]}
            >
              <Input placeholder="Your company name" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="companyPhone"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Contact phone number" />
            </Form.Item>
            <Form.Item
              label="Street Address"
              name="streetAddress"
              rules={[{ required: true, message: "Please enter your street address" }]}
            >
              <Input placeholder="Street address" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item
              label="State/Province/Region"
              name="state"
              rules={[{ required: true, message: "Please enter your state or region" }]}
            >
              <Input placeholder="State/Province/Region" />
            </Form.Item>
            <Form.Item
              label="Postal Code"
              name="postalCode"
              rules={[{ required: true, message: "Please enter your postal code" }]}
            >
              <Input placeholder="Postal Code" />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Please enter your country" }]}
            >
              <Input placeholder="Country" />
            </Form.Item>
          </Form>

          {/* Navigation Buttons */}
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "24px",
            }}
          >
            <Button onClick={() => router.push("/onboarding/secure-login")}>Back</Button>
            <Button
              type="primary"
              onClick={() => router.push("/onboarding/upload-logo")}
            >
              Next: Upload Company Logo
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

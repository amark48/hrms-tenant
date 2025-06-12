"use client";

import React from "react";
import { Layout, Button, Typography, Upload, message, Steps, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const stepsItems = [
  { title: "Welcome" },
  { title: "Company Info" },
  { title: "Upload Logo" },
  { title: "Subscription" },
  { title: "Auth Setup" },
  { title: "Billing" },
  { title: "Review" }
];

export default function UploadLogoPage() {
  const router = useRouter();

  const onBack = () => {
    router.push("/dashboard/onboarding/company-info");
  };

  const onNext = () => {
    // Proceed to the next step, e.g., subscription selection.
    router.push("/dashboard/onboarding/subscription");
  };

  const handleUploadChange = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Header with Branding */}
      <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img src="/logo.png" alt="Enterprise HRMS Logo" style={{ height: "40px", marginRight: "16px" }} />
          <Title level={3} style={{ margin: 0, color: "#000" }}>Enterprise HRMS</Title>
        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Steps current={2} items={stepsItems} style={{ marginBottom: "24px" }} />
          <div style={{ textAlign: "center" }}>
            <Title level={2}>Upload Company Logo</Title>
            <Paragraph style={{ fontSize: "16px", color: "#555" }}>
              Add your company logo to reinforce your brand identity. Please upload a clear image in PNG or JPG format.
            </Paragraph>
            <Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: "24px" }}>
              <Upload
                name="logo"
                action="/api/upload-logo" // Replace with your file upload endpoint
                listType="picture"
                onChange={handleUploadChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Space>
            <Space size="middle">
              <Button onClick={onBack}>Back</Button>
              <Button type="primary" onClick={onNext}>Next: Subscription</Button>
            </Space>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Footer>
    </Layout>
  );
}

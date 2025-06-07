"use client";

import React from "react";
import { Layout, Button, Typography, Steps } from "antd";
import { useRouter } from "next/navigation";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// Define your steps for the onboarding process.
const stepsItems = [
  { title: "Welcome" },
  { title: "Company Info" },
  { title: "Upload Logo" },
  { title: "Subscription" },
  { title: "Auth Setup" },
  { title: "Billing" },
  { title: "Review" }
];

export default function OnboardingWelcome() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/company-info");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Header with Branding */}
      <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {/* Update the src path to your logo */}
          <img src="/logo.png" alt="Enterprise HRMS Logo" style={{ height: "40px", marginRight: "16px" }} />
          <Title level={3} style={{ margin: 0, color: "#000" }}>Enterprise HRMS</Title>
        </div>
      </Header>

      {/* Content Area */}
      <Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Progress Bar showing Step 1 of 7 */}
          <Steps current={0} items={stepsItems} style={{ marginBottom: "24px" }} />

          <div style={{ textAlign: "center" }}>
            <Title level={2}>Welcome to Enterprise HRMS Onboarding!</Title>
            <Paragraph style={{ fontSize: "16px", color: "#555" }}>
              Your corporate email has been verified. Now, let's begin setting up your company profile and preferences.
              This process is simple and secure—start your journey by getting to know your organization.
            </Paragraph>
            <div style={{ marginTop: "40px" }}>
              <Button type="primary" size="large" onClick={handleNext}>
                Next: Company Information
              </Button>
            </div>
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

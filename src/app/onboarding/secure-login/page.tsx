"use client";

import React, { useState } from "react";
import { Layout, Button, Typography, Steps, Space, message } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function SecureLoginPage() {
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Handler for Secure Login:
  // This API call automatically logs the user in using the secure, random password
  // that was generated during signup. We expect the userId (or a similar identifier)
  // is available in localStorage.
  const onSecureLogin = async () => {
    setLoginLoading(true);
    try {
      const userId = localStorage.getItem("userId"); // Ensure this is stored after OTP verification
      if (!userId) {
        throw new Error("User identification not found. Please complete signup again.");
      }

      // Call the new auto-login endpoint under auth routes.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/auto-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Auto login failed.");
      }

      // Expect the response to return a token that includes tenant information.
      const data = await response.json();
      const { token } = data;
      if (!token) {
        throw new Error("Authentication token missing from response.");
      }

      // Save token in localStorage for subsequent API calls.
      localStorage.setItem("token", token);

      message.success("Login successful!");
      router.push("/onboarding/company-info");
    } catch (error: any) {
      console.error("Secure login error:", error);
      message.error("Secure login failed: " + error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handler for resending the secure login credentials email.
  const onResendEmail = () => {
    setResendLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setResendLoading(false);
      message.success("Secure login credentials have been resent to your registered email.");
    }, 2000);
  };

  // Navigate back to the Welcome page.
  const onBack = () => {
    router.push("/onboarding/welcome");
  };

  // Handler to save progress (this can be extended to actually persist progress data).
  const onSaveProgress = () => {
    message.success("Progress saved!");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Branded Header */}
      <Layout.Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img src="/logo.png" alt="Enterprise HRMS Logo" style={{ height: "40px", marginRight: "16px" }} />
          <Title level={3} style={{ margin: 0, color: "#000" }}>Enterprise HRMS</Title>
        </div>
      </Layout.Header>

      {/* Main Content Area */}
      <Layout.Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          {/* Manually defined steps; current index = 1 (Step 2 of 7) */}
          <Steps current={1} style={{ marginBottom: "24px" }}>
            <Steps.Step title="Welcome" />
            <Steps.Step title="Secure Login" />
            <Steps.Step title="Company Info" />
            <Steps.Step title="Upload Logo" />
            <Steps.Step title="Subscription" />
            <Steps.Step title="Enhance Security" />
            <Steps.Step title="Billing/Review" />
          </Steps>

          <Text strong>Step 2 of 7</Text>
          <Title level={2} style={{ margin: "8px 0" }}>Secure Login</Title>
          <Paragraph>
            A secure, random password was generated during your signup process and has been emailed to your registered address.
            You do not need to manually create a password. Simply click the button below to log in securely.
          </Paragraph>

          <Space>
            <Button onClick={onBack}>Back</Button>
            <Button onClick={onSaveProgress}>Save Progress</Button>
            <Button type="primary" onClick={onSecureLogin} loading={loginLoading}>
              Secure Login
            </Button>
          </Space>

          <div style={{ marginTop: "16px" }}>
            <Button type="link" loading={resendLoading} onClick={onResendEmail}>
              Resend Credentials Email
            </Button>
          </div>
        </div>
      </Layout.Content>

      {/* Footer */}
      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

"use client";

import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, Steps, Space, message } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function SecureLoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [resendLoading, setResendLoading] = useState(false);

  // Handler when the secure login form is submitted.
  const onFinish = (values: any) => {
    console.log("Secure login code submitted:", values);

    // Here you would typically call your backend API to verify the secure login code.
    // For example:
    //
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-secure-code`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ code: values.secureCode })
    // })
    //   .then(res => {
    //     if (res.ok) {
    //       router.push("/onboarding/company-info");
    //     } else {
    //       throw new Error("Verification failed");
    //     }
    //   })
    //   .catch(err => message.error("Verification failed. Please check your code."));
    //
    // For now, we simulate successful verification:
    router.push("/onboarding/company-info");
  };

  // Handler to simulate resending the secure login code.
  const onResendCode = () => {
    setResendLoading(true);
    // Simulate the API call delay.
    setTimeout(() => {
      setResendLoading(false);
      message.success("Secure login code has been resent to your email.");
    }, 2000);
  };

  // Navigate back to the previous (welcome) page if needed.
  const onBack = () => {
    router.push("/onboarding/welcome");
  };

  // Handler to save progress, e.g., by persisting form data.
  const onSaveProgress = () => {
    const data = form.getFieldsValue();
    console.log("Progress saved:", data);
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
            A secure login code has been sent to your registered email. Please check your inbox and enter the code below to continue.
          </Paragraph>

          <Form form={form} layout="vertical" onFinish={onFinish} style={{ textAlign: "left" }}>
            <Form.Item
              label="Secure Login Code"
              name="secureCode"
              rules={[{ required: true, message: "Please enter your secure login code" }]}
            >
              <Input placeholder="Enter secure login code" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button onClick={onBack}>Back</Button>
                <Button onClick={onSaveProgress}>Save Progress</Button>
                <Button type="primary" htmlType="submit">Login</Button>
              </Space>
            </Form.Item>
          </Form>
          
          <Button type="link" loading={resendLoading} onClick={onResendCode}>
            Resend Code
          </Button>
        </div>
      </Layout.Content>

      {/* Footer */}
      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

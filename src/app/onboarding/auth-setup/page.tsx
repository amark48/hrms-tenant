"use client";

import React from "react";
import { Layout, Form, Input, Button, Typography, Steps, Space, Checkbox } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function EnhanceSecurityPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Security Setup Submitted:", values);
    // Proceed to the Billing page (Step 6) after successful form submission.
    router.push("/onboarding/billing");
  };

  const onBack = () => {
    router.push("/onboarding/subscription");
  };

  const onSaveProgress = () => {
    const currentValues = form.getFieldsValue();
    console.log("Progress saved:", currentValues);
    // Integrate your actual save logic as needed.
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header with Branding */}
      <Layout.Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img src="/logo.png" alt="Enterprise HRMS Logo" style={{ height: "40px", marginRight: "16px" }} />
          <Title level={3} style={{ margin: 0, color: "#000" }}>Enterprise HRMS</Title>
        </div>
      </Layout.Header>

      {/* Main Content */}
      <Layout.Content style={{ padding: "24px", marginTop: "24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Updated Steps: Manually listing steps */}
          <Steps current={4} style={{ marginBottom: "24px" }}>
            <Steps.Step title="Welcome" />
            <Steps.Step title="Company Info" />
            <Steps.Step title="Upload Logo" />
            <Steps.Step title="Subscription" />
            <Steps.Step title="Enhance Security" />
            <Steps.Step title="Billing" />
            <Steps.Step title="Review" />
          </Steps>

          <div style={{ textAlign: "center" }}>
            <Text strong>Step 5 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>Enhance Your Security</Title>
            <Paragraph>
              Create a robust password and set up two-factor authentication for enhanced account security.
              A strong security setup safeguards your sensitive company data.
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              password: "",
              confirmPassword: "",
              enable2FA: false,
              twoFACode: ""
            }}
          >
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please create a password" },
                { min: 12, message: "Password must be at least 12 characters" }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Create a strong password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The passwords do not match"));
                  }
                })
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item name="enable2FA" valuePropName="checked">
              <Checkbox>Enable Two-Factor Authentication (Optional)</Checkbox>
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) =>
                getFieldValue("enable2FA") ? (
                  <Form.Item
                    label="2FA Verification Code"
                    name="twoFACode"
                    rules={[{ required: true, message: "Please enter your verification code" }]}
                  >
                    <Input placeholder="Enter code from your authenticator app" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item>
              <Space size="middle">
                <Button onClick={onBack}>Back</Button>
                <Button onClick={onSaveProgress}>Save Progress</Button>
                <Button type="primary" htmlType="submit">Next: Billing</Button>
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

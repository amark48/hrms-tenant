"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Space,
  Radio,
  Checkbox,
  Segmented,
  message,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function AuthSetupPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  // State for password configuration mode.
  const [generateMode, setGenerateMode] = useState<"auto" | "manual">("manual");
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // MFA-related state.
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  // Expecting an array from the backend, e.g. ["SMS", "TOTP", "EMAIL"]
  const [mfaTypes, setMfaTypes] = useState<string[]>([]);
  const [selectedMfaTypes, setSelectedMfaTypes] = useState<string[]>([]);
  const [qrcode, setQrcode] = useState<string | null>(null);

  // Fetch available MFA types from the backend.
  useEffect(() => {
    const fetchMfaTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/get-mfa-types`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch MFA types.");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter out falsy values.
          setMfaTypes(data.filter((type) => type != null && type !== ""));
        } else {
          setMfaTypes([]);
        }
      } catch (error: any) {
        console.error("Error fetching MFA types:", error);
        message.error("Error fetching MFA types: " + error.message);
      }
    };
    fetchMfaTypes();
  }, []);

  // Handle password auto-generation.
  useEffect(() => {
    if (generateMode === "auto") {
      // For a production system use a robust password generator.
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        "!" +
        Math.random().toString(36).slice(-4);
      setGeneratedPassword(randomPassword);
      form.setFieldsValue({
        password: randomPassword,
        confirmPassword: randomPassword,
      });
    } else {
      setGeneratedPassword("");
      form.resetFields(["password", "confirmPassword"]);
    }
  }, [generateMode, form]);

  // Simulate TOTP QR code generation.
  const onGenerateQRCode = () => {
    setQrcode("https://via.placeholder.com/150?text=QR+Code");
  };

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    message.success("Security setup saved!");
    router.push("/onboarding/billing");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
          <Steps current={4} style={{ marginBottom: "24px" }}>
            <Steps.Step title="Welcome" />
            <Steps.Step title="Secure Login" />
            <Steps.Step title="Company Info" />
            <Steps.Step title="Upload Logo" />
            <Steps.Step title="Subscription" />
            <Steps.Step title="Enhance Security" />
            <Steps.Step title="Billing" />
            <Steps.Step title="Review" />
          </Steps>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Text strong>Step 5 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>
              Enhance Your Security
            </Title>
            <Paragraph>
              Set up your password and configure multi-factor authentication for
              maximum security.
            </Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Password Options */}
            <Form.Item label="Password Options">
              <Radio.Group
                value={generateMode}
                onChange={(e) => setGenerateMode(e.target.value)}
              >
                <Radio value="auto">Auto-generate Secure Password</Radio>
                <Radio value="manual">Enter Password Manually</Radio>
              </Radio.Group>
            </Form.Item>

            {generateMode === "manual" && (
              <>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Enter password" />
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
                        return Promise.reject(new Error("Passwords do not match"));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm password" />
                </Form.Item>
              </>
            )}

            {generateMode === "auto" && (
              <Form.Item label="Generated Password">
                <Input value={generatedPassword} readOnly />
              </Form.Item>
            )}

            {/* MFA Checkbox placed outside a Form.Item so it directly uses local state */}
            <div style={{ marginBottom: "16px" }}>
              <Checkbox
                checked={mfaEnabled}
                onChange={(e) => {
                  console.log("MFA checkbox changed:", e.target.checked);
                  setMfaEnabled(e.target.checked);
                }}
              >
                Enable Multi-Factor Authentication (MFA)
              </Checkbox>
            </div>

            {mfaEnabled && (
              <>
                <Form.Item
                  label="Select MFA Methods"
                  name="mfaTypes"
                  rules={[
                    { required: true, message: "Please select at least one MFA method" },
                  ]}
                >
                  <Checkbox.Group
                    options={(mfaTypes || [])
                      .filter((type) => type)
                      .map((type: string) => ({
                        label: type,
                        value: type,
                      }))}
                    value={selectedMfaTypes}
                    onChange={(checkedValues) => setSelectedMfaTypes(checkedValues as string[])}
                  />
                </Form.Item>

                {selectedMfaTypes.includes("SMS") && (
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Please enter your phone number" },
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                )}

                {selectedMfaTypes.includes("TOTP") && (
                  <Form.Item label="TOTP Setup">
                    <Button type="dashed" onClick={onGenerateQRCode}>
                      Generate QR Code
                    </Button>
                    {qrcode && (
                      <div style={{ marginTop: "16px" }}>
                        <img src={qrcode} alt="QR Code" />
                      </div>
                    )}
                  </Form.Item>
                )}

                {selectedMfaTypes.includes("EMAIL") && (
                  <Form.Item
                    label="MFA Email"
                    name="mfaEmail"
                    rules={[
                      { required: true, message: "Please enter your email for MFA" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter MFA email" />
                  </Form.Item>
                )}
              </>
            )}

            <Form.Item>
              <Space>
                <Button onClick={() => router.push("/onboarding/subscription")}>
                  Back
                </Button>
                <Button onClick={() => message.success("Progress saved!")}>
                  Save Progress
                </Button>
                <Button type="primary" htmlType="submit">
                  Next: Billing
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

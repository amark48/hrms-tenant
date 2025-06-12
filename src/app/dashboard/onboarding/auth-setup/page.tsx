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
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { QRCodeCanvas as QRCode } from "qrcode.react";

const { Title, Paragraph, Text } = Typography;

export default function AuthSetupPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  // Retrieve the registration email and phone from localStorage.
  // This assumes these values were stored during registration.
  const registrationEmail =
    (typeof window !== "undefined" && localStorage.getItem("registrationEmail")) || "";
  const registrationPhone =
    (typeof window !== "undefined" && localStorage.getItem("registrationPhone")) || "";

  // Debug logs to verify received values.
  useEffect(() => {
    console.log("DEBUG: Registration email from localStorage:", registrationEmail);
    console.log("DEBUG: Registration phone from localStorage:", registrationPhone);
    // Also check the secure login token.
    const token = typeof window !== "undefined" && localStorage.getItem("token");
    console.log("DEBUG: Secure login token from localStorage:", token);
  }, [registrationEmail, registrationPhone]);

  // Set initial values on the Form using initialValues.
  const formInitialValues = {
    mfaEmail: registrationEmail,
    phoneNumber: registrationPhone,
  };

  // Also use a useEffect to ensure the fields are set.
  useEffect(() => {
    form.setFieldsValue({ mfaEmail: registrationEmail, phoneNumber: registrationPhone });
  }, [registrationEmail, registrationPhone, form]);

  // State for password configuration mode.
  const [generateMode, setGenerateMode] = useState<"auto" | "manual">("manual");
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // MFA-related state.
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [mfaTypes, setMfaTypes] = useState<string[]>([]);
  const [selectedMfaTypes, setSelectedMfaTypes] = useState<string[]>([]);

  // State for TOTP QR Code generation.
  const [otpSecret, setOtpSecret] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  // Fetch MFA types from the backend.
  useEffect(() => {
    const fetchMfaTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-mfa-types`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch MFA types.");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter out any null or empty values.
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

  // Handle auto-generation of password.
  useEffect(() => {
    if (generateMode === "auto") {
      // For production, use a more robust generator.
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

  // Generate a TOTP secret and show the QR code.
  const handleGenerateQRCode = () => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 16; i++) {
      secret += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    setOtpSecret(secret);
    setShowQRCode(true);
  };

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    message.success("Security setup saved!");
    router.push("/dashboard/onboarding/billing");
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
              Set up your password and configure multi-factor authentication for maximum security.
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={formInitialValues}
          >
            {/* Password Configuration */}
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

            {/* MFA Section */}
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
                    onChange={(checkedValues) =>
                      setSelectedMfaTypes(checkedValues as string[])
                    }
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
                  <div style={{ marginTop: "16px", textAlign: "center", marginBottom: "24px" }}>
                    {showQRCode ? (
                      <div>
                        <QRCode
                          value={`otpauth://totp/EnterpriseHRMS:${
                            form.getFieldValue("companyName") || "YourCompany"
                          }?secret=${otpSecret}&issuer=EnterpriseHRMS`}
                          size={150}
                        />
                        <Text strong style={{ display: "block", marginTop: "8px" }}>
                          Scan this QR Code in your authenticator app
                        </Text>
                      </div>
                    ) : (
                      <Button type="primary" onClick={handleGenerateQRCode}>
                        Generate QR Code
                      </Button>
                    )}
                  </div>
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
                    <Input placeholder="MFA Email" />
                  </Form.Item>
                )}
              </>
            )}

            <Form.Item>
              <Space>
                <Button onClick={() => router.push("/dashboard/onboarding/subscription")}>
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

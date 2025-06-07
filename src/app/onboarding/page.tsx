"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Steps,
  Button,
  message,
  Typography,
  Form,
  Input,
  Upload,
  Checkbox,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { useRouter } from "next/navigation";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const [subscriptionOptions, setSubscriptionOptions] = useState<any[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();

  // States for QR Code generation in the MFA step.
  const [showQRCode, setShowQRCode] = useState(false);
  const [otpSecret, setOtpSecret] = useState("");

// In your useEffect that fetches subscription options:
   useEffect(() => {
    async function fetchSubscriptions() {
        try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        // Retrieve the token from localStorage (ensure it is stored there by your auth process)
        const token = localStorage.getItem("token");
        console.log("Using token:", token);
        const res = await fetch(`${apiURL}/subscriptions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
        },
        });

        
        if (res.ok) {
            const data = await res.json();
            // Assuming response data is an array of subscription objects with id and name.
            const options = data.map((plan: any) => ({
            value: plan.id,
            label: plan.name,
            }));
            setSubscriptionOptions(options);
        } else {
            console.error("Failed to fetch subscriptions:", res.statusText);
        }
        } catch (error) {
        console.error("Error fetching subscriptions:", error);
        }
    }
    fetchSubscriptions();
    }, []);


  // On mount, prefill initial fields from saved progress or registration info.
  useEffect(() => {
    const savedProgress = localStorage.getItem("onboardingProgress");
    if (savedProgress) {
      form.setFieldsValue(JSON.parse(savedProgress));
    }
    const registrationInfo = localStorage.getItem("registrationInfo");
    if (registrationInfo) {
      const reg = JSON.parse(registrationInfo);
      form.setFieldsValue({
        companyName: reg.companyName || "",
        companyCountry: reg.country || "",
      });
    }
  }, [form]);

  // Helper to generate a random 16-character secret using Base32.
  const handleGenerateQRCode = () => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 16; i++) {
      secret += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    setOtpSecret(secret);
    setShowQRCode(true);
  };

  // Define the onboarding steps.
  const steps = [
    {
      title: "Welcome",
      content: (
        <div style={{ textAlign: "center" }}>
          <Title level={4}>Welcome to Enterprise HRMS Onboarding</Title>
          <Text>Let’s begin setting up your company profile and preferences.</Text>
        </div>
      ),
    },
    {
      title: "Company Information",
      content: (
        <>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Company name is required" }]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>
          <Form.Item
            label="Street Address"
            name="companyStreet"
            rules={[{ required: true, message: "Street address is required" }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Form.Item
            label="City"
            name="companyCity"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item
            label="State/Province"
            name="companyState"
            rules={[{ required: true, message: "State/Province is required" }]}
          >
            <Input placeholder="Enter state/province" />
          </Form.Item>
          <Form.Item
            label="Zip/Postal Code"
            name="companyZip"
            rules={[{ required: true, message: "Zip/Postal code is required" }]}
          >
            <Input placeholder="Enter zip/postal code" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="companyCountry"
            rules={[{ required: true, message: "Country is required" }]}
          >
            <Input placeholder="Enter your country" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Upload Company Logo",
      content: (
        <>
          <Form.Item
            label="Company Logo"
            name="companyLogo"
            valuePropName="fileList"
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e && e.fileList
            }
            rules={[{ required: true, message: "Please upload your company logo" }]}
          >
            <Upload name="logo" beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Subscription",
      content: (
        <>
          <Form.Item
            label="Select Subscription Type"
            name="subscriptionType"
            rules={[{ required: true, message: "Please select a subscription type" }]}
          >
            <Select placeholder="Select a subscription plan">
              {subscriptionOptions.length > 0 ? (
                subscriptionOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))
              ) : (
                // In case options are not yet loaded, show a loading indicator or default value
                <Option value="loading" disabled>
                  Loading...
                </Option>
              )}
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Authentication Setup",
      content: (
        <>
          <Form.Item name="enableMFA" valuePropName="checked">
            <Checkbox>Enable Multi-Factor Authentication (MFA)</Checkbox>
          </Form.Item>
          <Form.Item
            shouldUpdate={(prev, curr) =>
              prev.enableMFA !== curr.enableMFA || prev.mfaTypes !== curr.mfaTypes
            }
          >
            {({ getFieldValue }) => {
              if (!getFieldValue("enableMFA")) return null;
              const selectedMfa = getFieldValue("mfaTypes") || [];
              return (
                <>
                  <Form.Item
                    label="Select MFA Types (select at least one)"
                    name="mfaTypes"
                    rules={[
                      { required: true, message: "Select at least one MFA type" },
                    ]}
                  >
                    <Checkbox.Group>
                      <Checkbox value="SMS">SMS</Checkbox>
                      <Checkbox value="TOTP">Authenticator App (TOTP)</Checkbox>
                      <Checkbox value="Email">Email</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  {selectedMfa.includes("SMS") && (
                    <Form.Item
                      label="Phone Number for SMS"
                      name="mfaPhoneNumber"
                      rules={[
                        { required: true, message: "Enter phone number for SMS MFA" },
                      ]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  )}
                  {selectedMfa.includes("TOTP") && (
                    <div style={{ marginTop: "16px", textAlign: "center" }}>
                      {showQRCode ? (
                        <div>
                          <QRCode
                            value={`otpauth://totp/EnterpriseHRMS:${getFieldValue("companyName") ||
                              "YourCompany"}?secret=${otpSecret}&issuer=EnterpriseHRMS`}
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
                </>
              );
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Billing Information",
      content: (
        <>
          <Form.Item name="billingSame" valuePropName="checked">
            <Checkbox>Billing address is same as company address</Checkbox>
          </Form.Item>
          <Form.Item shouldUpdate={(prev, curr) => prev.billingSame !== curr.billingSame}>
            {({ getFieldValue }) => {
              if (getFieldValue("billingSame")) return null;
              return (
                <>
                  <Form.Item
                    label="Billing Street Address"
                    name="billingStreet"
                    rules={[{ required: true, message: "Billing street address is required" }]}
                  >
                    <Input placeholder="Enter billing street" />
                  </Form.Item>
                  <Form.Item
                    label="Billing City"
                    name="billingCity"
                    rules={[{ required: true, message: "Billing city is required" }]}
                  >
                    <Input placeholder="Enter billing city" />
                  </Form.Item>
                  <Form.Item
                    label="Billing State/Province"
                    name="billingState"
                    rules={[{ required: true, message: "Billing state/province is required" }]}
                  >
                    <Input placeholder="Enter billing state/province" />
                  </Form.Item>
                  <Form.Item
                    label="Billing Zip/Postal Code"
                    name="billingZip"
                    rules={[{ required: true, message: "Billing zip/postal code is required" }]}
                  >
                    <Input placeholder="Enter billing zip/postal code" />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[{ required: true, message: "Please select a payment method" }]}
          >
            <Select placeholder="Select payment method">
              <Option value="cc">Credit Card</Option>
              <Option value="paypal">PayPal</Option>
              <Option value="bank">Bank Transfer</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Review & Finish",
      content: (
        <div style={{ textAlign: "center" }}>
          <Title level={4}>Review Your Information</Title>
          <Text>Please review all your details below before completing onboarding:</Text>
          <div style={{ marginTop: "16px", textAlign: "left", lineHeight: "1.6" }}>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Company Name:</Text> {form.getFieldValue("companyName") || "-"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Address:</Text>{" "}
              {`${form.getFieldValue("companyStreet") || "-"}, ${form.getFieldValue("companyCity") || "-"}, ${form.getFieldValue("companyState") || "-"}, ${form.getFieldValue("companyZip") || "-"}, ${form.getFieldValue("companyCountry") || "-"}`}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Subscription:</Text> {form.getFieldValue("subscriptionType") || "-"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>MFA Enabled:</Text> {form.getFieldValue("enableMFA") ? "Yes" : "No"}
            </div>
            {form.getFieldValue("enableMFA") && (
              <>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong>MFA Types:</Text> {(form.getFieldValue("mfaTypes") || []).join(", ")}
                </div>
                {(form.getFieldValue("mfaTypes") || []).includes("SMS") && (
                  <div style={{ marginBottom: "8px" }}>
                    <Text strong>SMS Phone:</Text> {form.getFieldValue("mfaPhoneNumber") || "-"}
                  </div>
                )}
                {(form.getFieldValue("mfaTypes") || []).includes("TOTP") && (
                  <div style={{ marginBottom: "8px" }}>
                    <Text strong>TOTP Secret:</Text> {otpSecret || "-"}
                  </div>
                )}
              </>
            )}
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Billing Address:</Text>{" "}
              {form.getFieldValue("billingSame")
                ? "Same as company address"
                : `${form.getFieldValue("billingStreet") || "-"}, ${form.getFieldValue("billingCity") || "-"}, ${form.getFieldValue("billingState") || "-"}, ${form.getFieldValue("billingZip") || "-"}`}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Payment Method:</Text> {form.getFieldValue("paymentMethod") || "-"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Company Logo:</Text>{" "}
              {form.getFieldValue("companyLogo") ? "Logo uploaded" : "No logo uploaded"}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Updated Save Progress: Save locally and call API (injecting tenantId from registration info).
  const saveProgress = async () => {
    try {
      const values = { ...form.getFieldsValue() };

      // Inject the tenant id from registration info stored in localStorage.
      const registrationInfoString = localStorage.getItem("registrationInfo");
      if (registrationInfoString) {
        const registrationInfo = JSON.parse(registrationInfoString);
        if (registrationInfo.id) {
          values.tenantId = registrationInfo.id;
        }
      }
      
      // Save locally as backup.
      localStorage.setItem("onboardingProgress", JSON.stringify(values));

      // Use API URL from environment.
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiURL}/api/onboarding/save-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to save progress.");
        }
        message.success("Progress saved to server!");
      } else {
        const resultText = await response.text();
        console.error("Unexpected response (not JSON):", resultText);
        throw new Error("Failed to save progress: Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error saving progress:", error);
      message.error("Error saving progress. Please try again.");
    }
  };

  const next = async () => {
    try {
      if (current === 1) {
        await form.validateFields([
          "companyName",
          "companyStreet",
          "companyCity",
          "companyState",
          "companyZip",
          "companyCountry",
        ]);
      }
      if (current === 2) {
        await form.validateFields(["companyLogo"]);
      }
      if (current === 3) {
        await form.validateFields(["subscriptionType"]);
      }
      if (current === 4) {
        if (form.getFieldValue("enableMFA")) {
          await form.validateFields(["mfaTypes"]);
          if ((form.getFieldValue("mfaTypes") || []).includes("SMS")) {
            await form.validateFields(["mfaPhoneNumber"]);
          }
        }
      }
      if (current === 5) {
        if (!form.getFieldValue("billingSame")) {
          await form.validateFields([
            "billingStreet",
            "billingCity",
            "billingState",
            "billingZip",
          ]);
        }
        await form.validateFields(["paymentMethod"]);
      }
      setCurrent(current + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const finishOnboarding = async () => {
    try {
      const allValues = form.getFieldsValue();
      console.log("Onboarding data collected:", allValues);
      message.success("Onboarding completed!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to finish onboarding:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          margin: "40px auto",
          maxWidth: "800px",
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "32px" }}>
          Onboarding Wizard
        </Title>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form form={form} layout="vertical">
          <div style={{ marginTop: "32px", minHeight: "200px" }}>
            {steps[current].content}
          </div>
        </Form>
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
          <Button style={{ margin: "0 8px" }} onClick={saveProgress}>
            Save Progress
          </Button>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={finishOnboarding}>
              Finish
            </Button>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        ©2025 Enterprise HRMS - All Rights Reserved
      </Footer>
    </Layout>
  );
}

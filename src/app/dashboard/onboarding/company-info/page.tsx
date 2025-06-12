"use client";

import React from "react";
import { Layout, Form, Input, Button, Typography, Select, Space, Steps } from "antd";
import { useRouter } from "next/navigation";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Expanded list of countries (sample list; extend as needed)
const countryOptions = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Argentina", value: "AR" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "UK" }
  // ... Add additional countries here
];

// Define the steps for progress indication.
const stepsItems = [
  { title: "Welcome" },
  { title: "Company Info" },
  { title: "Upload Logo" },
  { title: "Subscription" },
  { title: "Auth Setup" },
  { title: "Billing" },
  { title: "Review" }
];

export default function CompanyInfoPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  // Handle form submission
  const onFinish = (values: any) => {
    console.log("Company Info Submitted:", values);
    // Proceed to the next step: the Upload Logo page
    router.push("/dashboard/onboarding/upload-logo");
  };

  // Navigate back to the Welcome page
  const onBack = () => {
    router.push("/dashboard/onboarding/welcome");
  };

  // Save progress handler (this is a placeholder—integrate with your API as needed)
  const onSaveProgress = () => {
    const currentValues = form.getFieldsValue();
    console.log("Progress saved:", currentValues);
    // Implement actual save (e.g., API call) to persist progress
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
          {/* Progress Bar showing Step 2 of 7 */}
          <Steps current={1} items={stepsItems} style={{ marginBottom: "24px" }} />

          <div style={{ textAlign: "center" }}>
            <Text strong>Step 2 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>Company Information</Title>
            <Paragraph>
              Please provide your company's details so we can tailor your HRMS experience to your unique needs.
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              companyName: "",
              phoneNumber: "",
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: ""
            }}
          >
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Please enter your company name" }]}
            >
              <Input placeholder="Your company name" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Contact phone number" />
            </Form.Item>

            <Form.Item
              label="Street Address"
              name="street"
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
              rules={[{ required: true, message: "Please enter your state, province, or region" }]}
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
              rules={[{ required: true, message: "Please select your country" }]}
            >
              <Select
                placeholder="Select your country"
                options={countryOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item>
              <Space size="middle">
                <Button onClick={onBack}>Back</Button>
                <Button onClick={onSaveProgress}>Save Progress</Button>
                <Button type="primary" htmlType="submit">
                  Next: Upload Company Logo
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Footer>
    </Layout>
  );
}

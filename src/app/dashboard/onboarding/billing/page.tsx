"use client";

import React, { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Radio,
  Space,
  message,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function BillingPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "paypal" | "invoice">("creditCard");

  const onFinish = (values: any) => {
    console.log("Billing form values:", values);
    message.success("Billing information saved!");
    // Proceed to the review step
    router.push("/dashboard/onboarding/review");
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
          <Steps current={5} style={{ marginBottom: "24px" }}>
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
            <Text strong>Step 6 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>
              Billing Information
            </Title>
            <Paragraph>
              Please select your payment method and provide the required billing details.
              You can later integrate this process with a third‐party payment provider for seamless checkout.
            </Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Payment Method Selection */}
            <Form.Item label="Payment Method" name="paymentMethod" initialValue={paymentMethod}>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Radio value="creditCard">Credit Card</Radio>
                <Radio value="paypal">PayPal</Radio>
                <Radio value="invoice">Invoice</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Conditional Fields for Credit Card Payment */}
            {paymentMethod === "creditCard" && (
              <>
                <Form.Item
                  label="Card Number"
                  name="cardNumber"
                  rules={[{ required: true, message: "Please enter your card number" }]}
                >
                  <Input placeholder="Card Number" />
                </Form.Item>
                <Form.Item
                  label="Expiry Date"
                  name="expiryDate"
                  rules={[{ required: true, message: "Please enter the expiry date" }]}
                >
                  <Input placeholder="MM/YY" />
                </Form.Item>
                <Form.Item
                  label="CVV"
                  name="cvv"
                  rules={[{ required: true, message: "Please enter the CVV" }]}
                >
                  <Input placeholder="CVV" />
                </Form.Item>
              </>
            )}

            {/* Conditional Field for PayPal */}
            {paymentMethod === "paypal" && (
              <>
                <Paragraph>
                  You will be redirected to PayPal to complete your payment.
                </Paragraph>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      message.info("Redirecting to PayPal...");
                      // TODO: Integrate with PayPal payment flow.
                    }}
                  >
                    Connect to PayPal
                  </Button>
                </Form.Item>
              </>
            )}

            {/* Conditional Information for Invoice */}
            {paymentMethod === "invoice" && (
              <Paragraph>
                An invoice will be emailed to you for manual payment.
              </Paragraph>
            )}

            {/* Navigation Buttons */}
            <Form.Item>
              <Space>
                <Button onClick={() => router.push("/dashboard/onboarding/auth-setup")}>
                  Back
                </Button>
                <Button onClick={() => message.success("Progress saved!")}>
                  Save Progress
                </Button>
                <Button type="primary" htmlType="submit">
                  Next: Review
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>

      {/* Footer */}
      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

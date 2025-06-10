"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Steps,
  Typography,
  Button,
  Space,
  Radio,
  Select,
  Segmented,
  message,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

export default function SubscriptionSelectionPage() {
  const router = useRouter();
  // Initially an empty array; will be populated by the API response.
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  // Toggle between "dropdown" and "buttons" mode.
  const [inputMode, setInputMode] = useState<"dropdown" | "buttons">("dropdown");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch subscription plans from the backend API.
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans.");
        }
        const data = await response.json();
        // Assume the API returns an array of subscription objects.
        setSubscriptions(data);
      } catch (error: any) {
        console.error("Error fetching subscriptions:", error);
        message.error("Error fetching subscriptions: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const onSaveProgress = () => {
    // Implement saving logic as needed—for now, simply show a message.
    message.success("Progress saved!");
  };

  const onSubmit = () => {
    if (!selectedPlan) {
      message.error("Please select a subscription plan.");
      return;
    }
    // You might want to persist the selection to an API or context.
    router.push("/onboarding/auth-setup");
  };

  const onBack = () => {
    router.push("/onboarding/upload-logo");
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
          <Steps current={3} style={{ marginBottom: "24px" }}>
            <Steps.Step title="Welcome" />
            <Steps.Step title="Company Info" />
            <Steps.Step title="Upload Logo" />
            <Steps.Step title="Subscription" />
            <Steps.Step title="Enhance Security" />
            <Steps.Step title="Billing" />
            <Steps.Step title="Review" />
          </Steps>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Text strong>Step 4 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>
              Select Your Subscription Plan
            </Title>
            <Paragraph>
              Choose the plan that best meets your company’s needs. You can always
              adjust your subscription as your organization grows.
            </Paragraph>
          </div>
          
          {/* Toggle between Dropdown and Button options */}
          <div style={{ marginBottom: "24px", textAlign: "center" }}>
            <Segmented
              options={[
                { label: "Dropdown", value: "dropdown" },
                { label: "Buttons", value: "buttons" },
              ]}
              value={inputMode}
              onChange={(val: "dropdown" | "buttons") => setInputMode(val)}
            />
          </div>

          {inputMode === "dropdown" ? (
            <Select
              placeholder="Select a subscription plan"
              style={{ width: "100%" }}
              loading={loading}
              value={selectedPlan}
              onChange={(val) => setSelectedPlan(val)}
              options={subscriptions.map((plan) => ({
                value: plan.id, // assuming backend returns a unique id
                label: `${plan.name} - $${plan.price}/month`,
              }))}
            />
          ) : (
            <Radio.Group
              onChange={(e) => setSelectedPlan(e.target.value)}
              value={selectedPlan}
              optionType="button"
              buttonStyle="solid"
              style={{ width: "100%" }}
            >
              {subscriptions.map((plan) => (
                <Radio.Button
                  key={plan.id}
                  value={plan.id}
                  style={{
                    display: "block",
                    textAlign: "left",
                    padding: "16px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <b>{plan.name}</b>
                  </div>
                  <div>{plan.description}</div>
                  <div>
                    <b>${plan.price} / month</b>
                  </div>
                </Radio.Button>
              ))}
            </Radio.Group>
          )}

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Space>
              <Button onClick={onBack}>Back</Button>
              <Button onClick={onSaveProgress}>Save Progress</Button>
              <Button type="primary" onClick={onSubmit}>
                Next: Enhance Security
              </Button>
            </Space>
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

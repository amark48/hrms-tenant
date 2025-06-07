"use client";

import React, { useState, useEffect } from "react";
import { Layout, Steps, Typography, Button, message, Radio, Space } from "antd";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

export default function SubscriptionSelectionPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch subscription plans from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token is missing. Please log in.");
      return;
    }
    setLoading(true);
fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Subscriptions data:", data); // Debug log
    setSubscriptions(data);
    setLoading(false);
  })
  .catch((err) => {
    console.error(err);
    message.error("Failed to fetch subscription plans.");
    setLoading(false);
  });

  }, []);

  const onSaveProgress = () => {
    // Save the selected plan or current form data—as needed
    message.success("Progress saved!");
  };

  const onSubmit = () => {
    if (!selectedPlan) {
      message.error("Please select a subscription plan.");
      return;
    }
    // Persist the chosen plan as needed before moving on
    router.push("/onboarding/auth-setup");
  };

  const onBack = () => {
    router.push("/onboarding/upload-logo");
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
          {/* Updated Steps: Manually listing each step */}
          <Steps current={3} style={{ marginBottom: "24px" }}>
            <Steps.Step title="Welcome" />
            <Steps.Step title="Company Info" />
            <Steps.Step title="Upload Logo" />
            <Steps.Step title="Subscription" />
            <Steps.Step title="Enhance Security" />
            <Steps.Step title="Billing" />
            <Steps.Step title="Review" />
          </Steps>

          <div style={{ textAlign: "center" }}>
            <Text strong>Step 4 of 7</Text>
            <Title level={2} style={{ margin: "8px 0" }}>Select Your Subscription Plan</Title>
            <Paragraph>
              Choose the plan that best meets your company’s needs. You can always adjust your subscription as your organization grows.
            </Paragraph>
          </div>

          <Radio.Group
            onChange={(e) => setSelectedPlan(e.target.value)}
            value={selectedPlan}
            style={{ width: "100%" }}
          >
            {subscriptions.length > 0 ? (
              subscriptions.map((plan) => (
                <Radio.Button
                  key={plan.id}
                  value={plan.id}
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: "8px",
                    padding: "16px",
                    textAlign: "left"
                  }}
                >
                  <Title level={4} style={{ marginBottom: "4px" }}>{plan.name}</Title>
                  <Paragraph style={{ margin: 0 }}>{plan.description}</Paragraph>
                  <Text strong>${plan.price} / month</Text>
                </Radio.Button>
              ))
            ) : (
              !loading && <Paragraph>No subscription plans available.</Paragraph>
            )}
          </Radio.Group>

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

      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState } from "react";
import { Form, Select, Checkbox, Typography, Spin, Alert } from "antd";

const { Title, Text } = Typography;

export interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  price: string;
  features?: any;
}

export interface SubscriptionStepProps {
  tenant?: any; // Optional tenant info
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ tenant }) => {
  // Retrieve the shared form instance.
  const formInstance = Form.useFormInstance();

  // Local state for fetched subscriptions.
  const [subscriptions, setSubscriptions] = useState<SubscriptionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // Local state for the selected subscription details.
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionOption | undefined>(undefined);

  // Fetch subscriptions from the API.
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/api/subscriptions`);
        if (!res.ok) {
          throw new Error("Failed to fetch subscriptions.");
        }
        const data: SubscriptionOption[] = await res.json();
        setSubscriptions(data);
        // Try to restore a persisted selection.
        const savedId = formInstance.getFieldValue("subscriptionPlan");
        if (savedId) {
          const savedSub = data.find((sub) => sub.id === savedId);
          if (savedSub) {
            setSelectedSubscription(savedSub);
          }
        }
        // If a tenant object is provided and it contains a subscriptionId, pre-select it.
        if (tenant && tenant.subscriptionId && !savedId) {
          const preSelected = data.find((sub) => sub.id === tenant.subscriptionId);
          if (preSelected) {
            formInstance.setFieldsValue({
              subscriptionPlan: tenant.subscriptionId,
              autoRenew: tenant.autoRenew || false,
            });
            setSelectedSubscription(preSelected);
          }
        }
      } catch (error: any) {
        setFetchError(error.message || "Error fetching subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [tenant, formInstance]);

  // Handler when subscription selection changes.
  const handleSubscriptionChange = (value: string) => {
    formInstance.setFieldsValue({ subscriptionPlan: value });
    const chosen = subscriptions.find((sub) => sub.id === value);
    setSelectedSubscription(chosen);
  };

  // Helper to render subscription features.
  const renderFeatures = (features: any): JSX.Element => {
    if (!features) return <Text type="secondary">No features provided.</Text>;
    if (Array.isArray(features)) {
      return <div style={{ whiteSpace: "pre-line" }}>{features.join("\n")}</div>;
    }
    if (typeof features === "string") {
      const items = features.split(",").map((f) => f.trim()).filter((f) => f);
      return <div style={{ whiteSpace: "pre-line" }}>{items.join("\n")}</div>;
    }
    if (typeof features === "object") {
      const entries = Object.entries(features);
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          {entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}
        </div>
      );
    }
    return <pre>{JSON.stringify(features, null, 2)}</pre>;
  };

  const content = (
    <div>
      <Title level={4}>Subscription Plan</Title>
      <Form.Item
        label="Subscription Plan"
        name="subscriptionPlan"
        rules={[{ required: true, message: "Please select a subscription plan" }]}
      >
        <Select
          placeholder="Select a subscription plan"
          options={subscriptions.map((option) => ({
            label: option.name,
            value: option.id,
          }))}
          onChange={handleSubscriptionChange}
          value={formInstance.getFieldValue("subscriptionPlan") || undefined}
          allowClear
        />
      </Form.Item>

      <div style={{ marginTop: "24px" }}>
        <Form.Item name="autoRenew" valuePropName="checked">
          <Checkbox>Auto Renew Subscription</Checkbox>
        </Form.Item>
      </div>

      {selectedSubscription && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
          <Title level={5}>{selectedSubscription.name}</Title>
          <Text strong>Price: </Text>
          <Text>{selectedSubscription.price}</Text>
          <div style={{ marginTop: "8px" }}>{renderFeatures(selectedSubscription.features)}</div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <Spin tip="Loading subscription options...">
        <div style={{ minHeight: "100px" }} />
      </Spin>
    );
  }
  if (fetchError) {
    return <Alert message="Error" description={fetchError} type="error" showIcon />;
  }
  return content;
};

export default SubscriptionStep;

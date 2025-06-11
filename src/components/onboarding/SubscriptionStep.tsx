import React, { useState, useEffect } from "react";
import { Form, Select, Spin } from "antd";

const SubscriptionStep: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/subscriptions`)
      .then((res) => res.json())
      .then((data) => setSubscriptions(data))
      .catch((err) => {
        console.error("Error fetching subscriptions", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" />;

  return (
    <div>
      <h3>Subscription Information</h3>
      <Form layout="vertical">
        <Form.Item
          label="Subscription"
          name="subscriptionId"
          rules={[{ required: true, message: "Please select a subscription" }]}
        >
          <Select
            placeholder="Select a subscription"
            options={subscriptions.map((sub) => ({
              label: sub.name,
              value: sub.id,
            }))}
            onChange={(value) => {
              const sub = subscriptions.find((s) => s.id === value) || null;
              setSelectedSubscription(sub);
            }}
          />
        </Form.Item>
      </Form>
      {selectedSubscription && (
        <div style={{ marginTop: "16px" }}>
          <h4>Subscription Details:</h4>
          <p>
            <strong>Name:</strong> {selectedSubscription.name}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {selectedSubscription.description || "No description available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStep;

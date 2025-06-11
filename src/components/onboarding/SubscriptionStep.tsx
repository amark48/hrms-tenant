import React, { useEffect, useState } from "react";
import { Form, Select, Checkbox, Typography, message } from "antd";

const { Title } = Typography;

export interface SubscriptionStepProps {
  tenant?: {
    // Assume tenant provides a subscriptionId that relates to one of the fetched subscriptions.
    subscriptionId?: string;
    autoRenew?: boolean;
  };
}

interface SubscriptionOption {
  id: string;
  name: string;
  // Add any additional properties as needed.
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ tenant }) => {
  const [form] = Form.useForm();
  const [subscriptionOptions, setSubscriptionOptions] = useState<SubscriptionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch subscription plans from the API endpoint specified in .env.local
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // Read the API URL from process.env.NEXT_PUBLIC_API_URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/subscriptions`);
        if (!res.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        const data: SubscriptionOption[] = await res.json();
        setSubscriptionOptions(data);
      } catch (error) {
        message.error("Error fetching subscription options");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // Pre-populate the form fields from tenant data when available.
  useEffect(() => {
    if (tenant) {
      form.setFieldsValue({
        subscriptionPlan: tenant.subscriptionId || undefined,
        autoRenew: tenant.autoRenew || false,
      });
    }
  }, [tenant, form]);

  // Map the fetched subscription options to the format expected by antd's Select.
  const selectOptions = subscriptionOptions.map((option) => ({
    label: option.name,
    value: option.id,
  }));

  return (
    <div>
      <Title level={4}>Subscription Information</Title>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Subscription Plan"
          name="subscriptionPlan"
          rules={[{ required: true, message: "Please select a subscription plan" }]}
        >
          <Select options={selectOptions} placeholder="Select a plan" loading={loading} />
        </Form.Item>
        <Form.Item name="autoRenew" valuePropName="checked">
          <Checkbox>Auto Renew Subscription</Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubscriptionStep;

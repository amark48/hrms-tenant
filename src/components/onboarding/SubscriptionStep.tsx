import React, { useEffect, useState } from "react";
import { Form, Select, Checkbox, Typography, Spin, Alert } from "antd";

const { Title, Paragraph, Text } = Typography;

export interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  price: string;
  features?: any; // Could be an array, string, or object
}

export interface SubscriptionStepProps {
  // A shared form instance from the parent wizard is optional—if not provided, a fallback local form is used.
  form?: any;
  tenant?: {
    subscriptionId?: string;
    autoRenew?: boolean;
    // You may have additional tenant properties.
    [key: string]: any;
  };
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = (props) => {
  // Use parent's form if provided; otherwise, create a local one.
  const [localForm] = Form.useForm();
  // Use fallback when no valid form is provided.
  const formInstance = props.form || localForm;
  
  // For fallback, supply initial values for persistence.
  const fallbackInitialValues = {
    subscriptionPlan: props.tenant?.subscriptionId || "",
    autoRenew: props.tenant?.autoRenew || false,
  };

  // Local state for fetched subscriptions.
  const [subscriptions, setSubscriptions] = useState<SubscriptionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Local state for the currently selected subscription.
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionOption | undefined>(undefined);

  // Local state for debug info.
  const [debugInfo, setDebugInfo] = useState<{
    tenantData?: any;
    tenantId?: string;
    fetchedIds: string[];
    matchFound: boolean;
  }>({ fetchedIds: [], matchFound: false });

  // Log the currently selected subscription for the console.
  useEffect(() => {
    console.log("DEBUG - Selected subscription changed:", selectedSubscription);
  }, [selectedSubscription]);

  // On mount, fetch subscriptions.
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/subscriptions`);
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions.");
        }
        const data: SubscriptionOption[] = await response.json();
        setSubscriptions(data);
        setFetchError(null);
        console.log("DEBUG - Fetched subscriptions:", data);
        console.log("DEBUG - Fetched Subscription IDs:", data.map((sub) => sub.id));
        
        // Update fetched IDs in debug info.
        const fetchedIds = data.map((sub) => sub.id);
        let matchFound = false;
        
        // Save the entire tenant prop for debugging.
        setDebugInfo((prev) => ({
          ...prev,
          tenantData: props.tenant,
          fetchedIds,
        }));

        // If tenant data is provided, attempt pre-selection.
        if (props.tenant && props.tenant.subscriptionId) {
          console.log("DEBUG - Tenant.subscriptionId provided:", props.tenant.subscriptionId);
          const preSelected = data.find((sub) => sub.id === props.tenant.subscriptionId);
          if (preSelected) {
            console.log("DEBUG - Matching subscription found for tenant:", preSelected);
            formInstance.setFieldsValue({
              subscriptionPlan: props.tenant.subscriptionId,
              autoRenew: props.tenant.autoRenew || false,
            });
            setSelectedSubscription(preSelected);
            matchFound = true;
          } else {
            console.warn("DEBUG - No matching subscription found for tenant.subscriptionId:", props.tenant.subscriptionId);
          }
          setDebugInfo((prev) => ({
            ...prev,
            tenantId: props.tenant.subscriptionId,
            matchFound,
          }));
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            tenantId: "None",
            matchFound: false,
          }));
        }
      } catch (error: any) {
        console.error("DEBUG - Error fetching subscriptions:", error);
        setFetchError(error.message || "Error fetching subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [props.tenant, formInstance]);

  // When the user selects a subscription from the dropdown.
  const handleSubscriptionChange = (value: string) => {
    formInstance.setFieldsValue({ subscriptionPlan: value });
    const chosen = subscriptions.find((sub) => sub.id === value);
    console.log("DEBUG - User selected subscription:", chosen);
    setSelectedSubscription(chosen);
  };

  // Helper to reformat and render features without bullets.
  const renderFeatures = (features: any): JSX.Element => {
    if (!features) {
      return <Text type="secondary">No features provided.</Text>;
    }
    if (Array.isArray(features)) {
      if (features.length === 0) {
        return <Text type="secondary">No features provided.</Text>;
      }
      return <div style={{ whiteSpace: "pre-line" }}>{features.join("\n")}</div>;
    }
    if (typeof features === "string") {
      const items = features.split(",").map((f) => f.trim()).filter((f) => f);
      if (items.length === 0) {
        return <Text type="secondary">No features provided.</Text>;
      }
      return <div style={{ whiteSpace: "pre-line" }}>{items.join("\n")}</div>;
    }
    if (typeof features === "object") {
      const entries = Object.entries(features);
      if (entries.length === 0) {
        return <Text type="secondary">No features provided.</Text>;
      }
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          {entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}
        </div>
      );
    }
    return <pre>{JSON.stringify(features, null, 2)}</pre>;
  };

  // Define the component content.
  const content = (
    <>
      <Title level={4}>Subscription Information</Title>
      <Form.Item
        label="Subscription Plan"
        name="subscriptionPlan"
        rules={[{ required: true, message: "Please select a subscription plan" }]}
      >
        <Select
          placeholder="Select a plan"
          options={subscriptions.map((option) => ({
            label: option.name,
            value: option.id,
          }))}
          onChange={handleSubscriptionChange}
        />
      </Form.Item>

      {/* Extra spacing between dropdown and Auto Renew checkbox */}
      <div style={{ marginTop: "24px" }}>
        <Form.Item name="autoRenew" valuePropName="checked">
          <Checkbox>Auto Renew Subscription</Checkbox>
        </Form.Item>
      </div>

      {/* Extra spacing before displaying subscription details */}
      {selectedSubscription && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
          <Title level={5}>{selectedSubscription.name}</Title>
          <Text strong>Price:</Text> <Text>{selectedSubscription.price}</Text>
          <Paragraph style={{ margin: "8px 0" }}>{selectedSubscription.description}</Paragraph>
          <div>
            <Text strong>Features:</Text>
            <div style={{ marginTop: "8px" }}>{renderFeatures(selectedSubscription.features)}</div>
          </div>
        </div>
      )}

      {/* Debugging UI – shows all tenant data and comparison info */}
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
        <Title level={5}>Debug Info</Title>
        <Text>
          Tenant Supplied Subscription ID:{" "}
          {props.tenant && props.tenant.subscriptionId ? props.tenant.subscriptionId : "None"}
        </Text>
        <br />
        <Text>
          Fetched Subscription IDs:{" "}
          {subscriptions.length > 0 ? subscriptions.map((sub) => sub.id).join(", ") : "None"}
        </Text>
        <br />
        <Text>
          Matching Subscription Found: {debugInfo.matchFound ? "Yes" : "No"}
        </Text>
        <br />
        <Text>All Tenant Data:</Text>
        <pre style={{ backgroundColor: "#e8e8e8", padding: "8px", borderRadius: "4px" }}>
          {JSON.stringify(props.tenant, null, 2)}
        </pre>
      </div>
    </>
  );

  // Render the content.
  // If a shared form instance is passed in via props, assume the parent wraps this component in a <Form>
  // and directly render our content. Otherwise, wrap our content in a fallback <Form> with component={false}
  // to connect our local form instance without rendering an extra <form> element.
  return props.form ? (
    loading ? (
      <Spin tip="Loading subscription options...">
        <div style={{ minHeight: "100px" }} />
      </Spin>
    ) : fetchError ? (
      <Alert message="Error" description={fetchError} type="error" showIcon />
    ) : (
      content
    )
  ) : (
    <Form form={localForm} component={false} initialValues={fallbackInitialValues}>
      {loading ? (
        <Spin tip="Loading subscription options...">
          <div style={{ minHeight: "100px" }} />
        </Spin>
      ) : fetchError ? (
        <Alert message="Error" description={fetchError} type="error" showIcon />
      ) : (
        content
      )}
    </Form>
  );
};

export default SubscriptionStep;

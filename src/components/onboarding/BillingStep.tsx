import React from "react";
import { Form, Input, Select, Button, Checkbox } from "antd";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Credit Card", value: "credit_card" },
  { label: "Bank Transfer/ACH", value: "bank_transfer" },
  { label: "PayPal", value: "paypal" },
];

const CREDIT_CARD_TYPE_OPTIONS = [
  { label: "Visa", value: "visa" },
  { label: "MasterCard", value: "mastercard" },
  { label: "American Express", value: "amex" },
];

interface BillingStepProps {
  form: any;
}

const BillingStep: React.FC<BillingStepProps> = ({ form }) => {
  return (
    <div>
      <h3>Payment Option / Type</h3>
      <Form layout="vertical" form={form} name="billingForm">
        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: "Please select a payment method" }]}
        >
          <Select placeholder="Select a payment method" options={PAYMENT_METHOD_OPTIONS} />
        </Form.Item>
        <Form.Item shouldUpdate={(prev, curr) => prev.paymentMethod !== curr.paymentMethod}>
          {({ getFieldValue }) => {
            const paymentMethod = getFieldValue("paymentMethod");
            if (paymentMethod === "credit_card") {
              return (
                <div
                  style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}
                >
                  <h4>Credit Card Details</h4>
                  <Form.Item
                    label="Card Type"
                    name="cardType"
                    rules={[{ required: true, message: "Please select your card type" }]}
                  >
                    <Select placeholder="Select card type" options={CREDIT_CARD_TYPE_OPTIONS} />
                  </Form.Item>
                  <Form.Item
                    label="Card Number"
                    name="cardNumber"
                    rules={[{ required: true, message: "Please enter your card number" }]}
                  >
                    <Input placeholder="Enter card number" />
                  </Form.Item>
                  <Form.Item
                    label="Expiry Date"
                    name="cardExpiry"
                    rules={[{ required: true, message: "Please enter card expiry date" }]}
                  >
                    <Input placeholder="MM/YY" />
                  </Form.Item>
                  <Form.Item
                    label="CVV"
                    name="cardCVV"
                    rules={[{ required: true, message: "Please enter your card CVV" }]}
                  >
                    <Input placeholder="Enter CVV" />
                  </Form.Item>
                  <Form.Item name="saveCardInfo" valuePropName="checked">
                    <Checkbox>Save card information</Checkbox>
                  </Form.Item>
                </div>
              );
            } else if (paymentMethod === "bank_transfer") {
              return (
                <div
                  style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}
                >
                  <h4>Bank Transfer / ACH Details</h4>
                  <Form.Item
                    label="Bank Account Number"
                    name="bankAccountNumber"
                    rules={[{ required: true, message: "Please enter your bank account number" }]}
                  >
                    <Input placeholder="Enter bank account number" />
                  </Form.Item>
                  <Form.Item
                    label="Bank Routing Number"
                    name="bankRoutingNumber"
                    rules={[{ required: true, message: "Please enter your bank routing number" }]}
                  >
                    <Input placeholder="Enter bank routing number" />
                  </Form.Item>
                  <Form.Item name="authorizeBankTransfer" valuePropName="checked">
                    <Checkbox>Authorize us to initiate the fund request</Checkbox>
                  </Form.Item>
                </div>
              );
            } else if (paymentMethod === "paypal") {
              return (
                <div
                  style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}
                >
                  <h4>PayPal</h4>
                  <p>You will be redirected to PayPal to link your account.</p>
                  <Button type="primary">Link PayPal Account</Button>
                </div>
              );
            }
            return null;
          }}
        </Form.Item>
        <h3>Billing Address</h3>
        <Form.Item
          label="Billing Street Address"
          name="billingAddress"
          rules={[{ required: true, message: "Please enter your billing street address" }]}
        >
          <Input placeholder="Enter billing street address" />
        </Form.Item>
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            label="Billing City"
            name="billingCity"
            rules={[{ required: true, message: "Please enter your billing city" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter billing city" />
          </Form.Item>
          <Form.Item
            label="Billing State/Province"
            name="billingState"
            rules={[{ required: true, message: "Please enter your billing state or province" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter billing state or province" />
          </Form.Item>
        </div>
        <Form.Item
          label="Billing Zip/Postal Code"
          name="billingZip"
          rules={[
            { required: true, message: "Please enter your billing zip/postal code" },
            {
              pattern: /^\d{5}(-\d{4})?$/,
              message: "Please enter a valid billing zip code",
            },
          ]}
        >
          <Input placeholder="Enter billing zip/postal code" />
        </Form.Item>
        <Form.Item
          label="Billing Country"
          name="billingCountry"
          rules={[{ required: true, message: "Billing country is required" }]}
        >
          <Input placeholder="Enter billing country" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default BillingStep;

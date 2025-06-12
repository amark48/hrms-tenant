"use client";
import '@ant-design/v5-patch-for-react-19';
import React from "react";
import { Form, Input, Select, Button, Checkbox, Typography, DatePicker, Row, Col } from "antd";
import moment from "moment";

const { Title } = Typography;

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

const US_STATES_OPTIONS = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  // ... add remaining US states here
];

const CANADIAN_PROVINCES_OPTIONS = [
  { label: "Alberta", value: "AB" },
  { label: "British Columbia", value: "BC" },
  { label: "Manitoba", value: "MB" },
  { label: "New Brunswick", value: "NB" },
  { label: "Newfoundland and Labrador", value: "NL" },
  { label: "Nova Scotia", value: "NS" },
  { label: "Ontario", value: "ON" },
  { label: "Prince Edward Island", value: "PE" },
  { label: "Quebec", value: "QC" },
  { label: "Saskatchewan", value: "SK" },
];

const COUNTRY_OPTIONS = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Other", value: "Other" },
];

interface BillingStepProps {
  tenant?: any; // Optional tenant data if needed.
}

const BillingStep: React.FC<BillingStepProps> = ({ tenant }) => {
  // Retrieve the shared form instance
  const formInstance = Form.useFormInstance();

  // Watch billing country to conditionally render state/province dropdown.
  const billingCountry = Form.useWatch("billingCountry", formInstance);

  // Render Billing State/Province field conditionally:
  const renderStateProvinceField = () => {
    if (billingCountry && billingCountry.toLowerCase() === "united states") {
      return (
        <Form.Item
          label="State"
          name="billingState"
          rules={[{ required: true, message: "Please select your state" }]}
        >
          <Select 
            placeholder="Select state" 
            options={US_STATES_OPTIONS} 
            onChange={(value) => formInstance.setFieldsValue({ billingState: value })}
          />
        </Form.Item>
      );
    } else if (billingCountry && billingCountry.toLowerCase() === "canada") {
      return (
        <Form.Item
          label="Province"
          name="billingState"
          rules={[{ required: true, message: "Please select your province" }]}
        >
          <Select 
            placeholder="Select province" 
            options={CANADIAN_PROVINCES_OPTIONS} 
            onChange={(value) => formInstance.setFieldsValue({ billingState: value })}
          />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item
          label="State/Province"
          name="billingState"
          rules={[{ required: true, message: "Please enter your billing state/province" }]}
        >
          <Input placeholder="Enter state/province" />
        </Form.Item>
      );
    }
  };

  return (
    <div>
      <Title level={3}>Payment Option / Type</Title>
      <Form.Item
        label="Payment Method"
        name="paymentMethod"
        rules={[{ required: true, message: "Please select a payment method" }]}
      >
        <Select 
          placeholder="Select a payment method" 
          options={PAYMENT_METHOD_OPTIONS} 
          onChange={(value) => formInstance.setFieldsValue({ paymentMethod: value })}
        />
      </Form.Item>

      <Form.Item shouldUpdate={(prev, curr) => prev.paymentMethod !== curr.paymentMethod}>
        {({ getFieldValue }) => {
          const paymentMethod = getFieldValue("paymentMethod");
          if (paymentMethod === "credit_card") {
            return (
              <div style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}>
                <Title level={4}>Credit Card Details</Title>
                <Form.Item
                  label="Card Type"
                  name="cardType"
                  rules={[{ required: true, message: "Please select your card type" }]}
                >
                  <Select 
                    placeholder="Select card type" 
                    options={CREDIT_CARD_TYPE_OPTIONS}
                    onChange={(value) => formInstance.setFieldsValue({ cardType: value })}
                  />
                </Form.Item>
                <Form.Item
                  label="Name on Card"
                  name="cardName"
                  rules={[{ required: true, message: "Please enter the name on the card" }]}
                >
                  <Input onChange={(e) => formInstance.setFieldsValue({ cardName: e.target.value })} placeholder="Enter name as printed on card" />
                </Form.Item>
                <Form.Item
                  label="Card Number"
                  name="cardNumber"
                  rules={[
                    { required: true, message: "Please enter your card number" },
                    {
                      pattern: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
                      message: "Card number must be in the format: xxxx-xxxx-xxxx-xxxx",
                    },
                  ]}
                >
                  <Input onChange={(e) => formInstance.setFieldsValue({ cardNumber: e.target.value })} placeholder="1234-5678-9012-3456" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Expiry Date"
                      name="cardExpiry"
                      rules={[{ required: true, message: "Please select the expiry date" }]}
                    >
                      <DatePicker
                        picker="month"
                        format="MM/YY"
                        style={{ width: "100%" }}
                        placeholder="MM/YY"
                        onChange={(date) => formInstance.setFieldsValue({ cardExpiry: date })}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="CVV"
                      name="cardCVV"
                      rules={[{ required: true, message: "Please enter the CVV" }]}
                    >
                      <Input onChange={(e) => formInstance.setFieldsValue({ cardCVV: e.target.value })} placeholder="CVV" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="saveCardInfo" valuePropName="checked">
                  <Checkbox onChange={(e) => formInstance.setFieldsValue({ saveCardInfo: e.target.checked })}>
                    Save card information
                  </Checkbox>
                </Form.Item>
              </div>
            );
          } else if (paymentMethod === "bank_transfer") {
            return (
              <div style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}>
                <Title level={4}>Bank Transfer / ACH Details</Title>
                <Form.Item
                  label="Account Name"
                  name="accountName"
                  rules={[{ required: true, message: "Please enter the account name" }]}
                >
                  <Input onChange={(e) => formInstance.setFieldsValue({ accountName: e.target.value })} placeholder="Enter account name" />
                </Form.Item>
                <Form.Item
                  label="Bank Account Number"
                  name="bankAccountNumber"
                  rules={[{ required: true, message: "Please enter your bank account number" }]}
                >
                  <Input onChange={(e) => formInstance.setFieldsValue({ bankAccountNumber: e.target.value })} placeholder="Enter bank account number" />
                </Form.Item>
                <Form.Item
                  label="Bank Routing Number"
                  name="bankRoutingNumber"
                  rules={[{ required: true, message: "Please enter your bank routing number" }]}
                >
                  <Input onChange={(e) => formInstance.setFieldsValue({ bankRoutingNumber: e.target.value })} placeholder="Enter bank routing number" />
                </Form.Item>
                <Form.Item name="authorizeBankTransfer" valuePropName="checked">
                  <Checkbox onChange={(e) => formInstance.setFieldsValue({ authorizeBankTransfer: e.target.checked })}>
                    Authorize us to initiate the fund request
                  </Checkbox>
                </Form.Item>
              </div>
            );
          } else if (paymentMethod === "paypal") {
            return (
              <div style={{ padding: "8px", border: "1px solid #f0f0f0", marginBottom: "16px" }}>
                <Title level={4}>PayPal</Title>
                <p>You will be redirected to PayPal to link your account.</p>
                <Button type="primary">Link PayPal Account</Button>
              </div>
            );
          }
          return null;
        }}
      </Form.Item>

      <Title level={3}>Billing Address</Title>
      {/* Billing Country appears above street address */}
      <Form.Item
        label="Billing Country"
        name="billingCountry"
        rules={[{ required: true, message: "Please select your billing country" }]}
      >
        <Select 
          placeholder="Select billing country" 
          options={COUNTRY_OPTIONS} 
          onChange={(value) => formInstance.setFieldsValue({ billingCountry: value })}
        />
      </Form.Item>
      <Form.Item
        label="Billing Street Address"
        name="billingAddress"
        rules={[{ required: true, message: "Please enter your billing street address" }]}
      >
        <Input onChange={(e) => formInstance.setFieldsValue({ billingAddress: e.target.value })} placeholder="Enter billing street address" />
      </Form.Item>
      {/* Billing City, Billing State/Province, Billing Zip on one row */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Billing City"
            name="billingCity"
            rules={[{ required: true, message: "Please enter your billing city" }]}
          >
            <Input onChange={(e) => formInstance.setFieldsValue({ billingCity: e.target.value })} placeholder="City" />
          </Form.Item>
        </Col>
        <Col span={8}>
          {renderStateProvinceField()}
        </Col>
        <Col span={8}>
          <Form.Item
            label="Billing Zip/Postal Code"
            name="billingZip"
            rules={[{ required: true, message: "Please enter your billing zip/postal code" }]}
          >
            <Input onChange={(e) => formInstance.setFieldsValue({ billingZip: e.target.value })} placeholder="Zip/Postal Code" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BillingStep;

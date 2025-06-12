"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useMemo } from "react";
import { Form, Typography, Divider, Row, Col, Button, Image } from "antd";

const { Title, Text, Paragraph } = Typography;

interface ReviewStepProps {
  tenant?: Record<string, any>; // Optional tenant data that may contain preexisting info.
}

const ReviewStep: React.FC<ReviewStepProps> = ({ tenant }) => {
  // Retrieve all values from the shared form instance.
  const formInstance = Form.useFormInstance();
  const formValues = formInstance.getFieldsValue();

  // Merge tenant info (if provided) with form values.
  // Form values take precedence over tenant values.
  const mergedValues = {
    ...(tenant || {}),
    ...formValues,
  };

  // Format card expiry if it's a moment-like value.
  const formattedCardExpiry =
    mergedValues.cardExpiry &&
    typeof mergedValues.cardExpiry.format === "function"
      ? mergedValues.cardExpiry.format("MM/YY")
      : mergedValues.cardExpiry || "-";

  // Build a summary object.
  const summary = useMemo(() => ({
    // Company Information
    companyName: mergedValues.companyName || "-",
    phone: mergedValues.phone || "-",
    companyWebsite: mergedValues.companyWebsite || "-",
    industry: mergedValues.industry || "-",
    address: mergedValues.address || "-",
    city: mergedValues.city || "-",
    state: mergedValues.state || "-",
    zip: mergedValues.zip || "-",
    country: mergedValues.country || "-",
    logoUrl: mergedValues.logoUrl || null,

    // Authentication Setup
    mfaEnabled: mergedValues.mfaEnabled ? "Yes" : "No",
    allowedMfa:
      mergedValues.allowedMfa && mergedValues.allowedMfa.length > 0
        ? mergedValues.allowedMfa.join(", ")
        : "-",

    // Subscription Plan
    subscriptionPlan: mergedValues.subscriptionPlan || "-",
    autoRenew: mergedValues.autoRenew ? "Yes" : "No",

    // Payment & Billing Information
    paymentMethod: mergedValues.paymentMethod || "-",
    // Credit Card Details:
    cardType: mergedValues.cardType || "-",
    cardName: mergedValues.cardName || "-",
    cardNumber: mergedValues.cardNumber || "-",
    cardExpiry: formattedCardExpiry,
    cardCVV: mergedValues.cardCVV || "-",
    saveCardInfo: mergedValues.saveCardInfo ? "Yes" : "No",
    // Bank Transfer Details:
    accountName: mergedValues.accountName || "-",
    bankAccountNumber: mergedValues.bankAccountNumber || "-",
    bankRoutingNumber: mergedValues.bankRoutingNumber || "-",
    authorizeBankTransfer: mergedValues.authorizeBankTransfer ? "Yes" : "No",
    // Billing Address:
    billingCountry: mergedValues.billingCountry || "-",
    billingAddress: mergedValues.billingAddress || "-",
    billingCity: mergedValues.billingCity || "-",
    billingState: mergedValues.billingState || "-",
    billingZip: mergedValues.billingZip || "-",
  }), [mergedValues, formattedCardExpiry]);

  return (
    <div style={{ padding: 24, backgroundColor: "#fff" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
        Review Your Information
      </Title>
      <Paragraph style={{ textAlign: "center", marginBottom: 24 }}>
        Please double-check all the details below. If everything is correct, click{" "}
        <strong>Submit All Information</strong>.
      </Paragraph>

      <Divider orientation="left">Company Information</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Company Name:</Text> {summary.companyName}
        </Col>
        <Col span={12}>
          <Text strong>Phone:</Text> {summary.phone}
        </Col>
        <Col span={12}>
          <Text strong>Website:</Text> {summary.companyWebsite}
        </Col>
        <Col span={12}>
          <Text strong>Industry:</Text> {summary.industry}
        </Col>
        <Col span={24}>
          <Text strong>Address:</Text>{" "}
          {`${summary.address}, ${summary.city}, ${summary.state}, ${summary.zip}, ${summary.country}`}
        </Col>
        {summary.logoUrl && (
          <Col span={24} style={{ textAlign: "center", marginTop: 16 }}>
            <Text strong>Logo Preview:</Text>
            <div style={{ marginTop: 8 }}>
              <Image src={summary.logoUrl} alt="Logo Preview" width={120} />
            </div>
          </Col>
        )}
      </Row>

      <Divider orientation="left">Authentication Setup</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>MFA Enabled:</Text> {summary.mfaEnabled}
        </Col>
        {mergedValues.mfaEnabled && (
          <Col span={12}>
            <Text strong>Allowed MFA:</Text> {summary.allowedMfa}
          </Col>
        )}
      </Row>

      <Divider orientation="left">Subscription Plan</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Subscription Plan:</Text> {summary.subscriptionPlan}
        </Col>
        <Col span={12}>
          <Text strong>Auto Renew:</Text> {summary.autoRenew}
        </Col>
      </Row>

      <Divider orientation="left">Payment & Billing</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Payment Method:</Text> {summary.paymentMethod}
        </Col>
      </Row>
      {mergedValues.paymentMethod === "credit_card" && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Card Type:</Text> {summary.cardType}
            </Col>
            <Col span={8}>
              <Text strong>Name on Card:</Text> {summary.cardName}
            </Col>
            <Col span={8}>
              <Text strong>Card Number:</Text> {summary.cardNumber}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Expiry Date:</Text> {summary.cardExpiry}
            </Col>
            <Col span={8}>
              <Text strong>CVV:</Text> {summary.cardCVV}
            </Col>
            <Col span={8}>
              <Text strong>Save Card Info:</Text> {summary.saveCardInfo}
            </Col>
          </Row>
        </>
      )}
      {mergedValues.paymentMethod === "bank_transfer" && (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>Account Name:</Text> {summary.accountName}
          </Col>
          <Col span={8}>
            <Text strong>Bank Account Number:</Text> {summary.bankAccountNumber}
          </Col>
          <Col span={8}>
            <Text strong>Bank Routing Number:</Text> {summary.bankRoutingNumber}
          </Col>
          <Col span={8}>
            <Text strong>Authorize Transfer:</Text> {summary.authorizeBankTransfer}
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Text strong>Billing Country:</Text> {summary.billingCountry}
        </Col>
        <Col span={8}>
          <Text strong>Billing Street Address:</Text> {summary.billingAddress}
        </Col>
        <Col span={8}>
          <Text strong>Billing City:</Text> {summary.billingCity}
        </Col>
        <Col span={8}>
          <Text strong>State/Province:</Text> {summary.billingState}
        </Col>
        <Col span={8}>
          <Text strong>Zip/Postal Code:</Text> {summary.billingZip}
        </Col>
      </Row>

      <Divider />
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col>
          <Button type="primary" htmlType="submit">
            Submit All Information
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStep;

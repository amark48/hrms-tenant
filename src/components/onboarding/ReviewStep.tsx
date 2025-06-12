"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useMemo } from "react";
import { Form, Typography, Divider, Row, Col, Button, Image } from "antd";

const { Title, Text, Paragraph } = Typography;

const ReviewStep: React.FC = () => {
  // Retrieve the shared form instance to access all entered data.
  const formInstance = Form.useFormInstance();
  const values = formInstance.getFieldsValue();

  // Prepare and structure the summary.
  // Adjust the keys below to match your actual form field names.
  const summary = useMemo(() => {
    return {
      // Company Information (Step 1)
      companyName: values.companyName || "-",
      phone: values.phone || "-",
      companyWebsite: values.companyWebsite || "-",
      industry: values.industry || "-",
      address: values.address || "-",
      city: values.city || "-",
      state: values.state || "-",
      zip: values.zip || "-",
      country: values.country || "-",
      logoUrl: values.logoUrl || null,

      // Authentication Setup (Step 2)
      mfaEnabled: values.mfaEnabled,
      allowedMfa: values.allowedMfa || [],

      // Subscription Plan (Step 3)
      subscriptionPlan: values.subscriptionPlan || "-",
      autoRenew: values.autoRenew ? "Yes" : "No",

      // Payment & Billing (Step 4 & 5)
      paymentMethod: values.paymentMethod || "-",
      // Credit Card Details:
      cardType: values.cardType || "-",
      cardName: values.cardName || "-",
      cardNumber: values.cardNumber || "-",
      cardExpiry: values.cardExpiry ? (typeof values.cardExpiry.format === "function" ? values.cardExpiry.format("MM/YY") : values.cardExpiry) : "-",
      cardCVV: values.cardCVV || "-",
      saveCardInfo: values.saveCardInfo ? "Yes" : "No",
      // Bank Transfer Details:
      accountName: values.accountName || "-",
      bankAccountNumber: values.bankAccountNumber || "-",
      bankRoutingNumber: values.bankRoutingNumber || "-",
      authorizeBankTransfer: values.authorizeBankTransfer ? "Yes" : "No",
      // Billing Address:
      billingCountry: values.billingCountry || "-",
      billingAddress: values.billingAddress || "-",
      billingCity: values.billingCity || "-",
      billingState: values.billingState || "-",
      billingZip: values.billingZip || "-",
    };
  }, [values]);

  return (
    <div style={{ padding: 24, backgroundColor: "#fff" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
        Review Your Information
      </Title>
      <Paragraph style={{ textAlign: "center", marginBottom: 24 }}>
        Please double-check all the details you provided. If everything is correct, click <strong>Submit All Information</strong>.
      </Paragraph>

      <Divider orientation="left">Company Information</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Company Name: </Text> {summary.companyName}
        </Col>
        <Col span={12}>
          <Text strong>Phone: </Text> {summary.phone}
        </Col>
        <Col span={12}>
          <Text strong>Website: </Text> {summary.companyWebsite}
        </Col>
        <Col span={12}>
          <Text strong>Industry: </Text> {summary.industry}
        </Col>
        <Col span={24}>
          <Text strong>Address: </Text>{" "}
          {`${summary.address}, ${summary.city}, ${summary.state}, ${summary.zip}, ${summary.country}`}
        </Col>
        {summary.logoUrl && (
          <Col span={24} style={{ textAlign: "center" }}>
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
          <Text strong>MFA Enabled: </Text> {summary.mfaEnabled ? "Yes" : "No"}
        </Col>
        {summary.mfaEnabled && (
          <Col span={12}>
            <Text strong>Allowed MFA: </Text>{" "}
            {summary.allowedMfa.length > 0 ? summary.allowedMfa.join(", ") : "-"}
          </Col>
        )}
      </Row>

      <Divider orientation="left">Subscription Plan</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Subscription Plan: </Text> {summary.subscriptionPlan}
        </Col>
        <Col span={12}>
          <Text strong>Auto Renew: </Text> {summary.autoRenew}
        </Col>
      </Row>

      <Divider orientation="left">Payment & Billing</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Payment Method: </Text> {summary.paymentMethod}
        </Col>
      </Row>
      {summary.paymentMethod === "credit_card" && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Card Type: </Text> {summary.cardType}
            </Col>
            <Col span={8}>
              <Text strong>Name on Card: </Text> {summary.cardName}
            </Col>
            <Col span={8}>
              <Text strong>Card Number: </Text> {summary.cardNumber}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Expiry Date: </Text> {summary.cardExpiry}
            </Col>
            <Col span={8}>
              <Text strong>CVV: </Text> {summary.cardCVV}
            </Col>
            <Col span={8}>
              <Text strong>Save Card Info: </Text> {summary.saveCardInfo}
            </Col>
          </Row>
        </>
      )}
      {summary.paymentMethod === "bank_transfer" && (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>Account Name: </Text> {summary.accountName}
          </Col>
          <Col span={8}>
            <Text strong>Bank Account Number: </Text> {summary.bankAccountNumber}
          </Col>
          <Col span={8}>
            <Text strong>Bank Routing Number: </Text> {summary.bankRoutingNumber}
          </Col>
          <Col span={8}>
            <Text strong>Authorize Transfer: </Text> {summary.authorizeBankTransfer}
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Text strong>Billing Country: </Text> {summary.billingCountry}
        </Col>
        <Col span={8}>
          <Text strong>Billing Street Address: </Text> {summary.billingAddress}
        </Col>
        <Col span={8}>
          <Text strong>Billing City: </Text> {summary.billingCity}
        </Col>
        <Col span={8}>
          <Text strong>State/Province: </Text> {summary.billingState}
        </Col>
        <Col span={8}>
          <Text strong>Zip/Postal Code: </Text> {summary.billingZip}
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

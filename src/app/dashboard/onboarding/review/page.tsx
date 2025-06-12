"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layout,
  Button,
  Typography,
  Steps,
  Descriptions,
  Space,
  message,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function ReviewPage() {
  const router = useRouter();

  // States to store details from previous steps.
  const [registrationInfo, setRegistrationInfo] = useState({
    email: "N/A",
    phone: "N/A",
    company: "N/A",
  });
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    plan: "N/A",
  });
  const [securityInfo, setSecurityInfo] = useState({
    mfaEnabled: false,
    mfaMethods: "N/A",
  });
  const [billingInfo, setBillingInfo] = useState({
    paymentMethod: "N/A",
    cardNumber: "N/A",
  });

  useEffect(() => {
    // Retrieve stored values from localStorage for each section.
    const regEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("registrationEmail") || "N/A"
        : "N/A";
    const regPhone =
      typeof window !== "undefined"
        ? localStorage.getItem("registrationPhone") || "N/A"
        : "N/A";
    const companyName =
      typeof window !== "undefined"
        ? localStorage.getItem("companyName") || "N/A"
        : "N/A";
    const subscriptionPlan =
      typeof window !== "undefined"
        ? localStorage.getItem("subscriptionPlan") || "N/A"
        : "N/A";
    const mfaEnabled =
      typeof window !== "undefined"
        ? localStorage.getItem("mfaEnabled") === "true"
        : false;
    const mfaMethods =
      typeof window !== "undefined"
        ? localStorage.getItem("mfaMethods") || "N/A"
        : "N/A";
    const paymentMethod =
      typeof window !== "undefined"
        ? localStorage.getItem("paymentMethod") || "N/A"
        : "N/A";
    const cardNumber =
      typeof window !== "undefined"
        ? localStorage.getItem("cardNumber") || "N/A"
        : "N/A";

    console.log("DEBUG: Registration Email:", regEmail);
    console.log("DEBUG: Registration Phone:", regPhone);
    console.log("DEBUG: Company Name:", companyName);
    console.log("DEBUG: Subscription Plan:", subscriptionPlan);
    console.log("DEBUG: MFA Enabled:", mfaEnabled);
    console.log("DEBUG: MFA Methods:", mfaMethods);
    console.log("DEBUG: Payment Method:", paymentMethod);
    console.log("DEBUG: Card Number:", cardNumber);

    setRegistrationInfo({ email: regEmail, phone: regPhone, company: companyName });
    setSubscriptionInfo({ plan: subscriptionPlan });
    setSecurityInfo({ mfaEnabled, mfaMethods });
    setBillingInfo({ paymentMethod, cardNumber });
  }, []);

  const completeOnboarding = () => {
    message.success("Onboarding complete!");
    router.push("/dashboard");
  };

  // Define an array of step titles.
  const stepsList = [
    "Welcome",
    "Secure Login",
    "Company Info",
    "Upload Logo",
    "Subscription",
    "Enhance Security",
    "Billing",
    "Review",
  ];

  const currentStep = 7; // Zero-based index; 7 means the Review step is current.

  // Render a custom step icon that always shows the step number.
  // If the step is already completed (index < currentStep), overlay a check mark.
  const renderStepIcon = (index: number) => {
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#1890ff",
          color: "#fff",
          lineHeight: "24px",
          textAlign: "center",
          fontSize: 12,
        }}
      >
        {index + 1}
        {index < currentStep && (
          <CheckOutlined
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              backgroundColor: "#fff",
              borderRadius: "50%",
              fontSize: 10,
              color: "#52c41a",
              padding: "0 1px",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Global CSS Overrides */}
      <style jsx global>{`
        .ant-steps-item {
          white-space: normal !important;
          flex: 1;
          min-width: 80px !important;
          text-align: center;
        }
        .ant-steps-item-title {
          white-space: normal !important;
          font-size: 12px !important;
        }
      `}</style>

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
          {/* Steps Container */}
          <div style={{ marginBottom: "24px" }}>
            <Steps current={currentStep} size="small">
              {stepsList.map((title, index) => (
                <Steps.Step
                  key={index}
                  title={title}
                  icon={renderStepIcon(index)}
                />
              ))}
            </Steps>
          </div>

          <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
            Onboarding Overview
          </Title>

          {/* Registration Information */}
          <Descriptions
            title="Registration Information"
            bordered
            column={1}
            extra={
              <Link href="/dashboard/onboarding/company-info">
                <Button type="link">Edit</Button>
              </Link>
            }
          >
            <Descriptions.Item label="Email">
              {registrationInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {registrationInfo.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Company">
              {registrationInfo.company}
            </Descriptions.Item>
          </Descriptions>

          <br />

          {/* Subscription Information */}
          <Descriptions
            title="Subscription Information"
            bordered
            column={1}
            extra={
              <Link href="/dashboard/onboarding/subscription">
                <Button type="link">Edit</Button>
              </Link>
            }
          >
            <Descriptions.Item label="Plan">
              {subscriptionInfo.plan}
            </Descriptions.Item>
          </Descriptions>

          <br />

          {/* Security Setup */}
          <Descriptions
            title="Security Setup"
            bordered
            column={1}
            extra={
              <Link href="/dashboard/onboarding/auth-setup">
                <Button type="link">Edit</Button>
              </Link>
            }
          >
            <Descriptions.Item label="MFA Enabled">
              {securityInfo.mfaEnabled ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="MFA Methods">
              {securityInfo.mfaMethods}
            </Descriptions.Item>
          </Descriptions>

          <br />

          {/* Billing Information */}
          <Descriptions
            title="Billing Information"
            bordered
            column={1}
            extra={
              <Link href="/dashboard/onboarding/billing">
                <Button type="link">Edit</Button>
              </Link>
            }
          >
            <Descriptions.Item label="Payment Method">
              {billingInfo.paymentMethod}
            </Descriptions.Item>
            {billingInfo.paymentMethod === "creditCard" && (
              <Descriptions.Item label="Card Number">
                {billingInfo.cardNumber}
              </Descriptions.Item>
            )}
          </Descriptions>

          <br />

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={completeOnboarding}>
              Complete Onboarding
            </Button>
          </Space>
        </div>
      </Layout.Content>

      {/* Footer */}
      <Layout.Footer style={{ textAlign: "center" }}>
        Enterprise HRMS ©2025 Created by Your Company Name
      </Layout.Footer>
    </Layout>
  );
}

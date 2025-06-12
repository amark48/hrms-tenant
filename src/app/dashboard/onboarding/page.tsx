"use client";

import React, { useEffect, useState } from "react";
import { Layout, Steps, Button, Form, message } from "antd";
import DashboardHeader from "../DashboardHeader/page";

// Import your step components (ensure these are updated similarly to assume blank inputs)
import WelcomeStep from "../../../components/onboarding/WelcomeStep";
import CompanyInfoAndLogoForm from "../../../components/onboarding/CompanyInfoAndLogoForm";
import AuthenticationSetupStep from "../../../components/onboarding/AuthenticationSetupStep";
import SubscriptionStep from "../../../components/onboarding/SubscriptionStep";
import BillingStep from "../../../components/onboarding/BillingStep";
import ReviewStep from "../../../components/onboarding/ReviewStep";

// Utility for role-based menus if needed
import { getAccessibleMenuItems } from "../../../utils/menuConfig";

const { Content, Footer } = Layout;
const { Step } = Steps;

// Container style constants
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
};
const wizardContainerStyle = {
  marginTop: "40px",
  minHeight: "300px",
  padding: "24px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const LOCAL_STORAGE_KEY = "onboardingData";
const LOCAL_STEP_KEY = "onboardingCurrentStep";

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedValues = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedValues) {
        form.setFieldsValue(JSON.parse(savedValues));
      }
      const savedStep = localStorage.getItem(LOCAL_STEP_KEY);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (err) {
      console.error("Failed to load saved onboarding data", err);
    }
  }, [form]);

  // Persist step changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STEP_KEY, String(currentStep));
  }, [currentStep]);


  // For demonstration, assume a default role for UI rendering.
  const userRoles = ["employee"];
  const menuItems = getAccessibleMenuItems(userRoles);

  // Save progress from the current step.
  const saveProgress = async () => {
    try {
      await form.validateFields();
      message.success("Progress saved!");
    } catch (error) {
      message.error("Validation failed. Please check your inputs.");
    }
  };

  // Next step: validate current step fields then proceed.
  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      message.error("Please complete the required fields before proceeding.");
    }
  };

  // Previous step.
  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Finish onboarding: validate final step and submit.
  const finishOnboarding = async () => {
    try {
      await form.validateFields();
      // Here you would handle final submission.
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STEP_KEY);
      message.success("Onboarding process completed!");
    } catch (error) {
      message.error("Please confirm that all information is valid before finishing.");
    }
  };

  // Define the wizard steps.
  const steps = [
    {
      title: "Welcome",
      content: <WelcomeStep />,
    },
    {
      title: "Company Info",
      content: (
        <CompanyInfoAndLogoForm form={form} />
      ),
    },
    {
      title: "Authentication",
      content: (
        <AuthenticationSetupStep
          initialMfaEnabled={false}
          initialAllowedMfa={[]}
        />
      ),
    },
    {
      title: "Subscription",
      content: <SubscriptionStep form={form} />,
    },
    {
      title: "Billing Information",
      content: <BillingStep form={form} />,
    },
    {
      title: "Review & Finish",
      content: <ReviewStep />,
    },
  ];

  // If any async loading was needed, show a spinner.
  // For this simplified version, we assume immediate availability.
  // Render the wizard.
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardHeader
        menuItems={menuItems}
        userMenuItems={[
          { key: "profile", label: "Profile" },
          { key: "logout", label: "Logout" },
        ]}
      />
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div style={containerStyle}>
          <Steps current={currentStep} style={{ marginBottom: 40 }}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={(_, allValues) =>
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allValues))
            }
          >
            <div style={wizardContainerStyle}>{steps[currentStep].content}</div>
          </Form>
          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Button style={{ marginRight: "8px" }} onClick={saveProgress}>
              Save Progress
            </Button>
            {currentStep > 0 && (
              <Button style={{ marginRight: "8px" }} onClick={prev}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={finishOnboarding}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default OnboardingWizard;

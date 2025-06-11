"use client";

import React, { useState, useEffect } from "react";
import { Layout, Steps, Button, Form, message, Spin } from "antd";
import DashboardHeader from "../DashboardHeader/page";

// Import modular step components
import WelcomeStep from "../../../components/onboarding/WelcomeStep";
import CompanyInformationForm from "../../../components/onboarding/CompanyInformationForm";
import CompanyLogoStep from "../../../components/onboarding/CompanyLogoStep";
import SubscriptionStep from "../../../components/onboarding/SubscriptionStep";
import AuthenticationSetupStep from "../../../components/onboarding/AuthenticationSetupStep";
import BillingStep from "../../../components/onboarding/BillingStep";
import ReviewStep from "../../../components/onboarding/ReviewStep";

// Import the utility for role-based menu items.
// Make sure that getAccessibleMenuItems returns standardMenuItems if roles is empty.
import { getAccessibleMenuItems } from "../../../utils/menuConfig";

const { Content, Footer } = Layout;
const { Step } = Steps;

// Define interfaces for company info and tenant
export interface CompanyInfo {
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  paymentMethod?: string;
  cardType?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  saveCardInfo?: boolean;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  authorizeBankTransfer?: boolean;
  paypalLinked?: boolean;
  mfaEnabled?: boolean;
  allowedMfa?: string[];
  industry?: string;
}

let initialCompanyInfo: CompanyInfo = {};

export interface Tenant {
  id: string;
  name: string;
  country: string;
  addresses?: any;
  logoUrl?: string;
  mfaEnabled?: boolean;
  allowedMfa?: string[];
  industry?: string;
  [key: string]: any;
}

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

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [form] = Form.useForm();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Load user and tenant info from localStorage (simulate logged-in user)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // Set roles from user.roles (or user.role) if available. Use a fallback if empty.
      const roles =
        (Array.isArray(user.roles) && user.roles.length > 0
          ? user.roles
          : user.role
          ? [user.role]
          : ["employee"]) || ["employee"];
      setUserRoles(roles);
      if (user.tenantId) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiUrl}/tenants/${user.tenantId}`)
          .then((res) => res.json())
          .then((data) => {
            setTenant(data);
            setLoadingTenant(false);
          })
          .catch((err) => {
            console.error("Error fetching tenant", err);
            setLoadingTenant(false);
          });
      } else {
        setLoadingTenant(false);
      }
    } else {
      // Fallback: if no user is present, assume default role (for instance "employee")
      setUserRoles(["employee"]);
      setLoadingTenant(false);
    }
  }, []);

  // Merge saved progress and tenant data into form values.
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingProgress");
    let initialData: CompanyInfo = savedData ? JSON.parse(savedData) : {};
    if (tenant) {
      if (!initialData.companyName) {
        initialData.companyName = tenant.name;
      }
      if (!initialData.country) {
        initialData.country = tenant.country || "";
      }
      // Merge mailing address from tenant (if available)
      let mailingAddress: any = null;
      if (tenant.addresses) {
        if (Array.isArray(tenant.addresses)) {
          mailingAddress = tenant.addresses.find(
            (addr: any) => addr.addressType === "mailing"
          );
        } else if (tenant.addresses.addressType === "mailing") {
          mailingAddress = tenant.addresses;
        }
      }
      if (mailingAddress) {
        if (!initialData.address) initialData.address = mailingAddress.street;
        if (!initialData.city) initialData.city = mailingAddress.city;
        if (!initialData.state) initialData.state = mailingAddress.state;
        if (!initialData.zip) initialData.zip = mailingAddress.postalCode;
        if (!initialData.country && mailingAddress.country)
          initialData.country = mailingAddress.country;
      }
      // Merge billing address from tenant (if available)
      let billingAddress: any = null;
      if (tenant.addresses) {
        if (Array.isArray(tenant.addresses)) {
          billingAddress = tenant.addresses.find(
            (addr: any) => addr.addressType === "billing"
          );
        } else if (tenant.addresses.addressType === "billing") {
          billingAddress = tenant.addresses;
        }
      }
      if (billingAddress) {
        if (!initialData.billingAddress)
          initialData.billingAddress = billingAddress.street;
        if (!initialData.billingCity)
          initialData.billingCity = billingAddress.city;
        if (!initialData.billingState)
          initialData.billingState = billingAddress.state;
        if (!initialData.billingZip)
          initialData.billingZip = billingAddress.postalCode;
        if (!initialData.billingCountry)
          initialData.billingCountry = billingAddress.country;
      }
      // Pre-populate industry if not already set in form
      if (tenant.industry && !initialData.industry) {
        initialData.industry = tenant.industry;
      }
      // Merge MFA settings if available.
      if (tenant.mfaEnabled !== undefined) {
        initialData.mfaEnabled = tenant.mfaEnabled;
      }
      if (tenant.allowedMfa) {
        initialData.allowedMfa = tenant.allowedMfa;
      }
    }
    setCompanyInfo(initialData);
    form.setFieldsValue(initialData);
  }, [form, tenant]);

  // Save progress – validate fields on steps using the form (steps 1 & 5)
  const saveProgress = async () => {
    try {
      if (currentStep === 1 || currentStep === 5) {
        await form.validateFields();
        const values = form.getFieldsValue();
        setCompanyInfo(values);
        localStorage.setItem("onboardingProgress", JSON.stringify(values));
      }
      message.success("Progress saved!");
    } catch (error) {
      message.error("Validation failed. Please check your inputs.");
    }
  };

  // Next step: validate if required, then proceed.
  const next = async () => {
    if (currentStep === 1 || currentStep === 5) {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        setCompanyInfo(values);
        localStorage.setItem("onboardingProgress", JSON.stringify(values));
      } catch (error) {
        message.error("Please complete the required fields before proceeding.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  // Previous step function.
  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Finish onboarding: validate final step and clear saved progress.
  const finishOnboarding = async () => {
    try {
      if (currentStep === 1 || currentStep === 5) {
        await form.validateFields();
      }
      message.success("Onboarding process completed!");
      localStorage.removeItem("onboardingProgress");
    } catch (error) {
      message.error("Please confirm that all information is valid before finishing.");
    }
  };

  // Extract MFA settings (if any) from tenant for the Authentication Setup step.
  const initialMfaEnabled = tenant?.mfaEnabled ?? false;
  const initialAllowedMfa = tenant?.allowedMfa ?? [];

  // Define wizard steps with modular components.
  const steps = [
    { title: "Welcome", content: <WelcomeStep /> },
    { title: "Company Information", content: <CompanyInformationForm form={form} tenant={tenant} /> },
    { title: "Company Logo", content: <CompanyLogoStep tenant={tenant} /> },
    { title: "Subscription", content: <SubscriptionStep /> },
    {
      title: "Authentication Setup",
      content: (
        <AuthenticationSetupStep
          initialMfaEnabled={initialMfaEnabled}
          initialAllowedMfa={initialAllowedMfa}
        />
      ),
    },
    { title: "Billing Information", content: <BillingStep form={form} /> },
    { title: "Review & Finish", content: <ReviewStep companyInfo={companyInfo} /> },
  ];

  // Get the filtered topbar menu items based on user roles.
  // Fallback: if userRoles is empty, we assume the user is an "employee".
  const menuItems = getAccessibleMenuItems(userRoles && userRoles.length > 0 ? userRoles : ["employee"]);

  if (loadingTenant) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <DashboardHeader
          menuItems={menuItems}
          userMenuItems={[
            { key: "profile", label: "Profile" },
            { key: "logout", label: "Logout" },
          ]}
        />
        <Content style={{ padding: "40px 20px", marginTop: "64px", textAlign: "center" }}>
          <Spin size="large" />
        </Content>
        <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
          Enterprise HRMS ©2025 | All Rights Reserved.
        </Footer>
      </Layout>
    );
  }

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
          {/* Wrap step content in a Form to ensure the Form instance is always connected */}
          <Form form={form} layout="vertical">
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

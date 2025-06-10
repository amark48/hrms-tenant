"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Steps,
  Button,
  Form,
  Input,
  message,
  Upload,
  Select,
  Spin,
  Switch,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
// Import DashboardHeader from the correct relative path
import DashboardHeader from "../DashboardHeader/page";

const { Content, Footer } = Layout;
const { Step } = Steps;

// Container styles
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

// Dropdown options for US states and Canadian provinces
const US_STATES_OPTIONS = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
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
  { label: "Northwest Territories", value: "NT" },
  { label: "Nunavut", value: "NU" },
  { label: "Yukon", value: "YT" },
];

export interface CompanyInfo {
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

let initialCompanyInfo: CompanyInfo = {};

export interface Tenant {
  id: string;
  name: string;
  country: string;
  addresses?: any;
  logoUrl?: string;
  [key: string]: any;
}

//
// Step 1: Welcome
//
const WelcomeStep = () => (
  <div>
    <h2>Welcome to Enterprise HRMS Onboarding</h2>
    <p>
      Thank you for choosing Enterprise HRMS. Click “Next” to begin the process.
    </p>
  </div>
);

//
// Step 2: Company Information
//
type CompanyInformationFormProps = {
  form: any;
};

const CompanyInformationForm: React.FC<CompanyInformationFormProps> = ({
  form,
}) => {
  const selectedCountry = Form.useWatch("country", form);
  return (
    <Form layout="vertical" form={form} name="companyInfoForm">
      <Form.Item
        label="Company Name"
        name="companyName"
        rules={[{ required: true, message: "Please enter your company name" }]}
      >
        <Input placeholder="Enter your company name" />
      </Form.Item>
      <Form.Item
        label="Street Address"
        name="address"
        rules={[{ required: true, message: "Please enter your street address" }]}
      >
        <Input placeholder="Enter street address" />
      </Form.Item>
      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: "Please enter your city" }]}
      >
        <Input placeholder="Enter city" />
      </Form.Item>
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: "Country is required" }]}
      >
        <Input disabled placeholder="Country" />
      </Form.Item>
      {selectedCountry === "United States" ? (
        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "Please select your state" }]}
        >
          <Select placeholder="Select state" options={US_STATES_OPTIONS} />
        </Form.Item>
      ) : selectedCountry === "Canada" ? (
        <Form.Item
          label="Province"
          name="state"
          rules={[{ required: true, message: "Please select your province" }]}
        >
          <Select
            placeholder="Select province"
            options={CANADIAN_PROVINCES_OPTIONS}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="State/Province"
          name="state"
          rules={[{ required: true, message: "Please enter your state or province" }]}
        >
          <Input placeholder="Enter state or province" />
        </Form.Item>
      )}
      <Form.Item
        label="Zip/Postal Code"
        name="zip"
        rules={[
          { required: true, message: "Please enter your zip/postal code" },
          {
            pattern: /^\d{5}(-\d{4})?$/,
            message:
              "Please enter a valid zip code (e.g., 12345 or 12345-6789)",
          },
        ]}
      >
        <Input placeholder="Enter zip/postal code" />
      </Form.Item>
    </Form>
  );
};

//
// Step 3: Company Logo – Display preview from tenant info if available
//
type CompanyLogoStepProps = {
  tenant: Tenant | null;
};

const CompanyLogoStep: React.FC<CompanyLogoStepProps> = ({ tenant }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const getTenantLogoUrl = (logoUrl?: string) => {
    if (!logoUrl) return "";
    return logoUrl.startsWith("http")
      ? logoUrl
      : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${logoUrl}`;
  };
  const onChange = (info: any) => {
    setFileList([...info.fileList]);
  };
  return (
    <div>
      <h3>Company Logo</h3>
      {tenant && tenant.logoUrl ? (
        <div style={{ marginBottom: "16px" }}>
          <img
            src={getTenantLogoUrl(tenant.logoUrl)}
            alt="Company Logo Preview"
            style={{ maxHeight: "150px" }}
          />
        </div>
      ) : (
        <p>No logo available. Please upload one.</p>
      )}
      <Upload fileList={fileList} onChange={onChange} beforeUpload={() => false}>
        <Button icon={<UploadOutlined />}>Upload New Logo</Button>
      </Upload>
    </div>
  );
};

//
// Step 4: Subscription – Fetch subscriptions and show extra details
//
type SubscriptionOption = {
  id: string;
  name: string;
  description?: string;
};

const SubscriptionStep: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionOption | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/subscriptions`)
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
      })
      .catch((err) => {
        console.error("Error fetching subscriptions", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

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
              const sub =
                subscriptions.find((s) => s.id === value) || null;
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
            {selectedSubscription.description ||
              "No description available."}
          </p>
        </div>
      )}
    </div>
  );
};

//
// Step 5: Authentication Setup – Enable MFA and select allowed MFA types via checkboxes
//
const AuthenticationSetupStep: React.FC = () => {
  const [form] = Form.useForm();
  const [mfaTypes, setMfaTypes] = useState<{ id: string; name: string }[]>([]);
  const [loadingMfa, setLoadingMfa] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/auth/get-mfa-types`)
      .then((res) => res.json())
      .then((data) => {
        // Map through each MFA type, safely reading mfa.dataValues?.name.
        const validMfaTypes = Array.isArray(data)
          ? data
              .map((mfa: any) => {
                const mfaName = mfa.dataValues?.name;
                if (!mfaName) return null;
                return { id: mfaName, name: mfaName };
              })
              .filter(Boolean)
          : [];
        console.debug("Extracted MFA types:", validMfaTypes.map((m) => m.name));
        setMfaTypes(validMfaTypes);
      })
      .catch((err) => {
        console.error("Error fetching MFA types", err);
      })
      .finally(() => {
        setLoadingMfa(false);
      });
  }, []);

  // Use useWatch to monitor the "mfaEnabled" state in this form.
  const mfaEnabled = Form.useWatch("mfaEnabled", form);

  return (
    <Form
      layout="vertical"
      name="authSetupForm"
      form={form}
      initialValues={{ mfaEnabled: false }}
    >
      <Form.Item
        label="Enable Multi-Factor Authentication"
        name="mfaEnabled"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {mfaEnabled && (
        loadingMfa ? (
          <Spin size="large" />
        ) : (
          <Form.Item
            label="Allowed MFA Types"
            name="allowedMfa"
            rules={[
              {
                required: true,
                message: "Please select one or more MFA types",
              },
            ]}
          >
            <Checkbox.Group
              options={mfaTypes.map((mfa) => ({
                label: mfa.name,
                value: mfa.id,
              }))}
            />
          </Form.Item>
        )
      )}
    </Form>
  );
};

//
// Step 6: Billing Information
//
const BillingStep = () => (
  <div>
    <h3>Billing Information</h3>
    <p>
      Enter your billing details such as billing address, payment method, etc.
    </p>
  </div>
);

//
// Step 7: Review & Finish
//
type ReviewStepProps = { companyInfo: CompanyInfo };

const ReviewStep: React.FC<ReviewStepProps> = ({ companyInfo }) => (
  <div>
    <h3>Review Your Information</h3>
    <p>Please confirm that the following details are correct:</p>
    <ul>
      <li>
        <strong>Company Name:</strong> {companyInfo.companyName || "N/A"}
      </li>
      <li>
        <strong>Address:</strong> {companyInfo.address || "N/A"}
      </li>
      <li>
        <strong>City:</strong> {companyInfo.city || "N/A"}
      </li>
      <li>
        <strong>
          {companyInfo.country === "Canada" ? "Province" : "State"}:
        </strong>{" "}
        {companyInfo.state || "N/A"}
      </li>
      <li>
        <strong>Zip/Postal Code:</strong> {companyInfo.zip || "N/A"}
      </li>
      <li>
        <strong>Country:</strong> {companyInfo.country || "N/A"}
      </li>
    </ul>
  </div>
);

//
// Main OnboardingWizard Component
//
const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [form] = Form.useForm();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);

  // Fetch tenant info based on the logged-in user's tenantId.
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
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
      setLoadingTenant(false);
    }
  }, []);

  // Merge saved progress with tenant info and pre-populate form values.
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
      let mailingAddress: any = null;
      if (tenant.addresses) {
        if (Array.isArray(tenant.addresses)) {
          mailingAddress = tenant.addresses.find(
            (addr) => addr.addressType === "mailing"
          );
        } else if (tenant.addresses.addressType === "mailing") {
          mailingAddress = tenant.addresses;
        }
      }
      if (mailingAddress) {
        if (!initialData.address) {
          initialData.address = mailingAddress.street;
        }
        if (!initialData.city) {
          initialData.city = mailingAddress.city;
        }
        if (!initialData.state) {
          initialData.state = mailingAddress.state;
        }
        if (!initialData.zip) {
          initialData.zip = mailingAddress.postalCode;
        }
        if (!initialData.country && mailingAddress.country) {
          initialData.country = mailingAddress.country;
        }
      }
    }
    setCompanyInfo(initialData);
    form.setFieldsValue(initialData);
  }, [form, tenant]);

  const saveProgress = async () => {
    try {
      if (currentStep === 1) {
        await form.validateFields();
        const values = form.getFieldsValue();
        setCompanyInfo(values);
        localStorage.setItem("onboardingProgress", JSON.stringify(values));
      } else {
        message.info("Progress saved!");
      }
      message.success("Progress saved!");
    } catch (error) {
      message.error("Validation failed. Please check your inputs.");
    }
  };

  const next = async () => {
    if (currentStep === 1) {
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
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const finishOnboarding = async () => {
    try {
      if (currentStep === 1) {
        await form.validateFields();
      }
      message.success("Onboarding process completed!");
      localStorage.removeItem("onboardingProgress");
    } catch (error) {
      message.error("Please confirm that all information is valid before finishing.");
    }
  };

  const steps = [
    { title: "Welcome", content: <WelcomeStep /> },
    { title: "Company Information", content: <CompanyInformationForm form={form} /> },
    { title: "Company Logo", content: <CompanyLogoStep tenant={tenant} /> },
    { title: "Subscription", content: <SubscriptionStep /> },
    { title: "Authentication Setup", content: <AuthenticationSetupStep /> },
    { title: "Billing Information", content: <BillingStep /> },
    { title: "Review \u0026 Finish", content: <ReviewStep companyInfo={companyInfo} /> },
  ];

  if (loadingTenant) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <DashboardHeader
          menuItems={[
            { key: "dashboard", label: "Dashboard" },
            { key: "employees", label: "Employees" },
            { key: "attendance", label: "Attendance" },
            { key: "reports", label: "Reports" },
            { key: "settings", label: "Settings" },
          ]}
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
        menuItems={[
          { key: "dashboard", label: "Dashboard" },
          { key: "employees", label: "Employees" },
          { key: "attendance", label: "Attendance" },
          { key: "reports", label: "Reports" },
          { key: "settings", label: "Settings" },
        ]}
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
          <div style={wizardContainerStyle}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{ display: currentStep === index ? "block" : "none" }}
              >
                {step.content}
              </div>
            ))}
          </div>
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

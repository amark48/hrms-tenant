"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Upload, 
  message 
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Industry options
const INDUSTRY_OPTIONS = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Education", value: "education" },
  { label: "Other", value: "other" },
];

// US states list
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

// Canadian provinces list
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

// Countries list
const COUNTRY_OPTIONS = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "Other", value: "Other" },
];

export interface CompanyInfoAndLogoFormProps {
  form: any; // Provided by the wizard so that the entire process uses a single form
  tenant?: any; // Optional: for debug purposes (new tenant onboarding normally starts empty)
  onLogoChange?: (file: File) => void;
}

const CompanyInfoAndLogoForm: React.FC<CompanyInfoAndLogoFormProps> = ({ form, tenant, onLogoChange }) => {
  if (!form) {
    throw new Error("CompanyInfoAndLogoForm requires a valid form instance.");
  }
  
  // Debug log to track incoming tenant data (if any)
  useEffect(() => {
    console.log("DEBUG - CompanyInfoAndLogoForm received tenant:", tenant);
  }, [tenant]);

  // Helper function to compute the full URL of the logo.
  const computeLogoUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  // Get the initial logo preview—the form instance is assumed to be shared.
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    form.getFieldValue("logoUrl") || computeLogoUrl(tenant?.logoUrl)
  );

  // For new tenants, we no longer prepopulate fields from an existing tenant object.
  // We assume all fields are blank (or set with defaults) when the form loads.
  // However, if the tenant prop exists (for debugging), you may log it.
  useEffect(() => {
    // No merging of tenant data is done here—the fields are meant to be filled out afresh.
    console.log("DEBUG - CompanyInfoAndLogoForm: initializing form with blank defaults.");
  }, []);

  // Handle logo file change: update preview and set form field.
  const handleLogoChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    console.log("DEBUG - New logo file selected, preview URL:", previewUrl);
    setLogoPreview(previewUrl);
    form.setFieldsValue({ logoUrl: previewUrl });
    if (onLogoChange) {
      onLogoChange(file);
    }
  };

  const beforeLogoUpload = (file: File) => {
    const isImg = file.type.startsWith("image/");
    if (!isImg) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    handleLogoChange(file);
    return false; // Prevent auto-upload.
  };

  const logoUploadButton = (
    <Upload beforeUpload={beforeLogoUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Replace Logo</Button>
    </Upload>
  );

  // Determine which state/province field to display based on country selection.
  const selectedCountry = Form.useWatch("country", form);
  const normalizedCountry = (selectedCountry || "").toLowerCase().trim();
  const isUS = normalizedCountry === "us" || normalizedCountry === "united states" || normalizedCountry === "usa";
  const isCanada = normalizedCountry === "canada" || normalizedCountry === "ca";

  const renderStateProvinceField = () => {
    if (isUS) {
      return (
        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "Please select your state" }]}
        >
          <Select placeholder="Select state" options={US_STATES_OPTIONS} />
        </Form.Item>
      );
    } else if (isCanada) {
      return (
        <Form.Item
          label="Province"
          name="state"
          rules={[{ required: true, message: "Please select your province" }]}
        >
          <Select placeholder="Select province" options={CANADIAN_PROVINCES_OPTIONS} />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item
          label="State/Province"
          name="state"
          rules={[{ required: false, message: "Providing state/province is recommended" }]}
        >
          <Input placeholder="Enter state/province (optional)" />
        </Form.Item>
      );
    }
  };

  return (
    <>
      <Title level={4}>Company Information</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please enter your company name" }]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Contact Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your contact phone" }]}
          >
            <Input placeholder="Enter your contact phone" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Industry"
            name="industry"
            rules={[{ required: true, message: "Please select your industry" }]}
          >
            <Select placeholder="Select industry" options={INDUSTRY_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Website" name="companyWebsite">
            <Input placeholder="Enter your company website" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Street Address"
        name="address"
        rules={[{ required: true, message: "Please enter your street address" }]}
      >
        <Input placeholder="Enter street address" />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter your city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col span={12}>
          {renderStateProvinceField()}
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select your country" }]}
          >
            <Select placeholder="Select country" options={COUNTRY_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Zip/Postal Code"
            name="zip"
            rules={[
              { required: true, message: "Please enter your zip/postal code" },
              {
                pattern: /^\d{5}(-\d{4})?$/,
                message: "Please enter a valid zip code (e.g., 12345 or 12345-6789)",
              },
            ]}
          >
            <Input placeholder="Enter your zip/postal code" />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Title level={4}>Branding</Title>
        {logoPreview ? (
          <>
            <img
              src={logoPreview}
              alt="Brand Logo Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
            {logoUploadButton}
          </>
        ) : (
          logoUploadButton
        )}
        <div style={{ marginTop: "10px", color: "red" }}>
          DEBUG - Logo served from: {logoPreview || "None"}
        </div>
      </div>

      {/* On-screen debug panel for tenant info (if provided) */}
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e8e8e8", borderRadius: "4px" }}>
        <Title level={5}>Tenant Debug Info</Title>
        <Text strong>Tenant Data Received:</Text>
        <pre style={{ backgroundColor: "#fff", padding: "8px", borderRadius: "4px", marginTop: "10px" }}>
          {tenant ? JSON.stringify(tenant, null, 2) : "No tenant data provided"}
        </pre>
      </div>
    </>
  );
};

export default CompanyInfoAndLogoForm;

import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Row, Col, Typography, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
  form: any;
  tenant?: {
    id?: string;
    name?: string;
    domain?: string;
    adminEmail?: string;
    subscriptionId?: string;
    industry?: string;
    addresses?: Array<{
      addressType?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      phone?: string;
    }>;
    street?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    companyWebsite?: string;
    phone?: string;
    // Existing logo provided by the backend (absolute URL is expected)
    logoUrl?: string;
  };
  onLogoChange?: (file: File) => void;
}

const CompanyInfoAndLogoForm: React.FC<CompanyInfoAndLogoFormProps> = ({ form, tenant, onLogoChange }) => {
  // Debug log the raw tenant.logoUrl.
  useEffect(() => {
    console.log("DEBUG - Tenant logoUrl (raw):", tenant?.logoUrl);
  }, [tenant]);

  // Helper to compute the full logo URL.
  // If tenant.logoUrl starts with 'http', return it; otherwise, prefix it with NEXT_PUBLIC_API_URL.
  const computeLogoUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  // On mount, if the form already contains a logoUrl (from previous upload), use it.
  useEffect(() => {
    const formLogo = form.getFieldValue("logoUrl");
    if (formLogo) {
      setLogoPreview(formLogo);
    }
  }, [form]);

  // Local state to hold the logo preview URL.
  // Prioritize the form value over tenant.logoUrl.
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    form.getFieldValue("logoUrl") || computeLogoUrl(tenant?.logoUrl)
  );

  // Pre-populate other form fields if not already set.
  useEffect(() => {
    if (tenant && form && !form.getFieldValue("companyName")) {
      const mailingAddress =
        tenant.addresses?.find((addr) => addr.addressType === "mailing") || {};
      const initialValues = {
        companyName: tenant.name ?? "",
        phone: mailingAddress.phone ?? "",
        companyWebsite: tenant.companyWebsite ?? "",
        address: mailingAddress.street ?? tenant.street ?? tenant.address ?? "",
        city: mailingAddress.city ?? tenant.city ?? "",
        state: mailingAddress.state ?? tenant.state ?? "",
        zip: mailingAddress.zip ?? tenant.zip ?? "",
        country: mailingAddress.country ?? tenant.country ?? "",
        industry: tenant.industry ?? "",
        logoUrl: form.getFieldValue("logoUrl") || computeLogoUrl(tenant.logoUrl),
      };
      form.setFieldsValue(initialValues);
      console.log("DEBUG - Form pre-populated with:", initialValues);
    }
  }, [tenant, form]);

  // Determine which State/Province field to render based on the selected country.
  const selectedCountry = Form.useWatch("country", form);
  const getNormalizedCountry = (country?: string) => (country || "").toLowerCase().trim();
  const normalizedCountry = getNormalizedCountry(selectedCountry);
  const isUS =
    normalizedCountry === "us" ||
    normalizedCountry === "united states" ||
    normalizedCountry === "usa";
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

  // --- Branding Section: Logo Upload & Preview ---
  const handleLogoChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    console.log("DEBUG - New logo file selected, preview URL:", previewUrl);
    setLogoPreview(previewUrl);
    // Persist the new logo in the form.
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
    return false;
  };

  const logoUploadButton = (
    <Upload beforeUpload={beforeLogoUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Replace Logo</Button>
    </Upload>
  );

  return (
    <>
      <Title level={4}>Company Information</Title>

      {/* Row 1: Company Name and Contact Phone */}
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
            <Input placeholder="Enter contact phone" />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 2: Industry and Website */}
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
            <Input placeholder="Enter company website" />
          </Form.Item>
        </Col>
      </Row>

      {/* Street Address Field */}
      <Form.Item
        label="Street Address"
        name="address"
        rules={[{ required: true, message: "Please enter your street address" }]}
      >
        <Input placeholder="Enter street address" />
      </Form.Item>

      {/* Row 3: City and State/Province */}
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
        <Col span={12}>{renderStateProvinceField()}</Col>
      </Row>

      {/* Row 4: Country and Zip/Postal Code */}
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
              { pattern: /^\d{5}(-\d{4})?$/, message: "Please enter a valid code (e.g., 12345 or 12345-6789)" },
            ]}
          >
            <Input placeholder="Enter zip/postal code" />
          </Form.Item>
        </Col>
      </Row>

      {/* Branding Section with Logo Preview and Upload */}
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
    </>
  );
};

export default CompanyInfoAndLogoForm;

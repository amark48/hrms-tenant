"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useEffect } from "react";
import { Form, Input, Select, Row, Col, Typography, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export interface CompanyInfoAndLogoFormProps {
  form: any; // Provided by the unified wizard form.
  tenant?: any; // Optional tenant info (for pre-population or debugging)
  onLogoChange?: (file: File) => void;
}

const CompanyInfoAndLogoForm: React.FC<CompanyInfoAndLogoFormProps> = ({ form, tenant, onLogoChange }) => {
  if (!form) {
    throw new Error("CompanyInfoAndLogoForm requires a valid form instance.");
  }
  
  // We'll treat the passed form as our shared form instance.
  const formInstance = form;
  
  // --- DEBUGGING SECTION: Watch key fields and log their values ---
  // Use Form.useWatch to monitor changes to several Company Info fields.
  const companyName = Form.useWatch("companyName", formInstance);
  const phone = Form.useWatch("phone", formInstance);
  const companyWebsite = Form.useWatch("companyWebsite", formInstance);
  const industry = Form.useWatch("industry", formInstance);
  const address = Form.useWatch("address", formInstance);
  const city = Form.useWatch("city", formInstance);
  const state = Form.useWatch("state", formInstance);
  const zip = Form.useWatch("zip", formInstance);
  const country = Form.useWatch("country", formInstance);
  
  // This effect logs the grouped company info every time any monitored field changes.
  useEffect(() => {
    const currentCompanyInfo = {
      companyName,
      phone,
      companyWebsite,
      industry,
      address,
      city,
      state,
      zip,
      country,
    };
    console.log("DEBUG - Company Info updated:", currentCompanyInfo);
  }, [companyName, phone, companyWebsite, industry, address, city, state, zip, country]);
  // --- END DEBUGGING SECTION ---

  // Existing logo upload logic remains unchanged.
  const computeLogoUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const [logoPreview, setLogoPreview] = React.useState<string | undefined>(
    formInstance.getFieldValue("logoUrl") || computeLogoUrl(tenant?.logoUrl)
  );

  const handleLogoChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    console.log("DEBUG - New logo file selected, preview URL:", previewUrl);
    setLogoPreview(previewUrl);
    formInstance.setFieldsValue({ logoUrl: previewUrl });
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

  // Render the Company Info form fields.
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
            <Select
              placeholder="Select industry"
              options={[
                { label: "Technology", value: "technology" },
                { label: "Finance", value: "finance" },
                { label: "Healthcare", value: "healthcare" },
                { label: "Retail", value: "retail" },
                { label: "Manufacturing", value: "manufacturing" },
                { label: "Education", value: "education" },
                { label: "Other", value: "other" },
              ]}
            />
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
          <Form.Item
            label="State/Province"
            name="state"
            rules={[{ required: true, message: "Please enter your state/province" }]}
          >
            <Input placeholder="Enter state/province" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Zip/Postal Code"
            name="zip"
            rules={[
              { required: true, message: "Please enter your zip/postal code" },
              { pattern: /^\d{5}(-\d{4})?$/, message: "Enter a valid zip code (e.g., 12345 or 12345-6789)" },
            ]}
          >
            <Input placeholder="Enter zip/postal code" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select your country" }]}
          >
            <Select
              placeholder="Select country"
              options={[
                { label: "United States", value: "United States" },
                { label: "Canada", value: "Canada" },
                { label: "United Kingdom", value: "United Kingdom" },
                { label: "Australia", value: "Australia" },
                { label: "Germany", value: "Germany" },
                { label: "France", value: "France" },
                { label: "Other", value: "Other" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Title level={4}>Branding</Title>
        {logoPreview ? (
          <>
            <img
              src={logoPreview}
              alt="Logo Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
            <Upload beforeUpload={beforeLogoUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Replace Logo</Button>
            </Upload>
          </>
        ) : (
          <Upload beforeUpload={beforeLogoUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        )}
      </div>
    </>
  );
};

export default CompanyInfoAndLogoForm;

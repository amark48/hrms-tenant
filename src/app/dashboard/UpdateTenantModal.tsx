"use client";

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Checkbox,
  Button,
  Select,
  Upload,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import { Typography } from "antd";
const { Text } = Typography;
const { Option } = Select;

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
];

const USStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "CA", name: "California" },
  { code: "NY", name: "New York" },
  // … add remaining US states as needed
];

const CAProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "ON", name: "Ontario" },
  // … add remaining provinces/territories as needed
];

const renderStateField = (country: string, fieldName: string, required: boolean = true) => {
  if (country === "US") {
    return (
      <Form.Item
        label="State"
        name={fieldName}
        rules={required ? [{ required: true, message: "Select a state" }] : []}
      >
        <Select placeholder="Select state">
          {USStates.map((state) => (
            <Option key={state.code} value={state.name}>
              {state.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else if (country === "CA") {
    return (
      <Form.Item
        label="Province"
        name={fieldName}
        rules={required ? [{ required: true, message: "Select a province" }] : []}
      >
        <Select placeholder="Select province">
          {CAProvinces.map((prov) => (
            <Option key={prov.code} value={prov.name}>
              {prov.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else {
    return (
      <Form.Item
        label="State/Province"
        name={fieldName}
        rules={required ? [{ required: true, message: "Enter state/province" }] : []}
      >
        <Input />
      </Form.Item>
    );
  }
};

export interface UpdateTenantModalProps {
  visible: boolean;
  tenant: any;
  mfaTypes: string[];
  mfaRawData?: any;
  onOk: (updatedData: any) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}

export default function UpdateTenantModal(props: UpdateTenantModalProps) {
  const { visible, tenant, mfaTypes, mfaRawData, onOk, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();

  // Pre-fill form when tenant data is available.
  useEffect(() => {
    if (tenant) {
      form.setFieldsValue({
        name: tenant.name,
        enableMFA: tenant.enableMFA || false,
        mfaType: tenant.mfaType || [],
        contactStreet: tenant.contactStreet,
        contactCity: tenant.contactCity,
        contactState: tenant.contactState,
        contactPostalCode: tenant.contactPostalCode,
        contactCountry: tenant.contactCountry,
        contactPhone: tenant.contactPhone,
        billingStreet: tenant.billingStreet,
        billingCity: tenant.billingCity,
        billingState: tenant.billingState,
        billingPostalCode: tenant.billingPostalCode,
        billingCountry: tenant.billingCountry,
        billingPhone: tenant.billingPhone,
      });
    }
  }, [tenant, form]);

  // Watch for country fields.
  const contactCountry = Form.useWatch("contactCountry", form);
  const billingCountry = Form.useWatch("billingCountry", form);

  const handleCopyContactToBilling = () => {
    const values = form.getFieldsValue([
      "contactStreet",
      "contactCity",
      "contactState",
      "contactPostalCode",
      "contactCountry",
      "contactPhone",
    ]);
    form.setFieldsValue({
      billingStreet: values.contactStreet,
      billingCity: values.contactCity,
      billingState: values.contactState,
      billingPostalCode: values.contactPostalCode,
      billingCountry: values.contactCountry,
      billingPhone: values.contactPhone,
    });
    console.log("Contact copied to billing:", values);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values on submit:", values);
        onOk(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Update Tenant Information"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      centered
      forceRender
      destroyOnClose
    >
      <Form form={form} layout="vertical" onValuesChange={(changed, all) => console.log("Form changed:", changed, all)}>
        <Form.Item
          label="Tenant Name"
          name="name"
          rules={[{ required: true, message: "Please enter the tenant name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Tenant Logo" name="logoFile">
          <Upload name="file" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item>
        {/* MFA Section */}
        <div style={{ marginBottom: "16px" }}>
          <Checkbox
            onChange={(e) => {
              console.log("MFA checkbox changed:", e.target.checked);
              form.setFieldValue("enableMFA", e.target.checked);
            }}
            checked={form.getFieldValue("enableMFA")}
          >
            Enable Multi-Factor Authentication (MFA)
          </Checkbox>
        </div>
        {form.getFieldValue("enableMFA") && (
          <>
            <Form.Item
              label="Select MFA Methods"
              name="mfaType"
              rules={[
                { required: true, message: "Please select at least one MFA method" },
              ]}
            >
              <Checkbox.Group
                options={(mfaTypes || []).map((type: string) => ({
                  label: type,
                  value: type,
                }))}
                onChange={(vals) => {
                  console.log("MFA Types selected:", vals);
                  form.setFieldValue("mfaType", vals);
                }}
              />
            </Form.Item>
            {((form.getFieldValue("mfaType") || []) as string[]).includes("SMS") && (
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>
            )}
            {((form.getFieldValue("mfaType") || []) as string[]).includes("TOTP") && (
              <div style={{ marginTop: "16px", textAlign: "center", marginBottom: "24px" }}>
                <Button type="primary" onClick={() => console.log("Generate QR Code clicked")}>
                  Generate QR Code
                </Button>
                {/* Optionally render a QR code */}
              </div>
            )}
            {((form.getFieldValue("mfaType") || []) as string[]).includes("EMAIL") && (
              <Form.Item
                label="MFA Email"
                name="mfaEmail"
                rules={[
                  { required: true, message: "Please enter your MFA email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter MFA Email" />
              </Form.Item>
            )}
          </>
        )}
        {/* Debug: Display raw MFA data from API */}
        {mfaTypes.length > 0 && (
          <div style={{ marginTop: 16, background: "#f0f0f0", padding: 8 }}>
            <Text strong>Raw MFA Data:</Text>
            <pre>{JSON.stringify({ mfaTypes }, null, 2)}</pre>
          </div>
        )}
        {/* Compact Contact Information */}
        <Form.Item label="Contact Information">
          <Form.Item
            label="Street"
            name="contactStreet"
            rules={[{ required: true, message: "Enter contact street" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="contactCity" rules={[{ required: true, message: "Enter city" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>{renderStateField(form.getFieldValue("contactCountry") || "", "contactState")}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Postal Code"
                name="contactPostalCode"
                rules={[{ required: true, message: "Enter postal code" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="contactCountry"
                rules={[{ required: true, message: "Select country" }]}
              >
                <Select placeholder="Select country">
                  {countries.map((ctry) => (
                    <Option key={ctry.code} value={ctry.code}>
                      {ctry.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Phone" name="contactPhone">
            <Input />
          </Form.Item>
        </Form.Item>
        {/* Compact Billing Information */}
        <Form.Item label="Billing Information">
          <Form.Item
            label="Street"
            name="billingStreet"
            rules={[{ required: true, message: "Enter billing street" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="billingCity" rules={[{ required: true, message: "Enter city" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>{renderStateField(form.getFieldValue("billingCountry") || "", "billingState")}</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Postal Code"
                name="billingPostalCode"
                rules={[{ required: true, message: "Enter postal code" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="billingCountry"
                rules={[{ required: true, message: "Select country" }]}
              >
                <Select placeholder="Select country">
                  {countries.map((ctry) => (
                    <Option key={ctry.code} value={ctry.code}>
                      {ctry.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Phone" name="billingPhone">
            <Input />
          </Form.Item>
          <Button type="dashed" onClick={handleCopyContactToBilling}>
            Copy Contact to Billing
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

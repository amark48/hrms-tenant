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
  // ... add remaining US states as needed
];

const CAProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "ON", name: "Ontario" },
  // ... add remaining provinces/territories as needed
];

// Helper to render state/province field based on selected country
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
  onOk: (updatedData: any) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}

export default function UpdateTenantModal(props: UpdateTenantModalProps) {
  const { visible, tenant, mfaTypes, onOk, onCancel, confirmLoading } = props;
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

  // Use Form.useWatch for country changes.
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
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
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
      <Form form={form} layout="vertical">
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
        <Form.Item name="enableMFA" label="Enable MFA for employees" valuePropName="checked">
          <Checkbox>Enable MFA</Checkbox>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.enableMFA !== curValues.enableMFA}>
          {({ getFieldValue }) =>
            getFieldValue("enableMFA") ? (
              <Form.Item
                name="mfaType"
                label="MFA Type(s)"
                rules={[{ required: true, message: "Please select at least one MFA type" }]}
              >
                <Checkbox.Group options={mfaTypes.map((mfa) => ({ label: mfa, value: mfa }))} />
              </Form.Item>
            ) : null
          }
        </Form.Item>

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
            <Col span={12}>
              {renderStateField(contactCountry || "", "contactState")}
            </Col>
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
            <Col span={12}>
              {renderStateField(billingCountry || "", "billingState")}
            </Col>
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

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
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Text } = Typography;
const { Option } = Select;

// Data arrays
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
];

const USStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const CAProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
];

// Helper to render a state/province select/input field.
const renderStateField = (country: string, fieldName: string, required: boolean = true) => {
  if (country === "CA") {
    return (
      <Form.Item label="State/Province" name={fieldName} rules={required ? [{ required: true, message: "Select a province" }] : []}>
        <Select placeholder="Select province">
          {CAProvinces.map((prov) => (
            <Option key={prov.code} value={prov.name}>
              {prov.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else if (country === "US") {
    return (
      <Form.Item label="State/Province" name={fieldName} rules={required ? [{ required: true, message: "Select a state" }] : []}>
        <Select placeholder="Select state">
          {USStates.map((state) => (
            <Option key={state.code} value={state.name}>
              {state.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else {
    return (
      <Form.Item label="State/Province" name={fieldName} rules={required ? [{ required: true, message: "Enter state/province" }] : []}>
        <Input />
      </Form.Item>
    );
  }
};

export interface UpdateTenantModalProps {
  visible: boolean;
  tenant: any;
  mfaTypes: string[];
  refreshTenant?: () => Promise<any>;
  onOk: (updatedData: any) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}

export default function UpdateTenantModal(props: UpdateTenantModalProps) {
  const { visible, tenant, mfaTypes, refreshTenant, onOk, onCancel, confirmLoading } = props;
  const [form] = Form.useForm();

  // Local state for MFA settings.
  const [mfaEnabled, setMfaEnabled] = React.useState<boolean>(false);
  const [selectedMfaMethods, setSelectedMfaMethods] = React.useState<string[]>([]);

  // Local state for the logo file list (for preview).
  const [logoFileList, setLogoFileList] = React.useState<any[]>([]);

  // populateForm extracts and sets form fields from tenant data.
  const populateForm = (tData: any) => {
    console.log("Populating form with tenant data", tData);
    if (tData) {
      // Check if addresses exist; if not, warn.
      if (!tData.addresses) {
        console.warn("tenant.addresses is missing. Ensure that the API returns addresses.");
      }
      const mailingAddress = tData.addresses?.find((addr: any) => addr.addressType === "mailing") || {};
      const billingAddress = tData.addresses?.find((addr: any) => addr.addressType === "billing") || {};

      form.setFieldsValue({
        name: tData.name,
        corporateWebsite: tData.companyWebsite,
        contactStreet: mailingAddress.street || tData.contactStreet,
        contactCity: mailingAddress.city || tData.contactCity,
        contactState: mailingAddress.state || tData.contactState,
        contactPostalCode: mailingAddress.postalCode || tData.contactPostalCode,
        contactCountry: mailingAddress.country || tData.contactCountry || "US",
        contactPhone: mailingAddress.phone || tData.contactPhone,
        billingStreet: billingAddress.street || tData.billingStreet,
        billingCity: billingAddress.city || tData.billingCity,
        billingState: billingAddress.state || tData.billingState,
        billingPostalCode: billingAddress.postalCode || tData.billingPostalCode,
        billingCountry: billingAddress.country || tData.billingCountry || "US",
        billingPhone: billingAddress.phone || tData.billingPhone,
      });
      setMfaEnabled(tData.mfaEnabled === true);
      setSelectedMfaMethods(tData.allowedMfa || []);

      if (tData.logoUrl) {
        const logoUrl = tData.logoUrl.startsWith("http")
          ? tData.logoUrl
          : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${tData.logoUrl}`;
        setLogoFileList([{ uid: "-1", name: "logo.png", status: "done", url: logoUrl }]);
      } else {
        setLogoFileList([]);
      }
    }
  };

  // Reset and re-populate the form every time the modal becomes visible.
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (refreshTenant) {
        refreshTenant()
          .then((updatedTenant) => {
            populateForm(updatedTenant);
          })
          .catch((err) => {
            console.error("Failed to refresh tenant:", err);
            populateForm(tenant);
          });
      } else if (tenant) {
        populateForm(tenant);
      }
    }
  }, [visible, tenant, refreshTenant, form]);

  // Update handler
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const mergedValues = {
        ...values,
        mfaEnabled: mfaEnabled,
        allowedMfa: selectedMfaMethods,
      };

      // Prepare tenant payload.
      const tenantPayload = {
        name: mergedValues.name,
        companyWebsite: mergedValues.corporateWebsite,
        mfaEnabled: mergedValues.mfaEnabled,
        allowedMfa: mergedValues.allowedMfa,
      };

      // Update tenant basic info.
      const tenantResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tenantPayload),
        }
      );
      if (!tenantResponse.ok) {
        throw new Error("Failed to update tenant");
      }

      // Check if mailing and billing addresses exist.
      const mailingAddr =
        tenant.addresses?.find((addr: any) => addr.addressType === "mailing") || null;
      const billingAddr =
        tenant.addresses?.find((addr: any) => addr.addressType === "billing") || null;

      const mailingAddress = {
        tenantId: tenant.id,
        addressType: "mailing",
        street: mergedValues.contactStreet,
        city: mergedValues.contactCity,
        state: mergedValues.contactState,
        postalCode: mergedValues.contactPostalCode,
        country: mergedValues.contactCountry,
        phone: mergedValues.contactPhone,
      };

      const billingAddress = {
        tenantId: tenant.id,
        addressType: "billing",
        street: mergedValues.billingStreet,
        city: mergedValues.billingCity,
        state: mergedValues.billingState,
        postalCode: mergedValues.billingPostalCode,
        country: mergedValues.billingCountry,
        phone: mergedValues.billingPhone,
      };

      // Process mailing address update: PUT if exists, else POST.
      let mailingRes;
      if (mailingAddr && mailingAddr.id) {
        mailingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}/address/${mailingAddr.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mailingAddress),
          }
        );
      } else {
        mailingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}/address`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mailingAddress),
          }
        );
      }
      if (!mailingRes.ok) {
        throw new Error("Failed to update mailing address");
      }

      // Process billing address update: PUT if exists, else POST.
      let billingRes;
      if (billingAddr && billingAddr.id) {
        billingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}/address/${billingAddr.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(billingAddress),
          }
        );
      } else {
        billingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}/address`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(billingAddress),
          }
        );
      }
      if (!billingRes.ok) {
        throw new Error("Failed to update billing address");
      }

      toast.success("Tenant updated successfully!");
      onOk(mergedValues);
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error("Failed to update tenant: " + err.message);
    }
  };

  // Copies contact fields to billing.
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
    console.log("Copied contact information to billing:", values);
  };

  return (
    <Modal
      key={tenant ? tenant.id : "new-tenant"}
      title="Update Tenant Information"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Update"
      confirmLoading={confirmLoading}
      centered
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" initialValues={{ contactCountry: "US", billingCountry: "US" }}>
        {/* Tenant Name & Logo */}
        <Form.Item label={<Text strong>Tenant Name</Text>} name="name" rules={[{ required: true, message: "Please enter the tenant name" }]}>
          <Input />
        </Form.Item>
        <Form.Item label={<Text strong>Tenant Logo</Text>} name="logoFile">
          <Upload
            name="logo"
            disabled={!tenant || !tenant.id}
            listType="picture-card"
            defaultFileList={
              tenant && tenant.logoUrl
                ? [
                    {
                      uid: "-1",
                      name: "logo.png",
                      status: "done",
                      url: tenant.logoUrl.startsWith("http")
                        ? tenant.logoUrl
                        : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${tenant.logoUrl}`,
                    },
                  ]
                : []
            }
            fileList={logoFileList}
            onChange={({ fileList }) => setLogoFileList(fileList)}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const formData = new FormData();
                formData.append("logo", file);
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/upload/${tenant.id}/logo`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                if (response.ok) {
                  const data = await response.json();
                  setLogoFileList([{ uid: "-1", name: file.name, status: "done", url: data.url || tenant.logoUrl }]);
                  onSuccess && onSuccess(data, file);
                } else {
                  onError && onError(new Error("Logo upload failed"));
                }
              } catch (error) {
                onError && onError(error);
              }
            }}
          >
            {logoFileList.length >= 1 ? null : <Button icon={<UploadOutlined />}>Upload Logo</Button>}
          </Upload>
        </Form.Item>

        {/* MFA Section */}
        <div style={{ marginBottom: 16 }}>
          <Checkbox
            checked={mfaEnabled}
            onChange={(e) => {
              const checked = e.target.checked;
              console.log("MFA checkbox changed:", checked);
              setMfaEnabled(checked);
              if (!checked) setSelectedMfaMethods([]);
            }}
          >
            Enable MFA for Employees
          </Checkbox>
        </div>
        {mfaEnabled && (
          <>
            {mfaTypes && mfaTypes.length > 0 ? (
              <Form.Item label={<Text strong>Select MFA Methods</Text>} rules={[{ required: true, message: "Please select at least one MFA method" }]}>
                <Checkbox.Group
                  options={mfaTypes.filter((type) => !!type).map((type: string) => ({ label: type, value: type }))}
                  value={selectedMfaMethods}
                  onChange={(values) => {
                    console.log("MFA Methods selected:", values);
                    setSelectedMfaMethods(values as string[]);
                  }}
                />
              </Form.Item>
            ) : (
              <Text type="warning">No MFA methods available. Please check your dashboard fetch.</Text>
            )}
          </>
        )}

        {/* Corporate Website */}
        <Form.Item label={<Text strong>Corporate Website</Text>} name="corporateWebsite">
          <Input placeholder="Enter corporate website URL" />
        </Form.Item>

        {/* Contact Information */}
        <div style={{ marginBottom: 10 }}>
          <Text strong style={{ fontSize: 16 }}>Contact Information</Text>
        </div>
        <Form.Item label="Street" name="contactStreet" rules={[{ required: true, message: "Enter contact street" }]}>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City" name="contactCity" rules={[{ required: true, message: "Enter city" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item shouldUpdate={(prev, curr) => prev.contactCountry !== curr.contactCountry}>
              {({ getFieldValue }) =>
                renderStateField(getFieldValue("contactCountry") || "US", "contactState")
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Postal Code" name="contactPostalCode" rules={[{ required: true, message: "Enter postal code" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="contactCountry" rules={[{ required: true, message: "Select country" }]}>
              <Select placeholder="Select country">
                {countries.map((ctry) => (
                  <Option key={ctry.code} value={ctry.code}>{ctry.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Phone" name="contactPhone">
          <Input />
        </Form.Item>

        {/* Billing Information */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text strong style={{ fontSize: 16 }}>Billing Information</Text>
          <Button type="dashed" onClick={handleCopyContactToBilling}>Copy Contact to Billing</Button>
        </div>
        <Form.Item label="Street" name="billingStreet" rules={[{ required: true, message: "Enter billing street" }]}>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City" name="billingCity" rules={[{ required: true, message: "Enter city" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item shouldUpdate={(prev, curr) => prev.billingCountry !== curr.billingCountry}>
              {({ getFieldValue }) =>
                renderStateField(getFieldValue("billingCountry") || "US", "billingState")
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Postal Code" name="billingPostalCode" rules={[{ required: true, message: "Enter postal code" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="billingCountry" rules={[{ required: true, message: "Select country" }]}>
              <Select placeholder="Select country">
                {countries.map((ctry) => (
                  <Option key={ctry.code} value={ctry.code}>{ctry.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Phone" name="billingPhone">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

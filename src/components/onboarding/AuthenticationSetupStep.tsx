"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState } from "react";
import { Form, Checkbox, Typography, Spin, Alert } from "antd";

const { Title, Paragraph } = Typography;

export interface AuthenticationSetupStepProps {
  initialMfaEnabled: boolean;    // For new tenants, should be false.
  initialAllowedMfa: string[];    // Usually an empty array.
  tenant?: any;                   // Optional, for debugging purposes.
}

const AuthenticationSetupStep: React.FC<AuthenticationSetupStepProps> = ({
  initialMfaEnabled,
  initialAllowedMfa,
  tenant,
}) => {
  // Get the shared form instance from the parent's Form.
  const formInstance = Form.useFormInstance();

  // Local state to track if MFA is enabled.
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(initialMfaEnabled);
  // Local state for available MFA options fetched from the endpoint.
  const [availableMfaOptions, setAvailableMfaOptions] = useState<string[]>([]);
  // Local state for tracking options loading and any fetch errors.
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // Local state for the selected MFA methods.
  const [selectedMfaMethods, setSelectedMfaMethods] = useState<string[]>(initialAllowedMfa);

  // On mount, update MFA enabled state from the shared form.
  useEffect(() => {
    const currentValue = formInstance.getFieldValue("mfaEnabled");
    setMfaEnabled(currentValue || false);
  }, [formInstance]);

  // When MFA is enabled, fetch the available MFA options.
  useEffect(() => {
    if (mfaEnabled) {
      const fetchMfaOptions = async () => {
        setLoadingOptions(true);
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${baseUrl}/api/auth/get-mfa-types`);
          if (!res.ok) {
            throw new Error("Failed to fetch MFA options.");
          }
          // Expecting an array of strings, e.g. ["TOTP", "EMAIL", "SMS"]
          const data: string[] = await res.json();
          setAvailableMfaOptions(data);
          setFetchError(null);
        } catch (error: any) {
          setFetchError(error.message || "Error fetching MFA options");
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchMfaOptions();
    } else {
      // If MFA is disabled, clear options and selection.
      setAvailableMfaOptions([]);
      setSelectedMfaMethods([]);
    }
  }, [mfaEnabled]);

  // Handler for MFA-enabled checkbox changes.
  const handleMfaCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    setMfaEnabled(checked);
    // Update the shared form field.
    formInstance.setFieldsValue({ mfaEnabled: checked });
  };

  // Handler for changes in the allowed MFA methods.
  const handleMfaMethodsChange = (checkedValues: any) => {
    setSelectedMfaMethods(checkedValues);
    formInstance.setFieldsValue({ allowedMfa: checkedValues });
  };

  return (
    <div>
      <Title level={4}>Authentication Setup</Title>
      <Paragraph>
        Configure multi-factor authentication (MFA) for extra security.
      </Paragraph>
      {/* MFA Enabled Checkbox; initially false */}
      <Form.Item
        name="mfaEnabled"
        valuePropName="checked"
        initialValue={false}
        rules={[{ required: true, message: "Please confirm your MFA preference" }]}
      >
        <Checkbox onChange={handleMfaCheckboxChange}>
          Enable Multi-Factor Authentication (MFA)
        </Checkbox>
      </Form.Item>

      {/* Render allowed MFA methods if MFA is enabled */}
      {mfaEnabled && (
        <>
          {loadingOptions && (
            <Spin tip="Loading MFA options..." style={{ marginBottom: "16px" }} />
          )}
          {(!loadingOptions && !fetchError) && (
            <Form.Item
              name="allowedMfa"
              initialValue={initialAllowedMfa}
              rules={[{ required: true, message: "Please select at least one MFA method" }]}
            >
              <Checkbox.Group
                options={availableMfaOptions.map((option) => ({
                  label: option,
                  value: option,
                }))}
                onChange={handleMfaMethodsChange}
              />
            </Form.Item>
          )}
          {mfaEnabled && fetchError && (
            <Alert message="Error" description={fetchError} type="error" showIcon />
          )}
        </>
      )}
    </div>
  );
};

export default AuthenticationSetupStep;

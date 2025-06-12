"use client";
import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState, useMemo, useRef } from "react";
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

  // useMemo to produce a stable default for allowed MFA
  const defaultAllowedMfa = useMemo(() => {
    return initialAllowedMfa ?? [];
  }, [initialAllowedMfa]);

  // Use a ref to ensure we only initialize once on mount.
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      if (formInstance.getFieldValue("mfaEnabled") === undefined) {
        formInstance.setFieldsValue({ mfaEnabled: initialMfaEnabled });
      }
      if (formInstance.getFieldValue("allowedMfa") === undefined) {
        formInstance.setFieldsValue({ allowedMfa: defaultAllowedMfa });
      }
      initializedRef.current = true;
    }
  }, [formInstance, initialMfaEnabled, defaultAllowedMfa]);

  // Read current values from the form via useWatch.
  const mfaEnabled = Form.useWatch("mfaEnabled", formInstance) ?? false;
  const allowedMfa = Form.useWatch("allowedMfa", formInstance) ?? defaultAllowedMfa;

  // Local state for available MFA options fetched from the endpoint.
  const [availableMfaOptions, setAvailableMfaOptions] = useState<string[]>([]);
  // Local state for tracking options loading and any fetch errors.
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      setAvailableMfaOptions([]);
      formInstance.setFieldsValue({ allowedMfa: [] });
    }
  }, [mfaEnabled, formInstance]);

  // Handler for MFA-enabled checkbox changes.
  const handleMfaCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    formInstance.setFieldsValue({ mfaEnabled: checked });
    if (!checked) {
      formInstance.setFieldsValue({ allowedMfa: [] });
    }
  };

  // Handler for changes in the allowed MFA methods.
  const handleMfaMethodsChange = (checkedValues: any) => {
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
          <Paragraph>Please select the MFA type(s):</Paragraph>
          {loadingOptions && (
            <Spin style={{ marginBottom: "16px" }} />
          )}
          {!loadingOptions && !fetchError && (
            <Form.Item
              name="allowedMfa"
              rules={[{ required: true, message: "Please select at least one MFA method" }]}
            >
              <Checkbox.Group
                value={allowedMfa}
                options={availableMfaOptions.map((option) => ({
                  label: option,
                  value: option,
                }))}
                onChange={handleMfaMethodsChange}
              />
            </Form.Item>
          )}
          {fetchError && (
            <Alert message="Error" description={fetchError} type="error" showIcon />
          )}
        </>
      )}
    </div>
  );
};

export default AuthenticationSetupStep;

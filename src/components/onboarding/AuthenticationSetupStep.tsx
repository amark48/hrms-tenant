import React, { useState, useEffect } from "react";
import { Checkbox, Form, Spin } from "antd";

interface AuthenticationSetupStepProps {
  initialMfaEnabled?: boolean;
  initialAllowedMfa?: string[];
}

const AuthenticationSetupStep: React.FC<AuthenticationSetupStepProps> = ({
  initialMfaEnabled = false,
  initialAllowedMfa = [],
}) => {
  const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);
  const [mfaTypes, setMfaTypes] = useState<any[]>([]);
  const [loadingMfa, setLoadingMfa] = useState<boolean>(true);
  const [selectedMfaMethods, setSelectedMfaMethods] = useState<string[]>(initialAllowedMfa);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/auth/get-mfa-types`)
      .then((res) => res.json())
      .then((data) => {
        const validMfaTypes = Array.isArray(data)
          ? data
              .map((mfa: any) => {
                if (typeof mfa === "string") return { id: mfa, name: mfa };
                const mfaName = mfa.dataValues?.name || mfa.name;
                return mfaName ? { id: mfaName, name: mfaName } : null;
              })
              .filter(Boolean)
          : [];
        setMfaTypes(validMfaTypes);
      })
      .catch((err) => {
        console.error("Error fetching MFA types", err);
      })
      .finally(() => setLoadingMfa(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Checkbox
          checked={mfaEnabled}
          onChange={(e) => {
            const checked = e.target.checked;
            setMfaEnabled(checked);
            if (!checked) setSelectedMfaMethods([]);
          }}
        >
          Enable Multi-Factor Authentication
        </Checkbox>
      </div>
      {mfaEnabled &&
        (loadingMfa ? (
          <Spin size="large" />
        ) : mfaTypes && mfaTypes.length > 0 ? (
          <Form.Item
            label="Select MFA Methods"
            rules={[{ required: true, message: "Please select at least one MFA method" }]}
          >
            <Checkbox.Group
              options={mfaTypes.map((type) => ({ label: type.name, value: type.id }))}
              value={selectedMfaMethods}
              onChange={(values) => {
                setSelectedMfaMethods(values as string[]);
              }}
            />
          </Form.Item>
        ) : (
          <div style={{ color: "orange" }}>
            No MFA methods available. Please check your dashboard fetch.
          </div>
        ))}
    </div>
  );
};

export default AuthenticationSetupStep;

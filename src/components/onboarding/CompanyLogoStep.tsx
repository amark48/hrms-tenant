import React, { useState, useEffect } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface CompanyLogoStepProps {
  // The company logo URL from the backend (via tenant.logoUrl).
  logoUrl?: string;
  // Callback when a new logo file is selected.
  onLogoChange?: (file: File) => void;
}

const CompanyLogoStep: React.FC<CompanyLogoStepProps> = ({
  logoUrl,
  onLogoChange,
}) => {
  // State holds the current preview URL (either the existing logo or the new logo preview).
  const [logoPreview, setLogoPreview] = useState<string | undefined>(logoUrl);

  // Whenever the provided logoUrl changes, update the preview.
  useEffect(() => {
    if (logoUrl) {
      setLogoPreview(logoUrl);
    }
  }, [logoUrl]);

  // When a new logo is selected, create an object URL for preview.
  const handleLogoChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    if (onLogoChange) {
      onLogoChange(file);
    }
  };

  // Validate file type, intercept the upload, and return false to prevent auto-upload.
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    handleLogoChange(file);
    return false;
  };

  // The upload button for replacing the logo.
  const uploadButton = (
    <Upload beforeUpload={beforeUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Replace Logo</Button>
    </Upload>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h4>Company Logo</h4>
      {logoPreview ? (
        <>
          <img
            src={logoPreview}
            alt="Company Logo Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 10px",
            }}
          />
          <div>{uploadButton}</div>
        </>
      ) : (
        uploadButton
      )}
    </div>
  );
};

export default CompanyLogoStep;

"use client";

import { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Menu,
  Modal,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Data arrays
const countries = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "India", value: "IN" },
  { label: "Australia", value: "AU" },
  { label: "Japan", value: "JP" },
  { label: "China", value: "CN" },
  { label: "Brazil", value: "BR" },
];

const employeeCounts = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

// A container style to constrain width on large screens.
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
};

export default function LandingPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [registrationUserInfo, setRegistrationUserInfo] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // State for Resend OTP Timer.
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const startResendTimer = () => {
    setResendTimer(60);
    setIsResendDisabled(true);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (otpModalVisible) {
      startResendTimer();
    }
  }, [otpModalVisible]);

  const onFinish = async (values: any) => {
    const {
      email,
      firstName,
      lastName,
      companyName,
      country,
      employeeCount,
      phone,
    } = values;
    const domain = email.split("@")[1] || "";
    const payload = {
      firstName,
      lastName,
      company: companyName,
      email,
      mailingCountry: country,
      employeeCount,
      mailingPhone: phone,
      domain,
      industry: "other",
      isTenantAdmin: true,
      role: "Admin",
    };
    const registerEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/register`;
    try {
      const res = await fetch(registerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      const data = await res.json();
      console.log("Registration successful", data);
      setRegistrationUserInfo(data);
      setOtpModalVisible(true);
    } catch (error: any) {
      console.error("Error during registration:", error);
      messageApi.error("Error during registration: " + error.message);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp) {
      messageApi.error("Please enter your OTP code");
      return;
    }
    const otpPayload = { userId: registrationUserInfo?.user?.id, otp };
    try {
      const verifyEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/verify-otp`;
      const res = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpPayload),
      });
      if (!res.ok) {
        throw new Error("OTP verification failed");
      }
      const data = await res.json();
      if (data.user && data.user.id) {
        localStorage.setItem("userId", data.user.id);
      }
      messageApi.success("OTP verified successfully");
      setOtpModalVisible(false);
      if (registrationUserInfo?.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/secure-login");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      messageApi.error("OTP verification error: " + error.message);
    }
  };

  const handleResendOTP = async () => {
    if (!registrationUserInfo?.user?.id) {
      messageApi.error("User information missing.");
      return;
    }
    const resendEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/resend-otp`;
    try {
      const res = await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: registrationUserInfo.user.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to resend OTP");
      }
      const data = await res.json();
      messageApi.success(data.message || "OTP resent successfully.");
      startResendTimer();
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      messageApi.error("Error resending OTP: " + error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {contextHolder}

      {/* OTP Verification Modal */}
      <Modal
        title="OTP Verification"
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        onOk={handleOTPVerification}
        okText="Verify OTP"
        width={400}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Text>We've sent an OTP to your corporate email.</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Please check your inbox and enter the code below.
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="OTP Code" required style={{ textAlign: "center" }}>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ textAlign: "center", fontSize: 18 }}
            />
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text type="secondary">
            {isResendDisabled
              ? `Resend OTP in ${resendTimer} seconds`
              : <a onClick={handleResendOTP}>Resend OTP</a>}
          </Text>
        </div>
      </Modal>

      {/* HEADER */}
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          height: "64px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={containerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "64px",
            }}
          >
            {/* Left: Logo & Title */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Enterprise HRMS Logo"
                  style={{
                    height: "40px",
                    marginRight: "16px",
                    display: "block",
                  }}
                />
              </Link>
              <Title
                level={3}
                style={{ margin: 0, lineHeight: "64px", color: "#000" }}
              >
                Enterprise HRMS
              </Title>
            </div>
            {/* Center: Navigation Menu */}
            <div style={{ flexGrow: 1, textAlign: "center" }}>
              <Menu
                mode="horizontal"
                selectable={false}
                items={[
                  { key: "home", label: <Link href="/">Home</Link> },
                  { key: "features", label: <Link href="/features">Features</Link> },
                  { key: "pricing", label: <Link href="/pricing">Pricing</Link> },
                  { key: "contact", label: <Link href="/contact">Contact</Link> },
                ]}
                style={{
                  borderBottom: "none",
                  backgroundColor: "transparent",
                  display: "inline-block",
                }}
              />
            </div>
            {/* Right: Login Button */}
            <div>
              <Button type="primary" onClick={() => router.push("/login")}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </Header>

      {/* MAIN CONTENT */}
      <Content style={{ padding: "40px 20px" }}>
        <div style={containerStyle}>
          {/* HERO SECTION with two-column layout */}
          <div
            style={{
              background: "linear-gradient(135deg, #004e92, #000428)",
              padding: "80px 40px",
              borderRadius: "12px",
              color: "#fff",
              marginBottom: "60px",
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              {/* Left: Hero Text */}
              <Col xs={24} md={12}>
                <Title
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    color: "#fff",
                  }}
                >
                  Transform Your HR Management
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "#f0f2f5",
                    marginBottom: "32px",
                  }}
                >
                  Discover a modern, enterprise‑grade HR solution designed to streamline
                  your processes and empower your workforce.
                </Paragraph>
                <Button type="primary" size="large" onClick={() => router.push("/features")}>
                  Learn More
                </Button>
              </Col>
              {/* Right: Registration (Get Started) Card */}
              <Col xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  <Title
                    level={3}
                    style={{ textAlign: "center", marginBottom: "16px" }}
                  >
                    Get Started
                  </Title>
                  <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="First Name"
                          name="firstName"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[
                            { required: true, message: "Please enter your first name." },
                            { whitespace: true, message: "First name cannot be empty." },
                          ]}
                        >
                          <Input placeholder="John" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Last Name"
                          name="lastName"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[
                            { required: true, message: "Please enter your last name." },
                            { whitespace: true, message: "Last name cannot be empty." },
                          ]}
                        >
                          <Input placeholder="Doe" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Company Name"
                          name="companyName"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[
                            { required: true, message: "Please enter your company name." },
                            { whitespace: true, message: "Company name cannot be empty." },
                          ]}
                        >
                          <Input placeholder="ABC Corporation" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Phone"
                          name="phone"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[
                            { required: true, message: "Please enter your phone number." },
                            { whitespace: true, message: "Phone number cannot be empty." },
                          ]}
                        >
                          <Input placeholder="123-456-7890" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Corporate Email"
                          name="email"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[
                            { required: true, type: "email", message: "Please enter a valid corporate email." },
                          ]}
                        >
                          <Input placeholder="you@company.com" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Country"
                          name="country"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[{ required: true, message: "Please select your country." }]}
                        >
                          <Select placeholder="Select your country">
                            {countries.map((country) => (
                              <Select.Option key={country.value} value={country.value}>
                                {country.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Employee Count"
                          name="employeeCount"
                          validateTrigger="onBlur"
                          hasFeedback
                          rules={[{ required: true, message: "Please select your employee count." }]}
                        >
                          <Select placeholder="Select employee count">
                            {employeeCounts.map((count) => (
                              <Select.Option key={count} value={count}>
                                {count}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12} />
                    </Row>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" block size="large">
                        Sign Up Now
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
            {/* (Removed the info section, feature cards, and testimonials) */}
          </div>
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#fff",
          borderTop: "1px solid #e8e8e8",
        }}
      >
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
    </Layout>
  );
}

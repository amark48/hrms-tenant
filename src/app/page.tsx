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

// List of countries: display full names as labels; values are abbreviations.
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

export default function LandingPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  // Store the full registration response returned from the API.
  const [registrationUserInfo, setRegistrationUserInfo] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // --- New state for Resend OTP Timer ---
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  // Function to start the countdown timer for resending OTP.
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

  // Start the resend timer whenever the OTP modal opens.
  useEffect(() => {
    if (otpModalVisible) {
      startResendTimer();
    }
  }, [otpModalVisible]);

  // Registration submission handler.
  const onFinish = async (values: any) => {
    const { email, firstName, lastName, companyName, country, employeeCount, phone } = values;
    const domain = email.split("@")[1] || "";

    const payload = {
      firstName,
      lastName,
      company: companyName, // Send companyName as "company"
      email,
      mailingCountry: country, // abbreviated value (e.g., "US")
      employeeCount,
      mailingPhone: phone, // Send phone as "phoneNumber"
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

// --- OTP verification handler ---
const handleOTPVerification = async () => {
  if (!otp) {
    messageApi.error("Please enter your OTP code");
    return;
  }
  const otpPayload = { userId: registrationUserInfo?.user?.id, otp };
  console.log("Sending OTP payload:", otpPayload);
  
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
    
    // DEBUG: Log the full response data from the OTP verification API
    console.log("OTP verification response data:", data);
    
    // Check and store the user id (assumes that data.user is returned)
    if (data.user && data.user.id) {
      localStorage.setItem("userId", data.user.id);
    } else {
      console.error("User object or user ID is missing from the response:", data);
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



  // Handler for Resend OTP action.
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

      {/* Enhanced OTP Verification Modal */}
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

      {/* FULL-WIDTH TOP BAR */}
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "80%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Logo and Branding */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <img
                src="/logo.png"
                alt="VisaTrak Logo"
                style={{ height: "35px", alignSelf: "flex-end" }}
              />
            </Link>
            <Text strong style={{ marginLeft: "8px", fontSize: "18px", color: "#001529" }}>
              enterprise HRMS
            </Text>
          </div>
          {/* Center: Navigation Menu */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["home"]}
              items={[
                { key: "home", label: "Home" },
                { key: "features", label: "Features" },
                { key: "pricing", label: "Pricing" },
                { key: "contact", label: "Contact" },
              ]}
              style={{
                borderBottom: "none",
                background: "transparent",
                display: "inline-block",
                lineHeight: "64px",
              }}
            />
          </div>
          {/* Right: Login Button */}
          <div style={{ flex: "0 0 100px", textAlign: "right" }}>
            <Link href="/login">
              <Button type="default">Login</Button>
            </Link>
          </div>
        </div>
      </Header>

      {/* MAIN CONTENT */}
      <Content style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "80%", margin: "auto" }}>
          <Row gutter={[32, 32]} align="middle">
            {/* Left Column: Informative Text */}
            <Col xs={24} md={12}>
              <div style={{ padding: "20px" }}>
                <Title level={2}>Why enterprise HRMS?</Title>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  Our modern HR solution integrates seamlessly with your existing systems to streamline processes,
                  enhance employee engagement, and drive organizational success. Discover a revolution in HR management.
                </Paragraph>
              </div>
            </Col>
            {/* Right Column: Registration Form */}
            <Col xs={24} md={12} style={{ display: "flex", justifyContent: "center" }}>
              <Card
                style={{
                  width: "480px",
                  borderRadius: "12px",
                  padding: "16px 24px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <Title level={3} style={{ textAlign: "center", marginBottom: "16px" }}>
                  Get Started
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
                  {/* Row 1: First Name & Last Name */}
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
                  {/* Row 2: Company Name & Phone */}
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
                  {/* Row 3: Corporate Email & Country */}
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
                  {/* Row 4: Employee Count */}
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
          {/* Hero Section: 3 Cards */}
          <Row gutter={[32, 32]} justify="center" style={{ marginTop: "40px" }}>
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  background: "linear-gradient(135deg, #f5faff, #e0efff)",
                }}
              >
                <Title level={3}>Innovative Solutions</Title>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  Harness cutting-edge technology to drive HR transformation.
                </Paragraph>
                <Button type="primary" style={{ marginTop: "16px" }}>
                  Learn More
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  background: "linear-gradient(135deg, #f5faff, #e0efff)",
                }}
              >
                <Title level={3}>Seamless Integration</Title>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  Integrate effortlessly with your existing systems for streamlined workflows.
                </Paragraph>
                <Button type="primary" style={{ marginTop: "16px" }}>
                  Explore Integration
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  background: "linear-gradient(135deg, #f5faff, #e0efff)",
                }}
              >
                <Title level={3}>Unmatched Support</Title>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  Enjoy 24/7 dedicated support tailored for enterprise needs.
                </Paragraph>
                <Button type="primary" style={{ marginTop: "16px" }}>
                  Get Support
                </Button>
              </Card>
            </Col>
          </Row>
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
        enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
    </Layout>
  );
}

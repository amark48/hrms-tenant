"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Card,
  List,
  Avatar,
  Typography,
  Table,
  Dropdown,
  Modal,
  Button,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
// Import chart components from Ant Design Plots
import { Pie, Line, Column } from "@ant-design/plots";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
};

// Dummy statistics data.
const stats = [
  { title: "Total Employees", value: 125 },
  { title: "Attendance Today", value: 92 },
  { title: "Open Positions", value: 5 },
  { title: "Employee Turnover", value: "2%" },
];

// Dummy data for team chat.
const messagesData = [
  { id: 1, name: "John Doe", message: "Please review the Q3 reports." },
  { id: 2, name: "Jane Smith", message: "The numbers look great!" },
  { id: 3, name: "Admin", message: "Let’s schedule a meeting for tomorrow." },
];

// Sample data for a line chart (Employee Trends).
const lineData = [
  { date: "2023-01", value: 80 },
  { date: "2023-02", value: 90 },
  { date: "2023-03", value: 100 },
  { date: "2023-04", value: 110 },
  { date: "2023-05", value: 130 },
  { date: "2023-06", value: 120 },
];
const lineConfig = {
  height: 250,
  data: lineData,
  xField: "date",
  yField: "value",
  smooth: true,
  color: "#004e92",
  tooltip: { showMarkers: false },
  animation: { appear: { animation: "path-in", duration: 500, easing: "easeLinear" } },
};

// Sample data for a pie chart (Department Distribution).
const pieData = [
  { type: "Engineering", value: 40 },
  { type: "Sales", value: 20 },
  { type: "Marketing", value: 15 },
  { type: "Support", value: 25 },
];
const pieConfig = {
  height: 250,
  appendPadding: 10,
  data: pieData,
  angleField: "value",
  colorField: "type",
  radius: 0.8,
  label: {
    // Use the offset property to render labels outside the pie chart.
    offset: 20,
    content: (data) => {
      const total = pieData.reduce((acc, item) => acc + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return `${data.type}: ${percentage}%`;
    },
  },
  interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
};

// Sample data for a Department Performance column chart.
const departmentPerformanceData = [
  { department: "Engineering", performance: 90 },
  { department: "Sales", performance: 70 },
  { department: "Marketing", performance: 80 },
  { department: "Support", performance: 60 },
];
const columnConfig = {
  height: 250,
  data: departmentPerformanceData,
  xField: "department",
  yField: "performance",
  color: "#17a2b8",
  label: {
    position: "middle",
    style: { fill: "#FFFFFF", opacity: 0.6 },
  },
  xAxis: { label: { autoHide: true, autoRotate: false } },
  meta: { performance: { alias: "Performance (%)" } },
};

// Sample data for an Employee Matrix table.
const matrixColumns = [
  { title: "Department", dataIndex: "department", key: "department" },
  { title: "Employees", dataIndex: "employees", key: "employees" },
  { title: "Avg Age", dataIndex: "avgAge", key: "avgAge" },
  { title: "Turnover Rate", dataIndex: "turnover", key: "turnover" },
];
const matrixData = [
  { key: 1, department: "Engineering", employees: 40, avgAge: 30, turnover: "5%" },
  { key: 2, department: "Sales", employees: 20, avgAge: 35, turnover: "8%" },
  { key: 3, department: "Marketing", employees: 15, avgAge: 33, turnover: "6%" },
  { key: 4, department: "Support", employees: 25, avgAge: 28, turnover: "4%" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // On mount, get the token and fetch the user profile.
useEffect(() => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("[DEBUG Dashboard] No token found in localStorage, redirecting to /login");
    router.push("/login");
    return;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  fetch(`${apiUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.log("[DEBUG Dashboard] Response not OK, status:", res.status);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("[DEBUG Dashboard] Fetched user profile:", data.user);
      setUser(data.user);
    })
    .catch((err) => {
      console.error("[ERROR Dashboard] Error fetching user profile:", err);
      // Clear the expired (or problematic) token and related user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("[DEBUG Dashboard] Cleared token and user info, redirecting to /login");
      // Force the user to re-login
      router.push("/login");
    });
}, [router]);



  // Show the password modal if user is loaded and onboarding is incomplete.
  useEffect(() => {
    if (user && user.onboardingCompleted === false) {
      setPasswordModalVisible(true);
    }
  }, [user]);

  const handlePasswordChange = () => {
    router.push("/settings/change-password");
  };

  const dismissModal = () => {
    setPasswordModalVisible(false);
  };

  // User menu items.
  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
    {
      key: "logout",
      label: (
        <span
          onClick={() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }}
        >
          Logout
        </span>
      ),
    },
  ];

  // Prepare a safe display value for the user's role.
  const displayRole =
    user && user.role && typeof user.role === "object"
      ? user.role.name || "N/A"
      : user?.role || "N/A";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Fixed Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
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
            {/* Logo & Title (links to /dashboard) */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href="/dashboard">
                <img
                  src="/logo.png"
                  alt="Enterprise HRMS Logo"
                  style={{ height: "40px", marginRight: "16px", display: "block" }}
                />
              </Link>
              <Title level={3} style={{ margin: 0, lineHeight: "64px", color: "#000" }}>
                Enterprise HRMS
              </Title>
            </div>
            {/* Navigation Menu */}
            <div style={{ flexGrow: 1, textAlign: "center" }}>
              <Menu
                mode="horizontal"
                defaultSelectedKeys={["dashboard"]}
                style={{
                  borderBottom: "none",
                  backgroundColor: "transparent",
                  display: "inline-block",
                }}
                items={[
                  { key: "dashboard", label: <Link href="/dashboard">Dashboard</Link> },
                  { key: "employees", label: <Link href="/dashboard/employees">Employees</Link> },
                  { key: "attendance", label: <Link href="/dashboard/attendance">Attendance</Link> },
                  { key: "recruitment", label: <Link href="/dashboard/recruitment">Recruitment</Link> },
                  { key: "payroll", label: <Link href="/dashboard/payroll">Payroll</Link> },
                  { key: "reports", label: <Link href="/dashboard/reports">Reports</Link> },
                  { key: "settings", label: <Link href="/dashboard/settings">Settings</Link> },
                ]}
              />
            </div>
            {/* User Avatar with Dropdown */}
            <div>
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Avatar style={{ backgroundColor: "#87d068", cursor: "pointer" }} icon={<UserOutlined />} />
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div style={containerStyle}>
          {/* User Status Card */}
          {user ? (
            <Card style={{ marginBottom: "24px" }}>
              <Text strong>Logged in as: </Text>
              <Text>
                {user.firstName} {user.lastName} ({user.email})
              </Text>
              <br />
              <Text strong>Role: </Text>
              <Text>{displayRole}</Text>
              <br />
              <Text strong>Onboarding Completed: </Text>
              <Text>{user.onboardingCompleted ? "Yes" : "No"}</Text>
            </Card>
          ) : (
            <Card style={{ marginBottom: "24px" }}>
              <Text>Loading user info...</Text>
            </Card>
          )}

          {/* Statistics Section */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            {stats.map((item, index) => (
              <Col xs={24} md={6} key={index}>
                <Card>
                  <Title level={4}>{item.title}</Title>
                  <Text strong style={{ fontSize: "24px" }}>{item.value}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Analytics Section */}
          <Row gutter={[32, 32]} style={{ marginBottom: "40px" }}>
            <Col xs={24} md={12}>
              <Card title="Employee Trends" style={{ minHeight: "260px" }}>
                <Line {...lineConfig} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Department Distribution" style={{ minHeight: "260px" }}>
                <div style={{ height: 250 }}>
                  <Pie {...pieConfig} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Matrix Section */}
          <Row gutter={[32, 32]} style={{ marginBottom: "40px" }}>
            <Col xs={24}>
              <Card title="Employee Matrix">
                <Table columns={matrixColumns} dataSource={matrixData} pagination={false} bordered />
              </Card>
            </Col>
          </Row>

          {/* Panels Section */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Team Chat" style={{ marginBottom: "24px" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={messagesData}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
                        title={item.name}
                        description={item.message}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Department Performance" style={{ marginBottom: "24px", minHeight: "260px" }}>
                <Column {...columnConfig} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>

      {/* Password Change Modal */}
      <Modal
        title="Password Change Required"
        open={passwordModalVisible}
        onCancel={dismissModal}
        footer={[
          <Button key="later" onClick={dismissModal}>
            Remind Me Later
          </Button>,
          <Button key="change" type="primary" onClick={handlePasswordChange}>
            Change Password Now
          </Button>,
        ]}
      >
        <p>
          It looks like you haven't changed your temporary password yet. For improved security, please update your password.
        </p>
      </Modal>
    </Layout>
  );
}

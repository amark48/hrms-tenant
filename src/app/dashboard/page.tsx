"use client";

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Dropdown,
  Badge,
} from "antd";
import {
  NotificationOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // --- Static Data for Charts ---
  const dataLine = [
    { month: "Jan", employees: 100 },
    { month: "Feb", employees: 110 },
    { month: "Mar", employees: 120 },
    { month: "Apr", employees: 130 },
    { month: "May", employees: 140 },
    { month: "Jun", employees: 145 },
    { month: "Jul", employees: 150 },
    { month: "Aug", employees: 155 },
    { month: "Sep", employees: 160 },
    { month: "Oct", employees: 165 },
    { month: "Nov", employees: 170 },
    { month: "Dec", employees: 175 },
  ];

  const dataBar = [
    { department: "HR", performance: 80 },
    { department: "Engineering", performance: 95 },
    { department: "Sales", performance: 70 },
  ];

  const dataPie = [
    { name: "HR", value: 20 },
    { name: "Engineering", value: 50 },
    { name: "Sales", value: 30 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // --- Sidebar Navigation Items ---
  const sidebarMenuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "employees", label: "Employees" },
    { key: "attendance", label: "Attendance" },
    { key: "recruitment", label: "Recruitment" },
    { key: "payroll", label: "Payroll" },
    { key: "reports", label: "Reports" },
    { key: "settings", label: "Settings" },
  ];

  // --- User Dropdown Menu Items ---
  const userMenuItems = [
    { key: "profile", label: "Profile", icon: <UserOutlined /> },
    { key: "settings", label: "Settings", icon: <SettingOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];

  const onUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      console.log("Logging out...");
      router.push("/login");
    } else if (key === "profile") {
      router.push("/profile");
    } else if (key === "settings") {
      router.push("/settings");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Full-width Top Bar */}
      <Header
        style={{
          background: "#fff",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side: Logo and Dashboard Title */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="Brand Logo"
            style={{ height: "40px", marginRight: "12px" }}
          />
          <Title level={4} style={{ margin: 0, fontWeight: "bold" }}>
            Tenant Admin Dashboard
          </Title>
        </div>
        {/* Right Side: Notification and User Avatar Dropdown */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge count={5} offset={[-5, 5]}>
            <NotificationOutlined style={{ fontSize: 24, marginRight: 24 }} />
          </Badge>
          <Dropdown
            menu={{ items: userMenuItems, onClick: onUserMenuClick }}
            trigger={["click"]}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      </Header>

      {/* Layout below the Header */}
      <Layout>
        {/* Sidebar: now only containing navigation */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ background: "#fff" }}
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            items={sidebarMenuItems}
          />
        </Sider>

        {/* Main Content */}
        <Content style={{ margin: "24px 16px", background: "#fff", padding: 24 }}>
          {/* Summary Metric Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card variant="borderless">
                <Title level={3}>125</Title>
                <Text>Total Employees</Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card variant="borderless">
                <Title level={3}>92</Title>
                <Text>Attendance Today</Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card variant="borderless">
                <Title level={3}>5</Title>
                <Text>Open Positions</Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card variant="borderless">
                <Title level={3}>2%</Title>
                <Text>Employee Turnover</Text>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {/* Left: Line Chart for Employee Trends */}
            <Col xs={24} md={12}>
              <Card title="Employee Trends" variant="borderless" style={{ height: 320 }}>
                <div style={{ height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataLine}>
                      <CartesianGrid stroke="#ccc" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="employees" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            {/* Right: Bar Chart for Department Performance */}
            <Col xs={24} md={12}>
              <Card title="Department Performance" variant="borderless" style={{ height: 320 }}>
                <div style={{ height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataBar}>
                      <CartesianGrid stroke="#ccc" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Second Charts Row: Pie Chart and Team Chat */}
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Department Distribution" variant="borderless" style={{ height: 320 }}>
                <div style={{ height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataPie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {dataPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Team Chat" variant="borderless" style={{ height: 320 }}>
                <div style={{ padding: "0 16px", height: "100%", overflowY: "auto" }}>
                  <Title level={5}>Recent Messages</Title>
                  <p><strong>John Doe:</strong> Please review the Q3 reports.</p>
                  <p><strong>Jane Smith:</strong> The numbers look great!</p>
                  <p><strong>Admin:</strong> Let's schedule a meeting for tomorrow.</p>
                  <Text type="secondary">...more conversation</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        ©2025 Enterprise HRMS - All Rights Reserved
      </Footer>
    </Layout>
  );
}

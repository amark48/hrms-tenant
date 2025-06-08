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
  message,
  Dropdown,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
// Import chart components from Ant Design Plots
import { Pie, Line, Column } from "@ant-design/plots";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// Reusable container style for centering content.
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
    type: "outer",
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
  meta: {
    performance: { alias: "Performance (%)" },
  },
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

  // Define user dropdown menu items.
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
            // Example logout: clear stored user and redirect.
            localStorage.removeItem("userId");
            router.push("/login");
          }}
        >
          Logout
        </span>
      ),
    },
  ];
  const userMenu = <Menu items={userMenuItems} />;

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
            {/* Left: Logo & Title */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href="/">
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
            {/* Center: Navigation Menu */}
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
            {/* Right: User Avatar with Dropdown */}
            <div>
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Avatar style={{ backgroundColor: "#87d068", cursor: "pointer" }} icon={<UserOutlined />} />
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>

      {/* Main Content with top margin to account for fixed header */}
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div style={containerStyle}>
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
            {/* Employee Trends (Line Chart) */}
            <Col xs={24} md={12}>
              <Card title="Employee Trends" style={{ minHeight: "260px" }}>
                <Line {...lineConfig} />
              </Card>
            </Col>
            {/* Department Distribution (Pie Chart) */}
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

      {/* FOOTER */}
      <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
    </Layout>
  );
}

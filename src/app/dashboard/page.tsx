"use client";
import '@ant-design/v5-patch-for-react-19';
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
  Modal,
  Button,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { Pie, Line, Column } from "@ant-design/plots";
import DashboardHeader from "./DashboardHeader/page";
import UpdateTenantModal from "./UpdateTenantModal";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const containerStyle = { maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "0 24px" };

const stats = [
  { title: "Total Employees", value: 125 },
  { title: "Attendance Today", value: 92 },
  { title: "Open Positions", value: 5 },
  { title: "Employee Turnover", value: "2%" },
];

const messagesData = [
  { id: 1, name: "John Doe", message: "Please review the Q3 reports." },
  { id: 2, name: "Jane Smith", message: "The numbers look great!" },
  { id: 3, name: "Admin", message: "Let’s schedule a meeting for tomorrow." },
];

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
  animation: {
    appear: {
      animation: "path-in",
      duration: 500,
      easing: "easeLinear",
    },
  },
};

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
    offset: 20,
    content: (data: any) => {
      const total = pieData.reduce((acc, item) => acc + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return `${data.type}: ${percentage}%`;
    },
  },
  interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
};

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
    position: "center",
    style: { fill: "#FFFFFF", opacity: 0.6 },
  },
  xAxis: { label: { autoHide: true, autoRotate: false } },
  meta: { performance: { alias: "Performance (%)" } },
};

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

// Helper function: resolves the full logo URL from the backend.
function getTenantLogoUrl(logoUrl?: string) {
  if (!logoUrl) return "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return logoUrl.startsWith("http") ? logoUrl : `${apiUrl.replace("/api", "")}${logoUrl}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const [tenantEditModalVisible, setTenantEditModalVisible] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [mfaTypes, setMfaTypes] = useState<string[]>([]);
  const [mfaRawData, setMfaRawData] = useState<any>(null);

  // ─────────── NEW: Dynamic state for charts ───────────
  const [employeeTrendsData, setEmployeeTrendsData] = useState(lineData);
  const [departmentPerformanceChartData, setDepartmentPerformanceChartData] = useState(departmentPerformanceData);

  // Create dynamic chart configuration objects that use the fetched data
  const dynamicLineConfig = { ...lineConfig, data: employeeTrendsData };
  const dynamicColumnConfig = { ...columnConfig, data: departmentPerformanceChartData };

  // Logout handler.
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menuItems = [
    { key: "dashboard", label: <Link href="/dashboard">Dashboard</Link> },
    { key: "employees", label: <Link href="/dashboard/employees">Employees</Link> },
    { key: "attendance", label: <Link href="/dashboard/attendance">Attendance</Link> },
    { key: "recruitment", label: <Link href="/dashboard/recruitment">Recruitment</Link> },
    { key: "payroll", label: <Link href="/dashboard/payroll">Payroll</Link> },
    { key: "reports", label: <Link href="/dashboard/reports">Reports</Link> },
    { key: "timesheet", label: <Link href="/dashboard/timesheet">Timesheet</Link> },
    { key: "settings", label: <Link href="/dashboard/settings">Settings</Link> },
  ];

  const userMenuItems = [
    { key: "profile", label: <Link href="/dashboard/profile">Profile</Link> },
    { key: "logout", label: <span onClick={handleLogout}>Logout</span> },
  ];

  // ─────────── Existing useEffect: Fetch user profile ───────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[DEBUG Dashboard] No token found in localStorage, redirecting to /login");
      router.push("/login");
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("[DEBUG Dashboard] Cleared token and user info, redirecting to /login");
        router.push("/login");
      });
  }, [router]);

  // ─────────── Existing useEffect: Fetch tenant info ───────────
  useEffect(() => {
    if (user && user.tenantId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      fetch(`${apiUrl}/api/tenants/${user.tenantId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch tenant info: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("[DEBUG Dashboard] Tenant data fetched:", data);
          setTenant(data);
        })
        .catch((err) => {
          console.error("Error fetching tenant info:", err);
        });
    }
  }, [user]);

  // ─────────── Existing useEffect: Fetch MFA types when tenant edit modal opens ───────────
  useEffect(() => {
    if (tenantEditModalVisible) {
      const fetchMfaTypes = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-mfa-types`);
          if (!response.ok) {
            throw new Error("Failed to fetch MFA types.");
          }
          const data = await response.json();
          if (Array.isArray(data)) {
            setMfaTypes(data.filter((type) => type != null && type !== ""));
          } else {
            setMfaTypes([]);
          }
        } catch (error: any) {
          console.error("Error fetching MFA types:", error);
          message.error("Error fetching MFA types: " + error.message);
        }
      };
      fetchMfaTypes();
    }
  }, [tenantEditModalVisible]);

  // ─────────── Existing useEffect: Show onboarding modal if needed ───────────
  useEffect(() => {
    if (user && user.onboardingCompleted === false) {
      setOnboardingModalVisible(true);
    }
  }, [user]);

  // ─────────── NEW: Fetch dynamic employee trends data ───────────
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/employee-trends`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setEmployeeTrendsData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic employee trends data", error);
      }
    })();
  }, []);

  // ─────────── NEW: Fetch dynamic department performance data ───────────
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/department-performance`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setDepartmentPerformanceChartData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic department performance data", error);
      }
    })();
  }, []);

  const handleOnboardingModalOk = () => {
    setOnboardingModalVisible(false);
    router.push("/dashboard/onboarding");
  };

  const handleOnboardingModalCancel = () => {
    setOnboardingModalVisible(false);
  };

  const displayRole =
    typeof user?.role === "object" ? user.role.name || "N/A" : user?.role || "N/A";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardHeader userMenuItems={userMenuItems} menuItems={menuItems} />
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div style={containerStyle}>
          {user ? (
            <Card style={{ marginBottom: "24px" }}>
              <Row justify="space-between" align="middle">
                <Col>
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
                </Col>
                <Col>
                  {tenant && (
                    <Row align="middle" gutter={8} style={{ flexWrap: "nowrap" }}>
                      <Col>
                        <Title level={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
                          {tenant.name}
                        </Title>
                      </Col>
                      <Col>
                        {tenant.logoUrl ? (
                          <img
                            src={getTenantLogoUrl(tenant.logoUrl)}
                            alt="Tenant Logo"
                            style={{ height: "50px" }}
                          />
                        ) : (
                          <Avatar style={{ background: "#ccc", verticalAlign: "middle" }} size={50}>
                            {tenant.name.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                      </Col>
                      {user.isTenantAdmin && (
                        <Col>
                          <EditOutlined
                            style={{ fontSize: "20px", cursor: "pointer", marginLeft: "8px" }}
                            onClick={() => setTenantEditModalVisible(true)}
                          />
                        </Col>
                      )}
                    </Row>
                  )}
                </Col>
              </Row>
              {user.onboardingCompleted === false && (
                <Button
                  type="primary"
                  onClick={() => setOnboardingModalVisible(true)}
                  style={{ marginTop: "12px" }}
                >
                  Start Onboarding Process
                </Button>
              )}
            </Card>
          ) : (
            <Card style={{ marginBottom: "24px" }}>
              <Text>Loading user info...</Text>
            </Card>
          )}

          {/* Stats, Charts, Tables, Chat, etc. */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            {stats.map((item, index) => (
              <Col xs={24} md={6} key={index}>
                <Card>
                  <Title level={4}>{item.title}</Title>
                  <Text strong style={{ fontSize: "24px" }}>
                    {item.value}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[32, 32]} style={{ marginBottom: "40px" }}>
            <Col xs={24} md={12}>
              <Card title="Employee Trends" style={{ minHeight: "260px" }}>
                {/* Use dynamicLineConfig so that updated data renders */}
                <Line {...dynamicLineConfig} />
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

          <Row gutter={[32, 32]} style={{ marginBottom: "40px" }}>
            <Col xs={24}>
              <Card title="Employee Matrix">
                <Table columns={matrixColumns} dataSource={matrixData} pagination={false} bordered />
              </Card>
            </Col>
          </Row>
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
                {/* Use dynamicColumnConfig so that the latest performance data is displayed */}
                <Column {...dynamicColumnConfig} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>

      <Modal
        title="Start Onboarding Process"
        open={onboardingModalVisible}
        onCancel={handleOnboardingModalCancel}
        footer={[
          <Button key="cancel" onClick={handleOnboardingModalCancel}>
            Cancel
          </Button>,
          <Button key="proceed" type="primary" onClick={handleOnboardingModalOk}>
            Proceed
          </Button>,
        ]}
        centered
        forceRender
      >
        <p>Please follow the steps to complete your onboarding process. This may include:</p>
        <ul>
          <li>Reviewing company policies</li>
          <li>Setting up your profile</li>
          <li>Completing mandatory training modules</li>
        </ul>
      </Modal>

      <UpdateTenantModal
        visible={tenantEditModalVisible}
        tenant={tenant}
        mfaTypes={mfaTypes}
        onOk={(values) => {
          setTenantLoading(true);
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          fetch(`${apiUrl}/api/tenants/${tenant.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          })
            .then((res) => {
              if (!res.ok) throw new Error(`Failed to update tenant info: ${res.status}`);
              return res.json();
            })
            .then((data) => {
              message.success("Tenant information updated successfully!");
              setTenant(data);
              setTenantEditModalVisible(false);
            })
            .catch((err) => {
              console.error("Error updating tenant info:", err);
              message.error("Error updating tenant information.");
            })
            .finally(() => {
              setTenantLoading(false);
            });
        }}
        onCancel={() => setTenantEditModalVisible(false)}
        confirmLoading={tenantLoading}
      />
    </Layout>
  );
}

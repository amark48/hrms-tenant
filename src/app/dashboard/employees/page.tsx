"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Steps,
  Upload,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "../DashboardHeader"; // Adjust path if needed

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

// Helper: Resolves full URL for logos/avatars.
function getTenantLogoUrl(logoUrl?: string) {
  if (!logoUrl) return "";
  return logoUrl.startsWith("http")
    ? logoUrl
    : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${logoUrl}`;
}

// -------------------------
// INTERFACES
// -------------------------

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  logoUrl?: string;
}

// Combined form values for the wizard.
export interface EmployeeFormValues {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  contactPhone: string;
  email: string;

  // Step 2: Emergency & Health Information
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyEmail: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  healthInsuranceProvider?: string;
  healthPolicyNumber?: string;
  healthDetails?: string;

  // Step 3: Employment Eligibility
  workEligibility: string;
  eligibilityUpload?: any; // File upload for supporting document
  idCardUpload?: any;      // File upload for second identification

  // Step 4: Financial & Job Information
  filingStatus: string;
  taxDependentCredits?: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  jobTitle: string;
  role: string; // Moved here from Step 1.
  reportingManager: string;
  department: string;
  payCircle: string; // e.g., "bi-weekly", "monthly", "quarterly"
  salary?: number;
  startDate?: string;
}

// Helper: Normalize file upload value.
const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

// -------------------------
// EMPLOYEE WIZARD MODAL COMPONENT (4 STEPS)
// -------------------------
interface EmployeeWizardModalProps {
  open: boolean;
  confirmLoading: boolean;
  onOk: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<EmployeeFormValues>;
  managers: Employee[]; // For Reporting Manager dropdown.
  departments: Array<{ id: string; name: string }>; // For Department dropdown.
}

function EmployeeWizardModal({
  open,
  confirmLoading,
  onOk,
  onCancel,
  initialValues,
  managers,
  departments,
}: EmployeeWizardModalProps) {
  const [form] = Form.useForm<EmployeeFormValues>();
  const [current, setCurrent] = useState(0);
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);

  // Assume tenantCountry is determined from tenant data; for demonstration, we set it to "US".
  const tenantCountry = "US";

useEffect(() => {
  async function fetchRoles() {
    try {
      // Retrieve the token from localStorage (ensure your client environment has it)
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      // Assume data is an array of roles with id and name.
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }
  fetchRoles();
}, []);


  // Reset wizard on modal open.
  useEffect(() => {
    if (open) {
      setCurrent(0);
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  // Define US states and Canadian provinces arrays.
  const USStates = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" },
  ];

  const CAProvinces = [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" },
    { code: "YT", name: "Yukon" },
  ];

  // Define wizard steps.
  const steps = [
    {
      title: "Personal Information",
      content: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Street Address"
            name="streetAddress"
            rules={[{ required: true, message: "Please enter street address" }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State/Province"
                name="state"
                rules={[{ required: true, message: "Please enter state/province" }]}
              >
                {tenantCountry === "US" ? (
                  <Select placeholder="Select state">
                    {USStates.map((s) => (
                      <Select.Option key={s.code} value={s.name}>
                        {s.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : tenantCountry === "Canada" ? (
                  <Select placeholder="Select province">
                    {CAProvinces.map((p) => (
                      <Select.Option key={p.code} value={p.name}>
                        {p.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder="Enter state/province" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Postal Code"
            name="postalCode"
            rules={[{ required: true, message: "Please enter postal code" }]}
          >
            <Input placeholder="Enter postal code" />
          </Form.Item>
          <Form.Item
            label="Contact Phone"
            name="contactPhone"
            rules={[{ required: true, message: "Please enter contact phone" }]}
          >
            <Input placeholder="Enter contact phone" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Emergency & Health Info",
      content: (
        <>
          <Form.Item
            label="Emergency Contact First Name"
            name="emergencyFirstName"
            rules={[{ required: true, message: "Please enter emergency contact first name" }]}
          >
            <Input placeholder="Enter emergency contact first name" />
          </Form.Item>
          <Form.Item
            label="Emergency Contact Last Name"
            name="emergencyLastName"
            rules={[{ required: true, message: "Please enter emergency contact last name" }]}
          >
            <Input placeholder="Enter emergency contact last name" />
          </Form.Item>
          <Form.Item
            label="Emergency Contact Email"
            name="emergencyEmail"
            rules={[
              { required: true, message: "Please enter emergency contact email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter emergency contact email" />
          </Form.Item>
          <Form.Item
            label="Emergency Contact Phone"
            name="emergencyPhone"
            rules={[{ required: true, message: "Please enter emergency contact phone" }]}
          >
            <Input placeholder="Enter emergency contact phone" />
          </Form.Item>
          <Form.Item
            label="Relationship"
            name="emergencyRelationship"
            rules={[{ required: true, message: "Please select relationship" }]}
          >
            <Select placeholder="Select relationship">
              <Select.Option value="wife">Wife</Select.Option>
              <Select.Option value="husband">Husband</Select.Option>
              <Select.Option value="sister">Sister</Select.Option>
              <Select.Option value="brother">Brother</Select.Option>
              <Select.Option value="cousin">Cousin</Select.Option>
              <Select.Option value="friend">Friend</Select.Option>
              <Select.Option value="others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Health Insurance Provider" name="healthInsuranceProvider">
            <Input placeholder="Optional: Health insurance provider" />
          </Form.Item>
          <Form.Item label="Policy Number" name="healthPolicyNumber">
            <Input placeholder="Optional: Policy number" />
          </Form.Item>
          <Form.Item label="Wellness/Plan Details" name="healthDetails">
            <TextArea rows={3} placeholder="Optional: Details on wellness plans or health benefits" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Employment Eligibility",
      content: (
        <>
          <Form.Item
            label="Employment Eligibility"
            name="workEligibility"
            rules={[{ required: true, message: "Please select your eligibility" }]}
          >
            <Select placeholder="Select eligibility">
              <Select.Option value="citizen">
                {tenantCountry === "US"
                  ? "US Citizen"
                  : tenantCountry === "Canada"
                  ? "Canadian National"
                  : "Citizen"}
              </Select.Option>
              <Select.Option value="green_card">Green Card / Work Permit</Select.Option>
              <Select.Option value="others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate={(prev, curr) => prev.workEligibility !== curr.workEligibility}>
            {() => {
              const eligibility = form.getFieldValue("workEligibility");
              if (eligibility === "citizen" || eligibility === "others") {
                return (
                  <Form.Item
                    label="Upload Supporting Document"
                    name="eligibilityUpload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload supporting document" }]}
                  >
                    <Upload beforeUpload={() => false} listType="picture-card">
                      <Button>Upload Documentation</Button>
                    </Upload>
                  </Form.Item>
                );
              } else if (eligibility === "green_card") {
                return (
                  <Form.Item
                    label="Upload Green Card/Work Permit Copy"
                    name="eligibilityUpload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload work permit copy" }]}
                  >
                    <Upload beforeUpload={() => false} listType="picture-card">
                      <Button>Upload Permit</Button>
                    </Upload>
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
          <Form.Item
            label="Upload Identification Card"
            name="idCardUpload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload an ID card" }]}
          >
            <Upload beforeUpload={() => false} listType="picture-card">
              <Button>Upload ID Card</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Financial & Job Info",
      content: (
        <>
          <h4>Tax Withholding Details</h4>
          <Form.Item
            label="Filing Status"
            name="filingStatus"
            rules={[{ required: true, message: "Please select your filing status" }]}
          >
            <Select placeholder="Select filing status">
              <Select.Option value="single_filing_separately">
                Single or Married Filing Separately
              </Select.Option>
              <Select.Option value="married_jointly_surviving">
                Married Filing Jointly or Qualifying Surviving Spouse
              </Select.Option>
              <Select.Option value="head_of_household">Head of Household</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Claim Dependent and Other Credits"
            name="taxDependentCredits"
          >
            <Input placeholder="Enter details for dependent credits" />
          </Form.Item>
          <h4>Direct Deposit Information</h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
                rules={[{ required: true, message: "Please enter bank name" }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Routing Number"
                name="routingNumber"
                rules={[{ required: true, message: "Please enter routing number" }]}
              >
                <Input placeholder="Enter routing number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true, message: "Please enter account number" }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account Type"
                name="accountType"
                rules={[{ required: true, message: "Please select account type" }]}
              >
                <Select placeholder="Select account type">
                  <Select.Option value="checking">Checking</Select.Option>
                  <Select.Option value="savings">Savings</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <h4>Job Information</h4>
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="Enter job title" />
          </Form.Item>
          {/* Role field moved here */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.name}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Reporting Manager"
            name="reportingManager"
            rules={[{ required: true, message: "Please select reporting manager" }]}
          >
            <Select placeholder="Select reporting manager">
              {managers.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select department">
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.name}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Pay Circle"
            name="payCircle"
            rules={[{ required: true, message: "Please select pay circle" }]}
          >
            <Select placeholder="Select pay circle">
              <Select.Option value="bi-weekly">Bi-Weekly</Select.Option>
              <Select.Option value="monthly">Monthly</Select.Option>
              <Select.Option value="quarterly">Quarterly</Select.Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Date" name="startDate">
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Salary" name="salary">
                <Input type="number" placeholder="Enter salary" prefix="$" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  // Utility: Return field names for current step validation.
  const getCurrentStepFields = (step: number): string[] => {
    switch (step) {
      case 0:
        return [
          "firstName",
          "lastName",
          "streetAddress",
          "city",
          "state",
          "postalCode",
          "contactPhone",
          "email",
        ];
      case 1:
        return [
          "emergencyFirstName",
          "emergencyLastName",
          "emergencyEmail",
          "emergencyPhone",
          "emergencyRelationship",
        ];
      case 2:
        return ["workEligibility", "eligibilityUpload", "idCardUpload"];
      case 3:
        return [
          "filingStatus",
          "bankName",
          "routingNumber",
          "accountNumber",
          "accountType",
          "jobTitle",
          "role", // now included in step 4
          "reportingManager",
          "department",
          "payCircle",
        ];
      default:
        return [];
    }
  };

  const next = async () => {
    try {
      const fieldsToValidate = getCurrentStepFields(current);
      await form.validateFields(fieldsToValidate);
      setCurrent(current + 1);
    } catch (error) {
      console.error("Step validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      onOk(values);
    } catch (error) {
      console.error("Final validation failed:", error);
    }
  };

  return (
    <Modal
      title="Add / Edit Employee"
      open={open}
      onCancel={onCancel}
      footer={null}
      confirmLoading={confirmLoading}
      centered
      destroyOnHidden
      width={800}
    >
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Form form={form} layout="vertical">
        {steps[current].content}
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {current > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prev}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleFinish}>
                Submit
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// -------------------------
// EMPLOYEES MANAGEMENT PAGE
// -------------------------

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch employees.
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Error fetching employees: ${res.status}`);
      const data = await res.json();
      setEmployees(data);
    } catch (error: any) {
      message.error("Error loading employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments.
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error: any) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const openModalForAdd = () => {
    setEditingEmployee(null);
    setModalVisible(true);
  };

  const openModalForEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      message.error("Error deleting employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardSubmit = async (values: EmployeeFormValues) => {
    setModalLoading(true);
    try {
      let res;
      if (editingEmployee) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }
      if (!res.ok) throw new Error("Failed to save employee");
      await res.json();
      message.success(`Employee ${editingEmployee ? "updated" : "created"} successfully!`);
      setModalVisible(false);
      fetchEmployees();
    } catch (error: any) {
      message.error("Error saving employee: " + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter managers from employees (for Reporting Manager dropdown).
  const managers = employees.filter((e) =>
    e.role.toLowerCase().includes("manager")
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "logoUrl",
      key: "avatar",
      render: (logoUrl: string) =>
        logoUrl ? <Avatar src={getTenantLogoUrl(logoUrl)} /> : <Avatar />,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Employee) => (
        <>
          <Button type="link" onClick={() => openModalForEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const userMenuItems = [
    { key: "profile", label: <Link href="/dashboard/profile">Profile</Link> },
    { key: "logout", label: <span onClick={handleLogout}>Logout</span> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardHeader userMenuItems={userMenuItems} menuItems={menuItems} />
      <Content style={{ padding: "40px 20px", marginTop: "64px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
          }}
        >
          <Card style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Manage Employees</h2>
              <Button type="primary" onClick={openModalForAdd}>
                Add Employee
              </Button>
            </div>
            <Table columns={columns} dataSource={employees} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </div>
      </Content>
      <Footer style={{ textAlign: "center", padding: "20px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        Enterprise HRMS ©2025 | All Rights Reserved.
      </Footer>
      <EmployeeWizardModal
        open={modalVisible}
        confirmLoading={modalLoading}
        onOk={handleWizardSubmit}
        onCancel={() => setModalVisible(false)}
        initialValues={
          editingEmployee
            ? {
                firstName: editingEmployee.name.split(" ")[0] || "",
                lastName: editingEmployee.name.split(" ")[1] || "",
                email: editingEmployee.email,
                department: editingEmployee.department,
                role: editingEmployee.role,
              }
            : undefined
        }
        managers={managers}
        departments={departments}
      />
    </Layout>
  );
}

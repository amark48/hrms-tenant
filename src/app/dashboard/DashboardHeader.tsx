"use client";

import React from "react";
import { Layout, Menu, Dropdown, Avatar, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  padding: "0 24px",
};

export interface DashboardHeaderProps {
  userMenuItems: any;
  menuItems: any;
}

export default function DashboardHeader({ userMenuItems, menuItems }: DashboardHeaderProps) {
  const router = useRouter();

  return (
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
            flexWrap: "nowrap",
          }}
        >
          {/* Left: Logo & Title */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/dashboard">
              <img
                src="/logo.png"
                alt="Enterprise HRMS Logo"
                style={{ height: "40px", marginRight: "16px", display: "block" }}
              />
            </Link>
            <Title
              level={3}
              style={{
                margin: 0,
                lineHeight: "40px",
                color: "#000",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              Enterprise HRMS
            </Title>
          </div>
          {/* Center: Navigation Menu */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["dashboard"]}
              style={{
                borderBottom: "none",
                backgroundColor: "transparent",
                display: "inline-block",
              }}
              items={menuItems}
            />
          </div>
          {/* Right: User Avatar with Dropdown */}
          <div style={{ textAlign: "right" }}>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <Avatar style={{ backgroundColor: "#87d068", cursor: "pointer" }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </div>
      </div>
    </Header>
  );
}

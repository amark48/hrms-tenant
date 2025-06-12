"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Tenant {
  subscriptionId?: string;
  autoRenew?: boolean;
  // Add any additional tenant properties here
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({
  initialTenantData,
  children,
}: {
  initialTenantData?: Tenant | null;
  children: ReactNode;
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenantData || null);
  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

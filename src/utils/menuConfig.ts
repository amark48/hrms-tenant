// utils/menuConfig.ts

export interface MenuItem {
  key: string;
  label: string;
}

export const standardMenuItems: MenuItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "employees", label: "Employees" },
  { key: "attendance", label: "Attendance" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

export const roleMenuMapping: { [role: string]: string[] } = {
  admin: ["dashboard", "employees", "attendance", "reports", "settings"],
  manager: ["dashboard", "employees", "reports"],
  employee: ["dashboard"],
};

export const getAccessibleMenuItems = (roles: any[]): MenuItem[] => {
  //console.log("getAccessibleMenuItems called with roles:", roles);

  // Fallback if no roles provided
  if (!roles || roles.length === 0) {
    //console.warn("No roles provided, falling back to employee role.");
    roles = ["employee"];
  }

  const allowedKeys = new Set<string>();
  roles.forEach((role) => {
    // Determine role name: if role is a string, use it;
    // if it's an object with a 'name' property, use that (converted to lowercase)
    let roleKey = "";
    if (typeof role === "string") {
      roleKey = role.toLowerCase();
    } else if (role && typeof role === "object" && role.name) {
      roleKey = role.name.toLowerCase();
    } else {
      console.warn("Unexpected role type:", role);
    }

    const keys = roleMenuMapping[roleKey];
    if (!keys) {
      console.warn(`No mapping found for role: ${roleKey}`);
    } else {
      //console.log(`Role "${roleKey}" allows keys:`, keys);
      keys.forEach((key) => allowedKeys.add(key));
    }
  });

  const accessibleMenuItems = standardMenuItems.filter((item) => allowedKeys.has(item.key));
  //console.log("Accessible Menu Items:", accessibleMenuItems);

  return accessibleMenuItems;
};

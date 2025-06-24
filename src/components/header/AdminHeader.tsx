"use client";

import React from "react";
import RoleBasedHeader from "./RoleBasedHeader";

/**
 * AdminHeader component
 * Uses the RoleBasedHeader component to create a header specifically for admin users
 * This component serves as the header for the admin dashboard section
 * 
 * @returns {JSX.Element} The AdminHeader component
 */
const AdminHeader: React.FC = () => {
    // Additional admin-specific content can be passed to the RoleBasedHeader
    // This badge indicates the user's role (admin in this case)
    const adminSpecificContent = (
        <div className="px-3">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Admin
            </span>
        </div>
    );

    // Use the RoleBasedHeader component with admin-specific props
    // This makes the header reusable across different roles
    return (
        <RoleBasedHeader
            title="Admin Dashboard"
            userRole="admin"
            logoPath="/images/logo/logo.svg"
            extraContent={adminSpecificContent}
        />
    );
};

export default AdminHeader;

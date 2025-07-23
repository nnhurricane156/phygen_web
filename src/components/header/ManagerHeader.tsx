"use client";

import React from "react";
import RoleBasedHeader from "./RoleBasedHeader";

/**
 * ManagerHeader component
 * Uses the RoleBasedHeader component to create a header specifically for manager users
 * This component serves as the header for the manager dashboard section
 * 
 * @returns {JSX.Element} The ManagerHeader component
 */
const ManagerHeader: React.FC = () => {
    // Additional manager-specific content can be passed to the RoleBasedHeader
    const managerSpecificContent = (
        <div className="px-3">
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                Manager
            </span>
        </div>
    );

    // Use the RoleBasedHeader component with manager-specific props
    return (
        <RoleBasedHeader
            title="Manager Dashboard"
            userRole="manager"
            logoPath="/images/logo/logo.svg"
            extraContent={managerSpecificContent}
        />
    );
};

export default ManagerHeader;

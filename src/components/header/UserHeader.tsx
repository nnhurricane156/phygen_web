"use client";

import React from "react";
import RoleBasedHeader from "./RoleBasedHeader";

/**
 * UserHeader component
 * Uses the RoleBasedHeader component to create a header specifically for regular users
 * This component serves as the header for the user dashboard section
 * 
 * @returns {JSX.Element} The UserHeader component
 */
const UserHeader: React.FC = () => {
    // Additional user-specific content can be passed to the RoleBasedHeader
    const userSpecificContent = (
        <div className="px-3">
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
                User
            </span>
        </div>
    );

    // Use the RoleBasedHeader component with user-specific props
    return (
        <RoleBasedHeader
            title="User Dashboard"
            userRole="user"
            logoPath="/images/logo/logo.svg"
            extraContent={userSpecificContent}
        />
    );
};

export default UserHeader;

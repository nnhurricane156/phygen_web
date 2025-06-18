import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
  className?: string; // Custom class names
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-white text-brand-500 border border-brand-500 dark:bg-white dark:text-brand-400 dark:border-brand-400",
      success:
        "bg-white text-success-600 border border-success-600 dark:bg-white dark:text-success-500 dark:border-success-500",
      error:
        "bg-white text-error-600 border border-error-600 dark:bg-white dark:text-error-500 dark:border-error-500",
      warning:
        "bg-white text-warning-600 border border-warning-600 dark:bg-white dark:text-orange-400 dark:border-orange-400",
      info: "bg-white text-blue-light-500 border border-blue-light-500 dark:bg-white dark:text-blue-light-500 dark:border-blue-light-500",
      light: "bg-white text-gray-700 border border-gray-300 dark:bg-white dark:text-gray-700 dark:border-gray-300",
      dark: "bg-white text-gray-700 border border-gray-500 dark:bg-white dark:text-gray-700 dark:border-gray-500",
    },
    solid: {
      primary: "bg-white text-brand-500 border-2 border-brand-500 dark:bg-white dark:text-brand-500",
      success: "bg-white text-success-600 border-2 border-success-600 dark:bg-white dark:text-success-600",
      error: "bg-white text-error-600 border-2 border-error-600 dark:bg-white dark:text-error-600",
      warning: "bg-white text-warning-600 border-2 border-warning-600 dark:bg-white dark:text-warning-600",
      info: "bg-white text-blue-light-500 border-2 border-blue-light-500 dark:bg-white dark:text-blue-light-500",
      light: "bg-white text-gray-700 border-2 border-gray-400 dark:bg-white dark:text-gray-700",
      dark: "bg-white text-gray-700 border-2 border-gray-700 dark:bg-white dark:text-gray-700",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];
  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;

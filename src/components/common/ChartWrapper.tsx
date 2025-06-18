"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import ApexCharts dynamically to avoid SSR issues
const ApexCharts = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-gray-50">Loading chart...</div>
});

interface ChartWrapperProps {
    type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
    series: any[];
    options: any;
    width?: string | number;
    height?: string | number;
}

/**
 * ChartWrapper component for safely rendering ApexCharts in Next.js
 * Prevents issues related to SSR and the window object
 */
const ChartWrapper: React.FC<ChartWrapperProps> = ({ type, series, options, width = "100%", height = 300 }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-[300px] w-full flex items-center justify-center bg-gray-50">Loading chart...</div>;
    }

    return (
        <ApexCharts
            type={type}
            series={series}
            options={options}
            width={width}
            height={height}
        />
    );
};

export default ChartWrapper;

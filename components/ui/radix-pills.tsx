
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PillTab {
    label: string;
    component?: React.ReactNode;
}

interface PillTabsProps {
    tabs: PillTab[];
    activeTab?: number;
    onTabChange?: (index: number) => void;
    className?: string;
    // Ignoring old style props as we want to enforce new theme
    [key: string]: any;
}

export default function Pills({
    tabs,
    activeTab: externalActiveTab,
    onTabChange,
    className,
    ...props
}: PillTabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(0);

    // Use external if provided, otherwise internal
    const activeIndex = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

    const handleValueChange = (val: string) => {
        // Determine new index from value string "tab-X"
        const index = parseInt(val.replace("tab-", ""), 10);

        if (onTabChange) {
            onTabChange(index);
        } else {
            setInternalActiveTab(index);
        }
    };

    if (!tabs || tabs.length === 0) {
        return <div>No tabs available</div>;
    }

    return (
        <Tabs
            value={`tab-${activeIndex}`}
            onValueChange={handleValueChange}
            className={cn("w-full h-full flex flex-col", className)}
        >
            <div className="shrink-0 mb-6">
                <TabsList
                    className="w-full grid gap-2"
                    style={{
                        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`
                    }}
                >
                    {tabs.map((tab, index) => (
                        <TabsTrigger
                            key={index}
                            value={`tab-${index}`}
                            className="font-montserrat text-sm md:text-base flex-1 min-w-0 truncate px-2"
                            title={tab.label}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-2">
                {tabs.map((tab, index) => (
                    <TabsContent
                        key={index}
                        value={`tab-${index}`}
                        className="mt-0 h-full focus-visible:outline-none focus-visible:ring-0 data-[state=inactive]:hidden"
                        forceMount={true} // Keep mounted to preserve state/scroll if needed? Actually Radix unmounts by default. Let's rely on default behavior for now unless requested.
                    >
                        {tab.component}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}

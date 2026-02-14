
"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface DrawerProps {
    isOpen?: boolean;
    onClose?: () => void;
    setDrawer?: Dispatch<SetStateAction<boolean>> | ((open: boolean) => void);
    children?: React.ReactNode;
    drawerContent?: string;
    overflow?: string;
    className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    setDrawer,
    children,
    drawerContent,
    overflow,
    className
}) => {

    const handleOpenChange = (open: boolean) => {
        if (setDrawer) {
            setDrawer(open);
        }
        if (!open && onClose) {
            onClose();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent
                side="right"
                className={cn(
                    "w-full sm:max-w-none p-0 bg-white border-l shadow-2xl transition-all duration-300 ease-in-out",
                    className
                )}
                style={{
                    width: drawerContent || "30%",
                    maxWidth: "100vw",
                    overflow: overflow || "hidden"
                }}
            >
                <VisuallyHidden.Root>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Drawer Content</SheetDescription>
                </VisuallyHidden.Root>
                <div className="h-full w-full overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Drawer;

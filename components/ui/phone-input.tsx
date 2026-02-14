"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const countries = [
    { value: "in", label: "India", code: "+91" },
    { value: "us", label: "USA", code: "+1" },
    { value: "ca", label: "Canada", code: "+1" },
    { value: "gb", label: "UK", code: "+44" },
    { value: "au", label: "Australia", code: "+61" },
    { value: "ae", label: "UAE", code: "+971" },
]

export interface PhoneInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onCountryChange?: (countryCode: string) => void
    defaultCountry?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, onCountryChange, defaultCountry = "in", ...props }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [selectedCountry, setSelectedCountry] = React.useState(
            countries.find((c) => c.value === defaultCountry) || countries[0]
        )
        const dropdownRef = React.useRef<HTMLDivElement>(null)

        // Handle click outside to close dropdown
        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setOpen(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        const handleSelect = (country: typeof countries[0]) => {
            setSelectedCountry(country)
            setOpen(false)
            if (onCountryChange) {
                onCountryChange(country.code)
            }
        }

        return (
            <div className={cn("relative flex gap-2 w-full", className)} ref={dropdownRef}>
                {/* Country Selector Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={cn(
                        "flex h-12 w-[140px] items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        open && "ring-2 ring-primary/20 border-primary/50"
                    )}
                >
                    <span className="flex items-center gap-2 truncate">
                        <img
                            src={`https://flagcdn.com/w40/${selectedCountry.value}.png`}
                            srcSet={`https://flagcdn.com/w80/${selectedCountry.value}.png 2x`}
                            alt={selectedCountry.label}
                            className="h-4 w-6 object-cover rounded-sm"
                        />
                        <span className="font-medium font-poppins text-gray-700">{selectedCountry.code}</span>
                    </span>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </button>

                {/* Dropdown Content */}
                {open && (
                    <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-[240px] rounded-xl border border-gray-200 bg-white p-1 text-gray-950 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
                        <div className="max-h-[300px] overflow-y-auto p-1">
                            {countries.map((country) => (
                                <div
                                    key={country.value}
                                    onClick={() => handleSelect(country)}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-poppins",
                                        selectedCountry.value === country.value && "bg-gray-50 text-gray-900"
                                    )}
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${country.value}.png`}
                                        srcSet={`https://flagcdn.com/w80/${country.value}.png 2x`}
                                        alt={country.label}
                                        className="mr-3 h-4 w-6 object-cover rounded-sm"
                                    />
                                    <span className="flex-1 font-medium">{country.label}</span>
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {country.code}
                                    </span>
                                    {selectedCountry.value === country.value && (
                                        <Check className="ml-2 h-4 w-4 shrink-0 opacity-100 text-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Phone Number Input */}
                <Input
                    ref={ref}
                    type="tel"
                    className="flex-1"
                    placeholder="98765 43210"
                    {...props}
                />
            </div>
        )
    }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }

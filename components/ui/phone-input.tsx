
import React, { useState, useRef, useEffect, useMemo } from "react";
import countries from "@/staticDatas/countryMap";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface Country {
    code: string;
    name: string;
    imageUrl: string;
}

interface PhoneInputProps {
    value: string;
    onChange: (value: string, country: Country) => void;
    label?: string;
    required?: boolean;
    errorMessage?: string;
    placeholder?: string;
    disabled?: boolean;
    isVerified?: boolean;
    readonly?: boolean;
    className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    label,
    required = false,
    errorMessage,
    placeholder = "",
    disabled = false,
    isVerified = false,
    readonly = false,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        countries.find((c) => c.code === "+91") || countries[0]
    );

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredCountries = useMemo(() => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        if (!trimmedSearchTerm) return countries;

        return countries.filter((country) => {
            const nameMatch = country.name.toLowerCase().startsWith(trimmedSearchTerm);
            const codeMatch = country.code.startsWith(trimmedSearchTerm);
            return nameMatch || codeMatch;
        });
    }, [searchTerm]);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setSearchTerm("");
        setIsOpen(false);
        // Keep the number, just update country code context if needed (though logic here seems to just pass number)
        // The original logic replaced code, but here 'value' seems to be just the number part based on usage?
        // Let's assume value is just the number.
        onChange(value, country);
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, "");

        if (selectedCountry.code === "+91" && numericValue.length > 10) {
            return;
        }

        onChange(numericValue, selectedCountry);
    };

    const isInvalidLength = selectedCountry.code === "+91" && value.length > 0 && value.length !== 10;

    return (
        <div className={cn("flex flex-col gap-2", className)} ref={containerRef}>
            {label && (
                <Label>
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            <div className={cn(
                "relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 ring-offset-background transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 shadow-sm",
                (isInvalidLength || errorMessage) ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive" : "",
                disabled && "opacity-50 cursor-not-allowed bg-muted",
                isVerified && "border-green-500 focus-within:ring-green-500/20"
            )}>

                <button
                    type="button"
                    onClick={() => !readonly && !disabled && setIsOpen(!isOpen)}
                    disabled={readonly || disabled}
                    className="flex h-10 items-center gap-2 px-3 hover:bg-muted/50 rounded-l-md transition-colors border-r"
                >
                    <img
                        src={selectedCountry.imageUrl}
                        alt={selectedCountry.name}
                        className="h-5 w-5 rounded-sm object-cover"
                    />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                <div className="flex items-center px-3 text-muted-foreground bg-muted/20 h-10 select-none">
                    {selectedCountry.code}
                </div>

                <input
                    ref={inputRef}
                    type="tel"
                    value={value}
                    onChange={handleInputChange}
                    disabled={disabled || readonly}
                    readOnly={readonly}
                    placeholder={placeholder}
                    className={cn(
                        "flex h-10 w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed",
                    )}
                />

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 z-50 mt-1 w-[300px] max-h-[300px] overflow-auto rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
                    >
                        <div className="sticky top-0 bg-popover p-2 border-b">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-md border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                        <div className="py-1">
                            {filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    onClick={() => handleCountrySelect(country)}
                                    className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                >
                                    <img src={country.imageUrl} alt={country.name} className="h-4 w-6 rounded-sm object-cover" />
                                    <span className="flex-1 text-left truncate">{country.name}</span>
                                    <span className="text-muted-foreground text-xs">{country.code}</span>
                                </button>
                            ))}
                            {filteredCountries.length === 0 && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No country found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isInvalidLength && (
                <p className="text-xs font-medium text-destructive">
                    Indian phone numbers must be 10 digits
                </p>
            )}
            {errorMessage && (
                <p className="text-xs font-medium text-destructive">{errorMessage}</p>
            )}
        </div>
    );
};

export { PhoneInput };

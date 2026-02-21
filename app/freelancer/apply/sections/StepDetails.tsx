"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { User, MapPin } from "lucide-react";
import { useFreelancerApplyStore } from "../store";

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function StepDetails() {
    const {
        fullName, setFullName,
        gender, setGender,
        phone, setPhone,
        countryCode, setCountryCode,
        country, setCountry,
        stateProv, setStateProv,
        city, setCity,
        pinCode, setPinCode,
        street, setStreet,
    } = useFreelancerApplyStore();

    return (
        <>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">
                Personal Details
            </h2>
            <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">
                Almost done! Tell us about yourself.
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Full Name *
                        </Label>
                        <Input
                            placeholder="e.g. James Wilson"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={<User className="w-[18px] h-[18px]" />}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Gender
                        </Label>
                        <Select value={gender} onValueChange={(v) => setGender(v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDERS.map((g) => (
                                    <SelectItem key={g} value={g}>
                                        {g}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Phone Number
                    </Label>
                    <PhoneInput
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onCountryChange={(code) => setCountryCode(code)}
                        defaultCountry="gb"
                        placeholder="7911 123456"
                    />
                </div>

                <div className="h-px bg-gray-100" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Country
                        </Label>
                        <Input
                            placeholder="United Kingdom"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            icon={<MapPin className="w-[18px] h-[18px]" />}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            County / Region
                        </Label>
                        <Input
                            placeholder="e.g. Greater London"
                            value={stateProv}
                            onChange={(e) => setStateProv(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            City
                        </Label>
                        <Input
                            placeholder="e.g. London"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Postcode
                        </Label>
                        <Input
                            placeholder="e.g. SW1A 1AA"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Street Address
                    </Label>
                    <Input
                        placeholder="e.g. 10 Downing Street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
}

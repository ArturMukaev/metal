"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormClearErrors,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";

// Custom phone formatting function
const formatPhoneNumber = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return "";
  }

  // Handle different starting digits
  let formatted = "";
  if (digits.startsWith("8")) {
    // Convert 8 to 7 and add the rest
    formatted = "7" + digits.slice(1);
  } else if (digits.startsWith("7")) {
    // Keep as is
    formatted = digits;
  } else {
    // Add 7 prefix if it doesn't start with 7 or 8
    formatted = "7" + digits;
  }

  // Limit to 11 digits (7 + 10 digits)
  formatted = formatted.slice(0, 11);

  // Format with mask +7 (xxx) xxx-xx-xx
  if (formatted.length === 1) {
    return "+7";
  } else if (formatted.length <= 4) {
    return `+7 (${formatted.slice(1)}`;
  } else if (formatted.length <= 7) {
    return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4)}`;
  } else if (formatted.length <= 9) {
    return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`;
  } else {
    return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9)}`;
  }
};

interface PhoneInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
  phoneValue: string;
  id?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function PhoneInput({
  register,
  errors,
  setValue,
  clearErrors,
  phoneValue,
  id = "phone",
  className = "",
  placeholder = "+7 (xxx) xxx-xx-xx",
  required = false,
}: PhoneInputProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    setValue("phone", formatted);

    // Clear phone error if input becomes valid
    if (errors.phone) {
      const digits = formatted.replace(/\D/g, "");
      if (digits.length === 11 && digits.startsWith("7")) {
        // Clear the error directly
        clearErrors("phone");
      }
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
      >
        Номер телефона {required && <span className="text-red-500">*</span>}
        {errors.phone && (
          <div className="relative group">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {errors.phone.message}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </label>
      <input
        type="tel"
        id={id}
        value={phoneValue}
        onChange={handlePhoneChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
          errors.phone
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        } ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}

"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormClearErrors,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface EmailInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  clearErrors: UseFormClearErrors<any>;
  emailValue: string;
  id?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function EmailInput({
  register,
  errors,
  clearErrors,
  emailValue,
  id = "email",
  className = "",
  placeholder = "your@email.com",
  required = false,
}: EmailInputProps) {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Clear email error if input becomes valid
    if (errors.email && inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(inputValue)) {
        // Clear the error directly
        clearErrors("email");
      }
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
      >
        Email {required && <span className="text-red-500">*</span>}
        {errors.email && (
          <div className="relative group">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {String(errors.email.message)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </label>
      <input
        {...register("email", {
          onChange: e => {
            register("email").onChange(e);
            handleEmailChange(e);
          },
        })}
        type="email"
        id={id}
        value={emailValue}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
          errors.email
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        } ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}

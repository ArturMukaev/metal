"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/utils/zodResolver";
import { Loader2, AlertCircle } from "lucide-react";
import { PhoneInput } from "./ui/PhoneInput";
import { EmailInput } from "./ui/EmailInput";
import { StatusPopup } from "./ui/StatusPopup";

const contactSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string({ required_error: "Введите номер телефона" })
    .min(1, "Введите номер телефона")
    .refine(value => {
      const digits = value.replace(/\D/g, "");
      return digits.length === 11 && digits.startsWith("7");
    }, "Введите корректный номер телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const phoneValue = watch("phone") || "";
  const emailValue = watch("email") || "";

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowPopup(true);
        reset();
        setTimeout(() => {
          setShowPopup(false);
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setSubmitStatus("idle");
        }, 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          Название
          {errors.name && (
            <div className="relative group">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {errors.name.message}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
            errors.name
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          }`}
          placeholder="Ваше имя или название компании"
        />
      </div>

      <PhoneInput
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        phoneValue={phoneValue}
        id="phone"
        placeholder="+7 (xxx) xxx-xx-xx"
        required={true}
      />

      <EmailInput
        register={register}
        errors={errors}
        clearErrors={clearErrors}
        emailValue={emailValue}
        id="email"
        placeholder="your@email.com"
        required={false}
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          Описание задачи
          {errors.message && (
            <div className="relative group">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {errors.message.message}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none ${
            errors.message
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          }`}
          placeholder="Опишите вашу задачу подробнее..."
        />
      </div>

      <StatusPopup
        show={showPopup}
        status={submitStatus}
        onClose={() => {
          setShowPopup(false);
          setSubmitStatus("idle");
        }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Отправка...
          </>
        ) : (
          "Отправить"
        )}
      </button>
    </form>
  );
}

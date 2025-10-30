"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@/lib/utils/zodResolver";
import {
  Loader2,
  AlertCircle,
  FileText,
  X,
  Check,
  Image,
  File as FileIcon,
  FolderArchive,
  Info,
} from "lucide-react";
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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total
const MAX_FILE_COUNT = 10;

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");

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

  const validateFile = (file: File): string | null => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension) {
      return `Файл "${file.name}" имеет неподдерживаемый формат`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Файл "${file.name}" слишком большой (макс. 50MB)`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check file count
    const newTotalCount = selectedFiles.length + files.length;
    if (newTotalCount > MAX_FILE_COUNT) {
      setFileError(`Максимум ${MAX_FILE_COUNT} файлов`);
      e.target.value = "";
      return;
    }

    // Check total size
    const currentTotalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const newFilesSize = files.reduce((sum, f) => sum + f.size, 0);
    const newTotalSize = currentTotalSize + newFilesSize;

    if (newTotalSize > MAX_TOTAL_SIZE) {
      setFileError(`Общий размер файлов превышает 100MB`);
      e.target.value = "";
      return;
    }

    // Validate each file
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileError(errors[0]);
      e.target.value = "";
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFileError("");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "bz2"];

    if (imageExtensions.includes(extension)) {
      return Image;
    }
    if (archiveExtensions.includes(extension)) {
      return FolderArchive;
    }
    return FileIcon;
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("phone", data.phone);
      formData.append("email", data.email || "");
      formData.append("message", data.message || "");

      selectedFiles.forEach(file => {
        formData.append(`files`, file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowPopup(true);
        reset();
        setSelectedFiles([]);
        setFileError("");
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

      <div>
        <div className="mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline">Прикрепите файлы</span>
              <span className="sm:hidden">Прикрепите файлы</span>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none max-w-xs sm:max-w-none sm:whitespace-nowrap">
                  Прикрепите ваши чертежи, планы, фотографии
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <label
              htmlFor="file-input"
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-gray-700 text-center flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Выбрать файлы
            </label>
          </div>
          <input
            type="file"
            id="file-input"
            multiple
            accept="*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-3">
          {fileError && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {fileError}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Выбранные файлы ({selectedFiles.length}/{MAX_FILE_COUNT}):
              </div>
              {selectedFiles.map((file, index) => {
                const Icon = getFileIcon(file.name);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Удалить файл"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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

      <p className="text-xs text-gray-500 text-center">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <Link
          href="/politika-konfidencialnosti"
          className="text-primary hover:underline"
          target="_blank"
        >
          политикой конфиденциальности
        </Link>
      </p>
    </form>
  );
}

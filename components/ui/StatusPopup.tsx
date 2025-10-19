"use client";

import React from "react";
import { Phone } from "lucide-react";
import { companyInfo } from "@/lib/data/company";

interface StatusPopupProps {
  show: boolean;
  status: "idle" | "success" | "error";
  onClose: () => void;
}

export function StatusPopup({ show, status, onClose }: StatusPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Успешно!
            </h3>
            <p className="text-gray-600 mb-4">
              Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в
              ближайшее время.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка</h3>
            <p className="text-gray-600 mb-2">
              Произошла ошибка при отправке. Пожалуйста, попробуйте позже или
              позвоните нам.
            </p>
            <a
              href={`tel:+${companyInfo.phones[0].replace(/\D/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors mb-4"
            >
              <Phone className="w-4 h-4" />
              {companyInfo.phones[0]}
            </a>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-3 rounded-lg transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

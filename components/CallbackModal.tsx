'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/lib/utils/zodResolver';
import { Modal } from './ui/Modal';
import { Loader2, Phone } from 'lucide-react';

const callbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
  });

  const onSubmit = async (data: CallbackFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          message: 'Запрос обратного звонка',
          source: 'callback',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Заказать обратный звонок" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-dark" />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              Оставьте свой номер телефона, и мы перезвоним вам в течение 15 минут
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="callback-name" className="block text-sm font-medium text-gray-700 mb-2">
              Ваше имя <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="callback-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Иван Иванов"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="callback-phone" className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="callback-phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              ✓ Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              ✗ Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам напрямую.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Отправка...
              </>
            ) : (
              'Заказать звонок'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </div>
    </Modal>
  );
}


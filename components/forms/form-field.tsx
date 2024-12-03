"use client";

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormInputs } from '@/lib/types';

interface FormFieldProps {
  label: string;
  name: keyof FormInputs;
  form: UseFormReturn<FormInputs>;
  placeholder?: string;
  textarea?: boolean;
}

export function FormField({ label, name, form, placeholder, textarea }: FormFieldProps) {
  const Component = textarea ? Textarea : Input;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <Component
        {...form.register(name)}
        placeholder={placeholder}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors[name]?.message}
        </p>
      )}
    </div>
  );
}
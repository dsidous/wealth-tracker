'use client';

import * as React from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils';

export type SelectOption = {
  value: string;
  label: React.ReactNode;
};

export type FormSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
  placeholder?: string;
  options: SelectOption[];
  /** Passed to SelectTrigger */
  triggerClassName?: string;
  /** Select size (matches SelectTrigger) */
  size?: 'sm' | 'default';
  disabled?: boolean;
};

export function FormSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  control: controlProp,
  placeholder,
  options,
  triggerClassName,
  size = 'default',
  disabled,
}: FormSelectFieldProps<TFieldValues, TName>) {
  const { control: contextControl } = useFormContext<TFieldValues>();
  const control = controlProp ?? contextControl;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                size={size}
                className={cn('w-full', triggerClassName)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

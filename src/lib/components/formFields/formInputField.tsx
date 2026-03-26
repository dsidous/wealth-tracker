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
import { Input } from '@/components/ui/input';

export type FormInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  control?: Control<TFieldValues>;
} & Omit<React.ComponentProps<typeof Input>, 'name'>;

export function FormInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  control: controlProp,
  ...inputProps
}: FormInputFieldProps<TFieldValues, TName>) {
  const { control: contextControl } = useFormContext<TFieldValues>();
  const control = controlProp ?? contextControl;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

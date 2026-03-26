'use client';

import * as React from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

export type HookFormProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
} & Omit<React.ComponentProps<'form'>, 'onSubmit' | 'children'>;

function HookForm<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...formProps
}: React.PropsWithChildren<HookFormProps<TFieldValues>>) {
  return (
    <FormProvider {...form}>
      <form {...formProps} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}

export { HookForm };

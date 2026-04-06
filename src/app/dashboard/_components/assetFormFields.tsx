'use client';

import { FormInputField, FormSelectField } from '@/components/formFields';
import { assetTypes } from '@/db/schema';

export const assetTypeSelectOptions = assetTypes.enumValues.map((t) => ({
  value: t,
  label: t,
}));

/** Shared fields for add/edit asset forms (react-hook-form names: name, balance, type, currency). */
export function AssetFormFields() {
  return (
    <>
      <FormInputField
        name='name'
        label='Asset Name'
        placeholder='e.g. Cold Wallet BTC'
        autoComplete='off'
      />
      <div className='grid grid-cols-2 gap-4'>
        <FormInputField
          name='balance'
          label='Balance'
          type='number'
          step='any'
          placeholder='0.5'
        />
        <FormSelectField
          name='type'
          label='Asset Type'
          placeholder='Select an asset type'
          options={assetTypeSelectOptions}
        />
        <FormInputField
          name='currency'
          label='Currency'
          placeholder='THB'
          autoCapitalize='characters'
          maxLength={3}
          className='col-span-2 sm:col-span-1'
        />
      </div>
    </>
  );
}

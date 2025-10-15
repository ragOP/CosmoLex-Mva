import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string')
    return value.toLowerCase() === 'true' || value === '1';
  return false;
};

const UpdateFirmDialog = ({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  firm = {},
  isLoading = false,
}) => {
  const initialValues = useMemo(
    () => ({
      first_name: firm?.first_name || '',
      last_name: firm?.last_name || '',
      country_code_id: firm?.country_code_id ?? '',
      firm_name: firm?.firm_name || '',
      address:
        [firm?.street_number, firm?.street_name, firm?.unit_number]
          .filter(Boolean)
          .join(' ') || '',
      city: firm?.city || '',
      state: firm?.province || '',
      zip_code: firm?.postal_code || '',
      country: firm?.country || '',
      email: firm?.email || '',
      phone_number: firm?.phone_number || '',
      business_number: firm?.business_number || '',
      fax_number: firm?.fax_number || '',
      toll_free_number: firm?.toll_free_number || '',
      website_address: firm?.website_address || '',
      is_active: toBoolean(firm?.is_active),
    }),
    [firm]
  );

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#F5F5FA] rounded-lg w-full max-w-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0px_4px_24px_0px_#000000] no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#40444D] text-center font-bold font-sans">
            Update Firm
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(() => {
            onSubmit(getValues());
            onClose();
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                First Name
              </Label>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Last Name
              </Label>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Country Code ID
              </Label>
              <Controller
                control={control}
                name="country_code_id"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Firm Name
              </Label>
              <Controller
                control={control}
                name="firm_name"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Address
              </Label>
              <Controller
                control={control}
                name="address"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">City</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">State</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Zip Code
              </Label>
              <Controller
                control={control}
                name="zip_code"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Country
              </Label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => <Input type="email" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Phone Number
              </Label>
              <Controller
                control={control}
                name="phone_number"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Business Number
              </Label>
              <Controller
                control={control}
                name="business_number"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Fax Number
              </Label>
              <Controller
                control={control}
                name="fax_number"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div>
              <Label className="text-[#40444D] font-semibold mb-2">
                Toll Free Number
              </Label>
              <Controller
                control={control}
                name="toll_free_number"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-[#40444D] font-semibold mb-2">
                Website
              </Label>
              <Controller
                control={control}
                name="website_address"
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className="border"
                  />
                )}
              />
              <Label className="text-[#40444D] font-semibold">Active</Label>
            </div>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
            >
              Update Firm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFirmDialog;

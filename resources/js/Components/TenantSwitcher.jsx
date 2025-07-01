import React from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

export default function TenantSwitcher({ tenants, currentTenantId, className }) {
  const handleValueChange = (tenantId) => {
    if (tenantId) {
      router.visit(route('tenants.show', tenantId));
    }
  };

  return (
    <div className={cn('w-[250px]', className)}>
      <Select onValueChange={handleValueChange} defaultValue={String(currentTenantId)}>
        <SelectTrigger>
          <SelectValue placeholder="Switch to another tenant..." />
        </SelectTrigger>
        <SelectContent>
          <p className="p-2 text-xs text-gray-500">Available Tenants</p>
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={String(tenant.id)}>
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

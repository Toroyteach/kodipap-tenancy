import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Check, ChevronsUpDown, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TenantSwitcher({ className, tenants = [], currentTenant = null }) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { url } = usePage();

    // Filter tenants based on search query
    const filteredTenants = tenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tenant.unit?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle tenant selection
    const handleSelectTenant = (tenantId) => {
        // Update the URL to include the selected tenant ID
        router.get(url, { tenant: tenantId }, { preserveState: true });
        setOpen(false);
    };

    // Get current tenant name for display
    const getCurrentTenantName = () => {
        if (!currentTenant && tenants.length > 0) {
            return 'Select a Tenant';
        }
        const tenant = tenants.find(t => t.id === currentTenant);
        return tenant ? tenant.name : 'No Tenant Selected';
    };

    // Get current tenant unit for display
    const getCurrentTenantUnit = () => {
        if (!currentTenant && tenants.length > 0) return `${tenants.length} tenants available`;
        const tenant = tenants.find(t => t.id === currentTenant);
        return tenant?.unit?.name || 'No unit assigned';
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'T';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a tenant"
                    className={cn("w-full justify-between text-left font-normal", className)}
                >
                    <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={currentTenant?.avatar} alt={getCurrentTenantName()} />
                            <AvatarFallback className="text-xs">
                                {getInitials(getCurrentTenantName())}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{getCurrentTenantName()}</p>
                            <p className="text-xs text-muted-foreground truncate">{getCurrentTenantUnit()}</p>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput 
                            placeholder="Search tenants..." 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="h-11 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <CommandList>
                        <CommandEmpty>No tenant found.</CommandEmpty>
                        <CommandGroup heading="Available Tenants">
                            {filteredTenants.map((tenant) => (
                                <CommandItem
                                    key={tenant.id}
                                    onSelect={() => handleSelectTenant(tenant.id)}
                                    className="text-sm cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={tenant.avatar} alt={tenant.name} />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(tenant.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{tenant.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {tenant.unit?.name || 'No unit assigned'}
                                            </p>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentTenant === tenant.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {tenants.length === 0 && (
                            <div className="py-6 text-center text-sm">
                                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p>No tenants available</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Add tenants to get started
                                </p>
                            </div>
                        )}
                    </CommandList>
                </Command>
                <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        asChild
                    >
                        <Link href={route('tenants.create')}>
                            <span className="mr-2">+</span> Add New Tenant
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

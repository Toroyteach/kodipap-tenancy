import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Loader2, Send, X, Search, Users, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/Components/ui/input';

const BulkMessageModal = ({ 
    isOpen, 
    onClose, 
    tenants = [],
    onSend,
    selectedTenants: externalSelectedTenants = []
}) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTenants, setSelectedTenants] = useState(externalSelectedTenants);
    const [selectAll, setSelectAll] = useState(false);
    const [showTenantList, setShowTenantList] = useState(true);

    // Filter tenants based on search term
    const filteredTenants = tenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone?.includes(searchTerm)
    );

    // Toggle select all tenants
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedTenants([]);
        } else {
            setSelectedTenants(filteredTenants.map(t => t.id));
        }
        setSelectAll(!selectAll);
    };

    // Toggle single tenant selection
    const toggleTenantSelection = (tenantId) => {
        setSelectedTenants(prev => 
            prev.includes(tenantId)
                ? prev.filter(id => id !== tenantId)
                : [...prev, tenantId]
        );
    };

    // Update select all checkbox when selected tenants change
    useEffect(() => {
        if (filteredTenants.length > 0 && selectedTenants.length === filteredTenants.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedTenants, filteredTenants]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || selectedTenants.length === 0) return;
        
        setIsSending(true);
        try {
            await onSend({
                recipient_ids: selectedTenants,
                recipient_type: 'tenant',
                message_type: messageType,
                content: message,
                subject: `Bulk: ${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`,
            });
            setMessage('');
            setSelectedTenants([]);
            onClose();
        } catch (error) {
            console.error('Failed to send bulk message:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Send Bulk Message</DialogTitle>
                        <button 
                            onClick={onClose}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <DialogDescription>
                        Send a message to multiple tenants at once. Selected: {selectedTenants.length} tenant(s)
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="space-y-4 overflow-y-auto flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="messageType">Message Type</Label>
                            <Select 
                                value={messageType} 
                                onValueChange={setMessageType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select message type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Message</SelectItem>
                                    <SelectItem value="payment">Payment Reminder</SelectItem>
                                    <SelectItem value="maintenance">Maintenance Update</SelectItem>
                                    <SelectItem value="notice">Important Notice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Recipients</Label>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search tenants..."
                                        className="w-full pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                
                                <div className="border rounded-md overflow-hidden">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowTenantList(!showTenantList)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium">
                                                {selectedTenants.length} {selectedTenants.length === 1 ? 'tenant' : 'tenants'} selected
                                            </span>
                                        </div>
                                        {showTenantList ? (
                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                    
                                    {showTenantList && (
                                        <div className="max-h-[200px] overflow-y-auto border-t">
                                            <div className="flex items-center space-x-2 p-2 border-b">
                                                <Checkbox 
                                                    id="select-all"
                                                    checked={selectAll}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                                <label
                                                    htmlFor="select-all"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Select All
                                                </label>
                                            </div>
                                            
                                            {filteredTenants.length > 0 ? (
                                                <div className="divide-y">
                                                    {filteredTenants.map(tenant => (
                                                        <div key={tenant.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                                                            <Checkbox 
                                                                id={`tenant-${tenant.id}`}
                                                                checked={selectedTenants.includes(tenant.id)}
                                                                onCheckedChange={() => toggleTenantSelection(tenant.id)}
                                                            />
                                                            <label
                                                                htmlFor={`tenant-${tenant.id}`}
                                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                                                            >
                                                                <div className="font-medium">{tenant.name}</div>
                                                                <div className="text-xs text-gray-500">{tenant.phone}</div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-gray-500">
                                                    No tenants found matching your search.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message to selected tenants..."
                                className="min-h-[150px]"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                            <p className="font-medium">Message Preview:</p>
                            <p className="mt-1 whitespace-pre-wrap">
                                {message || 'Your message will appear here...'}
                            </p>
                            <p className="mt-2 text-xs">
                                This message will be sent to {selectedTenants.length} {selectedTenants.length === 1 ? 'tenant' : 'tenants'}.
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter className="mt-4 pt-4 border-t">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={isSending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={!message.trim() || selectedTenants.length === 0 || isSending}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send to {selectedTenants.length} {selectedTenants.length === 1 ? 'Tenant' : 'Tenants'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BulkMessageModal;

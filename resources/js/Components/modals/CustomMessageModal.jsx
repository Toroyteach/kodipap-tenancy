import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Loader2, Send, X } from 'lucide-react';

const CustomMessageModal = ({ isOpen, onClose, tenant, onSend }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setIsSending(true);
        try {
            await onSend({
                recipient_id: tenant.id,
                recipient_type: 'tenant',
                message_type: messageType,
                content: message,
                subject: `Message regarding ${messageType}`,
            });
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Send Message to {tenant?.name}</DialogTitle>
                        <button 
                            onClick={onClose}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <DialogDescription>
                        Send a custom message to {tenant?.name}. This message will be sent via email and/or SMS.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                            id="message"
                            placeholder={`Type your message to ${tenant?.name}...`}
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
                    </div>
                    
                    <DialogFooter className="mt-4">
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
                            disabled={!message.trim() || isSending}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CustomMessageModal;

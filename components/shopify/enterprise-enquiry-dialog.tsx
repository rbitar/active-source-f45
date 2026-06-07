'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EnterpriseEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle?: string;
  productHandle?: string;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const EnterpriseEnquiryDialog: React.FC<EnterpriseEnquiryDialogProps> = ({
  open,
  onOpenChange,
  productTitle,
  productHandle,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          productTitle,
          productHandle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error || 'Something went wrong. Please try again.'
        );
        setFormState('error');
        return;
      }

      setFormState('success');
    } catch (err) {
      setErrorMessage(
        'Network error. Please check your connection and try again.'
      );
      setFormState('error');
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      // Reset form on close
      setTimeout(() => {
        setName('');
        setEmail('');
        setCompany('');
        setFormState('idle');
        setErrorMessage('');
      }, 300);
    }
    onOpenChange(val);
  };

  const isLoading = formState === 'loading';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full p-8">
        {formState === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Thank you for reaching out. Our team will review your enquiry and
              get back to you soon.
            </p>
            <Button
              variant="outline"
              className="mt-2 rounded-full px-8"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                Enquire for Enterprise Products
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Please complete the F45 Enterprise Inquiry Form below, our team
              will be in touch with you regarding your request momentarily.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Your Name */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="ent-name"
                >
                  Your Name
                </label>
                <Input
                  id="ent-name"
                  type="text"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-gray-100 border-0 rounded-lg h-12 px-4 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-enterprise"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="ent-email"
                >
                  Email Address
                </label>
                <Input
                  id="ent-email"
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-gray-100 border-0 rounded-lg h-12 px-4 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-enterprise"
                />
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="ent-company"
                >
                  Company Name
                </label>
                <Input
                  id="ent-company"
                  type="text"
                  placeholder="Enter Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-gray-100 border-0 rounded-lg h-12 px-4 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-enterprise"
                />
              </div>

              {/* Error */}
              {formState === 'error' && errorMessage && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full rounded-full h-13 mt-1 text-base font-bold bg-enterprise hover:bg-enterprise/90 text-enterprise-foreground gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Enquire Now'
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnterpriseEnquiryDialog;

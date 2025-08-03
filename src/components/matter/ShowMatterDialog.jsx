import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';
import formatDate from '@/utils/formatDate';

const ShowMatterDialog = ({ matter, open = false, onClose = () => {} }) => {
  if (!matter) return null;

  const {
    case_role,
    case_type,
    case_status,
    marketing_source,
    ad_campaign,
    case_description,
    contact,
  } = matter;

  const fullName = `${contact.prefix || ''} ${contact.first_name || ''} ${
    contact.middle_name || ''
  } ${contact.suffix || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#F5F5FA] p-6 rounded-xl shadow-xl overflow-auto max-h-[80vh] no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-[#1E293B]">
            <CalendarDays className="w-5 h-5 text-[#6366F1]" />
            Matter Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm text-slate-700">
          {/* --- Case Details --- */}
          <section>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <strong>Case Role:</strong> {case_role}
              </div>
              <div>
                <strong>Case Type:</strong> {case_type}
              </div>
              <div>
                <strong>Status:</strong> {case_status}
              </div>
              <div>
                <strong>Marketing Source:</strong> {marketing_source}
              </div>
              <div>
                <strong>Ad Campaign:</strong> {ad_campaign}
              </div>
              <div className="md:col-span-2">
                <strong>Description:</strong> {case_description || '—'}
              </div>
            </div>
          </section>

          <Separator />

          {/* --- Contact Details --- */}
          <section>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Contact Information
            </h3>
            <div className="flex items-start gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div>
                  <strong>Full Name:</strong> {fullName || '—'}
                </div>
                <div>
                  <strong>Alias:</strong> {contact.alias || '—'}
                </div>
                <div>
                  <strong>Contact Type:</strong> {contact.contact_type}
                </div>
                <div>
                  <strong>Gender:</strong> {contact.gender}
                </div>
                <div>
                  <strong>Company:</strong> {contact.company_name || '—'}
                </div>
                <div>
                  <strong>Job Title:</strong> {contact.job_title || '—'}
                </div>
                <div>
                  <strong>Primary Email:</strong> {contact.primary_email}
                </div>
                <div>
                  <strong>Secondary Email:</strong>{' '}
                  {contact.secondary_email || '—'}
                </div>
                <div>
                  <strong>Primary Phone:</strong> {contact.primary_phone}
                </div>
                <div>
                  <strong>Work Phone:</strong> {contact.work_phone}
                </div>
                <div>
                  <strong>Home Phone:</strong> {contact.home_phone}
                </div>
                <div>
                  <strong>Fax:</strong> {contact.fax || '—'}
                </div>
                <div>
                  <strong>Language:</strong> {contact.language}
                </div>
                <div>
                  <strong>Preferred Contact Time:</strong>{' '}
                  {contact.when_to_contact}
                </div>
                <div>
                  <strong>Contact Preference:</strong>{' '}
                  {contact.contact_preference}
                </div>
                <div>
                  <strong>Date of Birth:</strong>{' '}
                  {formatDate(contact.date_of_birth)}
                </div>
                <div>
                  <strong>SSN:</strong> {contact.ssn}
                </div>
                <div>
                  <strong>Tax ID:</strong> {contact.federal_tax_id}
                </div>
                <div>
                  <strong>Driver’s License:</strong>{' '}
                  {contact.drivers_license || '—'}
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* --- Meta --- */}
          <section>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">Meta</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Nature: {contact.nature}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Marital Status: {contact.marital_status}
              </Badge>
              {contact.notes && (
                <Badge variant="secondary" className="text-xs">
                  Notes: {contact.notes}
                </Badge>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMatterDialog;

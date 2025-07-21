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
import { format } from 'date-fns';
import { CalendarDays, Mail, User, AlarmClock } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'PPpp');
};

const EventPreviewDialog = ({ event, open = false, onClose = () => {} }) => {
  if (!event) return null;

  const {
    title,
    description,
    start_time,
    end_time,
    priority,
    status,
    repeat,
    eventcategory,
    participants = [],
    reminders = [],
  } = event;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#F5F5FA] p-6 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-[#1E293B]">
            <CalendarDays className="w-5 h-5 text-[#6366F1]" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-slate-700">
          <p className="text-muted-foreground">
            {description || 'No description provided.'}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                <strong>Start:</strong> {formatDate(start_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                <strong>End:</strong> {formatDate(end_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong>Status:</strong> {status || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong>Priority:</strong> {priority || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong>Repeat:</strong> {repeat || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong>Category:</strong> {eventcategory?.name || 'N/A'}
              </span>
            </div>
          </div>

          {/* Participants */}
          <Separator className="my-4" />
          <h3 className="text-lg font-semibold text-[#40444D]">Participants</h3>
          {participants.length === 0 && (
            <p className="text-muted-foreground">No participants added.</p>
          )}
          {participants.map((p, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{p.email[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{p.email}</p>
                <p className="text-xs text-muted-foreground">
                  Role: {p.role} | Status: {p.status}
                </p>
                {p.comment && (
                  <p className="text-xs italic text-muted-foreground">
                    “{p.comment}”
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Reminders */}
          <Separator className="my-4" />
          <h3 className="text-lg font-semibold text-[#40444D]">Reminders</h3>
          {reminders.length === 0 && (
            <p className="text-muted-foreground">No reminders set.</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {reminders.map((r, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
              >
                <AlarmClock className="w-3 h-3" />
                {`${r.type} - ${r.value} ${r.timing.replace('_', ' ')} before ${
                  r.relative_to
                }`}
              </Badge>
            ))}
          </div>
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

export default EventPreviewDialog;

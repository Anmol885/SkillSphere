'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import Image from 'next/image';

interface CertificateViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateUrl?: string;
  courseName?: string;
}

export default function CertificateViewer({
  open,
  onOpenChange,
  certificateUrl,
  courseName,
}: CertificateViewerProps) {
  if (!certificateUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `${courseName || 'certificate'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPdf = certificateUrl.toLowerCase().endsWith('.pdf');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{courseName || 'Certificate'}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              className="rounded-xl"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4 overflow-auto max-h-[70vh]">
          {isPdf ? (
            <iframe
              src={certificateUrl}
              className="w-full h-[600px] rounded-xl border"
              title={courseName || 'Certificate'}
            />
          ) : (
            <div className="relative w-full h-auto">
              <Image
                src={certificateUrl}
                alt={courseName || 'Certificate'}
                width={800}
                height={600}
                className="w-full h-auto rounded-xl"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

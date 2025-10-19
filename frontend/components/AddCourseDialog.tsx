'use client';

import { useState, useEffect } from 'react';
import { coursesApi, Course } from '@/lib/api/courses';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: () => void;
}

export default function AddCourseDialog({ open, onOpenChange, course, onSuccess }: AddCourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    startDate: '',
    endDate: '',
    status: 'not-started',
    category: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.title,  // Backend uses 'title', form uses 'name'
        platform: course.platform,
        startDate: course.startDate.split('T')[0],
        endDate: course.endDate.split('T')[0],
        status: course.status,
        category: course.category,
      });
    } else {
      setFormData({
        name: '',
        platform: '',
        startDate: '',
        endDate: '',
        status: 'not-started',
        category: '',
      });
      setCertificateFile(null);
    }
  }, [course, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: any = {
        ...formData,
        certificate: certificateFile,
      };

      if (course) {
        await coursesApi.update({ ...data, id: course.id });
        toast.success('Course updated successfully');
      } else {
        await coursesApi.create(data);
        toast.success('Course added successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            {course ? 'Update course details' : 'Add a new course to track your learning progress'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                placeholder="e.g., AWS Solutions Architect"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coursera">Coursera</SelectItem>
                  <SelectItem value="Udemy">Udemy</SelectItem>
                  <SelectItem value="AWS Academy">AWS Academy</SelectItem>
                  <SelectItem value="edX">edX</SelectItem>
                  <SelectItem value="LinkedIn Learning">LinkedIn Learning</SelectItem>
                  <SelectItem value="Pluralsight">Pluralsight</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate">Certificate (PDF or Image)</Label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="certificate"
                className="flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer hover:bg-secondary transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">{certificateFile ? certificateFile.name : 'Choose file'}</span>
              </label>
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl">
              {isLoading ? 'Saving...' : course ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

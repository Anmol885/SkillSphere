'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, User } from '@/lib/api/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, Mail, Calendar, Edit, Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    } else if (authUser) {
      fetchProfile();
    }
  }, [authUser, authLoading]);

  const fetchProfile = async () => {
    try {
      const profileData = await userApi.getProfile();
      setUser(profileData);
      setFormData({
        name: profileData.name,
        bio: profileData.bio || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        bio: formData.bio,
      };
      if (avatarFile) {
        updateData.avatar = avatarFile;
      }
      const updatedUser = await userApi.updateProfile(updateData);
      setUser(updatedUser);
      setIsEditing(false);
      setAvatarFile(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
    });
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account settings</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="rounded-xl">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="rounded-2xl lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatarUrl}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-4xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{user.totalCertificates}</div>
                      <div className="text-xs text-muted-foreground">Certificates</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-purple-500">
                        {user.achievements.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl"
                    />
                  ) : (
                    <p className="text-lg">{user.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-lg text-muted-foreground">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="rounded-xl"
                    />
                  ) : (
                    <p className="text-lg">{user.bio || 'No bio added yet'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="rounded-xl">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="rounded-2xl lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
                <CardDescription>Your learning milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                {user.achievements.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No achievements yet. Keep learning to unlock achievements!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent transition-colors"
                      >
                        <Award className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium">{achievement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

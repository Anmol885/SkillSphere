'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Courses', value: '1,234', icon: BookOpen, color: 'text-blue-500' },
    { title: 'Completed', value: '892', icon: Award, color: 'text-green-500' },
    { title: 'Certificates', value: '745', icon: Award, color: 'text-purple-500' },
    { title: 'Hours Learned', value: '5,432', icon: TrendingUp, color: 'text-orange-500' },
  ];

  const features = [
    {
      title: 'Track Your Courses',
      description: 'Keep all your learning in one place. Track courses from Coursera, Udemy, AWS Academy, and more.',
      icon: BookOpen,
    },
    {
      title: 'Upload Certificates',
      description: 'Store and showcase your achievements. Upload certificates and build your portfolio.',
      icon: Award,
    },
    {
      title: 'Visualize Progress',
      description: 'Get insights into your learning journey with beautiful charts and analytics.',
      icon: TrendingUp,
    },
    {
      title: 'Set Goals',
      description: 'Define learning objectives and track your progress towards achieving them.',
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Track Your Learning Journey
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Organize your courses, showcase certificates, and visualize your progress all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  Start Tracking
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="rounded-2xl border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Active users globally</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-2xl hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border-2">
          <CardHeader className="space-y-4 py-12">
            <CardTitle className="text-3xl md:text-4xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of learners tracking their educational journey.
            </CardDescription>
            {!user && (
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            )}
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}

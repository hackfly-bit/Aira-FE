'use client';

import { LogOut, Heart, Calendar, Users, Gift, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';

export function Dashboard() {
  const { user, logout } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Wedding Timeline',
      description: 'Kelola jadwal acara pernikahan Anda',
      color: 'from-rose-400 to-pink-500',
    },
    {
      icon: Users,
      title: 'Guest List',
      description: 'Atur daftar tamu undangan',
      color: 'from-purple-400 to-indigo-500',
    },
    {
      icon: Gift,
      title: 'Gift Registry',
      description: 'Buat wishlist hadiah pernikahan',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Camera,
      title: 'Photo Gallery',
      description: 'Koleksi foto momen spesial',
      color: 'from-emerald-400 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">
              Selamat Datang, {user?.name}! 💕
            </h1>
            <p className="text-gray-600">
              Kelola persiapan pernikahan Anda dengan mudah
            </p>
          </div>
          
          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="wedding-card mb-8 animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-linear-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif text-gray-800">
              Aira Wedding Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Semua yang Anda butuhkan untuk pernikahan yang sempurna
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="wedding-card hover:shadow-xl transition-all duration-300 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 bg-linear-to-br ${feature.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="wedding-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hari Menuju Pernikahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">120</div>
              <p className="text-xs text-gray-500">Hari tersisa</p>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tamu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">150</div>
              <p className="text-xs text-gray-500">Undangan terkirim</p>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                RSVP Konfirmasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">89</div>
              <p className="text-xs text-gray-500">Tamu hadir</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
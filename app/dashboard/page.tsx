import { Suspense } from 'react'
import { DashboardStats } from '@/features/dashboard'
import { PageHeader, LoadingSpinner, Card } from '@/shared/components'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader
        title="Dashboard"
        description="Selamat datang di Aira Back Office. Berikut adalah ringkasan aktivitas sistem."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' }
        ]}
      />
      
      <div className="space-y-6">
        {/* Statistics Cards */}
        <Suspense fallback={<LoadingSpinner text="Memuat statistik..." />}>
          <DashboardStats />
        </Suspense>
        
        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Aktivitas Pengguna</h3>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart akan ditampilkan di sini
              </div>
            </div>
          </Card>
          
          <Card className="col-span-3">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Aktivitas terbaru akan ditampilkan di sini
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Additional Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performa Sistem</h3>
              <div className="text-sm text-muted-foreground">
                Metrik performa sistem akan ditampilkan di sini
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Laporan Harian</h3>
              <div className="text-sm text-muted-foreground">
                Ringkasan laporan harian akan ditampilkan di sini
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notifikasi</h3>
              <div className="text-sm text-muted-foreground">
                Notifikasi penting akan ditampilkan di sini
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
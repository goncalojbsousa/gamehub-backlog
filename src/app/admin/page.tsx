import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';
import { AdminDashboard } from '@/src/components/admin/admin-dashboard';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';
import { logAdminAction, AdminActions } from '@/src/utils/adminLogger';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  // Check if user is admin by fetching from database
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  // Log admin access
  // Validate adminId is a valid UUID before logging
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (session.user.id && uuidRegex.test(session.user.id)) {
    await logAdminAction({
      action: AdminActions.ADMIN_LOGIN,
      adminId: session.user.id,
      adminEmail: session.user.email || 'unknown',
      targetType: 'SYSTEM',
      details: 'Admin accessed dashboard',
      ipAddress: 'server-side', // We'll get this from middleware if needed
      userAgent: 'server-side'
    });
  } else {
    console.warn('Invalid adminId format, skipping admin log:', session.user.id);
  }

  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-color_text mb-2">Admin Dashboard</h1>
            <p className="text-color_text_sec">
              Manage users, reviews, and system settings
            </p>
          </div>
          
          <AdminDashboard />
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
} 
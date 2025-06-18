import React from 'react';
import Header from '@/components/layout/Header'; // Custom Header
import HealthSummaryCard from '@/components/HealthSummaryCard'; // Custom HealthSummaryCard
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, CalendarPlus, FileText, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock user data (replace with actual data from auth context or API)
const mockUser = {
  name: "Dr. Smith", // or "John Doe" for patient
  avatarUrl: "https://i.pravatar.cc/150?u=drsmit", // Placeholder avatar
  role: "doctor" // "patient" or "doctor"
};

const DashboardPage = () => {
  console.log('DashboardPage loaded');
  const navigate = useNavigate();

  // Mock data for dashboard items
  const patientDashboardItems = [
    { title: "Upcoming Appointments", metric: "2", metricValue: "Scheduled", description: "Check your upcoming visits.", onActionClick: () => navigate('/appointments'), actionText: "View Appointments", variant: "appointments" as const },
    { title: "Recent Messages", metric: "1 New", metricValue: "From Dr. Emily", description: "You have unread messages.", onActionClick: () => console.log("Navigate to messages"), actionText: "View Messages", variant: "generic" as const },
    { title: "My Health Records", description: "Access your latest reports and summaries.", onActionClick: () => navigate('/records'), actionText: "View Records", variant: "generic" as const },
  ];

  const doctorDashboardItems = [
    { title: "Today's Schedule", metric: "5 Patients", metricValue: "Upcoming today", description: "View your appointments for the day.", onActionClick: () => navigate('/appointments'), actionText: "View Schedule", variant: "appointments" as const },
    { title: "Pending Requests", metric: "3 New", metricValue: "Appointment/Refill", description: "Review patient requests.", onActionClick: () => console.log("Navigate to requests"), actionText: "Manage Requests", variant: "generic" as const },
    { title: "Recent Patient Interactions", description: "Quick access to recent consultation notes.", onActionClick: () => navigate('/records'), actionText: "View Patient Records", variant: "generic" as const },
  ];

  const dashboardItems = mockUser.role === "patient" ? patientDashboardItems : doctorDashboardItems;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header userName={mockUser.name} userAvatarUrl={mockUser.avatarUrl} onLogout={() => navigate('/auth')} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <section className="mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">Welcome back, {mockUser.name}!</CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    {mockUser.role === 'patient' ? "Here's a summary of your health journey." : "Manage your day and patient interactions effectively."}
                  </CardDescription>
                </div>
                <Avatar className="h-20 w-20 border-2 border-white">
                  <AvatarImage src={mockUser.avatarUrl || "https://www.fillmurray.com/100/100"} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                 {mockUser.role === 'patient' && (
                    <Button
                        onClick={() => navigate('/appointments')}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold py-3 px-6 text-lg"
                    >
                        <CalendarPlus className="mr-2 h-5 w-5" /> Book New Appointment
                    </Button>
                 )}
                 {mockUser.role === 'doctor' && (
                    <Button
                        onClick={() => navigate('/appointments')} // Or a specific "Manage Availability" route
                        className="bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 px-6 text-lg"
                    >
                        <CalendarPlus className="mr-2 h-5 w-5" /> Manage Availability
                    </Button>
                 )}
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardItems.map((item, index) => (
                <HealthSummaryCard
                  key={index}
                  title={item.title}
                  metric={item.metric}
                  metricValue={item.metricValue}
                  description={item.description}
                  actionText={item.actionText}
                  onActionClick={item.onActionClick}
                  variant={item.variant}
                />
              ))}
            </div>
          </section>
          
          {/* Example of conceptual Header section for quick actions within dashboard */}
          <section>
             <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tools & Resources</h2>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="flex-col h-24" onClick={() => navigate('/profile')}><User className="h-8 w-8 mb-1 text-blue-600"/>My Profile</Button>
                <Button variant="outline" className="flex-col h-24" onClick={() => navigate('/records')}><FileText className="h-8 w-8 mb-1 text-green-600"/>View Records</Button>
                <Button variant="outline" className="flex-col h-24" onClick={() => console.log("Open Messages")}><MessageSquare className="h-8 w-8 mb-1 text-purple-600"/>Messages</Button>
                <Button variant="outline" className="flex-col h-24" onClick={() => console.log("Open Health Library")}><BookOpen className="h-8 w-8 mb-1 text-orange-600"/>Health Library</Button>
             </div>
          </section>
        </div>
      </main>
      <ScrollArea className="h-[calc(100vh-theme(spacing.16))] w-full"> {/* Example of ScrollArea usage if needed */}
        {/* Content that might overflow */}
      </ScrollArea>
    </div>
  );
};

export default DashboardPage;
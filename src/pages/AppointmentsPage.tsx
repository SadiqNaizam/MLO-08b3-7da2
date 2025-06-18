import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import AppointmentSlotPicker from '@/components/AppointmentSlotPicker';
import DoctorAvailabilityCalendar from '@/components/DoctorAvailabilityCalendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge';
import { CalendarDays, CheckCircle, Clock, PlusCircle, UserMd, Video } from 'lucide-react'; // UserMd for doctor, Video for telehealth
import { useNavigate } from 'react-router-dom';

// Mock user data (replace with actual data from auth context or API)
const mockUser = {
  name: "John Doe",
  avatarUrl: "https://i.pravatar.cc/150?u=johndoe",
  role: "patient" // "patient" or "doctor"
  // role: "doctor", // "patient" or "doctor"
  // doctorId: "doc123" // if role is doctor
};

// Mock data - replace with actual data fetching
const mockAppointments = [
  { id: '1', doctor: 'Dr. Emily Carter', specialty: 'Cardiology', date: '2024-08-15', time: '10:00 AM', status: 'Confirmed', type: 'In-Person' },
  { id: '2', patient: 'Alice Johnson', service: 'General Checkup', date: '2024-08-16', time: '02:30 PM', status: 'Completed', type: 'Telehealth' },
  { id: '3', doctor: 'Dr. Ben Miller', specialty: 'Pediatrics', date: '2024-07-20', time: '11:00 AM', status: 'Cancelled', type: 'In-Person' },
];

const mockDoctors = [
    { id: "doc123", name: "Dr. Emily Carter", specialty: "Cardiology" },
    { id: "doc456", name: "Dr. Ben Miller", specialty: "Pediatrics" },
];

// Mock function for AppointmentSlotPicker
const fetchAvailableSlots = async (date: Date, doctorId?: string): Promise<{id: string, time: string, isAvailable: boolean}[]> => {
    console.log("Fetching slots for", date, "Doctor:", doctorId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Example: return some slots based on date. This should be dynamic.
    const day = date.getDay();
    if (day === 0 || day === 6) return []; // No slots on weekends
    return [
        { id: 'slot1', time: '09:00 AM', isAvailable: true },
        { id: 'slot2', time: '09:30 AM', isAvailable: false }, // Example of a booked slot
        { id: 'slot3', time: '10:00 AM', isAvailable: true },
        { id: 'slot4', time: '02:00 PM', isAvailable: true },
    ];
};

// Mock function for DoctorAvailabilityCalendar
const saveDoctorAvailability = async (date: Date, slots: {time: string, isAvailable: boolean}[]) => {
    console.log("Saving availability for Doctor:", mockUser.role === 'doctor' ? (mockUser as any).doctorId : '', "Date:", date, "Slots:", slots);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate API call
    alert("Availability saved (mock)!");
};


const AppointmentsPage = () => {
  console.log('AppointmentsPage loaded');
  const navigate = useNavigate();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState<{dateTime: Date, doctorId?: string} | null>(null);

  const handleSlotSelected = (dateTime: Date, doctorId?: string) => {
    console.log("Slot selected in page:", dateTime, "Doctor ID:", doctorId);
    setSelectedSlotInfo({ dateTime, doctorId });
    setIsBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (selectedSlotInfo) {
        console.log("Booking confirmed for:", selectedSlotInfo.dateTime, "Doctor:", selectedSlotInfo.doctorId);
        // Add to mockAppointments or call API
        mockAppointments.push({
            id: String(mockAppointments.length + 1),
            doctor: mockDoctors.find(d => d.id === selectedSlotInfo.doctorId)?.name || 'Selected Doctor',
            specialty: mockDoctors.find(d => d.id === selectedSlotInfo.doctorId)?.specialty || 'N/A',
            date: selectedSlotInfo.dateTime.toISOString().split('T')[0],
            time: selectedSlotInfo.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Confirmed',
            type: 'In-Person' // default
        });
        setIsBookingDialogOpen(false);
        setSelectedSlotInfo(null);
        // Show success toast/sonner (not implemented here, but would be good)
        alert("Appointment Booked Successfully (Mock)!");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'default'; // Often green in shadcn default is primary
      case 'completed': return 'secondary'; // Often blue or gray
      case 'cancelled': return 'destructive'; // Often red
      default: return 'outline';
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header userName={mockUser.name} userAvatarUrl={mockUser.avatarUrl} onLogout={() => navigate('/auth')} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto space-y-8">
          
          {/* Patient View: Booking and Viewing Appointments */}
          {mockUser.role === 'patient' && (
            <>
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
                  {/* Button to trigger dialog for new appointment if AppointmentSlotPicker is not always visible */}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-blue-600" /> Upcoming & Past</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockAppointments.filter(apt => apt.doctor).length > 0 ? (
                       <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor</TableHead>
                              <TableHead>Specialty</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockAppointments.filter(apt => apt.doctor).map((apt) => ( // Filter for patient's appointments
                              <TableRow key={apt.id}>
                                <TableCell>{apt.doctor}</TableCell>
                                <TableCell>{apt.specialty}</TableCell>
                                <TableCell>{apt.date}</TableCell>
                                <TableCell>{apt.time}</TableCell>
                                <TableCell className="flex items-center">
                                    {apt.type === 'Telehealth' ? <Video className="mr-1 h-4 w-4 text-purple-600"/> : <UserMd className="mr-1 h-4 w-4 text-green-600"/>}
                                    {apt.type}
                                </TableCell>
                                <TableCell><Badge variant={getStatusBadgeVariant(apt.status) as any}>{apt.status}</Badge></TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Details</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <p className="text-muted-foreground">You have no appointments scheduled.</p>
                    )}
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Schedule New Appointment</h2>
                <AppointmentSlotPicker
                    doctors={mockDoctors}
                    availableSlotsForDate={fetchAvailableSlots}
                    onSlotSelected={handleSlotSelected}
                />
              </section>
            </>
          )}

          {/* Doctor View: Managing Availability and Viewing Schedule */}
          {mockUser.role === 'doctor' && (
            <>
              <section>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Your Schedule</h1>
                 <DoctorAvailabilityCalendar
                    doctorId={(mockUser as any).doctorId || "doc123"} // Provide actual doctor ID
                    onSaveAvailability={saveDoctorAvailability}
                    // initialAvailability can be fetched and passed here
                 />
              </section>
              <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Today's Appointments</h2>
                 <Card>
                  <CardContent className="pt-6">
                    {mockAppointments.filter(apt => apt.patient).length > 0 ? ( // Filter for doctor's appointments
                       <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockAppointments.filter(apt => apt.patient).map((apt) => (
                              <TableRow key={apt.id}>
                                <TableCell>{apt.patient}</TableCell>
                                <TableCell>{apt.service}</TableCell>
                                <TableCell>{apt.date}</TableCell>
                                <TableCell>{apt.time}</TableCell>
                                 <TableCell className="flex items-center">
                                    {apt.type === 'Telehealth' ? <Video className="mr-1 h-4 w-4 text-purple-600"/> : <UserMd className="mr-1 h-4 w-4 text-green-600"/>}
                                    {apt.type}
                                </TableCell>
                                <TableCell><Badge variant={getStatusBadgeVariant(apt.status) as any}>{apt.status}</Badge></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <p className="text-muted-foreground">No appointments scheduled for today.</p>
                    )}
                  </CardContent>
                </Card>
              </section>
            </>
          )}

          {/* Confirmation Dialog */}
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center"><CheckCircle className="mr-2 h-6 w-6 text-green-500" />Confirm Appointment</DialogTitle>
                <DialogDescription>
                  Please review the details of your appointment before confirming.
                </DialogDescription>
              </DialogHeader>
              {selectedSlotInfo && (
                <div className="py-4 space-y-2">
                  <p><strong>Doctor:</strong> {mockDoctors.find(d => d.id === selectedSlotInfo.doctorId)?.name || "Any Available"}</p>
                  <p><strong>Date:</strong> {selectedSlotInfo.dateTime.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedSlotInfo.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmBooking} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4"/> Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  );
};

export default AppointmentsPage;
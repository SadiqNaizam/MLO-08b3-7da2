import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { User, ShieldCheck, Briefcase, CalendarClock, Save, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock user data - replace with actual data from auth context or API
const mockUserData = {
  patient: {
    name: "Alice Wonderland",
    email: "alice@example.com",
    phone: "555-1234",
    dob: "1990-05-15",
    address: "123 Storybook Lane, Fantasyland",
    emergencyContactName: "Mad Hatter",
    emergencyContactPhone: "555- HATTER",
    medicalConditions: "Curiosity Syndrome",
    allergies: "Reality",
    avatarUrl: "https://i.pravatar.cc/150?u=alice",
  },
  doctor: {
    name: "Dr. Elara Vance",
    email: "dr.vance@clinic.com",
    phone: "555-DOCVU",
    specialization: "Cardiology",
    clinicName: "Heartbeat Clinic",
    clinicAddress: "456 Health Ave, Wellsville",
    consultationHours: "Mon-Fri, 9 AM - 5 PM",
    bio: "Dedicated cardiologist with 15 years of experience in treating heart conditions.",
    avatarUrl: "https://i.pravatar.cc/150?u=drElaraVance",
    availability: [ // Example for DoctorAvailabilityCalendar integration
        { date: new Date(2024, 7, 20), slots: [{time: "09:00", isAvailable: true}, {time: "09:30", isAvailable: false}] }
    ]
  }
};

// Simulate user role
const currentUserRole: 'patient' | 'doctor' = 'patient'; // or 'doctor'
const currentUserData = mockUserData[currentUserRole];

const ProfilePage = () => {
  console.log('ProfilePage loaded');
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // Form state for editable fields - initialize with current user data
  const [formData, setFormData] = useState({ ...currentUserData });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", formData);
    // Mock save action
    // In a real app, call an API to update user data
    Object.assign(currentUserData, formData); // Update mock data
    setIsEditing(false);
    alert("Profile updated successfully! (Mock)");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header userName={currentUserData.name} userAvatarUrl={currentUserData.avatarUrl} onLogout={() => navigate('/auth')} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-100 p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 border-2 border-blue-500">
                  <AvatarImage src={currentUserData.avatarUrl} alt={currentUserData.name} />
                  <AvatarFallback className="text-3xl">{currentUserData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">{currentUserData.name}</CardTitle>
                  <CardDescription className="text-gray-600">{currentUserData.email}</CardDescription>
                  <span className="text-sm text-blue-600 font-medium capitalize">{currentUserRole}</span>
                </div>
                <Button variant="outline" size="icon" className="ml-auto" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                  <span className="sr-only">{isEditing ? "Save Profile" : "Edit Profile"}</span>
                </Button>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSaveProfile}>
                <CardContent className="p-6">
                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
                    <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" />Personal Info</TabsTrigger>
                    {currentUserRole === 'patient' && <TabsTrigger value="medical"><ShieldCheck className="mr-2 h-4 w-4" />Medical Details</TabsTrigger>}
                    {currentUserRole === 'doctor' && <TabsTrigger value="professional"><Briefcase className="mr-2 h-4 w-4" />Professional Details</TabsTrigger>}
                    {currentUserRole === 'doctor' && <TabsTrigger value="availability"><CalendarClock className="mr-2 h-4 w-4" />Availability</TabsTrigger>}
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            {currentUserRole === 'patient' && (
                                <div>
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" value={(formData as any).dob} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                            )}
                        </div>
                         <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" name="address" value={(formData as any).address || (formData as any).clinicAddress} onChange={handleInputChange} disabled={!isEditing} rows={3} />
                        </div>
                    </TabsContent>

                    {/* Patient Medical Details Tab */}
                    {currentUserRole === 'patient' && (
                        <TabsContent value="medical" className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">Emergency & Medical Info</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                                    <Input id="emergencyContactName" name="emergencyContactName" value={(formData as any).emergencyContactName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div>
                                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                                    <Input id="emergencyContactPhone" name="emergencyContactPhone" value={(formData as any).emergencyContactPhone} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="medicalConditions">Known Medical Conditions</Label>
                                <Textarea id="medicalConditions" name="medicalConditions" value={(formData as any).medicalConditions} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="allergies">Allergies</Label>
                                <Textarea id="allergies" name="allergies" value={(formData as any).allergies} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                        </TabsContent>
                    )}

                    {/* Doctor Professional Details Tab */}
                    {currentUserRole === 'doctor' && (
                        <TabsContent value="professional" className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">Professional Information</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input id="specialization" name="specialization" value={(formData as any).specialization} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div>
                                    <Label htmlFor="clinicName">Clinic Name</Label>
                                    <Input id="clinicName" name="clinicName" value={(formData as any).clinicName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                             </div>
                            <div>
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea id="bio" name="bio" value={(formData as any).bio} onChange={handleInputChange} disabled={!isEditing} rows={4}/>
                            </div>
                        </TabsContent>
                    )}

                     {/* Doctor Availability Tab */}
                    {currentUserRole === 'doctor' && (
                        <TabsContent value="availability" className="space-y-4">
                             <h3 className="text-xl font-semibold text-gray-700 mb-3">Consultation Hours & Availability</h3>
                             {/* This would ideally integrate DoctorAvailabilityCalendar or similar component */}
                             <p className="text-muted-foreground">Current Hours: {(formData as any).consultationHours}</p>
                             <Textarea 
                                name="consultationHours" 
                                value={(formData as any).consultationHours} 
                                onChange={handleInputChange} 
                                disabled={!isEditing} 
                                placeholder="e.g., Mon-Fri, 9 AM - 1 PM, 2 PM - 5 PM"
                                rows={3}
                             />
                             <p className="text-sm text-muted-foreground mt-2">
                                For detailed day-to-day availability management, please visit the <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/appointments')}>Appointments page</Button>.
                             </p>
                        </TabsContent>
                    )}
                </Tabs>
                </CardContent>

                {isEditing && (
                <CardFooter className="border-t p-6">
                    <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </CardFooter>
                )}
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
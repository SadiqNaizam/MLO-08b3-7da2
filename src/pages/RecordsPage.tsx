import React from 'react';
import Header from '@/components/layout/Header';
import HealthSummaryCard from '@/components/HealthSummaryCard'; // Assuming this might be reused for specific record summaries
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Stethoscope, FlaskConical, ClipboardList, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock user data
const mockUser = {
  name: "John Doe", // or "Dr. Smith"
  avatarUrl: "https://i.pravatar.cc/150?u=johns",
  role: "patient" // "patient" or "doctor"
};

// Mock health records data
const mockPatientRecords = {
  consultationSummaries: [
    { id: 'cs1', date: '2024-07-01', doctor: 'Dr. Carter', summary: 'Routine checkup, vitals stable. Discussed diet.', fileUrl: '#' },
    { id: 'cs2', date: '2024-03-15', doctor: 'Dr. Lee', summary: 'Follow-up for flu symptoms. Prescribed rest.', fileUrl: '#' },
  ],
  labResults: [
    { id: 'lr1', date: '2024-06-20', testName: 'Blood Panel', status: 'Normal', reportUrl: '#' },
    { id: 'lr2', date: '2024-02-10', testName: 'Cholesterol Check', status: 'Slightly Elevated', reportUrl: '#' },
  ],
  prescriptions: [
    { id: 'p1', date: '2024-03-15', medication: 'Amoxicillin 250mg', dosage: '1 tablet 3 times a day for 7 days', doctor: 'Dr. Lee' },
  ]
};

const mockDoctorPatientRecords = [ // For doctor viewing a specific patient's records
    { patientName: "Alice Johnson", recordId: "aj001", type: "Consultation Note", date: "2024-08-10", details: "Routine checkup for Alice." },
    { patientName: "Bob Williams", recordId: "bw002", type: "Lab Result", date: "2024-08-09", details: "Blood test results for Bob." }
];


const RecordsPage = () => {
  console.log('RecordsPage loaded');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header userName={mockUser.name} userAvatarUrl={mockUser.avatarUrl} onLogout={() => navigate('/auth')} />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
                {mockUser.role === 'patient' ? "My Health Records" : "Patient Records"}
            </h1>
            {mockUser.role === 'doctor' && (
                <Button><Upload className="mr-2 h-4 w-4" /> Upload New Record</Button>
            )}
          </div>

          {mockUser.role === 'patient' && (
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={['consultations', 'lab_results']}>
              {/* Consultation Summaries */}
              <AccordionItem value="consultations">
                <AccordionTrigger className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-lg font-semibold">
                    <div className="flex items-center"> <Stethoscope className="mr-3 h-6 w-6 text-blue-600" /> Consultation Summaries </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white border border-t-0 rounded-b-lg">
                  {mockPatientRecords.consultationSummaries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPatientRecords.consultationSummaries.map(rec => (
                          <TableRow key={rec.id}>
                            <TableCell>{rec.date}</TableCell>
                            <TableCell>{rec.doctor}</TableCell>
                            <TableCell className="max-w-xs truncate">{rec.summary}</TableCell>
                            <TableCell><Button variant="link" size="sm" onClick={() => alert(`Viewing ${rec.fileUrl}`)}>View Full</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className="text-muted-foreground">No consultation summaries found.</p>}
                </AccordionContent>
              </AccordionItem>

              {/* Lab Results */}
              <AccordionItem value="lab_results">
                <AccordionTrigger className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-lg font-semibold">
                    <div className="flex items-center"> <FlaskConical className="mr-3 h-6 w-6 text-green-600" /> Lab Results </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white border border-t-0 rounded-b-lg">
                    {mockPatientRecords.labResults.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPatientRecords.labResults.map(res => (
                          <TableRow key={res.id}>
                            <TableCell>{res.date}</TableCell>
                            <TableCell>{res.testName}</TableCell>
                            <TableCell><Badge variant={res.status === 'Normal' ? 'default' : 'destructive'}>{res.status}</Badge></TableCell>
                            <TableCell><Button variant="link" size="sm" onClick={() => alert(`Viewing ${res.reportUrl}`)}>View Report</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className="text-muted-foreground">No lab results found.</p>}
                </AccordionContent>
              </AccordionItem>

              {/* Prescriptions */}
              <AccordionItem value="prescriptions">
                <AccordionTrigger className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-lg font-semibold">
                    <div className="flex items-center"> <ClipboardList className="mr-3 h-6 w-6 text-purple-600" /> Prescriptions </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white border border-t-0 rounded-b-lg">
                    {mockPatientRecords.prescriptions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Prescribed By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPatientRecords.prescriptions.map(pres => (
                          <TableRow key={pres.id}>
                            <TableCell>{pres.date}</TableCell>
                            <TableCell>{pres.medication}</TableCell>
                            <TableCell>{pres.dosage}</TableCell>
                            <TableCell>{pres.doctor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className="text-muted-foreground">No prescriptions found.</p>}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {mockUser.role === 'doctor' && (
            <Card>
                <CardHeader>
                    <CardTitle>Search Patient Records</CardTitle>
                    <CardDescription>Enter patient ID or name to fetch records.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Add search/filter functionality here for doctors */}
                    <Input placeholder="Search by Patient Name or ID..." className="mb-4"/>
                    {mockDoctorPatientRecords.length > 0 ? (
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Record Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {mockDoctorPatientRecords.map(rec => (
                                    <TableRow key={rec.recordId}>
                                    <TableCell>{rec.patientName}</TableCell>
                                    <TableCell>{rec.type}</TableCell>
                                    <TableCell>{rec.date}</TableCell>
                                    <TableCell><Button variant="outline" size="sm">View Details</Button></TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    ) : (
                        <p className="text-muted-foreground">No records found for the current filter.</p>
                    )}
                </CardContent>
            </Card>
          )}
          
          {/* Example of using HealthSummaryCard for a quick summary if applicable */}
          <div className="mt-8">
             <HealthSummaryCard
                title="Records Overview"
                metric={`${mockPatientRecords.consultationSummaries.length + mockPatientRecords.labResults.length + mockPatientRecords.prescriptions.length} Total Records`}
                description="A quick summary of your available health documents."
                variant="generic"
             />
          </div>

        </div>
      </main>
    </div>
  );
};

export default RecordsPage;
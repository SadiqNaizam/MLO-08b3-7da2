import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar"; // shadcn calendar
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For doctor/service selection
import { Clock } from 'lucide-react';

// Mock data structure - replace with actual data fetching and types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface TimeSlot {
  id: string;
  time: string; // e.g., "09:00 AM"
  isAvailable: boolean;
}

interface AppointmentSlotPickerProps {
  doctors?: Doctor[]; // Optional list of doctors to filter by
  availableSlotsForDate?: (date: Date, doctorId?: string) => Promise<TimeSlot[]>; // Function to fetch slots
  onSlotSelected: (dateTime: Date, doctorId?: string) => void;
  preselectedDoctorId?: string;
}

const AppointmentSlotPicker: React.FC<AppointmentSlotPickerProps> = ({
  doctors,
  availableSlotsForDate,
  onSlotSelected,
  preselectedDoctorId
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(preselectedDoctorId);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  console.log("Rendering AppointmentSlotPicker. Selected Date:", selectedDate, "Doctor:", selectedDoctor);

  React.useEffect(() => {
    if (selectedDate && availableSlotsForDate) {
      setIsLoadingSlots(true);
      setSelectedTimeSlot(undefined); // Reset selected time slot when date changes
      availableSlotsForDate(selectedDate, selectedDoctor)
        .then(slots => {
          setTimeSlots(slots);
          // Mock implementation detail - this should be dynamic
          if (slots.length === 0) {
             console.warn("No slots available for the selected date/doctor.");
          }
        })
        .catch(err => {
            console.error("Error fetching time slots:", err);
            setTimeSlots([]);
        })
        .finally(() => setIsLoadingSlots(false));
    }
  }, [selectedDate, selectedDoctor, availableSlotsForDate]);

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (slot.isAvailable && selectedDate) {
        setSelectedTimeSlot(slot);
        console.log("Slot selected:", slot.time, "on date:", selectedDate);
        // Combine date and time - this is a simplification
        const [hours, minutesPart] = slot.time.split(':');
        const [minutes, ampm] = minutesPart.split(' ');
        let numericHours = parseInt(hours);
        if (ampm === 'PM' && numericHours !== 12) numericHours += 12;
        if (ampm === 'AM' && numericHours === 12) numericHours = 0; // Midnight case

        const combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(numericHours, parseInt(minutes), 0, 0);
        onSlotSelected(combinedDateTime, selectedDoctor);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {doctors && doctors.length > 0 && (
          <div>
            <label htmlFor="doctor-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor (Optional)
            </label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger id="doctor-select">
                <SelectValue placeholder="Any Available Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Available Doctor</SelectItem>
                {doctors.map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col items-center">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
            />
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Available Slots for {selectedDate.toLocaleDateString()}
            </h3>
            {isLoadingSlots ? (
              <p className="text-muted-foreground">Loading slots...</p>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <Button
                    key={slot.id}
                    variant={selectedTimeSlot?.id === slot.id ? "default" : (slot.isAvailable ? "outline" : "secondary")}
                    disabled={!slot.isAvailable}
                    onClick={() => handleTimeSlotClick(slot)}
                    className={`w-full ${selectedTimeSlot?.id === slot.id ? 'ring-2 ring-blue-500' : ''}
                                ${!slot.isAvailable ? 'cursor-not-allowed line-through' : ''}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No slots available for this day. Please try another date.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentSlotPicker;
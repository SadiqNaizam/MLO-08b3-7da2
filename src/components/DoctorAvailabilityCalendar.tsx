import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckSquare, XSquare } from 'lucide-react';

// Mock data structure - replace with actual data
interface AvailabilitySlot {
  time: string; // e.g., "09:00"
  isAvailable: boolean;
}

interface DailyAvailability {
  date: Date;
  slots: AvailabilitySlot[];
}

interface DoctorAvailabilityCalendarProps {
  doctorId: string;
  initialAvailability?: DailyAvailability[]; // Existing availability
  onSaveAvailability?: (date: Date, slots: AvailabilitySlot[]) => Promise<void>;
}

const DoctorAvailabilityCalendar: React.FC<DoctorAvailabilityCalendarProps> = ({
  doctorId,
  initialAvailability = [],
  onSaveAvailability,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentDaySlots, setCurrentDaySlots] = useState<AvailabilitySlot[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  console.log("Rendering DoctorAvailabilityCalendar for Doctor:", doctorId, "Date:", selectedDate);

  // Predefined time slots for a typical workday - this can be made more dynamic
  const defaultWorkdaySlots = (): AvailabilitySlot[] => {
    const slots: AvailabilitySlot[] = [];
    for (let hour = 9; hour < 17; hour++) { // 9 AM to 4 PM
        slots.push({ time: `${String(hour).padStart(2, '0')}:00`, isAvailable: false });
        slots.push({ time: `${String(hour).padStart(2, '0')}:30`, isAvailable: false });
    }
    return slots;
  };

  React.useEffect(() => {
    if (selectedDate) {
      // Try to find existing availability for the selected date
      const existing = initialAvailability.find(
        (day) => day.date.toDateString() === selectedDate.toDateString()
      );
      if (existing) {
        setCurrentDaySlots(existing.slots);
      } else {
        // Or set to default (e.g., all unavailable)
        setCurrentDaySlots(defaultWorkdaySlots());
      }
      setIsEditing(false); // Reset editing state when date changes
    }
  }, [selectedDate, initialAvailability]);

  const handleSlotToggle = (index: number) => {
    if (!isEditing) return; // Only allow toggle in edit mode
    const updatedSlots = [...currentDaySlots];
    updatedSlots[index].isAvailable = !updatedSlots[index].isAvailable;
    setCurrentDaySlots(updatedSlots);
  };

  const handleSave = async () => {
    if (selectedDate && onSaveAvailability) {
      console.log("Saving availability for date:", selectedDate, "Slots:", currentDaySlots);
      try {
        await onSaveAvailability(selectedDate, currentDaySlots);
        // Optionally, show a success toast
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save availability:", error);
        // Optionally, show an error toast
      }
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Manage Your Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Can't set availability for past dates
          />
        </div>

        {selectedDate && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    Slots for {selectedDate.toLocaleDateString()}
                </h3>
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Slots</Button>
                )}
            </div>

            {currentDaySlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {currentDaySlots.map((slot, index) => (
                  <div
                    key={slot.time}
                    className={`p-2 border rounded-md flex items-center justify-between transition-colors
                                ${isEditing ? 'cursor-pointer hover:bg-muted' : ''}
                                ${slot.isAvailable ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}
                    onClick={() => handleSlotToggle(index)}
                  >
                    <span className="text-sm font-medium">{slot.time}</span>
                    {isEditing ? (
                         <Switch
                            checked={slot.isAvailable}
                            onCheckedChange={() => handleSlotToggle(index)}
                            aria-label={`Toggle availability for ${slot.time}`}
                         />
                    ) : (
                        slot.isAvailable ? <CheckSquare className="h-5 w-5 text-green-600" /> : <XSquare className="h-5 w-5 text-red-600" />
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No slots configured for this day. Click 'Edit Slots' to add.</p>
            )}
          </div>
        )}
      </CardContent>
      {isEditing && selectedDate && (
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
                setIsEditing(false);
                // Revert changes if needed by re-fetching or resetting to initial state for the day
                const existing = initialAvailability.find(
                    (day) => day.date.toDateString() === selectedDate.toDateString()
                );
                setCurrentDaySlots(existing ? existing.slots : defaultWorkdaySlots());
            }}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DoctorAvailabilityCalendar;
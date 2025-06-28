
"use client";

import * as React from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format, parse, parseISO, getDay, isSameDay } from "date-fns";
import { Save, Settings, Loader2, Calendar, Clock, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { getSchedulerSettings, type SchedulerSettings } from "@/ai/flows/get-scheduler-settings-flow";
import { updateSchedulerSettings } from "@/ai/flows/update-scheduler-settings-flow";
import { ALL_POSSIBLE_TIMES } from "@/lib/datetime-utils";

const ALL_WEEKDAYS = [
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
    { id: 6, label: 'Saturday' },
    { id: 0, label: 'Sunday' },
];

export function SettingsView() {
    const { toast } = useToast();

    const [settings, setSettings] = React.useState<SchedulerSettings | null>(null);
    const [disabledDates, setDisabledDates] = React.useState<Date[]>([]);
    const [availableWeekdays, setAvailableWeekdays] = React.useState<number[]>([]);
    const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>([]);
    
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const fetchedSettings = await getSchedulerSettings();
                setSettings(fetchedSettings);
                setAvailableWeekdays(fetchedSettings.availableWeekdays);
                setDisabledDates(fetchedSettings.disabledDates.map(d => parseISO(d)));
                setAvailableTimeSlots(fetchedSettings.availableTimeSlots);
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load scheduler settings." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleWeekdayToggle = (weekday: number) => {
        setAvailableWeekdays(prev =>
            prev.includes(weekday)
                ? prev.filter(d => d !== weekday)
                : [...prev, weekday]
        );
    };

    const handleTimeSlotToggle = (timeSlot: string) => {
        setAvailableTimeSlots(prev =>
            prev.includes(timeSlot)
                ? prev.filter(t => t !== timeSlot)
                : [...prev, timeSlot]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const settingsToSave: SchedulerSettings = {
                availableWeekdays,
                disabledDates: disabledDates.map(d => format(d, "yyyy-MM-dd")),
                availableTimeSlots,
            };
            const result = await updateSchedulerSettings(settingsToSave);

            if (result.success) {
                toast({ title: "Success", description: "Settings saved successfully." });
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            console.error("Failed to save settings:", error);
            toast({ variant: "destructive", title: "Save Failed", description: error.message || "Could not save settings." });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading Settings...</p>
            </div>
        );
    }
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
            <Card className="w-full max-w-6xl shadow-2xl rounded-lg">
                <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Scheduler Settings</CardTitle>
                        <CardDescription className="text-md text-muted-foreground">
                            Configure your availability for bookings.
                        </CardDescription>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Settings className="h-8 w-8 text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <div className="space-y-8">
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center"><Clock className="mr-2 h-5 w-5" /> Available Time Slots</h3>
                             <p className="text-sm text-muted-foreground">Select the time slots you want to make available for booking.</p>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 border rounded-lg">
                                 {ALL_POSSIBLE_TIMES.map(time => (
                                     <div key={time} className="flex items-center space-x-2">
                                         <Checkbox 
                                             id={`time-${time}`}
                                             checked={availableTimeSlots.includes(time)}
                                             onCheckedChange={() => handleTimeSlotToggle(time)}
                                         />
                                         <Label htmlFor={`time-${time}`}>{format(parse(time, 'HH:mm', new Date()), 'h:mm a')}</Label>
                                     </div>
                                 ))}
                             </div>
                        </div>

                        <Separator/>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center"><Calendar className="mr-2 h-5 w-5" /> Available Weekdays</h3>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                                     {ALL_WEEKDAYS.map(day => (
                                         <div key={day.id} className="flex items-center space-x-2">
                                             <Checkbox 
                                                 id={`weekday-${day.id}`}
                                                 checked={availableWeekdays.includes(day.id)}
                                                 onCheckedChange={() => handleWeekdayToggle(day.id)}
                                             />
                                             <Label htmlFor={`weekday-${day.id}`}>{day.label}</Label>
                                         </div>
                                     ))}
                                 </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center"><Calendar className="mr-2 h-5 w-5" /> Holidays / Disabled Dates</h3>
                                 <p className="text-sm text-muted-foreground">Toggle dates on the calendar. Green means available, red means it's a holiday.</p>
                                 <div className="flex justify-center">
                                     <ShadCalendar
                                        mode="multiple"
                                        selected={disabledDates}
                                        onSelect={(dates) => setDisabledDates(dates || [])}
                                        disabled={(date) => !availableWeekdays.includes(getDay(date))}
                                        modifiers={{
                                            available: (date) =>
                                                !disabledDates.some((disabled) => isSameDay(disabled, date)),
                                        }}
                                        modifiersClassNames={{
                                            selected:
                                                "!bg-destructive !text-destructive-foreground rounded-md",
                                            available:
                                                "!bg-success !text-success-foreground rounded-md",
                                        }}
                                        className="rounded-md border"
                                     />
                                 </div>
                            </div>
                        </div>
                    </div>
                    
                    <Separator className="my-8" />

                    <div className="flex justify-between items-center">
                        <Button asChild variant="outline">
                           <Link href="/booking" target="_blank">
                              <Eye className="mr-2 h-4 w-4" /> 
                              Preview Booking Page
                           </Link>
                         </Button>
                         <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Settings</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

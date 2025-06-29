import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy, CalendarDays } from 'lucide-react';

interface QuizData {
  id: string;
  userId: string;
  gameType: string;
  topic: string;
  timeStarted: Date;
  timeEnded: Date | null;
}

interface QuizCalendarProps {
  quizzyData?: QuizData[];
  showStats?: boolean;
  allowSelection?: boolean;
  className?: string;
}

// Helper function to extract dates from quizzy data
const extractQuizDates = (quizzyData: QuizData[]) => {
  return quizzyData.map(quiz => new Date(quiz.timeStarted));
};

// Utility function to combine class names
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Button variants helper
const buttonVariants = ({ variant = "default" }: { variant?: "default" | "outline" | "ghost" }) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  return `${base} ${variants[variant]}`;
};

interface CalendarProps {
  className?: string;
  quizzyData: QuizData[];
  disabled?: (date: Date) => boolean;
}

// Simple DayPicker-like component
function Calendar({
  className,
  quizzyData,
  disabled,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const quizDates = extractQuizDates(quizzyData);
  
  // Get days in month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Generate calendar days
  const days: (Date | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  const hasQuizOnDate = (date: Date | null): boolean => {
    if (!date) return false;
    return quizDates.some(quizDate => 
      quizDate && 
      quizDate.getDate() === date.getDate() &&
      quizDate.getMonth() === date.getMonth() &&
      quizDate.getFullYear() === date.getFullYear()
    );
  };
  
  const getQuizCountForDate = (date: Date | null): number => {
    if (!date) return 0;
    return quizzyData.filter(quiz => {
      const quizDate = new Date(quiz.timeStarted);
      return quizDate.getDate() === date.getDate() &&
             quizDate.getMonth() === date.getMonth() &&
             quizDate.getFullYear() === date.getFullYear();
    }).length;
  };
  
  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return false;
    return disabled ? disabled(date) : false;
  };
  
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={cn("p-3 bg-white border rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        
        <button
          onClick={() => navigateMonth(1)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-normal text-gray-500 h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="relative p-0 text-center text-sm">
            {date && (
              <div
                className={cn(
                  "h-8 w-8 p-0 font-normal relative flex items-center justify-center rounded-md",
                  hasQuizOnDate(date) && "bg-blue-500 text-white",
                  isToday(date) && !hasQuizOnDate(date) && "bg-gray-100 text-gray-900",
                  isDateDisabled(date) && "text-gray-400 opacity-50"
                )}
              >
                {date.getDate()}
                {hasQuizOnDate(date) && (
                  <div className="absolute -top-1 -right-1">
                    <Trophy className="h-3 w-3 text-yellow-400 drop-shadow-sm" />
                    {getQuizCountForDate(date) > 1 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center text-[8px]">
                        {getQuizCountForDate(date)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuizCalendar({ 
  quizzyData = [],
  showStats = true,
  className = "",
}: QuizCalendarProps) {
  // Mock data for demonstration - replace with your actual quizzyData prop
  const mockQuizzyData: QuizData[] = [
    {
      id: "1",
      userId: "user1",
      gameType: "QUICK_QUIZ",
      topic: "JavaScript",
      timeStarted: new Date('2024-06-15T10:30:00'),
      timeEnded: new Date('2024-06-15T10:45:00'),
    },
    {
      id: "2", 
      userId: "user1",
      gameType: "TIMED_QUIZ",
      topic: "React",
      timeStarted: new Date('2024-06-18T14:20:00'),
      timeEnded: new Date('2024-06-18T14:35:00'),
    },
    {
      id: "3",
      userId: "user1", 
      gameType: "CHALLENGE",
      topic: "Node.js",
      timeStarted: new Date('2024-06-22T09:15:00'),
      timeEnded: new Date('2024-06-22T09:30:00'),
    },
    {
      id: "4",
      userId: "user1",
      gameType: "QUICK_QUIZ", 
      topic: "CSS",
      timeStarted: new Date('2024-06-25T16:45:00'),
      timeEnded: new Date('2024-06-25T17:00:00'),
    },
    {
      id: "5",
      userId: "user1",
      gameType: "QUICK_QUIZ",
      topic: "HTML",
      timeStarted: new Date('2024-06-25T17:30:00'),
      timeEnded: new Date('2024-06-25T17:45:00'),
    }
  ];
  
  // Use passed quizzyData or fall back to mock data
  const dataToUse = quizzyData.length > 0 ? quizzyData : mockQuizzyData;
  
  return (
    <div className={cn("max-w-md mx-auto mr-4 min-h-screen", className)}>
      <Calendar
        quizzyData={dataToUse}
        disabled={(date) => date > new Date()}
        className="group hover:shadow-md transition-shadow duration-300"
      />
    </div>
  );
}
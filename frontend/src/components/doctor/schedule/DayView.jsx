import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Utility: detect overlaps & assign columns
function calculateOverlaps(appointments) {
  const sorted = [...appointments].sort((a, b) => new Date(a.start) - new Date(b.start));
  const result = [];

  sorted.forEach((apt) => {
    let overlapCols = 0;

    const aptStart = new Date(apt.start);
    const aptEnd = new Date(apt.end);

    // Count overlaps (those that start before this one ends and end after it starts)
    const overlapping = sorted.filter(
      (other) =>
        other !== apt &&
        new Date(other.start) < aptEnd &&
        new Date(other.end) > aptStart
    );

    overlapCols = overlapping.length + 1;

    // Find this appointment’s position among overlapping ones
    const overlapIndex = overlapping.filter(
      (other) => new Date(other.start) < aptStart
    ).length;

    result.push({ ...apt, overlapCols, overlapIndex });
  });

  return result;
}

const AppointmentBlock = ({ apt, calendarStartHour }) => {
  const colors = {
    "New Patient":
      "bg-blue-500/10 border-blue-500 text-blue-800 dark:text-blue-300",
    "Follow-up":
      "bg-green-500/10 border-green-500 text-green-800 dark:text-green-300",
    Blocked:
      "bg-gray-500/10 border-gray-500 text-gray-700 dark:text-gray-300",
    Patient:
      "bg-purple-500/10 border-purple-500 text-purple-800 dark:text-purple-300",
    Meeting:
      "bg-yellow-500/10 border-yellow-500 text-yellow-800 dark:text-yellow-300",
    Internal:
      "bg-teal-500/10 border-teal-500 text-teal-800 dark:text-teal-300",
    Personal:
      "bg-pink-500/10 border-pink-500 text-pink-800 dark:text-pink-300",
  };

  const aptStart = new Date(apt.start);
  const aptEnd = new Date(apt.end);

  const startMinutes =
    aptStart.getHours() * 60 +
    aptStart.getMinutes() -
    calendarStartHour * 60;
  const endMinutes =
    aptEnd.getHours() * 60 +
    aptEnd.getMinutes() -
    calendarStartHour * 60;

  const pxPerMinute = 2.5; // adjust height density
  const minHeightPx = 80; // Minimum height for an appointment block to ensure content visibility
  const top = startMinutes * pxPerMinute;
  const height = Math.max(minHeightPx, (endMinutes - startMinutes) * pxPerMinute);

  const blockWidth = 90; // Fixed width for each appointment block (as percentage)
  const horizontalOffset = 10; // Horizontal shift for each overlapping block (as percentage)
  const width = blockWidth;
  const left = apt.overlapIndex * horizontalOffset;
  const zIndex = 10 + apt.overlapIndex; // Stagger z-index for overlapping blocks

  const startTime = aptStart.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      className={`absolute rounded-lg border-l-4 p-1 shadow-sm cursor-pointer ${colors[apt.type] || colors.Blocked}`}
      style={{
        top,
        left: `${left}%`,
        width: `${width}%`,
        height,
        zIndex,
      }}
    >
      <p className="font-bold text-sm">{apt.title}</p>
      <p className="text-xs opacity-80">{apt.description || apt.reason}</p>
      <p className="text-xs font-semibold mt-1 opacity-90">{startTime}</p>
    </motion.div>
  );
};

const DayView = ({ date, appointments }) => {
  const calendarStartHour = 8;
  const calendarEndHour = 20;
  const totalMinutes = (calendarEndHour - calendarStartHour) * 60;
  const pxPerMinute = 2.5;

  const processed = useMemo(
    () => calculateOverlaps(appointments),
    [appointments]
  );

  return (
    <div className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl p-4 h-[75vh] overflow-y-auto relative">
      <h2 className="font-bold text-lg mb-4 sticky top-0 bg-card/80 backdrop-blur-sm z-20 py-2">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>

      {/* Time grid */}
      <div
        className="relative w-full"
        style={{
          height: `${totalMinutes * pxPerMinute}px`,
        }}
      >
        {Array.from({
          length: calendarEndHour - calendarStartHour + 1,
        }).map((_, i) => {
          const hour = calendarStartHour + i;
          const label = `${hour % 12 === 0 ? 12 : hour % 12
            }:00 ${hour < 12 || hour === 24 ? "AM" : "PM"}`;
          return (
            <div
              key={i}
              className="absolute w-full border-t border-border text-xs text-muted-foreground"
              style={{ top: `${i * 60 * pxPerMinute}px` }}
            >
              <span className="absolute -translate-y-2">{label}</span>
            </div>
          );
        })}

        {/* Appointment blocks */}
        {processed.map((apt) => (
          <AppointmentBlock
            key={apt.id}
            apt={apt}
            calendarStartHour={calendarStartHour}
          />
        ))}
      </div>
    </div>
  );
};

export default DayView;

import {
  addDays,
  format,
  getDay,
  parseISO,
  startOfDay,
  isBefore,
  differenceInHours,
} from "date-fns";

/** Weekdays Mon–Fri upcoming slots for booking UI (next 14 days) */
export function upcomingWeekdays(from = new Date(), days = 14): string[] {
  const out: string[] = [];
  let d = startOfDay(from);
  for (let i = 0; i < 60 && out.length < days; i++) {
    const day = getDay(d); // 0 Sun … 6 Sat
    if (day >= 1 && day <= 5) {
      out.push(format(d, "yyyy-MM-dd"));
    }
    d = addDays(d, 1);
  }
  return out;
}

export function weekdayLabelEs(dateStr: string) {
  const d = parseISO(dateStr);
  const labels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${labels[getDay(d)]} ${format(d, "d/M")}`;
}

export function isAtLeast24hBefore(dateStr: string, startHour: number, now = new Date()) {
  const classAt = parseISO(`${dateStr}T${String(startHour).padStart(2, "0")}:00:00`);
  return differenceInHours(classAt, now) >= 24;
}

export function isPastSlot(dateStr: string, startHour: number, now = new Date()) {
  const classAt = parseISO(`${dateStr}T${String(startHour).padStart(2, "0")}:00:00`);
  return isBefore(classAt, now);
}

export function todayStr(now = new Date()) {
  return format(now, "yyyy-MM-dd");
}

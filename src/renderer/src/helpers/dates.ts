export const getWeekDays = (currentDay: string) => {
   const today = new Date(currentDay);
   const dayOfWeek = today.getDay();
   const weekDays: string[] = [];

   const sunday = new Date(today);
   sunday.setDate(today.getDate() + 1 - (dayOfWeek || 7));

   for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      weekDays.push(day.toISOString().split("T")[0]);
   }

   return weekDays;
};

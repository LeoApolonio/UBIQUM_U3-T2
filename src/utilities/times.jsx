const days = ['M', 'Tu', 'W', 'Th', 'F'];
export const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const mapValues = (fn, obj) => (
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

export const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

export const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

export const fetchSchedule = async () => 
{
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw response;
  return addScheduleTimes(await response.json());
};

export const hasConflict = (course, selected) => 
(
  selected.some(selection => courseConflict(course, selection))
);

export const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

export const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

export const timeConflict = (course1, course2) => (
  course1.days && course2.days &&
  daysOverlap(course1.days, course2.days) &&
  hoursOverlap(course1.hours, course2.hours)
);

export const courseConflict = (course1, course2) => (
  course1.term === course2.term &&
  timeConflict(course1, course2)
);

export const timeParts = meets => 
{
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : 
  {
    days,
    hours: 
    {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

export const toggle = (x, lst) => 
(
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);
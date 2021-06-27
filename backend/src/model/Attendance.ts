export interface AttendanceData {
    Attendance: Attendance;
  }
  export interface Attendance {
    ['xmlns:xsd']: string;
    ['xmlns:xsi']: string;
    Type: string;
    StartPeriod: string;
    EndPeriod: string;
    PeriodCount: string;
    SchoolName: string;
    Absences: Absences;
    TotalExcused: TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies;
    TotalTardies: TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies;
    TotalUnexcused: TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies;
    TotalActivities: TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies;
    TotalUnexcusedTardies: TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies;
    ConcurrentSchoolsLists: ConcurrentSchoolsLists;
  }
  export interface Absences {
    Absence?: (Absence)[] | null;
  }
  export interface Absence {
    AbsenceDate: string;
    Reason: string;
    Note: string;
    DailyIconName: string;
    CodeAllDayReasonType: string;
    CodeAllDayDescription: string;
    Periods: Periods;
  }
  export interface Periods {
    Period?: (PeriodEntity)[] | null;
  }
  export interface PeriodEntity {
    Number: string;
    Name: string;
    Reason: string;
    Course: string;
    Staff: string;
    StaffEMail: string;
    IconName: string;
    SchoolName: string;
    StaffGU: string;
    OrgYearGU: string;
  }
  export interface TotalExcusedOrTotalTardiesOrTotalUnexcusedOrTotalActivitiesOrTotalUnexcusedTardies {
    PeriodTotal?: (PeriodTotalEntity)[] | null;
  }
  export interface PeriodTotalEntity {
    Number: string;
    Total: string;
  }
  export interface ConcurrentSchoolsLists {
  }
  
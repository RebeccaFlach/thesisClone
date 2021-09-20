export interface Schedule {
    StudentClassSchedule: StudentClassSchedule;
  }
  export interface StudentClassSchedule {
    _attributes: ScheduleInfo;
    TodayScheduleInfoData: TodayScheduleInfo;
    ClassLists: ClassLists;
    TermLists: TermLists;
    ConcurrentSchoolStudentClassSchedules: any;
  }
  export interface ScheduleInfo {
    "xmlns:xsd": string;
    "xmlns:xsi": string;
    TermIndex: string;
    TermIndexName: string;
    ErrorMessage: string;
    IncludeAdditionalStaffWhenEmailingTeachers: string;
  }
  export interface TodayScheduleInfo {
    _attributes: TodayInfo;
    SchoolInfos: SchoolInfos;
  }
  export interface TodayInfo {
    Date: string;
  }
  export interface SchoolInfos {
    SchoolInfo: SchoolInfo;
  }
  export interface SchoolInfo {
    _attributes: SchoolData;
    Classes: Classes;
  }
  export interface SchoolData {
    SchoolName: string;
    BellSchedName: string;
  }
  export interface Classes {
    ClassInfo?: Course[] | null;
  }
  export interface Course {
    _attributes: CourseInfo;
    AttendanceCode: any;
  }
  export interface CourseInfo {
    Period: string;
    ClassName: string;
    ClassURL: string;
    StartTime: string;
    EndTime: string;
    TeacherName: string;
    TeacherURL: string;
    RoomName: string;
    TeacherEmail: string;
    EmailSubject: string;
    StaffGU: string;
    EndDate: string;
    StartDate: string;
    SectionGU: string;
    HideClassStartEndTime: string;
  }
  
  export interface ClassLists {
    ClassListing?: (ClassListingEntity)[] | null;
  }
  export interface ClassListingEntity {
    _attributes: ClassInfo;
    AdditionalStaffInformationXMLs: any;
  }
  export interface ClassInfo {
    Period: string;
    CourseTitle: string;
    RoomName: string;
    Teacher: string;
    TeacherEmail: string;
    SectionGU: string;
    TeacherStaffGU: string;
  }
  export interface TermLists {
    TermListing?: (Term)[] | null;
  }
  export interface Term {
    _attributes: TermInfo;
    TermDefCodes: TermDefCodes;
  }
  export interface TermInfo {
    TermIndex: string;
    TermCode: string;
    TermName: string;
    BeginDate: string;
    EndDate: string;
    SchoolYearTrmCodeGU: string;
  }
  export interface TermDefCodes {
    TermDefCode: TermDefCode;
  }
  export interface TermDefCode {
    _attributes: TermDef;
  }
  export interface TermDef {
    TermDefName: string;
  }
  
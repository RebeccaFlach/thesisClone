export interface gradebook {
    Gradebook: Gradebook;
  }
  export interface Gradebook {
    'xmlns:xsd': string;
    'xmlns:xsi': string;
    Type: string;
    ErrorMessage: string;
    HideStandardGraphInd: string;
    HideMarksColumnElementary: string;
    HidePointsColumnElementary: string;
    HidePercentSecondary: string;
    DisplayStandardsData: string;
    GBStandardsTabDefault: string;
    ReportingPeriods: ReportingPeriods;
    ReportingPeriod: ReportingPeriod;
    Courses: Courses;
  }
  export interface ReportingPeriods {
    ReportPeriod?: (ReportPeriodEntity)[] | null;
  }
  export interface ReportPeriodEntity {
    Index: string;
    GradePeriod: string;
    StartDate: string;
    EndDate: string;
  }
  export interface ReportingPeriod {
    GradePeriod: string;
    StartDate: string;
    EndDate: string;
  }
  export interface Courses {
    Course?: (CourseEntity)[] | null;
  }
  export interface CourseEntity {
    UsesRichContent: string;
    Period: string;
    Title: string;
    Room: string;
    Staff: string;
    StaffEMail: string;
    StaffGU: string;
    HighlightPercentageCutOffForProgressBar: string;
    Marks: Marks;
  }
  export interface Marks {
    Mark: Mark;
  }
  export interface Mark {
    MarkName: string;
    CalculatedScoreString: string;
    CalculatedScoreRaw: string;
    StandardViews: ResourcesOrStandardsOrStandardViewsOrGradeCalculationSummary;
    GradeCalculationSummary: GradeCalculationSummary;
    Assignments: Assignments;
  }
  export interface ResourcesOrStandardsOrStandardViewsOrGradeCalculationSummary {
  }
  export interface GradeCalculationSummary {
    AssignmentGradeCalc?: (AssignmentGradeCalcEntity)[] | null;
  }
  export interface AssignmentGradeCalcEntity {
    Type: string;
    Weight: string;
    Points: string;
    PointsPossible: string;
    WeightedPct: string;
    CalculatedMark: string;
  }
  export interface Assignments {
    Assignment?: (AssignmentEntity)[] | null;
  }
  export interface AssignmentEntity {
    GradebookID: string;
    Measure: string;
    Type: string;
    Date: string;
    DueDate: string;
    Score: string;
    ScoreType: string;
    Points: string;
    Notes: string;
    TeacherID: string;
    StudentID: string;
    MeasureDescription: string;
    HasDropBox: string;
    DropStartDate: string;
    DropEndDate: string;
    Resources: Resources;
    Standards: ResourcesOrStandardsOrStandardViewsOrGradeCalculationSummary;
  }
  export interface Resources {
    Resource?: Resource | null;
  }
  export interface Resource {
    ClassID: string;
    FileName: string;
    FileType: string;
    GradebookID: string;
    ResourceDate: string;
    ResourceID: string;
    ResourceName: string;
    Sequence: string;
    TeacherID: string;
    Type: string;
    URL: string;
    ServerFileName: string;
  }
  
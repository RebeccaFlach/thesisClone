export default interface GradeYear {
    Grade: string;
    Terms?: GradedTerm[] | null;
  }
  export interface GradedTerm {
    SchoolName: string;
    Year: string;
    TermName: string;
    Courses?: GradedCourse[] | null;
  }
  export interface GradedCourse {
    CourseID: string;
    CourseTitle: string;
    CreditsAttempted: string;
    CreditsCompleted: string;
    VerifiedCredit: string;
    Mark: string;
    CHSType: string;
  }
  
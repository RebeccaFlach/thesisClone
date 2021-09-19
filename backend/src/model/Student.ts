export interface Student {
    StudentInfo: StudentInfo;
  }
  export interface StudentInfo {
    _attributes: Attributes;
    LockerInfoRecords: string;
    FormattedName: text;
    PermID: text;
    Gender: text;
    Grade: text;
    Address: text;
    LastNameGoesBy: string;
    NickName: string;
    BirthDate: text;
    EMail: text;
    Phone: text;
    HomeLanguage: string;
    CurrentSchool: text;
    Track: string;
    HomeRoomTch: text;
    HomeRoomTchEMail: text;
    HomeRoomTchStaffGU: text;
    OrgYearGU: text;
    HomeRoom: text;
    CounselorName: string;
    CounselorEmail: string;
    CounselorStaffGU: string;
    Photo: text;
    EmergencyContacts: EmergencyContacts;
    Physician: Physician;
    Dentist: Dentist;
    UserDefinedGroupBoxes: UserDefinedGroupBoxes;
  }
  export interface Attributes {
    "xmlns:xsd": string;
    "xmlns:xsi": string;
    Type: string;
    ShowPhysicianAndDentistInfo: string;
    ShowStudentInfo: string;
  }

  export interface text {
    _text: string;
  }
  export interface EmergencyContacts {
    EmergencyContact?: (EmergencyContactEntity)[] | null;
  }
  export interface EmergencyContactEntity {
    _attributes: Attributes1;
  }
  export interface Attributes1 {
    Name: string;
    Relationship: string;
    HomePhone: string;
    WorkPhone: string;
    OtherPhone: string;
    MobilePhone: string;
  }
  export interface Physician {
    _attributes: Attributes2;
  }
  export interface Attributes2 {
    Name: string;
    Hospital: string;
    Phone: string;
    Extn: string;
  }
  export interface Dentist {
    _attributes: Attributes3;
  }
  export interface Attributes3 {
    Name: string;
    Office: string;
    Phone: string;
    Extn: string;
  }
  export interface UserDefinedGroupBoxes {
    UserDefinedGroupBox: UserDefinedGroupBox;
  }
  export interface UserDefinedGroupBox {
    _attributes: Attributes4;
    UserDefinedItems: UserDefinedItems;
  }
  export interface Attributes4 {
    GroupBoxLabel: string;
    GroupBoxID: string;
    VCID: string;
  }
  export interface UserDefinedItems {
    UserDefinedItem?: (UserDefinedItemEntity)[] | null;
  }
  export interface UserDefinedItemEntity {
    _attributes: Attributes5;
  }
  export interface Attributes5 {
    ItemLabel: string;
    ItemType: string;
    SourceObject: string;
    SourceElement: string;
    VCID: string;
    Value: string;
  }
  
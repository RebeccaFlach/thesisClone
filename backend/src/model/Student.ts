export interface Student {
    StudentInfo: StudentInfo;
  }
  export interface StudentInfo {
    _attributes: DataAttributes;
    LockerInfoRecords: any;
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
  export interface DataAttributes {
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
    EmergencyContact?: EmergencyContact[] | null;
  }
  export interface EmergencyContact {
    _attributes: EmergencyContactInfo;
  }
  export interface EmergencyContactInfo {
    Name: string;
    Relationship: string;
    HomePhone: string;
    WorkPhone: string;
    OtherPhone: string;
    MobilePhone: string;
  }
  export interface Physician {
    _attributes: PhysicianInfo;
  }
  export interface PhysicianInfo {
    Name: string;
    Hospital: string;
    Phone: string;
    Extn: string;
  }
  export interface Dentist {
    _attributes: DentistInfo;
  }
  export interface DentistInfo {
    Name: string;
    Office: string;
    Phone: string;
    Extn: string;
  }
  export interface UserDefinedGroupBoxes {
    UserDefinedGroupBox: UserDefinedGroupBox;
  }
  export interface UserDefinedGroupBox {
    _attributes: GroupBoxInfo;
    UserDefinedItems: UserDefinedItems;
  }
  export interface GroupBoxInfo {
    GroupBoxLabel: string;
    GroupBoxID: string;
    VCID: string;
  }
  export interface UserDefinedItems {
    UserDefinedItem?: UserDefinedItem[] | null;
  }
  export interface UserDefinedItem {
    _attributes: ItemInfo;
  }
  export interface ItemInfo {
    ItemLabel: string;
    ItemType: string;
    SourceObject: string;
    SourceElement: string;
    VCID: string;
    Value: string;
  }
  
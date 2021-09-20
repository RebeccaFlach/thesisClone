export interface Messages {
  PXPMessagesData: PXPMessagesData;
}
export interface PXPMessagesData {
  _attributes: MessagesInfo;
  MessageListings: MessageListings;
  SynergyMailMessageListingByStudents: AttachmentDatasOrSynergyMailMessageListingByStudents;
}
export interface MessagesInfo {
  'xmlns:xsd': string;
  'xmlns:xsi': string;
  SupportingSynergyMail: string;
}
export interface MessageListings {
  MessageListing?: (Message)[] | null;
}
export interface Message {
  _attributes: MessageInfo;
  AttachmentDatas: AttachmentDatas;
}
export interface MessageInfo {
  IconURL: string;
  ID: string;
  BeginDate: string;
  Type: string;
  Subject: string;
  Content: string;
  Read: string;
  Deletable: string;
  From: string;
  SubjectNoHTML: string;
  Module: string;
  Email: string;
  StaffGU: string;
  SMMsgPersonGU: string;
}
export interface AttachmentDatas {
  AttachmentData?: AttachmentData | null;
}
export interface AttachmentData {
  _attributes: AttachmentInfo;
}
export interface AttachmentInfo {
  AttachmentName: string;
  SmAttachmentGU: string;
}
export interface AttachmentDatasOrSynergyMailMessageListingByStudents {
}

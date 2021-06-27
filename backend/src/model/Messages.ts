export default interface Messages {
    PXPMessagesData: PXPMessagesData;
  }
  export interface PXPMessagesData {
    ['xmlns:xsd']: string;
    ['xmlns:xsi']: string;
    SupportingSynergyMail: string;
    MessageListings: MessageList;
    SynergyMailMessageListingByStudents: AttachmentDatasOrSynergyMailMessageListingByStudents;
  }
  export interface MessageList {
    MessageListing?: IMessage[] | null;
  }
  export interface IMessage {
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
    AttachmentDatas: AttachmentDatas;
  }
  export interface AttachmentDatas {
    AttachmentData?: Attachment[] | null | Attachment;
  }
  export interface Attachment {
    AttachmentName: string;
    SmAttachmentGU: string;
  }
  export interface AttachmentDatasOrSynergyMailMessageListingByStudents {
  }
  
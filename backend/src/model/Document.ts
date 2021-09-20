export interface Document {
    StudentAttachedDocumentData: StudentAttachedDocumentData;
  }
  export interface StudentAttachedDocumentData {
    _attributes: XmlInfo;
    DocumentCategoryLookups: any;
    DocumentDatas: DocumentDatas;
  }
  export interface XmlInfo {
    "xmlns:xsd": string;
    "xmlns:xsi": string;
  }
  
  export interface DocumentDatas {
    DocumentData: DocumentData;
  }
  export interface DocumentData {
    _attributes: DocumentInfo;
    Base64Code: Base64Code;
  }
  export interface DocumentInfo {
    DocumentGU: string;
    StudentGU: string;
    DocDate: string;
    FileName: string;
    Category: string;
    Notes: string;
    DocType: string;
  }
  export interface Base64Code {
    _text: string;
  }
  
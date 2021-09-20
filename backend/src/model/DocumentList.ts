export interface DocumentList {
    StudentDocuments: StudentDocuments;
  }
  export interface StudentDocuments {
    _attributes: ListInfo;
    StudentDocumentDatas: Documents;
  }
  export interface ListInfo {
    "xmlns:xsd": string;
    "xmlns:xsi": string;
    showDateColumn: string;
    showDocNameColumn: string;
    showDocCatColumn: string;
    StudentGU: string;
    StudentSSY: string;
  }
  export interface Documents {
    StudentDocumentData?: ListedDocument[] | null;
  }
  export interface ListedDocument {
    _attributes: DocumentInfo;
  }
  export interface DocumentInfo {
    DocumentGU: string;
    DocumentFileName: string;
    DocumentDate: string;
    DocumentType: string;
    StudentGU: string;
    DocumentComment: string;
  }
  
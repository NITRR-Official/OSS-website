export interface Research {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  conference?: string;
  pdfUrl?: string;
  githubUrl?: string;
  doi?: string;
  tags: string[];
}

export type MagazineCategory = string;

export type UserRole = 'Yönetici' | 'Editör' | 'Öğretmen' | 'Öğrenci Katkısı' | 'Yazar';

export type ContentStatus = 'Taslak' | 'Kontrolde' | 'Düzeltme İstendi' | 'Onaylandı' | 'Yayına Hazır';

export type PageFormat = 'a4' | 'digital';

export interface PhotoFocalPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface MagazinePhoto {
  id: string;
  url: string;
  caption?: string;
  isMain?: boolean;
  focalPoint?: PhotoFocalPoint;
  width?: number;
  height?: number;
  isLowRes?: boolean;
}

export interface StemData {
  problem: string;
  purpose: string;
  process: string;
  result: string;
}

export interface InterviewQA {
  id: string;
  question: string;
  answer: string;
}

export interface BookReviewData {
  bookAuthor: string;
  publisher?: string;
  pages?: string;
  rating?: number; // 1-5
  recommendedFor?: string;
}

export interface InteractiveData {
  title: string;
  type: 'wordwall' | 'genially' | 'learningapps' | 'forms' | 'video' | 'other';
  url: string;
  buttonText: string;
  qrCodeDataUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: 'Yönetim' | 'Yayın Kurulu' | 'Tasarım & Bilişim' | 'Öğrenci Temsilcileri';
  photoUrl?: string;
}

export interface MastheadInfo {
  schoolName: string;
  magazineName: string;
  principal: string;
  editorInChief: string;
  editorialBoard: string[];
  graphicDesign: string[];
  contactEmail: string;
  schoolAddress: string;
  website: string;
  legalNotice: string;
}

export interface ArchiveIssue {
  id: string;
  issueNumber: number;
  month: string;
  year: number;
  title: string;
  coverUrl: string;
  canvaUrl: string;
}

export interface MagazineSection {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface ArticleItem {
  id: string;
  issueId: string;
  category: MagazineCategory;
  title: string;
  subtitle?: string;
  author: string;
  authorRole?: string;
  targetGrades?: string[];
  tags?: string[];
  content: string;
  pullQuote?: string;
  sourceReference?: string;
  mainPhoto?: MagazinePhoto;
  photos: MagazinePhoto[];
  videoUrl?: string;
  interactiveUrl?: string;
  interactiveData?: InteractiveData;
  stemData?: StemData;
  interviewData?: InterviewQA[];
  bookData?: BookReviewData;
  editorNote?: string;
  status: ContentStatus;
  createdBy: string;
  createdRole: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type SmartLayoutVariant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface BoxPosition {
  x: number; // percentage or absolute mm
  y: number; // percentage or absolute mm
  width: number;
  height: number;
}

export interface LayerStyle {
  fontFamily?: string;
  fontSize?: string; // e.g. "12pt"
  color?: string; // hex or rgb
  backgroundColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  letterSpacing?: string;
}

export interface MagazineLayer {
  id: string;
  type: 'title' | 'subtitle' | 'content' | 'quote' | 'image' | 'footer' | 'header' | 'author';
  zIndex: number;
  position: BoxPosition;
  style: LayerStyle;
  content: string; // HTML string for rich text, or URL for image
  imageRefId?: string; // Reference to MagazinePhoto id
  isHidden?: boolean;
  isLocked?: boolean;
}

export interface PageLayoutSettings {
  imagePosition?: 'top' | 'left' | 'right' | 'bottom' | 'full-width';
  imageScale?: number; // 20-100
  imageFit?: 'cover' | 'contain';
  columnCount?: 2 | 3;
  pullQuoteSize?: 'small' | 'medium' | 'large';
  manualOverrides?: Record<string, unknown>; // Kullanıcı tercihlerini korur
}

export interface MagazinePage {
  id: string;
  pageNumber: number;
  issueId: string;
  articleId?: string;
  sectionId?: string;
  templateId: string;
  layoutVariant: 'A' | 'B' | 'C';
  category: MagazineCategory;
  title: string;
  subtitle?: string;
  author?: string;
  authorRole?: string;
  content?: string;
  pullQuote?: string;
  sourceReference?: string;
  photos: MagazinePhoto[];
  qrCodeDataUrl?: string;
  qrUrl?: string;
  qrLabel?: string;
  interactiveButton?: {
    text: string;
    url: string;
  };
  customThemeColor?: string;
  isLocked?: boolean;
  layoutSettings?: PageLayoutSettings;
  smartLayoutMode?: boolean;
  layers?: MagazineLayer[];
  smartLayoutVariant?: SmartLayoutVariant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: Record<string, any>;
}

export interface MagazineIssue {
  id: string;
  title: string;
  subtitle: string;
  schoolName: string;
  issueNumber: number;
  month: string;
  monthIndex: number;
  year: number;
  coverTitle: string;
  coverSubtitle: string;
  slogan: string;
  editorName: string;
  publishDate: string;
  coverImageUrl?: string;
  format: PageFormat;
  sections: MagazineSection[];
  pages: MagazinePage[];
  articles: ArticleItem[];
  teamMembers: TeamMember[];
  masthead: MastheadInfo;
  archives: ArchiveIssue[];
  createdAt: string;
  updatedAt: string;
}

export interface PreflightItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  pageNumber?: number;
  pageTitle?: string;
  message: string;
  detail?: string;
  field?: string;
}

export interface PreflightReport {
  isValid: boolean;
  totalChecks: number;
  errorCount: number;
  warningCount: number;
  items: PreflightItem[];
}
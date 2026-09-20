const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'src/types/magazine.ts');
let content = fs.readFileSync(p, 'utf8');

const newTypes = 
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
;

content = content.replace("export interface PageLayoutSettings {", newTypes + "\nexport interface PageLayoutSettings {");

// Add smartLayout field to MagazinePage
content = content.replace(
  "layoutSettings?: PageLayoutSettings;", 
  "layoutSettings?: PageLayoutSettings;\n  smartLayoutMode?: boolean;\n  layers?: MagazineLayer[];\n  smartLayoutVariant?: SmartLayoutVariant;"
);

fs.writeFileSync(p, content, 'utf8');
console.log("Types updated.");

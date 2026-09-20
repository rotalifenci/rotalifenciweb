import React from 'react';

/**
 * Splits text into fitting and overflow text at a given word boundary
 * WITHOUT destroying newlines, spaces, tabs or paragraph breaks!
 * Also prevents headings from being stranded at the bottom boundary.
 */
export function splitContentAtWordCount(
  text: string,
  maxWords: number
): { fitting: string; overflow: string; totalWords: number; overflowCount: number } {
  if (!text) {
    return { fitting: '', overflow: '', totalWords: 0, overflowCount: 0 };
  }

  // Regex matches non-whitespace sequences (words)
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  let wordCount = 0;
  let splitIndex = text.length;

  while ((match = regex.exec(text)) !== null) {
    wordCount++;
    if (wordCount === maxWords) {
      splitIndex = match.index + match[0].length;
      break;
    }
  }

  // Count remaining words if any
  let totalWords = wordCount;
  if (splitIndex < text.length) {
    const remainingMatches = text.substring(splitIndex).match(/\S+/g);
    if (remainingMatches) {
      totalWords += remainingMatches.length;
    }
  }

  if (totalWords <= maxWords) {
    return { fitting: text, overflow: '', totalWords, overflowCount: 0 };
  }

  // If fittingCandidate ends with a heading line (###), move boundary before the heading
  // so the heading stays intact with its body text in the overflow!
  let fittingCandidate = text.substring(0, splitIndex);
  const lastLine = fittingCandidate.split('\n').pop() || '';
  if (/^#{1,4}\s+/.test(lastLine.trim())) {
    const lastNewline = fittingCandidate.lastIndexOf('\n');
    if (lastNewline > 0) {
      splitIndex = lastNewline;
    }
  }

  return {
    fitting: text.substring(0, splitIndex),
    overflow: text.substring(splitIndex).trim(),
    totalWords,
    overflowCount: totalWords - maxWords
  };
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'callout';
  text: string;
}

/**
 * Parses lines into distinct heading, callout, and paragraph blocks.
 */
export function parseContentBlocks(text: string): ContentBlock[] {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: ContentBlock[] = [];
  let currentParagraphLines: string[] = [];
  let currentCalloutLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const pText = currentParagraphLines.join('\n').trim();
      if (pText.length > 0) {
        blocks.push({ type: 'paragraph', text: pText });
      }
      currentParagraphLines = [];
    }
  };

  const flushCallout = () => {
    if (currentCalloutLines.length > 0) {
      const cText = currentCalloutLines.join('\n').trim();
      if (cText.length > 0) {
        blocks.push({ type: 'callout', text: cText });
      }
      currentCalloutLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this line is a callout block (starts with >)
    if (trimmed.startsWith('>')) {
      flushParagraph();
      currentCalloutLines.push(trimmed);
      continue;
    } else if (currentCalloutLines.length > 0) {
      // End of callout
      flushCallout();
    }

    // Check if this line is a markdown heading (# or ## or ###)
    if (/^#{1,4}\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'heading', text: trimmed });
    } else if (trimmed.length === 0) {
      // Empty line marks a paragraph boundary
      flushParagraph();
    } else {
      currentParagraphLines.push(line);
    }
  }

  flushParagraph();
  flushCallout();
  return blocks;
}

/**
 * Parses markdown-like bold, italic, subheadings, and color tags:
 * - **bold**
 * - *italic*
 * - ### Subheading
 * - > Callout ("Biliyor muydunuz?" / "Önemli Not")
 * - [color=#HEX]text[/color] or <span style="color:HEX">text</span>
 * Preserves copy-pasted paragraph breaks, soft line breaks, and indents!
 * Headings are strictly locked to their paragraphs with break-after: avoid.
 */
export interface FormattedContentStyles {
  fontSize?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
  textAlign?: 'justify' | 'left' | 'center';
}

export function renderFormattedContent(
  text: string,
  themeColor: string = '#0284c7',
  withDropCap: boolean = false,
  inlineMedia?: React.ReactNode,
  customStyles?: FormattedContentStyles
): React.ReactNode {
  if (!text) return inlineMedia || null;

  const blocks = parseContentBlocks(text);
  if (blocks.length === 0) return inlineMedia || null;

  let mediaInserted = false;

  return (
    <div
      className="text-slate-800 leading-relaxed overflow-visible"
      style={{
        fontSize: customStyles?.fontSize
          ? typeof customStyles.fontSize === 'number'
            ? `${customStyles.fontSize}px`
            : customStyles.fontSize
          : '13px',
        lineHeight: customStyles?.lineHeight || 1.45,
        textAlign: customStyles?.textAlign || 'justify',
        letterSpacing:
          customStyles?.letterSpacing !== undefined
            ? typeof customStyles.letterSpacing === 'number'
              ? `${customStyles.letterSpacing}px`
              : customStyles.letterSpacing
            : 'normal',
      }}
    >
      {blocks.map((block, bIdx) => {
        if (block.type === 'heading') {
          const headingText = block.text.replace(/^#+\s*/, '');
          return (
            <h4
              key={bIdx}
              className="font-bold text-xs sm:text-[13px] tracking-tight mt-2 mb-1 uppercase font-sans border-b pb-0.5 select-none"
              style={{
                color: themeColor,
                borderColor: `${themeColor}40`,
                breakInside: 'avoid',
                breakAfter: 'avoid',
                pageBreakAfter: 'avoid'
              }}
            >
              {parseInlineFormatting(headingText)}
            </h4>
          );
        }

        if (block.type === 'callout') {
          const cleanText = block.text
            .split('\n')
            .map(l => l.replace(/^>\s?/, ''))
            .join('\n')
            .trim();

          return (
            <div
              key={bIdx}
              className="my-2 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 shadow-2xs block w-full relative select-none"
              style={{ breakInside: 'avoid' }}
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-sky-800 uppercase tracking-wide mb-1">
                <span>💡</span>
                <span>BİLİYOR MUYDUNUZ? / ÖNEMLİ BİLGİ</span>
              </div>
              <div className="text-[11px] leading-relaxed text-sky-900 font-sans">
                {parseInlineFormatting(cleanText.replace(/💡/g, '').replace(/\*\*BİLİYOR MUYDUNUZ\?:\?\*\*/i, '').trim())}
              </div>
            </div>
          );
        }

        const lines = block.text.split('\n');
        const shouldInsertMedia = !mediaInserted && Boolean(inlineMedia);
        if (shouldInsertMedia) {
          mediaInserted = true;
        }

        // Regular paragraph with preserved soft line breaks - allows float wrapping naturally
        return (
          <p
            key={bIdx}
            className="mb-1.5 font-serif text-slate-800 overflow-visible"
            style={{
              fontSize: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
              textAlign: 'inherit',
              hyphens: 'auto',
              WebkitHyphens: 'auto',
              wordBreak: 'normal',
              overflowWrap: 'break-word'
            }}
          >
            {shouldInsertMedia ? inlineMedia : null}
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {parseInlineFormatting(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
      {!mediaInserted && inlineMedia}
    </div>
  );
}

/**
 * Parses bold, italic, and color tags inside inline text.
 */
export function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex matches:
  // 1. [color=(#?[a-zA-Z0-9]+)](.*?)[/color]
  // 2. <span style="color:\s*([^"]+)">([\s\S]*?)<\/span>
  // 3. \*\*(.*?)\*\* (Bold)
  // 4. \*(.*?)\* (Italic)
  const regex = /(\[color=([#a-zA-Z0-9]+)\]([\s\S]*?)\[\/color\]|<span style="color:\s*([^"]+)">([\s\S]*?)<\/span>|\*\*(.*?)\*\*|\*(.*?)\*)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const matchIndex = match.index;

    // Push preceding plain text
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    if (match[2] && match[3]) {
      // [color=HEX]text[/color]
      const color = match[2].startsWith('#') ? match[2] : `#${match[2]}`;
      elements.push(
        <span key={matchIndex} style={{ color }} className="font-semibold">
          {parseInlineFormatting(match[3])}
        </span>
      );
    } else if (match[4] && match[5]) {
      // <span style="color:HEX">text</span>
      elements.push(
        <span key={matchIndex} style={{ color: match[4] }} className="font-semibold">
          {parseInlineFormatting(match[5])}
        </span>
      );
    } else if (match[6]) {
      // **Bold**
      elements.push(
        <strong key={matchIndex} className="font-bold text-slate-900">
          {match[6]}
        </strong>
      );
    } else if (match[7]) {
      // *Italic*
      elements.push(
        <em key={matchIndex} className="italic text-slate-800">
          {match[7]}
        </em>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Push remainder
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

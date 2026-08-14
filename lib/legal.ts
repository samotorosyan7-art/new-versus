import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'legal');

export interface LegalDoc {
  title: string;
  effectiveDate: string;
  content: string;
}

/** Reads a legal document (e.g. "privacy-policy") for a given locale, falling back to English. */
export function getLegalDoc(slug: string, locale: string): LegalDoc | null {
  const fileName = `${slug}.${locale}.mdx`;
  let fullPath = path.join(CONTENT_DIR, fileName);

  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(CONTENT_DIR, `${slug}.en.mdx`);
    if (!fs.existsSync(fullPath)) return null;
  }

  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title ?? '',
    effectiveDate: data.effectiveDate ?? '',
    content,
  };
}

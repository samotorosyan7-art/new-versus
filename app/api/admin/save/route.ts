import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { commitFiles, isProductionRuntime, type FileChange } from '@/lib/github-content';
import { slugify } from '@/lib/slugify';
import { getInsightRedirects } from '@/lib/mdx';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');
const REDIRECTS_PATH = path.join(process.cwd(), 'content', 'insight-redirects.json');
const LOCALES = ['en', 'hy', 'ru'] as const;
type Locale = typeof LOCALES[number];

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_IMAGE_SIZE = 1024 * 1024; // the GitHub Contents/blobs APIs reject much larger payloads anyway

type TranslationInput = { title: string; excerpt: string; content: string };

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function buildMdx(t: TranslationInput, image: string, hasOrder: boolean, parsedOrder: number): string {
  const date = new Date().toISOString().split('T')[0];
  const orderLine = hasOrder ? `\norder: ${parsedOrder}` : '';
  return `---
title: "${t.title}"
date: "${date}"
tag: "Article"
excerpt: "${t.excerpt}"
isFeatured: false${orderLine}
image: "${image || ''}"
---

${t.content}
`;
}

/** Rewrites only the `image:` frontmatter line, leaving title/excerpt/content/order untouched. */
function setFrontmatterImage(raw: string, image: string): string {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return raw;
  const [, frontmatter, body] = match;
  const imageLine = `image: "${image}"`;
  const newFrontmatter = /^image:.*$/m.test(frontmatter)
    ? frontmatter.replace(/^image:.*$/m, imageLine)
    : `${frontmatter}\n${imageLine}`;
  return `---\n${newFrontmatter}\n---\n${body}`;
}

/** Rewrites only the `order:` frontmatter line (or removes/adds it), leaving everything else untouched. */
function setFrontmatterOrder(raw: string, hasOrder: boolean, parsedOrder: number): string {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return raw;
  const [, frontmatter, body] = match;
  const withoutOrder = frontmatter.replace(/^order:.*\n?/m, '');
  const newFrontmatter = hasOrder
    ? (/^isFeatured:.*$/m.test(withoutOrder)
      ? withoutOrder.replace(/^(isFeatured:.*)$/m, `$1\norder: ${parsedOrder}`)
      : `${withoutOrder}\norder: ${parsedOrder}`)
    : withoutOrder;
  return `---\n${newFrontmatter}\n---\n${body}`;
}

function readLocalFile(fileName: string): string | null {
  const filePath = path.join(CONTENT_DIR, fileName);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get('password');

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let translationsInput: Record<string, TranslationInput>;
    try {
      translationsInput = JSON.parse(String(formData.get('translations') || '{}'));
    } catch {
      return NextResponse.json({ error: 'Invalid translations payload' }, { status: 400 });
    }
    const localesToSave = Object.keys(translationsInput).filter(isLocale);
    if (localesToSave.length === 0) {
      return NextResponse.json({ error: 'No translations provided' }, { status: 400 });
    }

    // The URL slug is a case-level id shared by every translation. It's only ever derived
    // from the title for a brand-new case (no previousSlug). Editing an existing case's
    // title must never silently change its slug — that used to delete the live file with
    // no redirect left behind, so any bookmarked/indexed link to it 404'd in prod.
    const previousSlugRaw = String(formData.get('previousSlug') || '');
    const previousSlug = previousSlugRaw ? slugify(previousSlugRaw) : null;
    const requestedSlug = String(formData.get('slug') || '');
    const slug = slugify(requestedSlug || previousSlug || translationsInput[localesToSave[0]].title);

    if (!slug) {
      return NextResponse.json({ error: 'Could not derive a URL slug — please provide a title or slug' }, { status: 400 });
    }

    const inProd = isProductionRuntime();
    const changes: FileChange[] = [];
    const deletions: string[] = [];

    // Order is a case-level field shared across every translation, like the image —
    // it controls placement on the Cases grid, which isn't per-language.
    const orderRaw = String(formData.get('order') || '');
    const parsedOrder = Number(orderRaw);
    const hasOrder = orderRaw !== '' && !Number.isNaN(parsedOrder);

    // Image: either a freshly uploaded file, or whatever the client already had.
    let imageToSave = String(formData.get('image') || '');
    const file = formData.get('file');
    if (file instanceof File) {
      const ext = MIME_EXTENSIONS[file.type];
      if (!ext) {
        return NextResponse.json({ error: 'Unsupported image type. Use JPEG, PNG, WEBP, or GIF.' }, { status: 400 });
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Image is too large. Please keep it under 1MB.' }, { status: 400 });
      }
      const safeSlug = slug.replace(/[^a-z0-9-]/g, '').slice(0, 60) || 'case';
      const fileName = `${safeSlug}-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      imageToSave = `/uploads/cases/${fileName}`;

      if (inProd) {
        changes.push({ path: `public/uploads/cases/${fileName}`, content: buffer.toString('base64'), encoding: 'base64' });
      } else {
        const dirPath = path.join(process.cwd(), 'public', 'uploads', 'cases');
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(path.join(dirPath, fileName), buffer);
      }
    }

    const isRename = !!previousSlug && previousSlug !== slug;

    for (const locale of localesToSave) {
      const mdxContent = buildMdx(translationsInput[locale], imageToSave, hasOrder, parsedOrder);
      const fileName = `${slug}.${locale}.mdx`;

      if (inProd) {
        changes.push({ path: `content/insights/${fileName}`, content: mdxContent, encoding: 'utf-8' });
        if (isRename) deletions.push(`content/insights/${previousSlug}.${locale}.mdx`);
      } else {
        if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
        if (isRename) {
          const oldPath = path.join(CONTENT_DIR, `${previousSlug}.${locale}.mdx`);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        fs.writeFileSync(path.join(CONTENT_DIR, fileName), mdxContent, 'utf8');
      }
    }

    // Keep every other translation of this case (not edited in this save) in sync:
    // move it to the new slug on rename, and/or update its shared image/order.
    for (const locale of LOCALES) {
      if (localesToSave.includes(locale)) continue;
      const sourceFileName = isRename ? `${previousSlug}.${locale}.mdx` : `${slug}.${locale}.mdx`;
      const raw = readLocalFile(sourceFileName);
      if (!raw) continue;

      const siblingData = matter(raw).data;
      const siblingImage = siblingData.image || '';
      const siblingOrder = typeof siblingData.order === 'number' ? siblingData.order : null;
      const needsImageUpdate = siblingImage !== imageToSave;
      const needsOrderUpdate = siblingOrder !== (hasOrder ? parsedOrder : null);
      if (!isRename && !needsImageUpdate && !needsOrderUpdate) continue;

      let nextRaw = raw;
      if (needsImageUpdate) nextRaw = setFrontmatterImage(nextRaw, imageToSave);
      if (needsOrderUpdate) nextRaw = setFrontmatterOrder(nextRaw, hasOrder, parsedOrder);
      const destFileName = `${slug}.${locale}.mdx`;

      if (inProd) {
        changes.push({ path: `content/insights/${destFileName}`, content: nextRaw, encoding: 'utf-8' });
        if (isRename) deletions.push(`content/insights/${sourceFileName}`);
      } else {
        if (isRename) {
          const oldPath = path.join(CONTENT_DIR, sourceFileName);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        fs.writeFileSync(path.join(CONTENT_DIR, destFileName), nextRaw, 'utf8');
      }
    }

    // Leave a redirect behind so links/bookmarks to the old slug still resolve,
    // and repoint any earlier redirect that used to land on this slug.
    if (isRename && previousSlug) {
      const redirects = getInsightRedirects();
      for (const [from, to] of Object.entries(redirects)) {
        if (to === previousSlug) redirects[from] = slug;
      }
      redirects[previousSlug] = slug;
      const redirectsContent = JSON.stringify(redirects, null, 2) + '\n';

      if (inProd) {
        changes.push({ path: 'content/insight-redirects.json', content: redirectsContent, encoding: 'utf-8' });
      } else {
        fs.writeFileSync(REDIRECTS_PATH, redirectsContent, 'utf8');
      }
    }

    if (inProd) {
      await commitFiles(changes, deletions, `Save case: ${slug}`);
    }

    return NextResponse.json({
      success: true,
      slug,
      image: imageToSave,
      message: inProd ? 'Saved! Live in ~1-2 minutes once the site redeploys.' : 'Article saved successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}

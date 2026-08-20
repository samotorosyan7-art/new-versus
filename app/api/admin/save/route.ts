import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { commitFile, deleteFile, isProductionRuntime } from '@/lib/github-content';
import { slugify } from '@/lib/slugify';
import { getInsightRedirects } from '@/lib/mdx';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');
const REDIRECTS_PATH = path.join(process.cwd(), 'content', 'insight-redirects.json');
const LOCALES = ['en', 'hy', 'ru'];

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

async function writeCaseFile(fileName: string, mdxContent: string) {
  if (isProductionRuntime()) {
    await commitFile(`content/insights/${fileName}`, mdxContent, `Update insight: ${fileName}`);
    return;
  }
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  fs.writeFileSync(path.join(CONTENT_DIR, fileName), mdxContent, 'utf8');
}

async function deleteCaseFile(fileName: string) {
  if (isProductionRuntime()) {
    await deleteFile(`content/insights/${fileName}`, `Rename/remove insight: ${fileName}`);
    return;
  }
  const filePath = path.join(CONTENT_DIR, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

async function persistRedirects(redirects: Record<string, string>) {
  const content = JSON.stringify(redirects, null, 2) + '\n';
  if (isProductionRuntime()) {
    await commitFile('content/insight-redirects.json', content, 'Update case slug redirects');
    return;
  }
  fs.writeFileSync(REDIRECTS_PATH, content, 'utf8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, content, password, locale = 'en', order, image } = body;

    const parsedOrder = Number(order);
    const hasOrder = order !== undefined && order !== null && order !== '' && !Number.isNaN(parsedOrder);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    // The URL slug is a case-level id shared by every translation. It's only ever derived
    // from the title for a brand-new case (no previousSlug). Editing an existing case's
    // title must never silently change its slug — that used to delete the live file with
    // no redirect left behind, so any bookmarked/indexed link to it 404'd in prod.
    const previousSlug = typeof body.previousSlug === 'string' && body.previousSlug
      ? slugify(body.previousSlug)
      : null;
    const requestedSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const slug = slugify(requestedSlug || previousSlug || title);

    if (!slug) {
      return NextResponse.json({ error: 'Could not derive a URL slug — please provide a title or slug' }, { status: 400 });
    }

    const date = new Date().toISOString().split('T')[0];
    const orderLine = hasOrder ? `\norder: ${parsedOrder}` : '';
    const mdxContent = `---
title: "${title}"
date: "${date}"
tag: "Article"
excerpt: "${excerpt}"
isFeatured: false${orderLine}
image: "${image || ''}"
---

${content}
`;

    const fileName = `${slug}.${locale}.mdx`;
    const isRename = !!previousSlug && previousSlug !== slug;

    const oldFileNameForThisLocale = previousSlug ? `${previousSlug}.${locale}.mdx` : null;
    if (oldFileNameForThisLocale && oldFileNameForThisLocale !== fileName) {
      await deleteCaseFile(oldFileNameForThisLocale);
    }
    await writeCaseFile(fileName, mdxContent);

    if (isRename && previousSlug) {
      // Keep every other translation of this case on the same slug.
      for (const siblingLocale of LOCALES) {
        if (siblingLocale === locale) continue;
        const siblingOldName = `${previousSlug}.${siblingLocale}.mdx`;
        const siblingPath = path.join(CONTENT_DIR, siblingOldName);
        if (!fs.existsSync(siblingPath)) continue;

        const siblingRaw = fs.readFileSync(siblingPath, 'utf8');
        const siblingNewName = `${slug}.${siblingLocale}.mdx`;
        await deleteCaseFile(siblingOldName);
        await writeCaseFile(siblingNewName, siblingRaw);
      }

      // Leave a redirect behind so links/bookmarks to the old slug still resolve,
      // and repoint any earlier redirect that used to land on this slug.
      const redirects = getInsightRedirects();
      for (const [from, to] of Object.entries(redirects)) {
        if (to === previousSlug) redirects[from] = slug;
      }
      redirects[previousSlug] = slug;
      await persistRedirects(redirects);
    }

    // The case image is shared across every translation — keep siblings in sync
    // whenever it changes, regardless of which locale tab was saved.
    const finalImage = image || '';
    for (const siblingLocale of LOCALES) {
      if (siblingLocale === locale) continue;
      const siblingPath = path.join(CONTENT_DIR, `${slug}.${siblingLocale}.mdx`);
      if (!fs.existsSync(siblingPath)) continue;

      const siblingRaw = fs.readFileSync(siblingPath, 'utf8');
      const siblingImage = matter(siblingRaw).data.image || '';
      if (siblingImage === finalImage) continue;

      await writeCaseFile(`${slug}.${siblingLocale}.mdx`, setFrontmatterImage(siblingRaw, finalImage));
    }

    return NextResponse.json({
      success: true,
      slug,
      message: isProductionRuntime() ? 'Saved! Live in ~1-2 minutes once the site redeploys.' : 'Article saved successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}

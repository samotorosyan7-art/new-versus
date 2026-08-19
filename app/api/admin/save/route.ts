import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { commitFile, deleteFile, isProductionRuntime } from '@/lib/github-content';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, content, password, locale = 'en', oldFileName, order, image } = body;

    const parsedOrder = Number(order);
    const hasOrder = order !== undefined && order !== null && order !== '' && !Number.isNaN(parsedOrder);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0530-\u058F\u0400-\u04FF-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      // Fallback if slug is still empty
      const timestamp = new Date().getTime();
      return NextResponse.json({ error: 'Invalid title for slug generation' }, { status: 400 });
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

    if (isProductionRuntime()) {
      // Vercel's filesystem is read-only at runtime, so persist via a commit to
      // the GitHub repo instead — Vercel's git integration redeploys automatically.
      if (oldFileName && oldFileName !== fileName) {
        await deleteFile(`content/insights/${oldFileName}`, `Rename insight: ${oldFileName} -> ${fileName}`);
      }
      await commitFile(`content/insights/${fileName}`, mdxContent, `Update insight: ${title} (${locale})`);
      return NextResponse.json({ success: true, message: 'Saved! Live in ~1-2 minutes once the site redeploys.' });
    }

    const dirPath = path.join(process.cwd(), 'content', 'insights');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // If updating and filename changed, delete old
    if (oldFileName && oldFileName !== fileName && fs.existsSync(path.join(dirPath, oldFileName))) {
      fs.unlinkSync(path.join(dirPath, oldFileName));
    }

    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, mdxContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Article saved successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}

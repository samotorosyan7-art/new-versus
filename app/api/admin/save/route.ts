import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, content, password, locale = 'en', oldFileName } = body;

    if (password !== 'admin1211') {
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
    const mdxContent = `---
title: "${title}"
date: "${date}"
tag: "Article"
excerpt: "${excerpt}"
isFeatured: false
---

${content}
`;

    const dirPath = path.join(process.cwd(), 'content', 'insights');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // If updating and filename changed, delete old
    if (oldFileName && fs.existsSync(path.join(dirPath, oldFileName))) {
      const newFileName = `${slug}.${locale}.mdx`;
      if (oldFileName !== newFileName) {
        fs.unlinkSync(path.join(dirPath, oldFileName));
      }
    }

    const filePath = path.join(dirPath, `${slug}.${locale}.mdx`);
    fs.writeFileSync(filePath, mdxContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Article saved successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}

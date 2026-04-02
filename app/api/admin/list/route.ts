import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== 'admin1211') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dirPath = path.join(process.cwd(), 'content', 'insights');
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ posts: [] });
    }

    const files = fs.readdirSync(dirPath);
    const posts = [];

    for (const file of files) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

      const fullPath = path.join(dirPath, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);

      posts.push({
        fileName: file,
        title: data.title || 'Untitled',
        date: data.date || '',
        tag: data.tag || '',
        locale: file.match(/\.(en|hy|ru)\.mdx?$/)?.[1] || 'en',
      });
    }

    // Sort newest first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

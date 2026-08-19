import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function POST(req: Request) {
  try {
    const { password, fileName } = await req.json();

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullPath = path.join(process.cwd(), 'content', 'insights', fileName);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);

    return NextResponse.json({
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: content.trim(),
      order: typeof data.order === 'number' ? data.order : '',
      image: data.image || '',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

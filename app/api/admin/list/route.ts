import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const LOCALES = ['en', 'hy', 'ru'];

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dirPath = path.join(process.cwd(), 'content', 'insights');
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ cases: [] });
    }

    const files = fs.readdirSync(dirPath);
    const bySlug = new Map<string, Record<string, { title: string; date: string; order: number | null; image: string }>>();

    for (const file of files) {
      const match = file.match(/^(.+)\.(en|hy|ru)\.mdx?$/);
      if (!match) continue;
      const [, slug, locale] = match;

      const raw = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const { data } = matter(raw);

      if (!bySlug.has(slug)) bySlug.set(slug, {});
      bySlug.get(slug)![locale] = {
        title: data.title || 'Untitled',
        date: data.date || '',
        order: typeof data.order === 'number' ? data.order : null,
        image: data.image || '',
      };
    }

    const cases = Array.from(bySlug.entries()).map(([slug, translations]) => {
      const preferred = translations.en || translations.hy || translations.ru;
      return {
        slug,
        title: preferred?.title || slug,
        date: preferred?.date || '',
        order: preferred?.order ?? null,
        image: preferred?.image || '',
        locales: LOCALES.map((locale) => ({ locale, exists: !!translations[locale] })),
      };
    });

    // Sort: by manual order first (lower = earlier; unordered last), then newest first
    cases.sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ cases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

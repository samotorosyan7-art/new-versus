import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { commitFiles, isProductionRuntime } from '@/lib/github-content';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

export async function POST(req: Request) {
  try {
    const { password, fileNames } = await req.json();

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const names: string[] = Array.isArray(fileNames) ? fileNames.filter((n) => typeof n === 'string') : [];
    if (names.length === 0) {
      return NextResponse.json({ error: 'No files specified' }, { status: 400 });
    }

    if (isProductionRuntime()) {
      // Delete every locale file for this case as one commit, so a case delete
      // triggers exactly one deploy instead of one per translation.
      await commitFiles([], names.map((n) => `content/insights/${n}`), `Delete case: ${names.join(', ')}`);
      return NextResponse.json({ success: true, message: 'Deleted! Live in ~1-2 minutes once the site redeploys.' });
    }

    for (const fileName of names) {
      const fullPath = path.join(CONTENT_DIR, fileName);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

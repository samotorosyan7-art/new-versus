import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { deleteFile, isProductionRuntime } from '@/lib/github-content';

export async function POST(req: Request) {
  try {
    const { password, fileName } = await req.json();

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileName) {
        return NextResponse.json({ error: 'Filename missing' }, { status: 400 });
    }

    if (isProductionRuntime()) {
      await deleteFile(`content/insights/${fileName}`, `Delete insight: ${fileName}`);
      return NextResponse.json({ success: true, message: 'Deleted! Live in ~1-2 minutes once the site redeploys.' });
    }

    const fullPath = path.join(process.cwd(), 'content', 'insights', fileName);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return NextResponse.json({ success: true, message: 'Deleted successfully' });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

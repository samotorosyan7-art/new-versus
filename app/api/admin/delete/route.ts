import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { password, fileName } = await req.json();

    if (password !== 'admin1211') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileName) {
        return NextResponse.json({ error: 'Filename missing' }, { status: 400 });
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

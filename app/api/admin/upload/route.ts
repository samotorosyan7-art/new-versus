import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { commitBinaryFile, isProductionRuntime } from '@/lib/github-content';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// The GitHub Contents API (used to persist uploads in production) rejects files over 1MB.
const MAX_SIZE = 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get('password');
    const file = formData.get('file');
    const slugHint = String(formData.get('slug') || 'case');

    if (password !== (process.env.ADMIN_PASSWORD || 'admin1211')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = MIME_EXTENSIONS[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Unsupported image type. Use JPEG, PNG, WEBP, or GIF.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image is too large. Please keep it under 1MB.' }, { status: 400 });
    }

    const safeSlug = slugHint.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60) || 'case';
    const fileName = `${safeSlug}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicPath = `/uploads/cases/${fileName}`;

    if (isProductionRuntime()) {
      await commitBinaryFile(`public/uploads/cases/${fileName}`, buffer.toString('base64'), `Upload case image: ${fileName}`);
      return NextResponse.json({ success: true, path: publicPath, message: 'Uploaded! Live in ~1-2 minutes once the site redeploys.' });
    }

    const dirPath = path.join(process.cwd(), 'public', 'uploads', 'cases');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, fileName), buffer);

    return NextResponse.json({ success: true, path: publicPath, message: 'Uploaded successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 });
  }
}

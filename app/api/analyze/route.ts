import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';

function runPythonAnalysis(payload: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonExe = process.platform === 'win32' ? 'python' : 'python3';
    const scriptPath = path.join(process.cwd(), 'python', 'image_analysis.py');

    const py = spawn(pythonExe, [scriptPath, '--stdin'], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0 && !output) {
        reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
        return;
      }

      try {
        const parsed = JSON.parse(output.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse Python JSON output: ${output || errorOutput}`));
      }
    });

    py.stdin.write(payload);
    py.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch items or single item
    if (body.items && Array.isArray(body.items)) {
      const results = [];
      for (const item of body.items) {
        const payload = JSON.stringify({
          name: item.name || 'Contestant Palm',
          image_base64: item.image_base64 || item.previewUrl || ''
        });
        const analysis = await runPythonAnalysis(payload);
        results.push(analysis);
      }

      return NextResponse.json({
        status: 'success',
        count: results.length,
        results
      });
    }

    const payload = JSON.stringify({
      name: body.name || 'Contestant Palm',
      image_base64: body.image_base64 || body.image || ''
    });

    const analysis = await runPythonAnalysis(payload);
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('[API /api/analyze Error]:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error.message || 'An error occurred during Python OpenCV analysis'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data/contributors.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const contributors = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      count: contributors.length,
      data: contributors,
    }, {
      status: 200,
      headers: {
        // Allow CORS so other websites can fetch this data
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        // Cache heavily since contributors don't update every second
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contributors database' },
      { status: 500 }
    );
  }
}

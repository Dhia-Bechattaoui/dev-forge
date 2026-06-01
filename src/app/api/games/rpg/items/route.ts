import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data/rpg/items.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(fileContents);

    return NextResponse.json(
      { count: items.length, data: items },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load items data' },
      { status: 500 }
    );
  }
}

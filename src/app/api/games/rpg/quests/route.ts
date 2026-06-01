import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data/rpg/quests.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const quests = JSON.parse(fileContents);

    return NextResponse.json(
      { count: quests.length, data: quests },
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
      { error: 'Failed to load quests data' },
      { status: 500 }
    );
  }
}

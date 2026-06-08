import { NextRequest, NextResponse } from 'next/server';
import { toggleFavorite, isFavorite } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const decodedFileName = decodeURIComponent(fileName);
    
    const newFavoriteStatus = toggleFavorite(decodedFileName);

    return NextResponse.json({
      fileName: decodedFileName,
      isFavorite: newFavoriteStatus,
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];

  return NextResponse.json(
    {
      items,
      message: 'Items fetched successfully',
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Optionally add POST method to add items
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Here you would typically validate the input and save to a database
    // For this example, we'll just echo back the received data
    return NextResponse.json(
      {
        message: 'Item created successfully',
        data: body,
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid request body',
      },
      {
        status: 400,
      }
    );
  }
}

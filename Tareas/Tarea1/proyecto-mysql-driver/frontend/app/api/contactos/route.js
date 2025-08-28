// app/api/contactos/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Tu lógica para GET
    return NextResponse.json({ message: 'GET contactos' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Tu lógica para POST
    return NextResponse.json({ message: 'POST contactos', data: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
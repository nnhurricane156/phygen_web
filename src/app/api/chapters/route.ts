import { NextRequest, NextResponse } from 'next/server';

// GET /api/chapters - Fetch all chapters
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 Chapters API route called');
        
        // Get the API base URL from environment variables
        const apiBaseUrl = process.env.API_BASE_URL || 'http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api';
        
        // Get authorization header from the request
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        console.log('🔄 Making request to backend chapters endpoint...');
        
        // Forward the request to the backend API
        const response = await fetch(`${apiBaseUrl}/Chapters`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        console.log('📥 Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch chapters from backend' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Successfully fetched chapters');

        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error in chapters API route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/chapters - Create a new chapter
export async function POST(request: NextRequest) {
    try {
        console.log('🔍 Chapters POST API route called');
        
        const requestData = await request.json();
        console.log('📨 Request data:', requestData);
        
        // Get the API base URL from environment variables
        const apiBaseUrl = process.env.API_BASE_URL || 'http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api';
        
        // Get authorization header from the request
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        console.log('🔄 Making POST request to backend chapters endpoint...');
        
        // Forward the request to the backend API
        const response = await fetch(`${apiBaseUrl}/Chapters`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        console.log('📥 Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            return NextResponse.json(
                { error: 'Failed to create chapter in backend' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Successfully created chapter');

        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error in chapters POST API route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

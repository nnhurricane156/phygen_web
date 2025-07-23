import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log('🔍 Google login API route called');
        const requestData = await request.json();
        console.log('📨 Raw request data:', JSON.stringify(requestData, null, 2));
        
        const { uid, idToken, email, displayName, photoURL } = requestData;
        console.log('📨 Extracted data:', { 
            uid: uid,
            uidType: typeof uid,
            uidLength: uid?.length,
            hasIdToken: !!idToken, 
            email, 
            displayName, 
            photoURL: !!photoURL 
        });

        if (!uid || !email) {
            console.log('❌ Missing required fields');
            return NextResponse.json(
                { error: 'Firebase UID and email are required' },
                { status: 400 }
            );
        }

        // Use the backend's login-with-google endpoint with Firebase UID
        // If that fails, fallback to register + manual token creation
        
        console.log('✅ Using backend login-with-google endpoint...');
        
        const apiBaseUrl = process.env.API_BASE_URL || 'http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api';
        
        console.log('🔄 Making request to backend login-with-google...');
        const requestBody = {
            email: email,
            displayName: displayName,
            photoURL: photoURL
        };
        console.log('📤 Request body being sent:', JSON.stringify(requestBody, null, 2));
        console.log('📤 UID being sent as query parameter:', uid);
        
        // Send UID as query parameter, other data in body
        const response = await fetch(`${apiBaseUrl}/Auth/login-with-google?uid=${encodeURIComponent(uid)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('📡 Backend response status:', response.status);

        if (response.ok) {
            // Success - use backend response
            const contentType = response.headers.get('content-type');
            console.log('📡 Backend response content-type:', contentType);
            
            if (contentType?.includes('application/json')) {
                // Backend returned JSON
                const userData = await response.json();
                console.log('✅ Backend Google login JSON response:', userData);
                
                const actualData = userData.data || userData;
                return NextResponse.json({
                    isSuccess: userData.isSuccess || true,
                    message: userData.message || 'Google login successful',
                    data: {
                        accessToken: actualData.accessToken,
                        id: actualData.id,
                        email: actualData.email,
                        username: actualData.username || actualData.userName,
                        role: actualData.role,
                        identityId: actualData.identityId
                    }
                });
            } else {
                // Backend returned plain text (likely JWT token)
                const accessToken = await response.text();
                console.log('✅ Backend returned JWT token:', accessToken.substring(0, 50) + '...');
                
                // Create user data from our frontend data since backend only returned token
                const userData = {
                    id: uid,
                    email: email,
                    username: displayName || email.split('@')[0],
                    role: 1, // Default role for Google users
                    identityId: uid
                };
                
                return NextResponse.json({
                    isSuccess: true,
                    message: 'Google login successful',
                    data: {
                        accessToken: accessToken,
                        id: userData.id,
                        email: userData.email,
                        username: userData.username,
                        role: userData.role,
                        identityId: userData.identityId
                    }
                });
            }
        } else {
            // Backend Google login failed - try fallback approach
            console.log('⚠️ Backend Google login failed, trying fallback approach...');
            
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                errorData = { message: response.statusText || `HTTP ${response.status}` };
            }
            console.log('❌ Backend error response:', errorData);
            
            // Fallback: Try to register the user with regular endpoint
            console.log('🔄 Attempting fallback: Register Google user...');
            const userName = displayName?.replace(/[^a-zA-Z]/g, '') || email.split('@')[0].replace(/[^a-zA-Z]/g, '');
            const googlePassword = `Google123!${uid.slice(-4)}`; // Valid password with letter, number, special char
            
            try {
                const registerResponse = await fetch(`${apiBaseUrl}/Auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: userName,
                        email: email,
                        password: googlePassword
                    }),
                });

                if (registerResponse.ok || registerResponse.status === 400) {
                    // Registration succeeded or user already exists - try login
                    console.log('✅ Registration completed, attempting login...');
                    
                    const loginResponse = await fetch(`${apiBaseUrl}/Auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: googlePassword
                        }),
                    });

                    if (loginResponse.ok) {
                        const loginData = await loginResponse.json();
                        console.log('✅ Fallback login successful:', loginData);
                        return NextResponse.json(loginData);
                    }
                }
            } catch (fallbackError) {
                console.error('❌ Fallback approach failed:', fallbackError);
            }
            
            // If all else fails, return the original error
            return NextResponse.json(
                { error: errorData.message || errorData.title || 'Google login failed' },
                { status: response.status }
            );
        }

    } catch (error) {
        console.error('❌ Google login API error:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

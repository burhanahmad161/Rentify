import { createUser, isValidUser, getUserId, verifyToken,getAllUsers } from '../../../lib/actions/Users';

// Define the POST request handler
export const POST = async (req) => {
  try {
    // Extract the data from the request body
    const { email, password, action,username } = await req.json();

    // Handle 'signin' action
    if (action === 'login') {
      console.log("Signing in user:", { email, password });
      const result = await isValidUser(email, password);
      console.log(result);
      if (result.valid) {
        return new Response(
          JSON.stringify({ 
            success: true,
             token: result.token,
             userId: result.userId
            }), // Send token in response
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { status: 401 }
        );
      }
    }

    // Handle 'getId' action
    if (action === 'getId') {
      const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from 'Authorization' header
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token missing' }),
          { status: 401 }
        );
      }
      console.log('Verifying token in Route:', token);
      const decoded = verifyToken(token); // Verify the token
      if (!decoded) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 401 }
        );
      }

      console.log('Verified User ID:', decoded.userId);
      return new Response(
        JSON.stringify({ userId: decoded.email }),
        { status: 200 }
      );
    }

    // Handle 'signup' action
    if (action === 'register') {
      console.log('Creating user:', { email,password,username });
      // Ensure you're passing all the necessary fields to createUser
      const newUser = await createUser({ email, password,username });
      return new Response(
        JSON.stringify(newUser),
        { status: 201 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
};

// ✅ GET Handler to fetch all registered users
export const GET = async () => {
  try {
    const users = await getAllUsers(); // Should return array of { username, email, userId }
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
};
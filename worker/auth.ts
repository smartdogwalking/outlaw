// Simplified authentication backend routes
import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";

const authApp = new Hono<{ Bindings: Env }>();

// Start OAuth flow
authApp.post('/oauth/start', async (c) => {
  const provider = c.req.query('provider');
  const mode = c.req.query('mode') || 'signin';
  
  console.log(`🔐 Starting OAuth for ${provider} in ${mode} mode`);
  
  try {
    // Check environment variables
    if (!c.env.MOCHA_USERS_SERVICE_API_URL || !c.env.MOCHA_USERS_SERVICE_API_KEY) {
      console.error('🔐 Missing OAuth environment variables');
      return c.json({ 
        success: false,
        error: 'Authentication service not configured'
      }, 500);
    }

    // Import and use Mocha users service
    const { getOAuthRedirectUrl } = await import("@getmocha/users-service/backend");
    
    const config = {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY
    };

    console.log('🔐 Getting OAuth redirect URL...');
    const redirectUrl = await getOAuthRedirectUrl(provider as 'google', config);
    
    if (!redirectUrl) {
      throw new Error('Failed to get OAuth redirect URL');
    }
    
    console.log('🔐 OAuth URL generated successfully');
    return c.json({ 
      success: true,
      redirectUrl 
    });
    
  } catch (error) {
    console.error('🔐 OAuth start error:', error);
    return c.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Authentication service unavailable'
    }, 500);
  }
});

// OAuth callback handler
authApp.get('/oauth/callback', async (c) => {
  console.log('🔐 OAuth callback received');
  
  const code = c.req.query('code');
  const error = c.req.query('error');
  const mode = c.req.query('mode') || 'signin';
  
  // Handle OAuth errors
  if (error) {
    console.error('🔐 OAuth error:', error);
    return c.redirect(`/auth/callback?error=${encodeURIComponent(error)}&mode=${mode}`);
  }
  
  if (!code) {
    console.error('🔐 No authorization code');
    return c.redirect(`/auth/callback?error=no_code&mode=${mode}`);
  }
  
  // Redirect to frontend callback handler
  return c.redirect(`/auth/callback?code=${encodeURIComponent(code)}&mode=${mode}`);
});

// Create session from auth code  
authApp.post('/sessions', async (c) => {
  console.log('🔐 Creating session from auth code');
  
  try {
    const body = await c.req.json();
    
    if (!body?.code) {
      return c.json({ success: false, error: "Authorization code required" }, 400);
    }

    const { 
      exchangeCodeForSessionToken, 
      MOCHA_SESSION_TOKEN_COOKIE_NAME 
    } = await import("@getmocha/users-service/backend");
    
    const config = {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY
    };

    console.log('🔐 Exchanging code for session token...');
    const sessionToken = await exchangeCodeForSessionToken(body.code, config);
    
    if (!sessionToken) {
      return c.json({ success: false, error: "Failed to create session" }, 400);
    }

    // Set secure session cookie
    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    console.log('🔐 Session created successfully');
    
    // Create user profile if this is a new user
    try {
      const { authMiddleware } = await import("@getmocha/users-service/backend");
      await authMiddleware(c, async () => {});
      const user = c.get("user");
      
      if (user?.id) {
        // Check if profile exists, create if not
        let profile = await c.env.DB.prepare(
          "SELECT * FROM user_profiles WHERE user_id = ?"
        ).bind(user.id).first();

        if (!profile) {
          await c.env.DB.prepare(
            "INSERT INTO user_profiles (user_id) VALUES (?)"
          ).bind(user.id).run();
          
          // Create free subscription
          await c.env.DB.prepare(`
            INSERT INTO user_subscriptions (user_id, subscription_type, is_active)
            VALUES (?, 'free', 1)
          `).bind(user.id).run();
        }
      }
    } catch (profileError) {
      console.warn('🔐 Profile creation error (non-critical):', profileError);
    }

    return c.json({ success: true });
    
  } catch (error) {
    console.error('🔐 Session creation error:', error);
    return c.json({ success: false, error: "Authentication failed" }, 500);
  }
});

// Get current user
authApp.get('/me', async (c) => {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    
    await authMiddleware(c, async () => {});
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }
    
    return c.json(user);
    
  } catch (error) {
    return c.json({ error: "Authentication failed" }, 401);
  }
});

// Logout
authApp.post('/logout', async (c) => {
  try {
    const { MOCHA_SESSION_TOKEN_COOKIE_NAME } = await import("@getmocha/users-service/backend");

    deleteCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('🔐 Logout error:', error);
    return c.json({ success: true }); // Always succeed logout
  }
});

export default authApp;

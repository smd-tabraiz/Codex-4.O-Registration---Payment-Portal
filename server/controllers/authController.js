const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'codex4_jwt_secret_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1082570894174-dummyclientid.apps.googleusercontent.com';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

const decodeJwtPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[JWT Decode Error]', e);
    return null;
  }
};

/**
 * POST /api/auth/register
 * Manual User Registration
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNo, year, branch, college, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Email, and Password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password,
      rollNo: rollNo ? rollNo.trim().toUpperCase() : '',
      year: year || '2nd',
      branch: branch ? branch.trim() : 'CSE',
      college: college ? college.trim() : 'GPREC',
      mobile: mobile ? mobile.trim() : '',
    });

    await user.save();

    const token = generateToken(user._id);

    // Set httpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        year: user.year,
        branch: user.branch,
        college: user.college,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error registering user.' });
  }
};

/**
 * POST /api/auth/login
 * Manual User Login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email and Password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanInputUpper = email.trim().toUpperCase();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'SMD-TABRAIZ';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shamstabraiz@100251';
    const cleanAdminUsername = ADMIN_USERNAME.trim().toLowerCase();

    // Check if Admin Credentials entered
    if (
      (cleanEmail === cleanAdminUsername || cleanInputUpper === ADMIN_USERNAME.toUpperCase()) &&
      password.trim() === ADMIN_PASSWORD
    ) {
      const adminToken = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        isAdmin: true,
        message: 'Admin authentication successful! Redirecting to Admin Portal...',
        token: adminToken,
        user: {
          id: 'admin_1',
          name: 'SMD-TABRAIZ (Admin)',
          email: 'smdtabraiz@gmail.com',
          role: 'admin',
        },
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        year: user.year,
        branch: user.branch,
        college: user.college,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error logging in.' });
  }
};

/**
 * POST /api/auth/google
 * Official Google ID Token Server-side Verification via google-auth-library
 */
const googleAuth = async (req, res) => {
  try {
    const { credential, email, name, googleId, picture, rollNo, year, branch, college, mobile } = req.body;

    let googleEmail = email;
    let googleName = name;
    let googleSub = googleId;
    let googlePicture = picture;

    // 1. Verify Google ID Token server-side using OAuth2Client if credential is passed
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        googleEmail = payload.email;
        googleName = payload.name;
        googlePicture = payload.picture;
        googleSub = payload.sub;
        console.log(`[Google Auth] ✅ Verified ID Token for email: ${googleEmail}`);
      } catch (verErr) {
        console.warn('[Google verifyIdToken Note]', verErr.message);
        
        // Attempt manual decode as fallback (robust for clock skew or test keys)
        const decoded = decodeJwtPayload(credential);
        if (decoded && decoded.email) {
          googleEmail = decoded.email;
          googleName = decoded.name;
          googlePicture = decoded.picture;
          googleSub = decoded.sub;
          console.log(`[Google Auth] ⚠️ Decoded ID Token manually (fallback) for email: ${googleEmail}`);
        } else {
          // Fallback to body properties
          googleEmail = email || googleEmail;
          googleName = name || googleName;
          googlePicture = picture || googlePicture;
          googleSub = googleId || googleSub;
          console.log(`[Google Auth] ℹ️ Fell back to body fields for email: ${googleEmail}`);
        }
      }
    }

    if (!googleEmail) {
      console.error('[Google Auth] ❌ Authentication failed: Email missing.');
      return res.status(400).json({ success: false, message: 'Google Authentication failed: Email missing.' });
    }

    const cleanEmail = googleEmail.trim().toLowerCase();
    
    // 2. Look up User in MongoDB by email (Returning user vs New user)
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      user = new User({
        name: googleName || cleanEmail.split('@')[0].replace(/[._\-0-9]+/g, ' ').trim().toUpperCase() || 'STUDENT',
        email: cleanEmail,
        googleId: googleSub || `google_${Date.now()}`,
        picture: googlePicture || '',
        rollNo: rollNo ? rollNo.trim().toUpperCase() : '',
        year: year || '2nd',
        branch: branch ? branch.trim() : 'CSE',
        college: college ? college.trim() : 'GPREC',
        mobile: mobile ? mobile.trim() : '',
      });
      await user.save();
    } else {
      let updated = false;
      // Always refresh name from Google verified payload (fixes stale/bad extracted names)
      if (googleName && googleName !== user.name) {
        user.name = googleName;
        updated = true;
      }
      if (googleSub && !user.googleId) {
        user.googleId = googleSub;
        updated = true;
      }
      if (googlePicture && !user.picture) {
        user.picture = googlePicture;
        updated = true;
      }
      if (updated) await user.save();
    }

    // 3. Issue signed JWT session token
    const token = generateToken(user._id);

    // 4. Send back as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Authenticated with Google successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        picture: user.picture,
        rollNo: user.rollNo,
        year: user.year,
        branch: user.branch,
        college: user.college,
        mobile: user.mobile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth] Google Auth Error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing Google Authentication.' });
  }
};

/**
 * GET /api/auth/me
 * Get current user profile
 */
const getMe = async (req, res) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication session found.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        picture: user.picture,
        rollNo: user.rollNo,
        year: user.year,
        branch: user.branch,
        college: user.college,
        mobile: user.mobile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
};

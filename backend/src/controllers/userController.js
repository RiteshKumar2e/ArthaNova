import prisma from '../models/db.js';

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { full_name, bio, phone, avatar_url, risk_profile, theme, preferred_currency } = req.body;
  
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        full_name,
        bio,
        phone,
        avatar_url,
        risk_profile,
        theme,
        preferred_currency,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to update profile" });
  }
};

export const listUsers = async (req, res) => {
  // Only admin should list all users, but frontend uses it for some reason?
  // Let's assume it's for admin or limited
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to fetch users" });
  }
};

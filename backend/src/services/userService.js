import prisma from '../models/db.js';

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const updateUserLastLogin = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { last_login: new Date() },
  });
};

export const updateUserPassword = async (id, hashedPassword) => {
  return await prisma.user.update({
    where: { id },
    data: { hashed_password: hashedPassword },
  });
};

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/client';
import { signToken } from '../utils/jwt';
import { SignupDTO, LoginDTO } from '../dtos/auth.dto';
import { AuthRequest } from '../types/express';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const result = SignupDTO.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { firstName, lastName, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ message: 'Email already in use.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'ATTENDANT', 
    },
  });

  res.status(201).json({
  message: 'User created successfully.',
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  },
  });
  return;
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = LoginDTO.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials.' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({ message: 'Invalid password.' });
    return;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // You could do logging or token blacklisting here if needed
  res.status(200).json({ message: 'Logged out successfully.' });
};


export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getAttendants = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendants = await prisma.user.findMany({
      where: {
        role: 'ATTENDANT',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({ attendants });
  } catch (error) {
    console.error('Error fetching attendants:', error);
    res.status(500).json({ message: 'Failed to fetch attendants.' });
  }
};


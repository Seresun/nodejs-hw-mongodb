import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/User.js';

import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
} from '../services/auth.js';
import { sendResetEmail } from '../services/emailService.js';

/**
 * Регистрация пользователя
 */
const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Вход пользователя
 */
const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление access-токена
 */
const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Выход пользователя (logout)
 */
const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Отправка email для сброса пароля
 */
const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Проверяем, существует ли пользователь
    const user = await UsersCollection.findOne({ email }); // ✅ Используем UsersCollection
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Генерируем JWT токен на 5 минут
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    // Отправляем email с токеном
    await sendResetEmail(email, token);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Сброс пароля пользователя
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Проверяем токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const { email } = decoded;

    // Проверяем, существует ли пользователь
    const user = await UsersCollection.findOne({ email }); // ✅ Используем UsersCollection
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Хешируем новый пароль
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Экспорт всех функций (без дублирования!)
 */
export {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  sendResetPasswordEmail,
  resetPassword,
};

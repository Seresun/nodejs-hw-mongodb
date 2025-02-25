import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/User.js';
import { SessionsCollection } from '../db/models/Session.js';
import { randomBytes } from 'crypto';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Создает новую сессию с accessToken и refreshToken
 */
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

/**
 * Регистрация пользователя
 */
const registerUser = async (payload) => {
  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }

  const userExists = await UsersCollection.findOne({ email });
  if (userExists) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    ...payload,
    email,
    password: hashedPassword,
  });
};

/**
 * Вход пользователя
 */
const loginUser = async (payload) => {
  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }

  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

/**
 * Обновление сессии (refresh token)
 */
const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

/**
 * Выход пользователя (logout)
 */
const logoutUser = async (sessionId) => {
  if (!sessionId) {
    throw createHttpError(400, 'Session ID is required');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });
};

/**
 * ✅ Экспорт всех функций (ОДИН раз)
 */
export { registerUser, loginUser, refreshUsersSession, logoutUser };

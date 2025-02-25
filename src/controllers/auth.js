import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
} from '../services/auth.js';

/**
 * Регистрация пользователя
 */
export const registerUserController = async (req, res, next) => {
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
export const loginUserController = async (req, res, next) => {
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
      message: 'Successfully logged in an user!',
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
export const refreshUserSessionController = async (req, res, next) => {
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
export const logoutUserController = async (req, res, next) => {
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

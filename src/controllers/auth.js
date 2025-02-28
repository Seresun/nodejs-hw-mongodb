import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
  requestResetToken,
  resetPassword as resetPasswordService,
} from '../services/auth.js';

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
    await requestResetToken(req.body.email);
    res.json({
      status: 200,
      message: 'Reset password email sent successfully!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Сброс пароля пользователя
 */
const resetPasswordController = async (req, res, next) => {
  try {
    await resetPasswordService(req.body);
    res.json({
      status: 200,
      message: 'Password reset successfully!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Экспорт всех функций (без дублирования)
 */
export {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  sendResetPasswordEmail,
  resetPasswordController,
};

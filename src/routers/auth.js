import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  sendResetPasswordEmail,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validate.js';
import {
  registerUserSchema,
  loginUserSchema,
  emailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// Регистрация пользователя
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

// Вход пользователя
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

// Обновление access-токена
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

// Выход пользователя
router.post('/logout', ctrlWrapper(logoutUserController));

// Отправка email для сброса пароля
router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  ctrlWrapper(sendResetPasswordEmail)
);

// Сброс пароля
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

export default router;

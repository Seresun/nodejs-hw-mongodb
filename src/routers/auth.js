import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  sendResetPasswordEmail,
  resetPassword,
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

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  ctrlWrapper(sendResetPasswordEmail)
);
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPassword));

export default router;

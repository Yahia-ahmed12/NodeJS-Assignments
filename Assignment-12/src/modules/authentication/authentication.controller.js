import { Router } from "express";
import {
  signup,
  login,
  signupWithGmail,
  confirmEmail,
  resendConfirmEmail,
  requestForgotPasswordCode,
  verifyForgotPasswordCode,
  resetForgotPassword,
} from "./authentication.service.js";
import { successResponse } from "../../common/utils/success.respose.js";
import * as validators from "./authentication.validation.js";
import { validation } from "../../middleware/index.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    try {
      const data = await signup(req.validate.body);
      return successResponse({ res, status: 201, data });
    } catch (error) {
      next(error);
    }
  },
);
router.patch(
  "/confirm-email",
  validation(validators.confirmEmail),
  async (req, res, next) => {
    try {
      const data = await confirmEmail(req.body);
      return successResponse({ res, status: 200, data });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/request-forgot-password-code",
  validation(validators.resendConfirmEmail),
  async (req, res, next) => {
    try {
      const data = await requestForgotPasswordCode(req.body);
      return successResponse({ res, status: 201, data });
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  "/verify-forgot-password",
  validation(validators.confirmEmail),
  async (req, res, next) => {
    try {
      const data = await verifyForgotPasswordCode(req.body);
      return successResponse({ res, status: 200, data });
    } catch (error) {
      next(error);
    }
  },
);
router.patch(
  "/reset-forgot-password",
  validation(validators.resetForgotPassword),
  async (req, res, next) => {
    try {
      const data = await resetForgotPassword(req.body);
      return successResponse({ res, status: 200, data });
    } catch (error) {
      next(error);
    }
  },
);
router.patch(
  "/resend-confirm-email",
  validation(validators.resendConfirmEmail),
  async (req, res, next) => {
    try {
      const data = await resendConfirmEmail(req.body);
      return successResponse({ res, status: 200, data });
    } catch (error) {
      next(error);
    }
  },
);
router.post("/signup-with-gmail", async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.host}`;

    const result = await signupWithGmail(req.body, issuer);

    const statusCode = result.isNewUser ? 201 : 200;

    return successResponse({
      res,
      status: statusCode,
      data: result.tokens,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validation(validators.login), async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.host}`;
    const data = await login(req.validate.body, issuer);

    return successResponse({ res, data });
  } catch (error) {
    next(error);
  }
});
export default router;

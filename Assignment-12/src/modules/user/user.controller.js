import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import {
  logout,
  profile,
  rotateToken,
  update,
  updateProfileImageService,
} from "./user.service.js";
import {
  authentication,
  authorization,
  uploadMiddleware,
} from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/enum/token-security.enum.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { fileValidation, localFileUpload } from "../../common/utils/index.js";
const router = Router();

router.patch(
  "/profile-image",
  authentication(),

  uploadMiddleware({
    multerMiddleware: localFileUpload({
      maxFileSize: 3,
      validation: fileValidation.image,
    })
      // single("attachments"),
      .array("attachments", 2),

    customPath: "users",
    validation: fileValidation.image,
  }),

  async (req, res, next) => {
    try {
      const updatedUser = await updateProfileImageService({
        userId: req.user._id,
        file: req.file,
      });

      return successResponse({
        res,
        message: "Profile image updated successfully",
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  },
);
router.get(
  "/",
  authentication(TokenTypeEnum.ACCESS),
  async (req, res, next) => {
    try {
      const data = await profile(req.user._id);
      return successResponse({
        res,
        message: "Profile retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);
router.patch(
  "/",
  authentication(),
  authorization(RoleEnum.USER),
  async (req, res, next) => {
    try {
      const data = await update(req.user, req.body);

      return successResponse({
        res,
        message: "Profile updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  "/rotate-token",
  authentication(TokenTypeEnum.REFRESH),
  async (req, res, next) => {
    try {
      const data = await rotateToken(
        req.payload,
        req.user,
        `${req.protocol}://${req.get("host")}`,
      );

      return successResponse({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);
router.post("/logout", authentication(), async (req, res, next) => {
  try {
    const data = await logout(req.payload, req.user, req.body);

    return successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;

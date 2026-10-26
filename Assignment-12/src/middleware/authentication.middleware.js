import { TokenTypeEnum } from "../common/enum/token-security.enum.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../common/exceptions/global-error.exception.js";
import { basicAuth, decodeToken } from "../common/security/token.security.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw UnauthorizedException({ message: "Unauthorized Account" });
    }

    const [key, credential] = authorization.split(" ") || [];

    switch (key) {
      case "Bearer": {
        if (!credential) {
          throw UnauthorizedException({
            message: "Missing Bearer token credential",
          });
        }

        const { user, payload } = await decodeToken({
          authorization,
          tokenType,
        });

        req.user = user;
        req.payload = payload;
        break;
      }

      case "Basic": {
        const [email, password] = Buffer.from(credential, "base64")
          .toString()
          .split(":");

        if (!email || !password) {
          throw UnauthorizedException({
            message: "Invalid Basic authentication credentials format",
          });
        }

        const user = await basicAuth({ email, password });

        req.user = user;
        break;
      }

      default:
        throw UnauthorizedException({
          message: "Unsupported authentication type",
        });
    }

    next();
  };
};
export const authorization = (accessRoles) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException("Forbidden Account");
    }
    next();
  };
};

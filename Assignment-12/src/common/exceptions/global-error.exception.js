export const ApplicationException = ({
  message = "error",
  options = {
    cause: { status: 400 },
  },
  issues,
} = {}) => {
  const error = new Error(message, options);

  if (issues) {
    error.issues = issues;
  }

  throw error;
};

export const ConflictException = ({
  message = "conflict",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 409, ...extra },
    },
  });
};

export const UnauthorizedException = ({
  message = "Unauthorized",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 401, ...extra },
    },
  });
};

export const ForbiddenException = ({
  message = "Forbidden",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 403, ...extra },
    },
  });
};

export const NotFoundException = ({
  message = "Resource Not Found",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 404, ...extra },
    },
  });
};

export const BadException = ({
  message = "Bad request exception",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 400, ...extra },
    },
  });
};
export const TooManyRequestException = ({
  message = "Too many requests, please try again later",
  issues,
  extra,
} = {}) => {
  return ApplicationException({
    message,
    issues,
    options: {
      cause: { status: 429, ...extra },
    },
  });
};

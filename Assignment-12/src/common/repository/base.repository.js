export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
  const doc = model.findOne(filter);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  if (options.lean) {
    doc.lean();
  }

  return await doc.exec();
};
export const create = async ({
  model,
  data = [{}],
  options = { validateBeforeSave: true },
} = {}) => {
  return await model.create(data, options);
};

export const createOne = async ({
  model,
  data = {},
  options = { validateBeforeSave: true },
} = {}) => {
  const [doc] = await create({ model, data: [data], options });
  return doc;
};
export const findById = async ({ id, options = {}, select = "", model }) => {
  const doc = model.findById(id);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  if (options.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};
export const find = async ({ filter = {}, options = {}, model } = {}) => {
  const doc = model.find(filter);

  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  if (options.skip) {
    doc.skip(options.skip);
  }
  if (options.limit) {
    doc.limit(options.limit);
  }
  if (options.page && options.size) {
    doc.skip((options.page - 1) * options.size).limit(options.size);
  }

  return await doc.exec();
};
export const insertMany = async ({ model, docs = [], options = {} } = {}) => {
  return await model.insertMany(docs, options);
};

export const updateOne = async ({ filter, update, options, model } = {}) => {
  return await model.updateOne(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    options,
  );
};
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
  model,
} = {}) => {
  return await model.findOneAndUpdate(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );
};
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true, runValidators: true },
  model,
} = {}) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    options,
  );
};

export const deleteOne = async ({ filter, model } = {}) => {
  return await model.deleteOne(filter || {});
};

export const deleteMany = async ({ filter, model } = {}) => {
  return await model.deleteMany(filter || {});
};
export const findOneAndDelete = async ({
  filter,
  options = {},
  select = "",
  model,
} = {}) => {
  const doc = model.findOneAndDelete(filter || {}, options);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }

  return await doc.exec();
};

export const findByIdAndDelete = async ({
  id,
  options = {},
  select = "",
  model,
} = {}) => {
  const doc = model.findByIdAndDelete(id, options);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }

  return await doc.exec();
};

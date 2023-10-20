const saveError = async (err) => {
  const newError = await ErrorStack.create({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

  return newError.id;
};

saveError(new Error("Test Error"));

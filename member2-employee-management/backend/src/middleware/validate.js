const validate = (schema) => async (req, res, next) => {
  try {
    const parsedParams = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    // Update req with validated/transformed data if needed
    req.body = parsedParams.body;
    req.query = parsedParams.query;
    req.params = parsedParams.params;
    next();
  } catch (error) {
    next(error); // Pass ZodError to errorHandler
  }
};

module.exports = validate;

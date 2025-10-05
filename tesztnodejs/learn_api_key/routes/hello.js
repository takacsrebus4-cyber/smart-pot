async function hello(req, res, next) {
  try {
    const helloMessage = { msg: "Hello, World!" };

    res.json(helloMessage);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export default hello;
exports.getProtectedData = (req, res) => {
  res.json({
    message: "You have access to protected data",
    userId: req.user.userId
  });
};

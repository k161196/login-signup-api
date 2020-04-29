const router = require("express").Router();

const userController = require("../controllers/user.controller");
let middleware = require("../middlewares/authMiddleware");

let User = require("../models/user.model");

// router.route("/").get();
router.get("/", userController.getUsers);

// router.route("/add").post();
// router.post('/add',userController.postAddUser);
// router.patch('/update/:id',userController.patchUpdateUser);
router.patch(
  "/update/:id",
  middleware.checkToken,
  userController.patchUpdateUser
);

module.exports = router;

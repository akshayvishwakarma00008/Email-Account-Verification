const router = require("express").Router();
const { registerUser,verifyUser } = require("../controller/userController")

router.post("/", registerUser);
router.get("/:id/verify/:token/",verifyUser)

module.exports = router;
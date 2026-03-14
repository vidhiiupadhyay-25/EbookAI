const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
} = require("../controllers/bookController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.use(protect);


router.put("/cover/:id", upload.single("coverImage"), updateBookCover);

router.route("/")
  .post(createBook)
  .get(getBooks);

router.route("/:id")
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;

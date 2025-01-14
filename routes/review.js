const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../untils/wrapAsync.js");  
const ExpressError = require("../untils/ExpressError.js"); 
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middelware.js");


const review = require("../model/review.js");
const { createReview, destroyReview } = require("../controlers/review.js");

//post  review route
router.post("/", isLoggedIn,validateReview,wrapAsync(createReview));

//delete reviews route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(destroyReview));

module.exports = router;
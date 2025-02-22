const { model } = require("mongoose");
const Listing = require("../model/listing");
const Review = require("../model/review");

module.exports.createReview = async(req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created")

    res.redirect(`/listings/${listing._id}`)
};

module.exports.destroyReview = async(req,res) => {
    let {id,reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)

    // Listing.deleteOne({id});


    req.flash("success", " Review deleted")

    res.redirect(`/listings/${id}`)
};
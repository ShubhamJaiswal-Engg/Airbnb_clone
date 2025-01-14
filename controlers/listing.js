const { model } = require("mongoose");
const Listing = require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { link } = require("joi");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) => {
    const allListing = await Listing.find({});
     res.render("listings/index.ejs",{allListing});
 };

 module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"},})
    .populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested for does not exit");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapToken: process.env.MAP_TOKEN});
};

module.exports.createListing = async(req,res,next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1, 
      })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename);
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exit");
        res.redirect("/listings");
     }

     let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
        // console.log("Original Image URL:", originalImageUrl);

    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, updatedData);
     if(typeof req.file !== undefined){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
     }
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
};
 module.exports.destroyListing = async(req,res) => {
     let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     req.flash("success", "Listing Delete");
     res.redirect("/listings");
 };
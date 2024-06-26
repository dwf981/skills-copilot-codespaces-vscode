// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install ejs
// npm install method-override
// npm install express-sanitizer
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// App config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);

// RESTful routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE route
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//for all articles

app.route("/articles")

    .get(function (req, res) { 
    Article.find(function (err, foundArticles) { 
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
     })
 })
    
    .post(function (req, res) { 

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err) { 
        if(!err){
            res.send("successfully added");
        }
        else {
            res.send(err);
        }
     });
 })
    
    .delete(function (req, res) { 
    Article.deleteMany(function (err) { 
        if(!err){
            res.send("deleted everything");
        }
        else {
            res.send(err);
        }
     })
 });

//for a specific article

app.route("/articles/:articleTitle")

 .get(function (req, res) { 


    Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) { 
        if(foundArticle){
            res.send(foundArticle);
        }
        else {
            res.send("no articles found");
        }
     });
  })

  .put(function (req, res) { 

    Article.findOneAndReplace(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function (err) { 
            if(!err){
                res.send("succesfully replaced and updated");
            }
            else {
                res.send(err);
            }
         }
        );
   })

  .patch (function (req, res) { 
    Article.updateMany(
        {title: req.params.articleTitle},
        {$set: req.body},
        function (err) { 
            if(!err){
                res.send("successfully updated");
            }
            else{
                res.send(err);
            }
         }
    );
   })
   
   .delete(function (req, res) { 
    Article.deleteOne(
        {title: req.params.articleTitle},
        function (err) { 
            if(!err){
                res.send("deleted, it gone");
            }
            else{
                res.send(err);
            }
         }
        );
    })

app.listen(3000, function () { 
    console.log("server is up on 3000, pogly");
 })
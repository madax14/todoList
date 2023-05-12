const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-diego:diego1405@cluster0.4vvyigg.mongodb.net/todolistDb");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.set("view engine", "ejs");


const itemSchema = new mongoose.Schema({
    Name: {type: String}
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = {
    name: String,
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

const item1 = new Item({
    Name: "Welcome  to your todo list"
});
const item2 = new Item({
    Name: "Hit the + button to add a new item"
});
const item3 = new Item({
    Name: "<-- Hit this to delete an item"
});

const deffaultItems = [item1, item2, item3];

// let newItem = [];
// let workItems = [];


app.get("/", function(req, res) {
    Item.find({})
    .then((foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(deffaultItems);
            res.redirect("/")
       } else {
           res.render("list", {listTittle : "Today", newList : foundItems });
       }
    })
});

// created a Route parameters that each name will be the todo Tittle
// Created a new listSchema that the items is the the ItemSchema (the items inside the ItemSchema)

app.get("/:listName", function(req, res) {

    const CustumlistName = req.params.listName;
    
    List.findOne({name:CustumlistName})
        .then((foundList) => {
            //check if the list exist or not, to not duplicate, foundList is the result from findOne
        if (!foundList) {
            //if don't exist: Create a new list
            const list = new List({
                name: CustumlistName,
                items: deffaultItems
            });
            list.save();
            //save and redirect, to pass the code again. This time, 
            //the list will exist and goes to ELSE statement, where it will render
            res.redirect("/" + CustumlistName);
        } else {
            //Show an existing list
            res.render("list", {listTittle : foundList.name, newList : foundList.items });
        } 
    })    
});

app.post("/", function(req, res) {

    const itemName = req.body.newTask;

    //To get the name of the tittle of each page - 
    const listName = req.body.list;

    const item = new Item({
        Name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name:listName})
        .then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        });
    }


});

app.post("/delete", function(req, res) {

    const checkboxItemId = req.body.checkbox;
    const listNameTittle = req.body.tittleName;
    

    if (listNameTittle === "Today") {
        Item.findByIdAndRemove(checkboxItemId)
        .then(res.redirect("/"));

    } else {
        List.findOneAndUpdate({name: listNameTittle}, {$pull:{items: {id: checkboxItemId}}})
        .then(res.redirect("/" + listNameTittle));
    }
    
    
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.listen(5000, function() {
    console.log("Running on port 5000");
});
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _=require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let day = date.getDate()



mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your Todolist"
});

const item2 = new Item({
    name: "Hit + to add Lists"
});

const item3 = new Item({
    name: "Hit - to delete Lists"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {
    let day = date.getDate()


    Item.find({}, (err, foundItems) => {
        if (foundItems.length == 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log("There is an error");
                } else {
                    console.log("Sucelly added");
                }
            });
            res.redirect('/ ')

        }
        else {
            res.render("list", { listTitle: day, newListItems: foundItems })
        }
    })


});

app.post("/", (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;
    let day = date.getDate()

    const item = new Item({
        name: itemName
    });

    if (listName == day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        });
    }


});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName= req.body.listName;

    if (listName==day){
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                console.log("Sucessfully deleted");
                res.redirect("/");
            }
        });

    } else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},(err,foundList)=>{
            if(!err){
                res.redirect("/"+listName); 
            }
        })
    }

});


app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                //Crete a new list

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show Existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    })


});

// app.post("/work", (req, res) => {

//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })
app.listen(3000, () => {
    console.log("Server Running ok");
})
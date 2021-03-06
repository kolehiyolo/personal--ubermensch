// * NODE DEPENDENCIES DECLARATIONS
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const lodash = require("lodash");
const {
  Post
} = require("./public/javascript/server/data");
const {
  result
} = require("lodash");

// -* Not sure what this does lol
app.use(bodyParser.urlencoded({
  extended: true
}));

// -* I believe this is set to make sure EJS is set
app.set('view engine', 'ejs');

// -* This makes sure that any Express calls for files will always set the public folder as the root
app.use(express.static(__dirname + `/public`));

// * DEMO DATA
const data = require(`${__dirname}/public/javascript/server/data.js`);
const kolehiyolo = require(`${__dirname}/public/javascript/server/functions.js`);

// * EXPRESS ROUTES
// -* Home Route
app.get("/", function (req, res) { // * OKAY
  console.log(`GET request for Home Page`);
  console.log(`\n`);

  // let test = kolehiyolo.stringifyDate(1998,0,21);
  // console.log(test); 

  // let test = kolehiyolo.stringifyTime(14,1,21,8);
  // console.log(test); 

  // let test = kolehiyolo.codifyTime(14,1,21,8);
  // console.log(test); 

  function buildHeaderCalendarPicker() {
    let min = `1950-01-01`;
    let max = `2050-12-31`;

    let result = ``;
    result += `<div class="header--navbar--title--current--date-picker">`;
    result += `<p></p>`;
    result += `<input
    class="header--navbar--title--current--date-picker--input"
    id="date"
    name="date"
    type="date"
    value="" min="${min}" max="${max}">`;
    result += `</div>`;
    return result;
  }

  data.model.Post.find({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`ALL POSTS FETCH SUCCESSFUL`);
      res.render(`modules/home`, {
        pageHeader: buildHeaderCalendarPicker(),
        entryDBProxy: JSON.stringify(result),
      });
    }
  });

  // data.Post.findById(`621df9b0ec8e4dd7b2962b63`,(error,result)=>{
  //   if (error) {
  //     console.log(error); 
  //   } else {
  //     console.log(result); 
  //     res.render(`modules/home`, {
  //       pageHeader: headerCalendarPicker,
  //       entryDBProxy: JSON.stringify(result),
  //     });
  //   }
  // });

  // res.render(`modules/home`, {
  //   postsArray: data.posts,
  //   pageHeader: headerCalendarPicker,
  //   entryDBProxy: JSON.stringify(data.posts),
  // });

});

// -* About Route
// app.get("/about", function (req, res) {
//   console.log(`GET request for About Page`);
//   console.log(`\n`);

//   res.render(`modules/about`, {
//     sample: data.aboutContent
//   });
// });

// -* Contact Route
// app.get("/contact", function (req, res) {
//   console.log(`GET request for Contact Page`);
//   console.log(`\n`);

//   res.render(`modules/contact`, {
//     sample: data.contactContent
//   });
// });

// -* GET Compose Route
app.get("/compose/:date", function (req, res) {
  console.log("GET request for Compose Page");
  console.log(`\n`);

  res.render("modules/compose", {
    sample: "",
    pageHeader: `New Post`,
    date: req.params.date,
  });
});

// -* POST Compose
app.post("/compose", function (req, res) {
  console.log(`POST request for Compose`);
  console.log(`\n`);

  function createPost() {
    const stampDate = new Date();
    const dateDate = req.body.date.split("-");

    let stamp = new data.model.Stamp({
      code: "",
      string: "",
      year: stampDate.getFullYear(),
      month: stampDate.getMonth(),
      date: stampDate.getDate(),
    });

    let date = new data.model.Date({
      code: "",
      string: "",
      year: parseInt(dateDate[0]),
      month: parseInt(dateDate[1]) - 1,
      date: parseInt(dateDate[2]),
    });

    // ! WORKING
    // const codeDate = kolehiyolo.codifyDate(stamp.year, stamp.month, stamp.date);
    // const stringDate = kolehiyolo.stringifyDate(stamp.year, stamp.month, stamp.date);

    stamp.string = kolehiyolo.stringifyDate(stamp.year, stamp.month, stamp.date);
    stamp.code = kolehiyolo.codifyDate(stamp.year, stamp.month, stamp.date);
    date.string = kolehiyolo.stringifyDate(date.year, date.month, date.date);
    date.code = kolehiyolo.codifyDate(date.year, date.month, date.date);

    const time = new data.model.Time({
      code: "",
      string: "",
      hour: 1,
      minutes: 1,
      seconds: 1,
      timezone: 8,
    });

    time.code = kolehiyolo.codifyTime(time.hour, time.minutes, time.seconds, time.timezone);
    time.string = kolehiyolo.stringifyTime(time.hour, time.minutes, time.seconds, time.timezone);

    const stampCombi = new data.model.StampCombi({
      date: stamp,
      time: time,
    });

    const dateCombi = new data.model.DateCombi({
      date: date,
      time: time,
    });

    const editCombi = new data.model.StampCombi({
      date: stamp,
      time: time,
    });

    let result = new data.model.Post({
      title: req.body.title,
      body: req.body.body,
      link: "Sample Link",
      theme: "Sample Theme",
      status: "Done",
      stamp: stampCombi,
      date: dateCombi,
      edit: editCombi,
    })
    return result;
  }

  const post = createPost();
  console.log(`POSTING THIS`);
  console.log(post);
  post.save();

  res.redirect("/");
});


// -* GET Post Route
app.get("/post/:postDate", function (req, res) {
  console.log(`GET request for Post ${req.params.postDate}`);
  console.log(`\n`);

  data.model.Post.find({
    'date.date.code': req.params.postDate
  }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      let post = result[0];
      let postTitle = post.title;
      let postBody = post.body;

      res.render(`modules/post`, {
        pageHeader: req.params.postDate,
        postTitle: postTitle,
        postBody: postBody,
        postDate: post.date.date.code
      });
    }
  });
});

// -* GET Edit Route
app.get("/edit/:postDate", function (req, res) {
  console.log(`GET request for Post ${req.params.postDate}`);
  console.log(`\n`);

  data.model.Post.find({
    'date.date.code': req.params.postDate
  }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      let post = result[0];
      let postTitle = post.title;
      let postBody = post.body;
      let postDateArray = post.date.date.code.split("-");
      let postDate = `${postDateArray[0]}-${postDateArray[1]}-${postDateArray[2]}`;

      res.render(`modules/edit`, {
        pageHeader: req.params.postDate,
        postTitle: postTitle,
        postBody: postBody,
        date: postDate
      });
    }
  });
});

// -* POST Edit
app.post("/edit", function (req, res) {
  console.log(`POST request for Edit`);
  console.log(`\n`);

  function getEditDate() {
    const editDate = new Date();

    let edit = new data.model.Stamp({
      code: "",
      string: "",
      year: editDate.getFullYear(),
      month: editDate.getMonth(),
      date: editDate.getDate(),
    });

    edit.string = kolehiyolo.stringifyDate(edit.year, edit.month, edit.date);
    edit.code = kolehiyolo.codifyDate(edit.year, edit.month, edit.date);

    const time = new data.model.Time({
      code: "",
      string: "",
      hour: 1,
      minutes: 1,
      seconds: 1,
      timezone: 8,
    });

    time.code = kolehiyolo.codifyTime(time.hour, time.minutes, time.seconds, time.timezone);
    time.string = kolehiyolo.stringifyTime(time.hour, time.minutes, time.seconds, time.timezone);

    const editCombi = new data.model.StampCombi({
      date: edit,
      time: time,
    });

    return editCombi;
  }

  let filter = {
    "date.date.code": req.body.date
  }

  let update = {
    title: req.body.title,
    body: req.body.body,
    link: "Sample Link",
    theme: "Sample Theme",
    status: "Done",
    edit: getEditDate()
  }

  data.model.Post.updateOne(filter, update, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Update successful`);
      res.redirect("/");
    }
  });
});

// -* POST Delete
app.post("/delete/:postDate", function (req, res) {
  console.log(`POST request for Delete ${req.params.postDate}`);
  console.log(`\n`);

  data.model.Post.findOne({
    'date.date.code': req.params.postDate
  }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      let post = new data.model.Deleted(result.toJSON()) //or result.toObject
      /* you could set a new id
      post._id = mongoose.Types.ObjectId()
      post.isNew = true
      */

      result.remove();
      post.save();
      res.redirect("/");

      // post is now in a better place
    }
  })
});

// -* POST Restore
app.post("/restore/:postID", function (req, res) {
  console.log(`POST request for Restore ${req.params.postID}`);
  console.log(`\n`);

  data.model.Deleted.findOne({
    '_d': req.params.postID
  }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      let post = new data.model.Post(result.toJSON()) //or result.toObject
      /* you could set a new id
      post._id = mongoose.Types.ObjectId()
      post.isNew = true
      */

      result.remove();
      post.save();
      res.redirect("/");

      // post is now in a better place
    }
  })
});

app.get("/deleted", function (req, res) { // * OKAY
  console.log(`GET request for Deleted`);
  console.log(`\n`);

  data.model.Deleted.find({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`ALL DELETED FETCH SUCCESSFUL`);
      res.render(`modules/deleted`, {
        pageHeader: "Deleted",
        entryDBProxy: JSON.stringify(result),
      });
    }
  });
});

// * SERVER LISTENER
// TODO - Make sure to fix the port number
// 5000 - Personal
// 1000 - freeCodeCamp
// 2000 - Frontend Mentor
// 3000 - London App Brewery
app.listen(3011, function () {
  console.log("The server is running on port 3011.")
  console.log(`\n`);
});
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

require("colors");

//Middleware
app.use(cors());
app.use(express.json());

//Mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.je7jmto.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const Services = client.db("Medi-Time").collection("Services");
const Reviews = client.db("Medi-Time").collection("Reviews");

async function run() {
  try {
    await client.connect();
    console.log("Database Conneted".cyan);
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error,
    });
  }
}
run();

// Initial Server Load
app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.get("/services", async (req, res) => {
  try {
    const services = await Services.find({}).toArray();

    res.send({
      status: true,
      data: services,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Get 3 Services

app.get("/threeservices", async (req, res) => {
  try {
    const services = await Services.find({}).limit(3).toArray();

    res.send({
      status: true,
      data: services,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Get One service by Id
app.get("/services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Services.findOne({ _id: ObjectId(id) });
    if (service) {
      res.send({
        status: true,
        data: service,
      });
    } else {
      res.send({
        status: false,
        message: "Service not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

app.get("/newservice", async (req, res) => {
  try {
    const services = await Services.find({ newService: true }).toArray();

    if (services) {
      res.send({
        status: true,
        data: services,
      });
    } else {
      res.send({
        status: false,
        message: "Service not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

// Adding services

app.post("/serviceadd", async (req, res) => {
  try {
    const service = req.body;
    const result = await Services.insertOne(service);
    if (result.insertedId) {
      res.send({
        status: true,
        message: `Sucessfully added the service with ID: ${result.insertedId}`,
      });
    } else {
      res.send({
        status: false,
        message: "Failed to add the service",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

// Adding a Review
app.post("/reviewadd", async (req, res) => {
  try {
    const review = req.body;
    const result = await Reviews.insertOne(review);
    if (result.insertedId) {
      res.send({
        status: true,
        message: "Sucessfully added the review ",
      });
    } else {
      res.send({
        status: false,
        message: "Failed to add the review",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

//get review by service ID

app.get("/review", async (req, res) => {
  try {
    let query = {};

    if (req.query.serviceID) {
      query = {
        ServiceID: req.query.serviceID,
      };
    }
    const reviews = await Reviews.find(query).toArray();
    const result = reviews.sort().reverse();

    res.send({
      status: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

// //review by email

// app.get("/reviewemail", async (req, res) => {
//   try {
//     let query = {};

//     if (req.query.email) {
//       query = {
//         email: req.query.email,
//       };
//     }
//     const reviews = Reviews.find(query);
//     const result = await reviews.toArray();

//     if (result) {
//       res.send({
//         status: true,
//         data: result,
//       });
//     } else {
//       res.send({
//         status: false,
//         message: "No reviews found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: false,
//       message: error.message,
//     });
//   }
// });

// //delete a review
// app.delete("/reviewdelete/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const product = await Reviews.findOne({ _id: ObjectId(id) });

//     if (!product?._id) {
//       res.send({
//         status: false,
//         message: "Product not found",
//       });
//       return;
//     }

//     const result = await Reviews.deleteOne({ _id: ObjectId(id) });

//     if (result.deletedCount) {
//       res.send({
//         status: true,
//         message: "Deleted successfully !!",
//       });
//     } else {
//       res.send({ status: false, message: "Sorry !Review couldn't be deleted" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: false,
//       message: error.message,
//     });
//   }
// });
// //App Listener

app.listen(port, () => {
  console.log("Server is conneted at port:", port);
});
module.exports = app;

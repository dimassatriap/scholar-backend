module.exports = (app) => {
  const user = require("../controller/userController");
  const account = require("../controller/accountController");
  const scholar = require("../controller/scholarController");
  const publication = require("../controller/publicationController");
  const product = require("../controller/productController");
  const section = require("../controller/sectionController");
  const loan = require("../controller/loanController");
  const auth = require("../controller/authController");

  // Default
  app.get("/", (req, res) => {
    res.json({ Hello: "Welcome to Scholar Apps." });
  });

  // Auth
  // Register Account
  app.post("/auth/register", auth.register);
  // Login Account
  app.post("/auth/login", auth.login);

  // MODEL: ACCOUNTS
  // All Account
  app.get("/account", account.findAll);

  // Find One Account
  app.get("/account/:id", account.findOne);

  //Update Account
  app.put("/account/:id", account.update);

  //Delete Account
  app.delete("/account/:id", account.delete);


  // MODEL: SCHOLARS
  // All Scholar
  app.get("/scholar", scholar.findAll);

  // Find One Scholar
  app.get("/scholar/:id", scholar.findOne);

  // Find One Scholar and Publications
  app.get("/scholar/:id/publication", scholar.findScholarWithPublication);

  //Create Scholar
  app.post("/scholar", scholar.create);

  //Update Scholar
  app.put("/scholar/:id", scholar.update);
  
  //Delete Scholar
  app.delete("/scholar/:id", scholar.delete);

  // MODEL: PUBLICATIONS
  // All Publication
  app.get("/publication", publication.findAll);

  // Find One Publication
  app.get("/publication/:id", publication.findOne);

  //Create Publication
  app.post("/publication", publication.create);

  //Update Publication
  app.put("/publication/:id", publication.update);

  //Delete Publication
  app.delete("/publication/:id", publication.delete);


  // Customer
  // All User
  app.get("/user", user.findAllUser);

  // User's Product
  app.get("/userproduct/:id", user.findUserProduct);

  // User's Loan
  app.get("/user/loan/:id", user.findUserLoan);

  // Find One User
  app.get("/user/:id", user.findOne);

  //Create User
  app.post("/user", user.create);

  //Update User
  app.put("/user/:id", user.update);

  //Delete User
  app.delete("/user/:id", user.delete);


  //Product
  // All product
  app.get("/product", product.findAllProduct);

  // Product with section information
  app.get("/product-section", product.getAllRequestProduct);

  // All Request product
  // app.get("/request-product", product.findRequestProduct);

  // Find One product
  app.get("/product/:id", product.findOne);

  // Create product
  app.post("/product", product.create);

  // Update product
  app.put("/product/:id", product.update);

  // Delete product
  app.delete("/product/:id", product.delete);

  // Section
  // Find All Section
  app.get("/section", section.findAllSection);

  // get one Section
  app.get("/section/:id", section.findOne);

  // Find All Request product in section
  app.get("/request-section", section.getAllRequestSection);

  // Find All Request product in section
  app.get("/offer-section", section.getAllOfferSection);

  // Create Product Section
  app.post("/section", section.create);

  // Update Product Section 
  app.put("/section/:id", section.update);

  //delete Product Section
  app.delete("/section/:id", section.delete);

  //Loan
  // All Loan
  app.get("/loan", loan.findAllLoan);

  // find one Loan
  app.get("/loan/:id", loan.findOne);

  // create Loan
  app.post("/loan", loan.create);

  // Update Loan 
  app.put("/loan/:id", loan.update);

  //delete Loan
  app.delete("/loan/:id", loan.delete);
};

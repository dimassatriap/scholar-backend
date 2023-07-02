module.exports = (app) => {
  const account = require("../controller/accountController");
  const scholar = require("../controller/scholarController");
  const publication = require("../controller/publicationController");
  const auth = require("../controller/authController");
  const university = require("../controller/universityController");
  const faculty = require("../controller/facultyController");
  const department = require("../controller/departmentController");

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

  // MODEL: Universities
  // All University
  app.get("/university", university.findAll);
  //Create University
  app.post("/university", university.create);

  // MODEL: Faculties
  //Create Faculty
  app.post("/university/faculty", faculty.create);


  // MODEL: Departments
  //Create Department
  app.get("/department", department.findAll);
  app.post("/university/faculty/department", department.create);
};

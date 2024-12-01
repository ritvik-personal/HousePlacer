const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const multer = require("multer");
const path = require("path");

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


async function hashPassword(password) {
    const saltRounds = 12; 
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function checkPassword(password, hash){
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}




const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods:["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    key:"id",
    secret:"subscribe",
    resave:false,
    saveUninitialized: false,
    cookie:{
        expires: 60 * 60 * 24,
    },
}))

app.use('/imgs', express.static(path.join(__dirname, 'imgs')));


app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

const db = mysql.createConnection({
    host: 'op2hpcwcbxb1t4z9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'zs6ky2ikbey1n4rj',
    password: 'l21yrz7bfdji1a7o',
    database: 'zgyllt8xa0r8bkmv'
});

const generateRandomID = () => {
    return Math.floor(10000 + Math.random() * 89999); 
};

const generateRandomIDclass = (c) => {
    const firstDigit = c === "Student" ? 1 : 2; 
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 
    return parseInt(`${firstDigit}${randomDigits}`);
  };

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/register', async (req, res) => {
    const { classification, email, username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    
    let id;
    let query;
    if(classification == 'Student'){
        id = generateRandomIDclass('Student'); 
        query = "INSERT INTO Students (ID, email, username, password) VALUES (?, ?, ?, ?)";
    }
    else{
        id = generateRandomIDclass('Manager'); 
        query = "INSERT INTO Managers (ID, email, username, password) VALUES (?, ?, ?, ?)"; 
    }
    db.query(query, [id, email, username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: "Error inserting data."});
        }
        res.status(201).send({ message: "User registered successfully", userId: id });
    });
});

app.get('/login', (req, res) =>{
    if(req.session.user){
        res.send({loggedIn:true, user: req.session.user})
    }
    else{
        res.send({loggedIn:false}) 
    }
})
app.post('/login', async (req, res) => {
    const { classification, username, password } = req.body;
    let query;

    if (classification == 0) {
        query = "SELECT * FROM Students WHERE username = ?"; 
    } else {
        query = "SELECT * FROM Managers WHERE username = ?"; 
    }

    db.query(query, [username], async (err, result) => {
        if (err) {
            console.error('Error querying data:', err);
            return res.status(500).send({ message: "Error querying data." });
        }

        if (result.length > 0) {
            const hashedPassword = await hashPassword(password);
            const isMatch = await checkPassword(password, hashedPassword);

            if (isMatch) {
                req.session.user = {
                    id: result[0].ID, 
                    username: result[0].username,
                };
                return res.send({ message: "Success", userId: result[0].ID });
            } else {
                return res.send({ message: "Wrong password" });
            }
        } else {
            return res.send({ message: "Wrong username or password" });
        }
    });
});


app.post('/getStudentID', (req, res) =>{
    const {username, password, classification} = req.body;

    let query;
    if(classification == 0){
        query = "SELECT ID FROM Students WHERE username = ? AND password = ?"; 
    }
    else{
        query = "SELECT ID FROM Managers WHERE username = ? AND password = ?"; 
    }

    db.query(query, [username, password], (err, result) =>{
        if(err){
            return res.status(500).send({ message: "Error retrieving data." });
        }
        else{
            if (result.length > 0) {
                res.status(200).send({ message: "User found", userId: result[0].ID });
            } 
            else {
                res.status(404).send({ message: "User not found" });
            }
        }
    })
})


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.resolve(__dirname, 'imgs'))
    },
    filename:(req, file, cb)=>{
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({storage: storage});

app.post('/newproperty', upload.single('image'), (req, res) => {
    const {
      managerId,
      property_name,
      no_bedrooms,
      address,
      no_bathrooms,
      sq_footage,
      dist_campus,
      parking,
      property_description,
      rent,
      website,
    } = req.body;
  
    const imageFilename = req.file ? req.file.filename : null;
    const propertyId = generateRandomID();
  
    const query = `
      INSERT INTO Property 
      (Property_ID, Manager_ID, Property_Name, No_Bedrooms, Address, No_Bathrooms, Sq_Footage, Dist_Campus, Parking, Property_Description, Rent, Website, Image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [propertyId, managerId, property_name, no_bedrooms, address, no_bathrooms, sq_footage, dist_campus, parking, property_description, rent, website, imageFilename],
      (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send({ message: "Error inserting data." });
        }
        res.status(201).send({ message: "Property added successfully", managerId: managerId });
      }
    );
  });

app.post('/newpreference', (req, res) => {

    const {student_id, no_bedrooms, no_bedrooms_priority, no_bathrooms, no_bathrooms_priority, budget, budget_priority, sq_footage, sq_footage_priority, dist_dining, dist_dining_priority, dist_gym, dist_gym_priority, dist_campus, dist_campus_priority, parking, notes} = req.body;

    query = "INSERT INTO Preferences (Student_ID, Bedrooms, Bedrooms_P, Bathrooms, Bathrooms_P, Rent, Rent_P, Sq_ft, Sq_ft_P, DistD, DistD_P, DistG, DistG_P, DistC, DistC_P, Parking, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 

    db.query(query, [student_id, no_bedrooms, no_bedrooms_priority, no_bathrooms, no_bathrooms_priority, budget, budget_priority, sq_footage, sq_footage_priority, dist_dining, dist_dining_priority, dist_gym, dist_gym_priority, dist_campus, dist_campus_priority, parking, notes], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: "Error inserting data." });
        }
        res.status(201).send({ message: "Property added successfully", userId: student_id });
    });

})

app.get('/getpreferences', (req, res) => {
    const { studentId } = req.query;
    const query = "SELECT * FROM Preferences WHERE Student_ID = ?";
    db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error retrieving preferences:', err);
        return res.status(500).send({ message: 'Error retrieving preferences.' });
      }
      if (result.length > 0) {
        res.status(200).send(result[0]); 
      } else {
        res.status(404).send({ message: 'No preferences found.' });
      }
    });
  });

  app.put('/updatepreferences/:studentId', (req, res) =>{
    const { studentId } = req.params;
    const {no_bedrooms, no_bedrooms_priority, no_bathrooms, no_bathrooms_priority, budget, budget_priority, sq_footage, sq_footage_priority, dist_dining, dist_dining_priority, dist_gym, dist_gym_priority, dist_campus, dist_campus_priority, parking, notes} = req.body; 
    const query = `
    UPDATE Preferences
    SET Bedrooms = ?, Bedrooms_P = ?, Bathrooms = ?, Bathrooms_P = ?, Rent = ?, Rent_P = ?, Sq_ft = ?, Sq_ft_P = ?, DistD = ?, DistD_P = ?, DistG = ?, DistG_P = ?, DistC = ?, DistC_P = ?, Parking = ?, Notes = ?
    WHERE Student_ID = ?`;

    db.query(query, [no_bedrooms, no_bedrooms_priority, no_bathrooms, no_bathrooms_priority, budget, budget_priority, sq_footage, sq_footage_priority, dist_dining, dist_dining_priority, dist_gym, dist_gym_priority, dist_campus, dist_campus_priority, parking, notes, studentId], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send({ message: "Error updating data." });
        }
        res.status(201).send({ message: "Preferences updates successfully"});
    });
})

app.get('/properties', (req, res) => {
    const { managerId } = req.query;

    const query = "SELECT * FROM Property WHERE Manager_ID = ?";
    db.query(query, [managerId], (err, result) => {
        if (err) {
            console.error('Error retrieving properties:', err);
            return res.status(500).send({ message: "Error retrieving properties." });
        }
        res.status(200).send(result);
    });
});


app.delete('/deleteproperty/:propertyId', (req, res) => {
    const { propertyId } = req.params;
    console.log('Received Property ID:', propertyId);
    const query = 'DELETE FROM Property WHERE Property_ID = ?';
    db.query(query, [propertyId], (err, result) => {
      if (err) {
        console.error('Error deleting property:', err);
        return res.status(500).send({ message: 'Error deleting property.' });
      }
      res.status(200).send({ message: 'Property deleted successfully.' });
    });
  });

app.put('/updateproperty/:propertyId', (req, res) => {
    const { propertyId } = req.params;
    const { Property_Name, Address, No_Bedrooms, No_Bathrooms, Rent } = req.body;
  
    const query = `UPDATE Property SET Property_Name = ?, Address = ?, No_Bedrooms = ?, No_Bathrooms = ?, Rent = ? WHERE Property_ID = ?`;
    
    db.query(query, [Property_Name, Address, No_Bedrooms, No_Bathrooms, Rent, propertyId], (err, result) => {
        if (err) {
          console.error('Error updating property:', err);
          return res.status(500).send({ message: 'Error updating property' });
        }
        
        if (result.affectedRows > 0) {
          res.status(200).send({ message: 'Property updated successfully' });
        } else {
          res.status(404).send({ message: 'Property not found' });
        }
      }
    );
  });
 
  
  const calculateMatchingScore = (studentPreferences, property) => {
    try {
        // Extract and log preferences and property data
        console.log('Calculating score for property:', property);
        console.log('With preferences:', studentPreferences);

        const {
            Bedrooms_P,
            Bathrooms_P,
            Rent_P,
            Sq_ft_P,
            DistD_P,
            DistG_P,
            DistC_P,
        } = studentPreferences;

        // Normalize weights
        const totalWeight = Bedrooms_P + Bathrooms_P + Rent_P + Sq_ft_P + DistD_P + DistG_P + DistC_P;

        if (totalWeight === 0) {
            console.error('Total weight is 0, invalid preferences:', studentPreferences);
            return 0;
        }

        const weights = {
            bedrooms: Bedrooms_P / totalWeight,
            bathrooms: Bathrooms_P / totalWeight,
            rent: Rent_P / totalWeight,
            squareFootage: Sq_ft_P / totalWeight,
            distanceDining: DistD_P / totalWeight,
            distanceGym: DistG_P / totalWeight,
            distanceCampus: DistC_P / totalWeight,
        };

        let score = 0;

        // Bedrooms Match
        if (property.No_Bedrooms === studentPreferences.Bedrooms) {
            score += weights.bedrooms;
        } else if (Math.abs(property.No_Bedrooms - studentPreferences.Bedrooms) === 1) {
            score += weights.bedrooms / 2; // Partial match
        }

        // Bathrooms Match
        if (property.No_Bathrooms === studentPreferences.Bathrooms) {
            score += weights.bathrooms;
        } else if (Math.abs(property.No_Bathrooms - studentPreferences.Bathrooms) === 1) {
            score += weights.bathrooms / 2; // Partial match
        }

        // Rent Match
        if (property.Rent <= studentPreferences.Rent) {
            score += weights.rent;
        }

        // Square Footage Match
        if (property.Sq_Footage >= studentPreferences.Sq_ft) {
            score += weights.squareFootage;
        } else if (property.Sq_Footage >= studentPreferences.Sq_ft * 0.9) {
            score += weights.squareFootage / 2; // Partial match for close sizes
        }

        // Distance to Dining Match
        if (property.Dist_Dining <= studentPreferences.DistD) {
            score += weights.distanceDining;
        }

        // Distance to Gym Match
        if (property.Dist_Gym <= studentPreferences.DistG) {
            score += weights.distanceGym;
        }

        // Distance to Campus Match
        if (property.Dist_Campus <= studentPreferences.DistC) {
            score += weights.distanceCampus;
        }

        // Parking Match
        if (property.Parking === studentPreferences.Parking) {
            score += 1; // Full score for parking match
        }

        return score;
    } catch (error) {
        console.error('Error in calculateMatchingScore:', error);
        return 0;
    }
};


app.get('/matchproperties/:studentId', (req, res) => {
    const { studentId } = req.params; // Retrieve studentId from params

    console.log('Student ID:', studentId); // Debug log for studentId

    if (!studentId) {
        console.error('Student ID is missing in the request.');
        return res.status(400).send({ message: 'Student ID is required.' });
    }

    const preferenceQuery = "SELECT * FROM Preferences WHERE Student_ID = ?";
    const propertyQuery = "SELECT * FROM Property";

    // Fetch student preferences
    db.query(preferenceQuery, [studentId], (err, preferenceResults) => {
        if (err) {
            console.error('Error retrieving preferences:', err);
            return res.status(500).send({ message: 'Error retrieving preferences.' });
        }

        if (preferenceResults.length === 0) {
            console.error('No preferences found for student ID:', studentId);
            return res.status(404).send({ message: 'No preferences found.' });
        }

        const studentPreferences = preferenceResults[0];
        console.log('Student Preferences:', studentPreferences); // Debug log preferences

        // Fetch all properties
        db.query(propertyQuery, (err, propertyResults) => {
            if (err) {
                console.error('Error retrieving properties:', err);
                return res.status(500).send({ message: 'Error retrieving properties.' });
            }

            if (propertyResults.length === 0) {
                console.error('No properties found');
                return res.status(404).send({ message: 'No properties found.' });
            }

            console.log('Properties Retrieved:', propertyResults.length); // Debug log property count

            try {
                // Calculate match scores for each property
                const scoredProperties = propertyResults.map(property => {
                    const score = calculateMatchingScore(studentPreferences, property);
                    return { ...property, matchScore: score };
                });

                // Sort properties by match score in descending order
                scoredProperties.sort((a, b) => b.matchScore - a.matchScore);

                res.status(200).send(scoredProperties);
            } catch (calculationError) {
                console.error('Error calculating match scores:', calculationError);
                res.status(500).send({ message: 'Error calculating match scores.' });
            }
        });
    });
});




app.post('/saveproperty', (req, res) => {
    const { studentId, propertyId } = req.body;
  
    const saveQuery = "INSERT INTO Saved_Properties (Student_ID, Property_ID) VALUES (?, ?)";
    
    db.query(saveQuery, [studentId, propertyId], (err, result) => {
      if (err) {
        console.error('Error saving property:', err);
        return res.status(500).send({ message: 'Error saving property.' });
      }
  
      res.status(200).send({ message: 'Property saved successfully.' });
    });
  });

  app.get('/saveproperty', (req, res) => {
    const studentId = req.query.studentId;
  
    const query = `
      SELECT sp.Property_ID, p.Property_Name, p.Rent, p.No_Bedrooms, p.No_Bathrooms, p.Sq_Footage, p.Dist_Campus, 
             p.Parking, p.Property_Description, p.Website, p.Image
      FROM Saved_Properties sp JOIN Property p ON sp.Property_ID = p.Property_ID WHERE sp.Student_ID = ?`;
  
    db.query(query, [studentId], (err, results) => {
      if (err) {
        console.error('Error fetching saved properties:', err);
        return res.status(500).send({ message: 'Error fetching saved properties.' });
      }
      res.status(200).send(results); 
    });
  });

  app.delete('/removeproperty/:propertyId', (req, res) =>{
    const { propertyId } = req.params;
    const query = 'DELETE FROM Saved_Properties WHERE Property_ID = ?';
    db.query(query, [propertyId], (err, result) => {
      if (err) {
        console.error('Error deleting property:', err);
        return res.status(500).send({ message: 'Error deleting property.' });
      }
      res.status(200).send({ message: 'Property deleted successfully.' });
    });
  });


  app.post('/addreview', (req, res) => {
    const {propertyId, studentId, rating, description} = req.body;
    const reviewId = generateRandomID()


    const query = `INSERT INTO Reviews (Review_ID, Property_ID, Student_ID, Score, Description) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [reviewId, propertyId, studentId, rating, description], (err, result) => {
      if (err) {
        console.error('Error inserting review:', err);
        res.status(500).send('Error inserting review');
        return;
      }
      res.status(200).send('Review added successfully');
    });
  });

  app.get('/reviews/:propertyId', (req, res) => {
    const { propertyId } = req.params;
  
    const query = `SELECT Score, Description FROM Reviews WHERE Property_ID = ?`;
    db.query(query, [propertyId], (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).send('Error fetching reviews');
        return;
      }
      res.status(200).json(results);
    });
  });
  

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
# BACKEND

Installation

Clone the Repository:
```bash
git clone https://github.com/Samrat0505/FEED4ME.git
cd FEED4ME
cd backend
```
Install Dependencies:
```bash
npm install
```
Set Up Environment Variables:Create a .env file in the root directory and add the following variables:
```bash
MONGO_URI
TOKEN_SECRET
TWILIO_ACC_SID
TWILIO_AUTH_TOKEN
TWILIO_VIRTUAL_PHONE
SESSION_SECRET
```
Start the Server:
```bash
npm start
```
The server will start on http://localhost:3000.

API Endpoints

1. Register a New User
roles : [farmer, customer, storage]
```
Endpoint: POST /localhost:3000/api/auth/:role/register/initiate
               https://feed4me-server.onrender.com/api/auth/:role/register/initiate
```
Request Body:
```json
{ 
  "name": "akshay", 
  "mobile": "4898429824",
  "password": "admin@123",
  "age":31,
  "location": {
      "address": "Delhi",
      "coordinates": 
      {
        "type": "Point", 
        "coordinates": [29.2183, 79.5130] }
    }
}
```
Response:
```json
{
  "status": "Registration successful",
  "message": "OTP sent successfully"
}
```
2. Verify OTP
**The twilio account is a trial account, so otp will be sent to "Akshay's" phone number**
```
Endpoint: POST localhost:3000/api/auth/:role/register/verify
               https://feed4me-server.onrender.com/api/auth/:role/register/verify
```
Request Body:
```json
{
  "identifier":"894383834",
  "otp":"16261"
}
```
Response:
```json
{
  "status": "Registration successful",
  "data": {
    "_id": "67d444362fa4659c4efc5fb1",
    "name": "akshay",
    "age": "31",
    "location": {
      "address": "Delhi",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          29.2183,
          79.513
        ]
      }
    },
    "role": "farmer",
    "mobile": "4898429824",
    "email": null
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.NDg5ODQyOTgyNA.yr0882JZ5n-nXt1IpX0K41nQMmnu1I2JkwYfqKqZ_8k"
}
```

3. Login a User
```
Endpoint: POST http://127.0.0.1:3000/api/auth/:role/login
               https://feed4me-server.onrender.com/api/auth/:role/login
```
Request Body:
```json
{
  "identifier":"89438383439",
  "password":"admin@123"
}
```
Response:
```json
{
  "status": "Logged in successfully",
  "data": {
    "_id": "67d444362fa4659c4efc5fb1",
    "name": "akshay",
    "age": "31",
    "location": {
      "coordinates": {
        "type": "Point",
        "coordinates": [
          29.2183,
          79.513
        ]
      },
      "address": "Delhi"
    },
    "role": "farmer",
    "mobile": "4898429824",
    "email": null
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.NDg5ODQyOTgyNA.yr0882JZ5n-nXt1IpX0K41nQMmnu1I2JkwYfqKqZ_8k"
}
```

4. Delete the User
```
Endpoint: DELETE http://127.0.0.1:3000/api/auth/:role/delete
               https://feed4me-server.onrender.com/api/auth/:role/delete
```
Request Body:
```json
authorization : 'Bearer {token}'
```
Response:
```json
{
  "status": "Profile deleted successfully"
}
```

Farmers API Documentation

5. Get all Farmers
```
Endpoint: GET http://127.0.0.1:3000/api/farmer
               https://feed4me-server.onrender.com/api/farmer
```
Response:
```json
{
  "status": "Farmers fetched successfully",
  "data": [
    {
      "_id": "679757737e7789fb3739459e",
      "name": "shohan",
      "age": "31",
      "location": "roorkee",
      "password": "$2a$10$92bs4mqXdv009ZKb.Lp9c.xwDttQavWVSN4YelDeeWZSEngi1qQXu",
      "mobile": "8943838343",
      "date": "2025-01-27T09:47:10.557Z",
      "__v": 0
    },
    {
      "_id": "67b8a5208ddcc30e2639386b",
      "name": "salmaan khaan",
      "age": "43",
      "location": "dehradun",
      "password": "admin@123",
      "mobile": "98388329322",
      "email": "iloveaishwarya@gmail.com",
      "date": null
    },
    {
      "date": "2025-02-21T16:29:21.739Z",
      "_id": "67b8a5ff8ddcc30e2639386c",
      "name": "sahrukh khaan",
      "age": "44",
      "location": "maharastra",
      "password": "admin@123",
      "mobile": "93939393939",
      "email": "heykiran@gmail.com"
    }
  ]
}
```

6. Get Farmer by id, name, email or mobile
```
Endpoint: GET http://127.0.0.1:3000/api/farmer/:parameter
               https://feed4me-server.onrender.com/api/farmer/:parameter
```
Response:
```json
{
  "status": "Farmer fetched successfully",
  "data": {
    "_id": "67b8a5208ddcc30e2639386b",
    "name": "salmaan khaan",
    "age": "43",
    "location": "dehradun",
    "password": "admin@123",
    "mobile": "98388329322",
    "email": "iloveaishwarya@gmail.com",
    "date": null
  }
}
```

7. Get profile
```
Endpoint: GET http://127.0.0.1:3000/api/farmer/me
               https://feed4me-server.onrender.com/api/farmer/me
```
Request Body:
```json
authorization : 'Bearer {token}'
```
Response:
```json
{
  "status": "Farmer fetched successfully",
  "data": {
    "_id":"434343",
    "name": "radhe shyam",
    "age": "64",
    "location": {
      "coordinates": {
        "type": "Point",
        "coordinates": [
          77.1025,
          28.7041
        ]
      },
      "address": "Delhi"
    },
    "mobile": "8943838343",
    "crops": [
      {
        "name": "baajra",
        "MRP": 5000,
        "stock": 400
      },
      {
        "name": "ravi",
        "MRP": 5000,
        "stock": 400
      },
      {
        "name": "genhu",
        "MRP": 100,
        "stock": 400
      }
    ],
    "customers": [],
    "inventory": [
      {
        "id": "67d5602cdd85cc341df87fe2",
        "name": "Storage A",
        "crop": "all",
        "area": 600,
        "cost": 720000,
        "owner": "67d55ffadd85cc341df87fdc"
      },
      {
        "id": "67d560a0dd85cc341df87fea",
        "name": "Storage C",
        "crop": "all",
        "area": 5000,
        "cost": 5000000,
        "owner": "67d55ffadd85cc341df87fdc"
      }
    ]
  }
}
```

8. update its information
```
Endpoint: PUT http://127.0.0.1:3000/api/farmer
               https://feed4me-server.onrender.com/api/farmer
```
Request Body:
```json
authorization : 'Bearer {token}'
{
  "name":"radhe shyam",
  "age":"64",
  "location":"ramnagar"
}
```
Response:
```json
{
  "status": "Farmer data updated successfully",
  "data": {
    "_id": "679757737e7789fb3739459e",
    "name": "radhe shyam",
    "age": "64",
    "location": "ramnagar",
    "password": "$2a$10$92bs4mqXdv009ZKb.Lp9c.xwDttQavWVSN4YelDeeWZSEngi1qQXu",
    "mobile": "8943838343",
    "date": "2025-01-27T09:47:10.557Z",
    "__v": 0
  }
}
```


Inventory API documentation

9. add new inventory
```
Endpoint: POST http://127.0.0.1:3000/api/inventory
               https://feed4me-server.onrender.com/api/inventory
```
Request Body:
```json
authorization : 'Bearer {token}'
{
  "name":"Storage E",
  "totalQuantity":59000,
  "price": 1200,
  "location": {
      "address": "Haldwani, RTO Road",
      "coordinates": {
        "type": "Point",
        "coordinates": [29.22, 79.52]
      }
    }
}
```
Response:
```json
{
  "status": "Inventory added successfully",
  "data": {
    "name": "Storage E",
    "crop": "all",
    "totalQuantity": 59000,
    "reservedQuantity": 0,
    "pricePerUnit": 1200,
    "owner": "67d3097fcd3d5a344d1dbce4",
    "takenBy": [],
    "location": {
      "address": "Haldwani, RTO Road",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          29.22,
          79.52
        ]
      }
    }
  }
}
```

10. get my inventories (only for storage owner)
```
Endpoint: POST http://127.0.0.1:3000/api/inventory
               https://feed4me-server.onrender.com/api/inventory
```
Request Body:
```json
authorization : 'Bearer {token}'
```
Response:
```json
{
  "status": "Inventory fetched successfully",
  "data": [
    {
      "location": {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            77.1025,
            28.7041
          ]
        },
        "address": "123 Warehouse St, Delhi, India"
      },
      "_id": "67d43154f729753f11841c6a",
      "name": "Storage A",
      "crop": "all",
      "totalQuantity": 5000,
      "reservedQuantity": 0,
      "pricePerUnit": 1500,
      "owner": "67d3097fcd3d5a344d1dbce4",
      "takenBy": [],
      "__v": 0
    },
    {
      "location": {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            29.1947,
            79.5104
          ]
        },
        "address": "Haldwani Rampur road"
      },
      "_id": "67d446fc2fa4659c4efc5fbe",
      "name": "Storage D",
      "crop": "all",
      "totalQuantity": 59000,
      "reservedQuantity": 0,
      "pricePerUnit": 1200,
      "owner": "67d3097fcd3d5a344d1dbce4",
      "takenBy": [],
      "__v": 0
    },
    {
      "location": {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            29.22,
            79.52
          ]
        },
        "address": "Haldwani, RTO Road"
      },
      "_id": "67d447a22fa4659c4efc5fc5",
      "name": "Storage E",
      "crop": "all",
      "totalQuantity": 59000,
      "reservedQuantity": 0,
      "pricePerUnit": 1200,
      "owner": "67d3097fcd3d5a344d1dbce4",
      "takenBy": [],
      "__v": 0
    }
  ]
}
```

11. get inventories near me
```
Endpoint: POST http://127.0.0.1:3000/api/inventory/nearby
               https://feed4me-server.onrender.com/api/inventory/nearby
```
Request Body:
```json
authorization : 'Bearer {token}'
{
  "lat":25.4683,
  "lng":81.8546
}
```
Response:
```json
{
  "status": "Inventory fetched successfully",
  "data": [
    {
      "location": {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            29.1947,
            79.5104
          ]
        },
        "address": "Haldwani Rampur road"
      },
      "_id": "67d446fc2fa4659c4efc5fbe",
      "name": "Storage D",
      "crop": "all",
      "totalQuantity": 59000,
      "reservedQuantity": 0,
      "pricePerUnit": 1200,
      "owner": "67d3097fcd3d5a344d1dbce4",
      "takenBy": [],
      "__v": 0
    },
    {
      "location": {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            29.22,
            79.52
          ]
        },
        "address": "Haldwani, RTO Road"
      },
      "_id": "67d447a22fa4659c4efc5fc5",
      "name": "Storage E",
      "crop": "all",
      "totalQuantity": 59000,
      "reservedQuantity": 0,
      "pricePerUnit": 1200,
      "owner": "67d3097fcd3d5a344d1dbce4",
      "takenBy": [],
      "__v": 0
    }
  ]
}
```

12. rent the inventory
```
Endpoint: POST http://localhost:3000/api/inventory/purchase
               https://feed4me-server.onrender.com/api/inventory/purchase
```
Request Body:
```json
authorization : 'Bearer {token}'
{
  "inventoryId": "67d560a0dd85cc341df87fea",
  "quantity": 5000
}
```
Response:
```json
{
  "status": "Inventory purchased successfully",
  "invoice": {
    "farmer": "67d444362fa4659c4efc5fb1",
    "name": "akshay",
    "seller": {
      "name": "akshay",
      "email": "nol.void75@gmail.com",
      "address": "Pantnagar"
    },
    "inventory": {
      "id": "67d560a0dd85cc341df87fea",
      "name": "Storage C",
      "location": "Prayagraaj"
    },
    "quantity": 5000,
    "totalPrice": 5000000,
    "date": "2025-03-15T13:23:29.126Z"
  }
}
```


Crops API documentation

13. add new crop
```
Endpoint: POST http://127.0.0.1:3000/api/crops
               https://feed4me-server.onrender.com/api/crops
```
Request Body:
```json
authorization : 'Bearer {token}'
{
  "name":"genhu",
  "MRP":"100",
  "stock":"400"
}
```
Response:
```json
{
  "status": "Crop added successfully",
  "data": {
    "farmerID": "679757737e7789fb3739459e",
    "name": "genhu",
    "MRP": 100,
    "stock": 400,
    "_id": "67b8c134a7e1bde998fe76d3",
    "__v": 0
  }
}
```

NGO API documentation

14. register a ngo
roles : [ngo]
```
Endpoint: POST /localhost:3000/api/auth/ngo/register/initiate
```
Request Body:
```json
{
    "email":"ngo.saath@gmail.com", // official email of ngo
    "password":"admin@123",
    "contact_person":"shivaji", // name of person in contact
    "phone":"4930993209", // phone number of the contact person (not ngo)
    "name":"sub ka saath", // name of ngo
    "registration_number":"ABSDCE353433", // official registration number of ngo
    "focus_area":"food", // eg. food, poverty, women empowerment etc
    "establishment":"03/01/2000", // date of creation
    "location": {
        "address":"nelium colony",
        "coordinates":{
            "coordinates" : [32.32, 32.44]
        }
    },
    "website":"www.something.com"
}
```
Response:
```json
{
    "status": "OTP sent",
}
```
15. Verify OTP
```
Endpoint: POST localhost:3000/api/auth/ngo/register/verify
```
Request Body:
```json
{
  "identifier":"ngo.saath@gmail.com",
  "otp":"16261"
}
```
Response:
```json
{
    "status": "registration successful",
    "data": {
        "_id": "67f60cd52f5bce3db4709e9d",
        "name": "sub ka saath",
        "location": {
            "coordinates": {
                "coordinates": [
                    32.32,
                    32.44
                ],
                "type": "Point"
            },
            "address": "nelium colony"
        },
        "role": "ngo",
        "email": "ngo.test@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9.bmdvLnRlc3RAZ21haWwuY29t.5jscceYZg89CauclNGax3p5QhJKFaa4nYtgTQYddvSY"
}
```

16. Login a User
```
Endpoint: POST http://127.0.0.1:3000/api/auth/ngo/login
```
Request Body:
```json
{
  "identifier":"ngo.saath@gmail.com",
  "password":"admin@123"
}
```
Response:
```json
{
    "status": "Logged in successfully",
    "data": {
        "_id": "67f6032e4e391e93cc99e393",
        "name": "sub ka saath",
        "location": {
            "coordinates": {
                "coordinates": [
                    32.32,
                    32.44
                ],
                "type": "Point"
            },
            "address": "nelium colony"
        },
        "role": "ngo",
        "email": "ngo.saarthi@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9.bmdvLnNhYXJ0aGlAZ21haWwuY29t.Ql77uQuuPXqlKohYnjmKp6bGObQKjxkee9Griz3YAMY"
}
```

17. get NGO list
```
Endpoint: GET http://127.0.0.1:3000/api/ngo
```
Response:
```json
{
    "status": "success",
    "data": [
        {
            "_id": "67f37b6f37980da48fb2fc19",
            "name": "nescomm",
            "registration_number": "asdfk49209320dfd",
            "email": "ngo@gmail.com",
            "password": "$2a$10$iqvDmgR04NQTF3.jtydMxe4hRZ3/Pg8dNcQpnQgzDTCnL9OtW6T/2",
            "focusAreas": "food",
            "establishment": "2002-12-01T18:30:00.000Z",
            "status": "active",
            "__v": 0,
            "location": {
                "coordinates": {
                    "type": "Point",
                    "coordinates": [
                        75.3,
                        76.98
                    ]
                },
                "address": "haldwani"
            },
            "contactPerson": "akshit",
            "contactPerson_phone": "949392392",
            "website": "0"
        },
        {
            "_id": "67f600231fb55ee52c10cded",
            "name": "sub ka saath",
            "registration_number": "ABSDCE353433",
            "email": "ngo.saath@gmail.com",
            "password": "$2a$10$01vCk7T5MuQmlBaC/ACX/.xeRE.WWpJj27Q7e1vscW8g2BFAbEwbS",
            "focusAreas": "food",
            "establishment": "2000-02-29T18:30:00.000Z",
            "status": "active",
            "__v": 0,
            "location": {
                "coordinates": {
                    "coordinates": [
                        32.32,
                        32.44
                    ],
                    "type": "Point"
                },
                "address": "nelium colony"
            },
            "contactPerson": "shivaji",
            "contactPerson_phone": "636025913",
            "website": "0"
        },
        {
            "_id": "67f60290a4fed443a5f51725",
            "name": "sub ka saath",
            "registration_number": "ABSDCE35343",
            "email": "ngo.saathi@gmail.com",
            "password": "$2a$10$Fya/cWG9EY/8tCLIICcBkObsClr9lU/oidKrnhPFacPXTj4yRG252",
            "focusAreas": "food",
            "establishment": "2000-02-29T18:30:00.000Z",
            "status": "active",
            "__v": 0,
            "location": {
                "coordinates": {
                    "coordinates": [
                        32.32,
                        32.44
                    ],
                    "type": "Point"
                },
                "address": "nelium colony"
            },
            "contactPerson": "shivaji",
            "contactPerson_phone": "636025913",
            "website": "0"
        },
        {
            "_id": "67f6032e4e391e93cc99e393",
            "name": "sub ka saath",
            "registration_number": "ABSDCE353493",
            "email": "ngo.saarthi@gmail.com",
            "password": "$2a$10$/xDfw6/AUJbUuJJglauMm.7DG1lEE6e4OdVDmoU.ZU25vSccRq2G.",
            "focusAreas": "food",
            "establishment": "2000-02-29T18:30:00.000Z",
            "status": "active",
            "__v": 0,
            "location": {
                "coordinates": {
                    "coordinates": [
                        32.32,
                        32.44
                    ],
                    "type": "Point"
                },
                "address": "nelium colony"
            },
            "contactPerson": "shivaji",
            "contactPerson_phone": "4930993209",
            "website": "www.something.com"
        },
        {
            "_id": "67f60cd52f5bce3db4709e9d",
            "name": "sub ka saath",
            "registration_number": "ABSDCE353df433",
            "email": "ngo.test@gmail.com",
            "password": "$2a$10$iRKjeA0jItfK7ecf4A9Jee5E39z9ot39O.ncJJRVPT4hQ806ddi1y",
            "focusAreas": "food",
            "establishment": "2000-02-29T18:30:00.000Z",
            "status": "active",
            "__v": 0,
            "location": {
                "coordinates": {
                    "coordinates": [
                        32.32,
                        32.44
                    ],
                    "type": "Point"
                },
                "address": "nelium colony"
            },
            "contactPerson": "shivaji",
            "contactPerson_phone": "4930993209",
            "website": "www.something.com"
        }
    ]
}
```

18. donate waste food
```
Endpoint: POST http://127.0.0.1:3000/api/ngo/donate
```
Request Body (FORM DATA):
```json
authorization : 'Bearer {token}' // token of a farmer or a storage owner
{
  "donor":"67d56ec3ffba679217bf0a0c",
  "donorModel" : "Farmers", // only two string are allowed : ["Farmers", "Storage"] (case sensitive)
  "ngo" : "67f6032e4e391e93cc99e393",
  "wasteType": "human", // ['human', 'cattle'] (case sensitive)
  "foodType" : "roti chawal",
  "quantity" : "1kg",
  "preparedOn": "8/4/2025",
  "availableOn" : "9/4/2025",
  "collectionPoint" : `{"address": "123 Street Name","coordinates": {"type": "Point","coordinates": [77.123456, 28.654321]}`, // use JSON.stringify(location object) before sending
  "image" : `send file`
}
}
```
Response:
```json
{
    "status": "success",
    "donation": {
        "donor": "67d56ec3ffba679217bf0a0c",
        "donorModel": "Farmers",
        "ngo": "67f6032e4e391e93cc99e393",
        "wasteType": "human",
        "foodType": "roti chawal",
        "quantity": "1kg",
        "preparedOn": "2025-08-03T18:30:00.000Z",
        "collectionPoint": {
            "address": "123 Street Name",
            "coordinates": {
                "type": "Point",
                "coordinates": [
                    77.123456,
                    28.654321
                ]
            }
        },
        "status": "Pending",
        "_id": "67f609969c5da3d89829f5f8",
        "__v": 0,
        "imageUrl": "/uploads/67f609969c5da3d89829f5f8-1744177558936.png"
    }
}
```

19. get donations given to a ngo
```
Endpoint: POST http://127.0.0.1:3000/api/ngo/donations
```
Request Body:
```json
authorization : 'Bearer {token}' // token of ngo
```
Response:
```json
{
    "status": "success",
    "data": [
        {
            "donor_details": {
                "id": "67d56ec3ffba679217bf0a0c",
                "name": "akshay",
                "phone": null,
                "email": "nol.void75@gmail.com",
                "address": {
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [
                            29.0222,
                            79.4908
                        ]
                    },
                    "address": "Pantnagar"
                }
            },
            "ngo_details": {
                "id": "67f37b6f37980da48fb2fc19",
                "name": "nescomm"
            },
            "collectionPoint": {
                "coordinates": {
                    "type": "Point",
                    "coordinates": [
                        77.123456,
                        28.654321
                    ]
                },
                "address": "123 Street Name"
            },
            "_id": "67f55930802ec93d88529763",
            "wasteType": "human",
            "foodType": "roti",
            "quantity": "1kg",
            "preparedOn": "2025-12-02T18:30:00.000Z",
            "status": "Pending",
            "__v": 0,
            "imageUrl": "/uploads/67f55930802ec93d88529763-1744132400422.png"
        },
        {
            "donor_details": {
                "id": "67d56ec3ffba679217bf0a0c",
                "name": "akshay",
                "phone": null,
                "email": "nol.void75@gmail.com",
                "address": {
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [
                            29.0222,
                            79.4908
                        ]
                    },
                    "address": "Pantnagar"
                }
            },
            "ngo_details": {
                "id": "67f37b6f37980da48fb2fc19",
                "name": "nescomm"
            },
            "collectionPoint": {
                "coordinates": {
                    "type": "Point",
                    "coordinates": [
                        77.123456,
                        28.654321
                    ]
                },
                "address": "123 Street Name"
            },
            "_id": "67f55a6278fc17d4a87a2de1",
            "wasteType": "human",
            "foodType": "roti",
            "quantity": "1kg",
            "preparedOn": "2025-12-02T18:30:00.000Z",
            "status": "Pending",
            "__v": 0,
            "imageUrl": "/uploads/67f55a6278fc17d4a87a2de1-1744132706437.png"
        },
        {
            "donor_details": {
                "id": "67d55ffadd85cc341df87fdc",
                "name": "akshay",
                "phone": null,
                "email": "nol.void75@gmail.com",
                "address": {
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [
                            29.0222,
                            79.4908
                        ]
                    },
                    "address": "Pantnagar"
                }
            },
            "ngo_details": {
                "id": "67f37b6f37980da48fb2fc19",
                "name": "nescomm"
            },
            "collectionPoint": {
                "coordinates": {
                    "type": "Point",
                    "coordinates": [
                        77.123456,
                        28.654321
                    ]
                },
                "address": "123 Street Name"
            },
            "_id": "67f56281749b8ccd120531c2",
            "wasteType": "human",
            "foodType": "roti",
            "quantity": "1kg",
            "preparedOn": "2025-12-02T18:30:00.000Z",
            "status": "Pending",
            "__v": 0,
            "imageUrl": "/uploads/67f56281749b8ccd120531c2-1744134785396.png"
        },
        {
            "donor_details": {
                "id": "67d56ec3ffba679217bf0a0c",
                "name": "akshay",
                "phone": null,
                "email": "nol.void75@gmail.com",
                "address": {
                    "coordinates": {
                        "type": "Point",
                        "coordinates": [
                            29.0222,
                            79.4908
                        ]
                    },
                    "address": "Pantnagar"
                }
            },
            "ngo_details": {
                "id": "67f37b6f37980da48fb2fc19",
                "name": "nescomm"
            },
            "collectionPoint": {
                "coordinates": {
                    "type": "Point",
                    "coordinates": [
                        77.123456,
                        28.654321
                    ]
                },
                "address": "123 Street Name"
            },
            "_id": "67f562f1749b8ccd120531c8",
            "wasteType": "human",
            "foodType": "roti",
            "quantity": "1kg",
            "preparedOn": "2025-12-02T18:30:00.000Z",
            "status": "Pending",
            "__v": 0,
            "imageUrl": "/uploads/67f562f1749b8ccd120531c8-1744134897082.png"
        }
    ]
}
```
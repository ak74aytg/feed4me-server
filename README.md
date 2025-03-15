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
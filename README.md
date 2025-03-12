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
```
Request Body:
```json
{ 
  "name": "rhohan", 
  "mobile": "894383834",
  "email": "something@example.com",
  "password": "admin@123",
  "age":31,
  "location":"roorkee"
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
  "message": "Register successful!"
}
```

3. Login a User
```
Endpoint: POST http://127.0.0.1:3000/api/auth/:role/login
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
    "_id": "6796808eb24826ee6e0305d5",
    "name": "mohan",
    "age": "31",
    "location": "roorkee",
    "password": "$2a$10$6SnM9j4kDJHvGXzURC9i3.UV.i/7KiytQLIGPKmjCqSwa2pE0hqKK",
    "mobile": "89438383439",
    "date": "2025-01-26T18:31:11.423Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.ODk0MzgzODM0Mzk.sFW7JVsm1Y3T5W2Zl3UsZWh0Dkuu-3Yb2PbTNIcM2rc"
}
```

4. Delete the User
```
Endpoint: DELETE http://127.0.0.1:3000/api/auth/:role/delete
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
    "location": "ramnagar",
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
    "customers": []
  }
}
```

8. update its information
```
Endpoint: PUT http://127.0.0.1:3000/api/farmer
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


Crops API documentation

9. add new crop
```
Endpoint: POST http://127.0.0.1:3000/api/crops
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
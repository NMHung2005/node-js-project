
# Laptopshop

This is an open-source e-commerce platform for a Laptopshop, built with Nodejs.

<p align="center">
  <img src="public\images\Capture.png" width="400" alt="Laptopshop Homepage" />
  <img src="public\images\Screenshot_1.png" width="400" alt="Laptopshop Product Details" />
</p>

<p align="center">
  <img src="public\images\Screenshot_2.png" width="400" alt="Laptopshop Products" />
  <img src="public\images\Screenshot_3.png" width="400" alt="Laptopshop Cart" />
</p>


## Tech Stack

* **Runtime Enviroment:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **Template Engine:** EJS (Embedded JavaScript templates)




## Features

- Secure User Authentication: Handles user registration and login using Passport.js.
- Advanced Filtering & Sorting: Easily filter products by brand and price, or sort them by price (ascending/descending).
- Shopping Cart Management: Add items to the cart, update quantities, or remove products. The total price is updated automatically.
- User Profile Management: Allows logged-in users to view and manage their personal information.
- ... and more to come!



## Run Locally

1\. Clone the project

```bash
  git clone https://github.com/NMHung2005/node-js-project.git
```

2\. Go to the project directory

```bash
  cd project-nodejs
```

3\. Install dependencies

```bash
  npm install
```

4\. Set up environment variables 
 - Copy the .env.example file to a new file named .env and update the variables with your PocketBase API URL.
```bash
  cp .env.example .env
```
 - Your .env file should look like this:
```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_string_for_jwt
JWT_EXPIRES_IN=1d
DATABASE_URL="mysql://root:your_password@localhost:3306/my_project_db"
```

5\. Run Database Migrations
 - This project uses Prisma to manage the database schema. Run the following command to create all the necessary tables based on the prisma/schema.prisma file.
```bash
  npx prisma migrate dev
```

6\. Start the server

```bash
  npm run start
```


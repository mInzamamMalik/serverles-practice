#Serverless MongoDB connection Example.

In this example we have implemented the functioanlity to connect to mongo db along with password encryption using BCRYPT. We have implemented Signup and Login functionality in serverless archtecture in this example.

After initialization of serverless function we will add our required modules and also update Package.json file.

As we have used <b>node js</b> we made a folder for db and pureFunctions.


<dl>
  <dt>DB:</dt>
  <dd>In this folder we have made a basic user model..</dd>

  <dt>PureFunctions:</dt>
  <dd>In this folder we have made our methods like generateToken, verifyToken, etc on the pattern we are already following for node js applications.</dd>
</dl>

After this we are going to require all the modules that we will be using in handler.js file and will also make a database connection. 
We are ready to play now. We will just call the methods from our modules and perform the desired functionality. 
This is how we will be using node js modules in serverless architecture.

> *Note:* Although we have Package.json file but we have to push our node_modules folder as well when we are deploying this function to AWS.

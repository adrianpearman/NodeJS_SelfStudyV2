# NodeJS_SelfStudyV2
#NodeAPP1
Purpose: Introduction to Node with the concepts of filesync to a locale file. Creating a CRUD note system.

Packages Used:
"lodash": a module for taking the hassle out of working with arrays, numbers, objects, strings, etc.
"yargs": used to create command line interface for the node project


#NodeAPP2
Purpose: This application is builds off of some of basic information discussed in the first application. This application will return the information provide by a user and display the weather of in user's input. The folder contains to examples. the first(app.js) provides the functionality with no promise values where the second(app-promise.js) provides a promised based option.

Packages Used:
"axios": Promise based package to perform GET requests for the data
"request": used to perform an HTTP request with no promises
"yargs": used to create command line interface for the node project

API's:
DarkSky - for weather information
GoogleMaps - for fetching the latitude and longitude of an address


#NodeAPP3
Purpose: The purpose of the application is a low level introduction connecting Node to a front end application. For the purpose of this application, we use Handlebar to create the connection between front and backend

Packages Used:
"express": Used to create a server to run the application
"hbs": HandleBar.js a framework used to create partials and pass information to the front end


#NodeAPP4
Purpose: Introduction to unit testing in Node. The platform of choice is Mocha with supertest used for request handling and expect for test assertion.

Packages Used:
"expect": Test assertions suite used to test functions
"express": Used to create a server to run the application
"mocha": "^4.0.1",
"rewire": "^3.0.1",
"supertest": "^3.0.0"


#NodeAPP5
Purpose: Exploring commonly used security protocols in creating node applications. This application creates a TODOs application that is able to provide security for information held by different users. The application also highlights key differences between production, development and testing environments.

Packages Used:
"bcryptjs": creates a hash with a salt value. presented as a more secure option of holding password information compared to crypto.js
"body-parser": middleware used to send the request as json to the database
"crypto-js": Coverts a string into a encrypted value of 256
"jsonwebtoken": allows you to decode, verify and generate JSON Web Tokens
"lodash": a module for taking the hassle out of working with arrays, numbers, objects, strings, etc.
"mongodb": the native driver for interacting with a mongodb instance. used in this project to created new ObjectID values
"mongoose": an Object modelling tool for MongoDB.
"validator": A library of string validators and sanitizers.
"expect": Test assertions suite used to test functions
"mocha": Testing suite used to test the functions created in the application
"nodemon": Used to auto reload the server after a change
"supertest": Provides a high-level abstraction for testing HTTP


#NodeAPP6
Purpose: Creating a real time web application that allows for users to enter chat rooms and talk with other individuals in the same room. Highlighting to a higher degree the functions of the previous examples. The application utilizes front and backend technologies to

Live Example: https://thawing-anchorage-24776.herokuapp.com/

Packages Used:
"express": Used to create a server to run the application
"moment": To format the timestamps of each of the sent messages
"socket.io": Used to create the connection between users
"expect": Test assertions suite used to test functions
"mocha": Testing suite used to test the functions created in the application
"nodemon": Used to auto reload the server after a change


#NodeAPP7
Purpose: This project contains an application that is able to perform currency exchanges while providing the countries where the exchanged currency is available to be used. The purpose of this application was to show how we can take advantage of the 'async await' functionality in comparison to the passing Promises.

Packages Used:
"axios": Promise based package to perform HTTP requests for the data

API's:
fixer.io - To receive the exchange rates of a currency
restcountries.eu - To provide information on where the currency can be used


#NodeMYSQL
Purpose: Simple mock connection application to highlight the ability to connect to a MYSQL application using Node.

Packages Used:
'mysql'


#NodePostgreSQL
Purpose:
Packages Used:

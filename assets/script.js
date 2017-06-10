 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyBqib18_w1C_70mMuM1UTGJ6V_JysodMMw",
     authDomain: "train-scheduler-7e5ca.firebaseapp.com",
     databaseURL: "https://train-scheduler-7e5ca.firebaseio.com",
     projectId: "train-scheduler-7e5ca",
     storageBucket: "train-scheduler-7e5ca.appspot.com",
     messagingSenderId: "194965452053"
 };
 firebase.initializeApp(config);

 // Create a variable to reference the database
 var database = firebase.database();

 // Button for adding trains
 $("#train-button").on("click", function(event) {
     event.preventDefault();

     // Grabs user input
     var trainName = $("#train-name").val().trim();
     var trainDestination = $("#train-destination").val().trim();
     var trainTime = moment($("#train-time").val().trim(), "HH:mm").format();
     var trainFrequency = $("#train-frequency").val().trim();

     // Creates local "temporary" object for holding train data
     var newTrain = {
         name: trainName,
         destination: trainDestination,
         time: trainTime,
         frequency: trainFrequency,
     }

     // Uploads train data to the database
     database.ref().push(newTrain);


     // Logs everything to console
     console.log(newTrain.name);
     console.log(newTrain.destination);
     console.log(newTrain.time);
     console.log(newTrain.frequency);

     // Alert
     alert("Train successfully added to schedule!");

     // Clears all of the text-boxes
     $("#train-name").val("");
     $("#train-destination").val("");
     $("#train-time").val("");
     $("#train-frequency").val("");


     return false;

 });

 //Create Firebase event for adding train to the database and a row in the html when a user adds an entry
 database.ref().on("child_added", function(childSnapshot, prevChildKey) {

     console.log(childSnapshot.val());

     // Stores everything into a variable
     var trainName = childSnapshot.val().name;
     var trainDestination = childSnapshot.val().destination;
     var trainTime = childSnapshot.val().time;
     var trainFrequency = childSnapshot.val().frequency;

     // Train Info
     console.log(trainName);
     console.log(trainDestination);
     console.log(trainTime);
     console.log(trainFrequency);

     // First Train Time 
     var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
     console.log(trainTimeConverted);

     // Current Time
     var currentTime = moment();
     console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

     // Difference between the times
     var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
     console.log("DIFFERENCE IN TIME: " + diffTime);

     // Time apart (remainder)
     var trainRemainder = diffTime % trainFrequency;
     console.log(trainRemainder);

     // Minutes Until Next Train
     var trainMinutesTill = trainFrequency - trainRemainder;
     console.log("MINUTES TILL TRAIN: " + trainMinutesTill);

     // Next Train
     var nextTrain = moment().add(trainMinutesTill, "minutes");
     console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

     // Add train info into the train schedule table
     $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
         trainFrequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + trainMinutesTill + "</td><td>" + "" + "</td></tr>");

 });

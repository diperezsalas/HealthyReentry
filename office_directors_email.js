// heroku scheduler script for automated email to office directors
// heroku scheduler every friday

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var moment = require('moment');
moment().format();

const sgClient = require('@sendgrid/mail');

sgClient.setApiKey(process.env.SENDGRID_API_KEY); 
var sender = process.env.SENDGRID_EMAIL;
var url = process.env.MONGO_URL;

const fs = require('fs');
var content = fs.readFileSync("./server/assets/email_templates/officeDirectorsReport.html").toString("utf-8");

let directors = {
    "Madrid": "diego.perez@nexplore.com", 
    "Mineapolis": "shady.nawara@nexplore.com"
}


//"Name,Email\r\n";
function nodeToCsv(node) {
    return `${node.name},${node.email}\r\n`;
}

let allUsers = [];



MongoClient.connect(url, {
    useUnifiedTopology: true
}).then(function (db) {
    console.log("CONNECTED TO DB");


    getUsers(db).then(function () {
        //console.log("allUsers", allUsers);
        Object.keys(directors).forEach((key, index) => {
            // three attachment
            // 1. employees who have signed up for the app, 
            // 2. employees who have signed up for the app but haven't reported their health status for more than 7 days,
            // 3. the number of app users in your office with a health status of Red and/or Orange.

            console.log(key); // office

            // 1. employees who have signed up for the app, 
            const usersbyOffice = allUsers.filter(u => u.location === key);
            console.log("usersbyOffice", usersbyOffice.length);
            if(usersbyOffice.length === 0 ) return;     
            let csvHeader = "Name,Email\r\n";
            let csv = csvHeader;

            usersbyOffice.forEach((user) => {
                csv += nodeToCsv(user)
            })
            let attachment = Buffer.from(csv).toString('base64');

            // 2. employees who have signed up for the app but haven't reported their health status for more than 7 days,
            var checkDate = new Date();
            var pastDate = checkDate.getDate() - 7;
            checkDate.setDate(pastDate);

            const usersneedsUpdate = usersbyOffice.filter(u => u.status.date < checkDate);
            let csv2 = csvHeader;
            usersneedsUpdate.forEach((user) => {
                csv2 += nodeToCsv(user)
            })
            let attachment2 = Buffer.from(csv2).toString('base64');

            // 3. the number of app users in your office with a health status of Red and/or Orange.
            const usersStatusOrange = usersbyOffice.filter(u => u.status.status === 1);
            const usersStatusRed = usersbyOffice.filter(u => u.status.status === 2);
            let csv3 = "Orange,Red,Total App Signups in Office\r\n";
            var numberOfOrange = usersStatusOrange.length;
            var numberOfRed = usersStatusRed.length;
            var total =  usersbyOffice.length;
            csv3 += `${numberOfOrange},${numberOfRed},${total}\r\n`
            let attachment3 = Buffer.from(csv3).toString('base64');
            
            sendEmail(directors[key], key, attachment, attachment2, attachment3);

        });

    })

}).catch(err => {
    console.error("An error occurred reading the database.");
    console.error(err);
});

function getUsers(client_db) {
    return new Promise((resolve, reject) => {
        let db = client_db.db();

        let include = {
            "_id": 1,
            // "dateOfConsent": 1,
            "name": 1,
            "location": 1
        }

        let collection = db.collection('users');
        let statusCollection = db.collection('status');

        collection.find({}, include).toArray(function (err, users) {
            var counter = 0;
            for (let u of users) {
                statusCollection.find({
                        "user": u._id
                    })
                    .sort({
                        date: -1
                    })
                    .limit(1).toArray(function (error, st) {                  
                        u.status = st[0];
                        allUsers.push(u);
                        isDone();

                    });

            }



            function isDone() {
                counter += 1;
                if (users.length === counter) {
                    resolve(true);
                }
            }


        });




    });


}

function sendEmail(toEmail, location, attachment, attachment2, attachment3) {

    const mailOptions = {
        to: toEmail,
        from: sender,
        subject: "Healthy Reentry – Weekly Report for " + location,
        html: content
    };

    if (attachment) {
        mailOptions.attachments = [{
                "content": attachment,
                "filename": "Employees Who Signed up.csv",
                "type": "text/csv"
            },
            {
                "content": attachment2,
                "filename": "Employees Who Have Not Updated in 7 Days.csv",
                "type": "text/csv"
            },
            {
                "content": attachment3,
                "filename": "Breakdown by Health Status.csv",
                "type": "text/csv"
            }
            
        ]
    }

    sgClient.send(mailOptions, function (err) {
        console.log("err?", err)
        if (err)
            return;
        else
            console.log('sent');

    });



}
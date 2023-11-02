const express = require("express");
const { google } = require("googleapis");
const path=require('path');
const credentialsPath="./credentials.json"; // Update with the correct path to your credentials file
const app = express();

//https://docs.google.com/spreadsheets/d/1ZGUVxQVn6P5Gf_ImtiSUvC4MpC5esva8AfxN-rcmmhM/edit#gid=0


app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.get('/user',(req,res)=>{
  res.render('index.ejs');
// res.redirect('/user');
})

app.get('/', async (req, res) => {
  try {
    // Load the service account credentials JSON file
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create a client instance for authentication
    const client = await auth.getClient();

    // Create an instance of the Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    // Define the spreadsheetId for the Google Sheet you want to access
    const spreadsheetId = "1ZGUVxQVn6P5Gf_ImtiSUvC4MpC5esva8AfxN-rcmmhM"; // Replace with your actual spreadsheet ID

    // Get data from the spreadsheet
    const getData = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:C", // Specify the sheet name without a specific range to fetch all data
    });

    const values = getData.data.values;

    if (!values || !values.length) {
      res.send('No data found.');
    } else {
      // Print data in a tabular format
      let table = '<table>';
      for (let row of values) {
        table += '<tr>';
        for (let cell of row) {
          table += '<td>' + cell + '</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      res.send(table);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Google Sheets');
  }
});

app.listen(3400, () => {
  console.log('Server is running on port 3400');
});


    // const getData = await googleSheets.spreadsheets.values.update({
    //     auth,
    //     googleSheetsId,
    //     Range:"Sheet1!A:C",
    //     valueInputOption:"USER_INPUTE",
    //      resource:{
    //         values:[['subodh kumar','subodh@gmail.com',34433]]
    //     }
    // })

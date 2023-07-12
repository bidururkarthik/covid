const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;

const dbpath = path.join(__dirname, "covid19India.db");

const intiallsetserverdatabase = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("running server http://localhost3000");
    });
  } catch (error) {
    console.log(`database error ${error.message}`);
  }
};

intiallsetserverdatabase();

//get state details method

app.get("/states/", async (request, response) => {
  const allstatedetailsquery = `
       SELECT
         *
       FROM
         state
    `;
  const statearray = await db.all(allstatedetailsquery);
  response.send(statearray);
});

//get specfic state details ID
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const Query_1state_details = `
        SELECT
          *
        FROM
        state
        WHERE state_id = ${stateId}
    `;
  const specificarraystate = await db.all(Query_1state_details);
  response.send(specificarraystate);
});

//post method district

app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const postquery = `
        INSERT INTO
           district (district_name,state_id,cases,cured,active,deaths)
        VALUES(
            '${districtName}',
            ${stateId},
            ${cases},
            ${cured},
            ${active},
            '${deaths}'
        )   
    `;
  const responsedistrict = await db.run(postquery);
  response.send("District Successfully Added");
});

//specfic details distric get
app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;

  const districdetailsquery = `
        SELECT
          *
        FROM 
          district
        WHERE
          district_id=${districtId}    
    `;
  const responsedb = await db.all(districdetailsquery);
  response.send(responsedb);
});

//delete
app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deletequerydistrict = `
       DELETE FROM
       district
       WHERE 
       district_id = ${districtId}
    `;
  await db.run(deletequerydistrict);
  response.send("District Removed");
});

//Updates the details of a specific district based on the district ID
app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;

  const districtqueryput = `
      update
        district
      SET 
        district_name=${districtName},
        state_id=${stateId},
        cases=${cases},
        cured=${cured},
        active=${active},
        deaths=${deaths}
     WHERE
        district_id = ${districtId}   
    `;
  await db.run(districtqueryput);
  response.send("District Details Updated");
});

//Returns the statistics of total cases, cured, active, deaths of a specific state based on state ID

app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const statequery = `
       SELECT
         *
       FROM
          district
       WHERE
         state_id = ${stateId}  
    `;
  const statearray = await db.all(statequery);
  response.send(statearray);
});

//Returns an object containing the state name of a district based on the district ID

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const districtquery = `
       SELECT
         *
       FROM
          district
       WHERE
         district_id = ${districtId}  
    `;
  const districtarray = await db.all(districtquery);
  response.send(districtarray);
});

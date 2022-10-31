import { parse } from "csv-parse"; //this csv-parse package converts the CSV text to readable arrays or objects.which also implements the Node.js stream API.
import fs from "fs"; // file system from node to read the file




const habitablePlanets = []; //initial array to hold our results


//function to filter habitable planets from the kepler-data
const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};


fs.createReadStream("kepler_data.csv") // this reads just the raw data as a stream
// the pipe connects the two streams together .
 .pipe(
    parse({ 
      comment: "#",     // for the file to be parsed correctly,we telling it that, it should treat each line with # as comments 
      columns: true, // this will return each row as javascript objects with key value pairs rather than just an array of the values.
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) habitablePlanets.push(data);
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(habitablePlanets.map((planet)=>{
        return planet['kepler_name']
    }))
    console.log(`${habitablePlanets.length} habitable Planets found!`);
  });

// Create Dino class and comparison methods
class Dinosaurs {
  constructor(dino) {
    this.species = dino.species;
    this.height = dino.height;
    this.weight = dino.weight;
    this.diet = dino.diet;
    this.name = dino.name;
    this.fact1 = dino.fact;
  }

  compareHeight(humanHeight, humanName) {
    this.fact2 =
      this.species +
      " is " +
      (this.height > humanHeight ? "taller" : "shorter") +
      " than " +
      humanName +
      "!";
  }
  compareWeight(humanWeight, humanName) {
    this.fact3 =
      this.species +
      " is " +
      (this.weight > humanWeight ? "bigger" : "smaller") +
      " than " +
      humanName +
      "!";
  }
  compareDiet(humanDiet, humanName) {
    this.fact4 =
      this.species +
      " has a " +
      (this.diet === humanDiet ? "similar" : "different") +
      " diet compared to " +
      humanName +
      "!";
  }
}

// Create Dino Objects with async function with fetch
async function getDinoData() {
  try {
    const response = await fetch("dino.json");
    const data = await response.json();
    return data.Dinos.map((dino) => new Dinosaurs(dino)); // return array of Dino objects
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Generate Tiles for each Dino in Array
async function makeTiles(human) {
  const tilesWrapper = document.getElementById("grid"); //wrapper for the html grid
  tilesWrapper.innerHTML = ""; // make sure grid is empty

  const dinoData = await getDinoData(); // wait for the dino array
  dinoData.splice(4, 0, human); // insert human object at index 4

  dinoData.forEach((dino) => {
    // loopinhg through the dino array
    const tile = document.createElement("div");
    tile.className = "grid-item";
    dino.img = "/images/" + dino.species.toLowerCase() + ".png"; // dino image path

    // create alternate facts
    dino.compareHeight(human.height, human.name);
    dino.compareWeight(human.weight, human.name);
    dino.compareDiet(human.diet, human.name);

    // Randomly select a fact to display per dino
    // except for pigeon which should always show fact1
    const randomNum = Math.floor(Math.random() * 4) + 1;
    if (dino.species === "Pigeon") {
      dino.displayFact = dino.fact1;
    } else {
      dino.displayFact = dino["fact" + randomNum];
    }

    // check for human to display name and image
    // else display species and image and details
    if (dino.species === "Human") {
      tile.innerHTML = `
                <h3>${dino.name}</h3>
                <img src="${dino.img}" alt="${dino.species}">
            `;
    } else {
      tile.innerHTML = `
                <h3>${dino.species}</h3>
                <img src="${dino.img}" alt="${dino.species}">
                <p>${dino.displayFact}</p>
                <div class="details">
                    <ul>
                        <li>Height: ${Math.floor(dino.height / 12)}' ${
                          dino.height % 12
                        }"</li>
                        <li>Weight: ${dino.weight} lbs</li>
                        <li>Diet: ${dino.diet}</li>
                    </ul>
                </div>
            `;
    }

    tilesWrapper.appendChild(tile);
  });

  // Hide the form after displaying the grid
  const form = document.getElementById("dino-compare");
  form.style.display = "none";
}

// On button click, prepare and display infographic
// Use IIFE to get human data from form
(function () {
  const button = document.getElementById("btn");

  button.addEventListener("click", function () {
    // Get human data from form
    const humanName = document.getElementById("name");
    const humanFeet = document.getElementById("feet");
    const humanInches = document.getElementById("inches");
    const humanWeightInput = document.getElementById("weight");
    const humanDiet = document.getElementById("diet");
    const errorDiv = document.getElementById("error-div");

    const humanHeight =
      parseInt(humanFeet.value) * 12 + parseInt(humanInches.value);
    const humanWeight = parseInt(humanWeightInput.value);

    //reset form validation styles and errors
    errorDiv.innerHTML = "";
    let errorMessage = "";

    // validate form data
    function validateForm() {
      let isValid = true;

      //check if inputs are empty
      [humanName, humanFeet, humanInches, humanWeightInput].forEach((input) => {
        input.classList.remove("error");
        if (input.value.trim() === "") {
          input.classList.add("error");
          errorMessage = "Please fill out all fields.";
          isValid = false;
        }
      });

      //check if inputs are numbers
      [humanFeet, humanInches, humanWeightInput].forEach((input) => {
        if (isNaN(input.value)) {
          input.classList.add("error");
          errorMessage = "Please enter valid numbers for height and weight.";
          isValid = false;
        }
      });

      return isValid;
    }

    if (validateForm()) {
      // Create Human Object
      const human = new Dinosaurs({
        species: "Human",
        height: humanHeight,
        weight: humanWeight,
        diet: humanDiet.value,
        name: humanName.value.trim(),
      });

      // Fetch Dino data and compare with Human and make tiles
      makeTiles(human);
    } else {
      errorDiv.textContent = errorMessage;
    }
  });
})();

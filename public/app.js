// request to URL, then run c/b function
var makeRequest = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url);

  request.onload = callback;
  request.send();
};

// look up name on API
var getGender = function(name, callback) {
  var url = "https://api.genderize.io/?name=" + name;
  makeRequest(url, callback);
}

// c/b for request being done
var requestComplete = function(){
  // get back data from API
  var responseString = this.responseText;
  // in JSON format so parse it
  var output = JSON.parse(responseString);
  console.log(output);
  // fetch div to show gender inside
  var genderDisplay = document.getElementById('gender');
  // make a new div to put message into
  var genderDiv = document.createElement('div');
  // centre text
  genderDiv.className = "center " +  output.gender;
  // write what gender it is
  genderDiv.innerText = "This name is " + output.gender + ".";

  // clear last result 
  genderDisplay.innerHTML = '';
  // add this result to page
  genderDisplay.appendChild(genderDiv);

  // prepare data for chart
  // the gender API predicts
  var predictedGender = output.gender;
  // probability of predicted one
  var predictedGenderProb = output.probability;
  // ascertain the other gender 
  var otherGender = (output.gender == 'male') ? 'female' : 'male';
  // ascertain order of colours for each gender
  var colourArray = []
  // ternary op. - if male = blue, o/w pink
  // add the colour to array (chart.js requires an array)
  colourArray.push((output.gender == 'male') ? "#36A2EB" : "#FF6384");
  // second colour, so if male, pink, else blue
  colourArray.push((output.gender == 'male') ? "#FF6384" : "#36A2EB");
  // probability of other gender
  var otherProb = 1.0 - predictedGenderProb;
  // put probabilities into array
  var dataArray = [];
  // first is predicted gender probability
  dataArray.push(predictedGenderProb);
  // then other one
  dataArray.push(otherProb);

  // the data to chart
  var data = {
      labels: [
          predictedGender, // text to show - "male" or "female"
          otherGender
      ],
      datasets: [
          {
              data: dataArray, // probabilities
              backgroundColor: colourArray // colours - pink for female, blue for male
          }]
  };

  // override default to set size manually, o/w graph too large
  var options = {responsive: false}
  // make a canvas
  var canvas = document.createElement('canvas');
  canvas.width="400";
  canvas.height="400";
  //  must be inline or width + height are ignored
  canvas.style.display = 'inline';
  // chart.js needs a context to the canvas
  var ctx = canvas.getContext('2d');

  ctx.display = 'inline';
  // create new doughnut chart
  var myDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
  });
  // find canvas container div in DOM
  var container = document.getElementById('canvas-container');
  // clear out any old canvases
  container.innerText = "";
  // add new canvas to screen
container.appendChild(canvas);
  
};

// button has been pressed now
var buttonPressed = function() {
  // obtain name entered in text box
  var nameBox = document.getElementById('name');
  var name = nameBox.value;
  // web request (to find gender)
  getGender(name, requestComplete);
}


// set event on button click
var mainApp = function(){
  var button = document.getElementById("submit");
  // button click event
  button.onclick = buttonPressed;
};

window.onload = mainApp;


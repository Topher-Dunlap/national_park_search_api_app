'use strict';
let spinner;

//state list
const state_list = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

//variables
// let state_id;
const apiKey = 'api_key=P6jXQdXYBnqZbUb5wuWodKs0YDBFMyCRiPtsHa22'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks?';
let state_id = '';
let limit_num ='';
//Functions
$("form").submit((event) => {
   spinner = new Spin.Spinner().spin(document.querySelector('body'));
  event.preventDefault();
  state_id = $('input[type="text"]').val();
  limit_num = $('input[type="number"]').val();
  fetch_api_data(state_id, limit_num);
  
});


function fetch_api_data(state_id, limit_num=10) {
let url = `${searchURL}stateCode=${state_id}&${limit_num}&${apiKey}`; 
console.log(url);

fetch(url)
    .then((response) => response.json())
    .then((responseJson) => displayResults(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

function add_state_name(state) {
    state = state.toUpperCase();
    let state_name = "";
    state_name += `<h2 class="results-img"> ${state_list[state]} State Parks </h2>`;  
    $("#show").prepend(state_name);
}

function displayResults(responseJson) {
let obj = responseJson;
let api_data_holder = "";
let api_park_address_holder = "";
if (limit_num > obj.data.length) {
    limit_num = obj.data.length;
    console.log(limit_num);
}
for (let i = 0; i < limit_num; i++) {
    let park_name = obj.data[i].name;
    let park_URL = obj.data[i].url;
    let park_desc = obj.data[i].description;
    
    //replace the existing image with the new one
    api_data_holder += `<h3 class="results-img">${park_name}:
                        <br>
                        <a href="${park_URL}" class="results-img">${park_URL}</a>
                    </h3>
                    <p>${park_desc}</p>
                    <ul class="park_address">` +
                    obj.data[i].addresses.reduce((acc, curr) => {
        if (curr.type !== 'Physical') {
            return acc;
        }
        const { line1, line2, line3, stateCode, city, postalCode} = curr;
        return `
        <li>
            ${line1}${line2}${line3}, ${city} ${stateCode}, ${postalCode}
        </li>`;
    }, '') + '</ul>';
    $("#park_address").html(api_park_address_holder);
}
  //display the results section
  $("#show").html(api_data_holder);
  $(".results").removeClass("hidden");
  add_state_name(state_id);
  spinner.stop();
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  // watchForm();
});
/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

// This calls the addCards() function when the page is first loaded
//document.addEventListener("DOMContentLoaded", showCards);
//html file ready --> load every player
//NOTE: add filter by bday & search players
let players = [];
let sortedPlayers = [];
let currentCardIdx = 0;
const cardLoadSize = 16;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("players.json");
    players = await response.json();
    sortedPlayers = [...players];
    showMorePlayers(); //first 10 players loaded

    //lazy load when they scroll to bottom
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        showMorePlayers();
      }
    });
  } catch(error) {
    console.error("Error loading players chat:", error);
  }
});

function showMorePlayers() {
  //base case: check for invalid idx
  if(currentCardIdx >= sortedPlayers.length) return;
  
  const container = document.getElementById("card-container");
  const template = document.querySelector(".card");

  //load next batch of cards thru new arr --> clone template & update to page
  const nextPlayerCards = sortedPlayers.slice(currentCardIdx, currentCardIdx + cardLoadSize);
  nextPlayerCards.forEach(
    (player) => {
    const card = template.cloneNode(true);
    card.style.display = "block";
    editCardContent(card, player);
    container.appendChild(card);
  });

  currentCardIdx += cardLoadSize;
}

function editCardContent(card, player) {
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = `${player.fname} ${player.lname}`;

  const cardImage = card.querySelector("img");
  cardImage.src = `img/${player.playerid}.png`;
  cardImage.alt = `${player.fname} ${player.lname} basetball photo`;

  const ul = card.querySelector("ul");
  ul.innerHTML = `
    <li><strong>Position:</strong> ${player.position}</li>
    <li><strong>Height:</strong> ${player.height}</li>
    <li><strong>Weight:</strong> ${player.weight} lbs</li>
    <li><strong>Birthday:</strong> ${player.birthday}</li>
  `;

  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  console.log("new basketball player card:", player.fname + player.lname, "- html: ", card);
}

document.getElementById("search").addEventListener("input", (inputStr) => {
  const userSearchStr = inputStr.target.value.toLowerCase();
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  const filteredPlayers = sortedPlayers.filter((player) =>
    (`${player.fname} ${player.lname}`.toLowerCase().includes(userSearchStr))
  );

  //reset idx so lazy loading works again!! --> add filtered cards to DOM
  currentCardIdx = 0;
  filteredPlayers.forEach((player) => {
    const card = document.querySelector(".card").cloneNode(true);
    card.style.display = "block";
    editCardContent(card, player);
    container.appendChild(card);
  });
});

document.getElementById("sort-selection").addEventListener("change", (currSelection) => {
  const selected = currSelection.target.value;
  const sorted = [...players]; //note: array must be copied since we don't need to change original arr

  if (selected === "youngest") {
    sorted.sort((a, b) => new Date(b.birthday) - new Date(a.birthday));
  } else if (selected === "oldest") {
    sorted.sort((a, b) => new Date(a.birthday) - new Date(b.birthday));
  }

  //point copy sorted array to sorted array based on selection
  sortedPlayers = sorted;
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  currentCardIdx = 0;
  showMorePlayers();
});

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "BLOCKED BY LEBRON"
  );
}
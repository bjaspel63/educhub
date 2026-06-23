let websites=[];

fetch("websites.json")
.then(r=>r.json())
.then(data=>{
    websites=data;
    display(websites);
    displayRecommended();
});

const container=document.getElementById("container");

function display(data){

container.innerHTML="";

data.forEach(site=>{

let favs=JSON.parse(localStorage.getItem("favorites"))||[];

container.innerHTML+=`
<div class="card" style="border-top:10px solid ${site.color}">
    
<div class="favorite"
onclick="toggleFavorite('${site.name}')">
${favs.includes(site.name)?"⭐":"☆"}
</div>

<img class="thumbnail" src="${site.thumbnail}">

<div class="content">

<h2>${site.icon} ${site.name}</h2>

<p>${site.description}</p>

<div>
${site.grade.map(g=>`<span class="grade">${g}</span>`).join("")}
</div>

${site.recommended ? "<div class='teacher'>❤️ Teacher Recommended</div>" : ""}

<div class="actions">

<button onclick="speak('${site.description}')">
🔊 Listen
</button>

<button onclick="window.open('${site.link}')">
🚀 Visit
</button>

</div>

</div>

</div>
`;
});
}

function speak(text){
let speech=new SpeechSynthesisUtterance(text);
speech.lang="en-US";
speech.rate=1;
speechSynthesis.speak(speech);
}

function toggleFavorite(name){

let favs=JSON.parse(localStorage.getItem("favorites"))||[];

if(favs.includes(name))
favs=favs.filter(x=>x!==name);
else
favs.push(name);

localStorage.setItem("favorites",JSON.stringify(favs));

display(websites);
}

search.oninput=filter;
category.onchange=filter;

function filter(){

let text=search.value.toLowerCase();
let cat=category.value;

let filtered=websites.filter(site=>

(site.name.toLowerCase().includes(text) ||
site.subject.toLowerCase().includes(text))

&&

(cat==="All" || site.subject===cat)

);

display(filtered);

}

themeBtn.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
);

};

if(localStorage.getItem("theme")==="true")
document.body.classList.add("dark");

surpriseBtn.onclick=()=>{

let random=websites[Math.floor(Math.random()*websites.length)];

window.open(random.link);

};

function displayRecommended(){

recommended.innerHTML="";

websites
.filter(site=>site.recommended)
.forEach(site=>{

recommended.innerHTML+=`
<div class="card" style="min-width:250px;border-top:10px solid ${site.color}">
<img class="thumbnail" src="${site.thumbnail}">
<div class="content">
<h3>${site.icon} ${site.name}</h3>
</div>
</div>
`;

});

}
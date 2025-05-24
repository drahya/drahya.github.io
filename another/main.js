(async () => {
  const sheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTMgxBdZvn9aYFJ8NxWuXQpyGER9bbBc2Iyor2eCYhGNCHAWMiAgFfJqnDzk5VmVfI4xpXybGB1AETA/pub?output=csv";
  const response = await fetch(sheets);
  const csvText = await response.text();

const sanitizeName = (name) => {
  const accentsMap = new Map([ ['á', 'a'], ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['å', 'a'], ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['í', 'i'], ['ì', 'i'], ['î', 'i'], ['ï', 'i'], ['ó', 'o'], ['ò', 'o'], ['ô', 'o'], ['ö', 'o'], ['õ', 'o'], ['ø', 'o'], ['ú', 'u'], ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ý', 'y'], ['ÿ', 'y'], ['ñ', 'n'], ['ç', 'c'] ]);
  let sanitized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  sanitized = Array.from(sanitized).map(char => accentsMap.get(char) || char).join('');
  return sanitized.replace(/[^A-Za-z0-9_\-]/g, '_');
};



/**
 * Convertit une chaîne CSV en objet JSON en utilisant ES6
 * @param {string} csvString - La chaîne CSV à convertir
 * @returns {Array} - Tableau d'objets représentant les données CSV
 */
const csvToJson = (csvString) => {
  try {
    const lines = [];
    let currentLine = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
        currentLine += char;
      } else if (char === '\n' && !insideQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/\r/g, '');

        if (value.includes('\n')) {
          value = value.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion CSV en JSON:", error);
    return [];
  }
};




const bgColors = ["red", "blue","gray","green","yellow","purple","orange","pink","brown","black","white"];

const _json = csvToJson(csvText);

// ajoute 6 fois _json dans const json
const json = [..._json, ..._json, ..._json,..._json, ..._json, ..._json];



const $projets = document.querySelector(".projets");

// parcourir le json et créer les éléments
json.forEach((item) => {
  const div = document.createElement("div");
  div.classList.add("projet");
  $projets.appendChild(div);
  // gsap.set(div,{backgroundColor: e => gsap.utils.random(bgColors)});
  // gsap.from(div, {
  //   x: e=> gsap.utils.random(-1000,1000),
  //   y : e  => gsap.utils.random(-1000,-20),
  //   opacity:0, duration: 0.5 });

  const img = document.createElement("img");
  img.src = `img/${sanitizeName(item.titre)}.jpg`;
  div.appendChild(img);


  const titre = document.createElement("h1");
  titre.textContent = item.titre;
  div.appendChild(titre);

  const categories = document.createElement("div");
  categories.textContent = item.catégories;
  div.appendChild(categories);

  const description = document.createElement("p");
  description.textContent = item.description;
  div.appendChild(description);

  div.addEventListener("click", () => {
    const header = document.querySelector("header");
    header.classList.add("fixed");

    const projets = document.querySelector(".projets");
    projets.classList.add("fixed");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    const wrap = document.createElement("div");
    wrap.classList.add("wrap");
    overlay.appendChild(wrap);

    const fiche = document.createElement("div");
    fiche.classList.add("fiche");
    wrap.appendChild(fiche);

    const close = document.createElement("div");
    close.textContent = "×";
    close.classList.add("close");
    overlay.appendChild(close);

    // amélioration de la fermeture de la fiche
    overlay.addEventListener("click", (e) => {
      if (e.target === fiche || fiche.contains(e.target)) return;
      gsap.to(overlay, {opacity: 0, duration: 0.2, onComplete: () => overlay.remove()});
      header.classList.remove("fixed");
      projets.classList.remove("fixed");
    });

    const img = document.createElement("img");
    img.src = `img/${sanitizeName(item.titre)}.jpg`;
    fiche.appendChild(img);

    const titre = document.createElement("h1");
    titre.textContent = item.titre;
    fiche.appendChild(titre);

    const desc = document.createElement("div");
    desc.innerHTML = item.modale;
    fiche.appendChild(desc);

    if(item.images !== "") {
      const images = item.images.split(",");
      const gallery = document.createElement("div");
      gallery.classList.add("gallery");
      images.forEach((image) => {
        const img = document.createElement("img");
        const name = sanitizeName(item.titre);
        img.src = `img/${name}/${image}`;
        gallery.appendChild(img);
      });
      fiche.appendChild(gallery);
    }
  

    // gsap.from(fiche, {opacity: 0, duration: 0.4});
    // gsap.from(overlay, {opacity: 0, duration: 0.4});
  });


});

// base pour le plugin motionPath
gsap.registerPlugin(MotionPathPlugin);
// base pour la position selon le viewport
const w = window.innerWidth;
const h = window.innerHeight;

// Create a horizontal line across the screen
let d = `M 0, ${h / 2} L ${w}, ${h / 2}`;

// For the demo
// Add the path to an SVG
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", w);
svg.setAttribute("height", h);
document.body.appendChild(svg);
const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", d);
path.setAttribute("stroke", "transparent");
path.setAttribute("fill", "none");
svg.appendChild(path);

// SVG on z-index -1
svg.style.position = "absolute";
svg.style.top = "20px";
svg.style.left = "20px";
svg.style.zIndex = -1;

gsap.set(".projet", {
  xPercent: -50,
  yPercent: -50,
  transformOrigin: "50% 50%",
});

let anim = gsap.to(".projet", {
  motionPath: {
    path: d,
  },
  duration: 5 * 3,
  stagger: {
    each: 2 / 1 * 3,
    repeat: -1,
  },
  ease: "none",
});
anim.pause(-1);
anim.play(2000);




//cursor cat
document.addEventListener("DOMContentLoaded", () => {
  const cat = document.createElement("img");
  cat.src = "/v01-canard/img/cat.png"; // Change this to your actual image path
  cat.alt = "Cat Cursor";
  cat.classList.add("cursor-cat");
  document.body.appendChild(cat);

  document.addEventListener("mousemove", (e) => {
    cat.style.left = `${e.pageX}px`;
    cat.style.top = `${e.pageY}px`;
  });
});


















async function fetchProjects() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-56ir3JCPtoOa_czsoNXp43_XHyIIA0iByWzj1ckrfgN_CNPHOGPBjCZuUl6e992msyb5gmVSUyML/pub?output=csv";
  
  try {
      const response = await fetch(url);
      const data = await response.text();
      
      const rows = data.split("\n").map(row => row.split(",")); // Split CSV into an array
      
      const projects = rows.slice(1).map(row => ({
          title: row[0],
          description: row[1],
          imageUrl: row[2],
          link: row[3]
      }));

      displayProjects(projects);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

function displayProjects(projects) {
  const container = document.getElementById("projects-container");
  container.innerHTML = "";

  projects.forEach(project => {
      if (!project.imageUrl || !project.imageUrl.startsWith("http")) {
          console.warn("Invalid image URL:", project.imageUrl);
          return; // Skip this project if the image URL is invalid
      }

      const projectElement = document.createElement("div");
      projectElement.classList.add("project");

      projectElement.innerHTML = `
          <img src="${project.imageUrl}" alt="${project.title}" onerror="this.src='fallback.jpg';">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank">See more</a>
      `;

      container.appendChild(projectElement);
  });
}


// Load projects when the page loads
document.addEventListener("DOMContentLoaded", fetchProjects);


  const starsContainer = document.createElement("div");
})();
const starsContainer = document.createElement("div");


document.removeEventListener("mousemove", (event) => {
  const star = document.createElement("div");
  star.classList.add("star");
  starsContainer.appendChild(star);

  gsap.set(star, {
      x: event.clientX,
      y: event.clientY,
      scale: Math.random() * 0.5 + 0.5,
  });

  gsap.to(star, {
      opacity: 0,
      scale: 0,
      duration: 1,
      onComplete: () => star.remove(),
  });
});

starsContainer.id = "stars-container";

document.body.appendChild(starsContainer);

for (let i = 0; i < 50; i++) {
  const star = document.createElement("div");
  star.classList.add("star");
  starsContainer.appendChild(star);

  gsap.set(star, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5,
  });

  animateStar(star);
}

function animateStar(star) {
  gsap.to(star, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 3 + 2,
      ease: "power1.inOut",
      onComplete: () => animateStar(star),
  });
}

// Add some basic styles for the stars
const style = document.createElement("style");
style.textContent = `
  #stars-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
  }
  .star {
      position: absolute;
      width: 20px;
      height: 20px;
      background: linear-gradient(90deg, red, orange, yellow, green, blue, violet);
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
`;
document.head.appendChild(style);

document.addEventListener("mousemove", (event) => {
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  const avoidanceRadius = 50; // Radius around the cursor to avoid

  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    const starRect = star.getBoundingClientRect();
    const starX = starRect.left + starRect.width / 2;
    const starY = starRect.top + starRect.height / 2;

    const distance = Math.sqrt((starX - cursorX) ** 2 + (starY - cursorY) ** 2);

    if (distance < avoidanceRadius) {
      const angle = Math.atan2(starY - cursorY, starX - cursorX);
      const offsetX = Math.cos(angle) * avoidanceRadius;
      const offsetY = Math.sin(angle) * avoidanceRadius;

      gsap.to(star, {
        x: `+=${offsetX}`,
        y: `+=${offsetY}`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });
});

// Create a control panel
const controlPanel = document.createElement("div");
controlPanel.id = "control-panel";
document.body.appendChild(controlPanel);

// Add sliders to the control panel
const controls = [
  { label: "Opacity", min: 0, max: 1, step: 0.1, value: 1, onChange: (value) => updateStars("opacity", value) },
  { label: "Size", min: 5, max: 50, step: 1, value: 20, onChange: (value) => updateStars("size", value) },
  { label: "Rain Speed", min: 0, max: 10, step: 0.1, value: 2, onChange: (value) => updateRainSpeed(value) },
  { label: "Chaos", min: 0, max: 10, step: 0.1, value: 1, onChange: (value) => updateChaos(value) },
  { label: "Direction X", min: -10, max: 10, step: 0.1, value: 0, onChange: (value) => updateDirection("x", value) },
  { label: "Direction Y", min: -10, max: 10, step: 0.1, value: 0, onChange: (value) => updateDirection("y", value) },
  { label: "Color Speed", min: 0, max: 5, step: 0.1, value: 1, onChange: (value) => updateColorSpeed(value) },
  { label: "Trail Length", min: 0, max: 1, step: 0.1, value: 0.8, onChange: (value) => updateTrailLength(value) },
  { label: "Bounce", min: 0, max: 1, step: 0.1, value: 0, onChange: (value) => updateBounce(value) },
  { label: "Star Count", min: 10, max: 200, step: 1, value: 50, onChange: (value) => updateStarCount(value) },
];

controls.forEach((control) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("control");

  const label = document.createElement("label");
  label.textContent = control.label;
  wrapper.appendChild(label);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = control.min;
  slider.max = control.max;
  slider.step = control.step;
  slider.value = control.value;
  slider.addEventListener("input", (e) => control.onChange(parseFloat(e.target.value)));
  wrapper.appendChild(slider);

  controlPanel.appendChild(wrapper);
});

// Update functions for sliders
function updateStars(property, value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    if (property === "opacity") {
      star.style.opacity = value;
    } else if (property === "size") {
      star.style.width = `${value}px`;
      star.style.height = `${value}px`;
    }
  });
}

function updateRainSpeed(value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    gsap.to(star, { y: `+=${value * 10}`, duration: 1, repeat: -1, ease: "none" });
  });
}

function updateChaos(value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    gsap.to(star, { x: `+=${Math.random() * value * 10}`, y: `+=${Math.random() * value * 10}`, duration: 1, repeat: -1, ease: "none" });
  });
}

function updateDirection(axis, value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    gsap.to(star, { [axis]: `+=${value * 10}`, duration: 1, repeat: -1, ease: "none" });
  });
}

function updateColorSpeed(value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    gsap.to(star, { background: `hsl(${Math.random() * 360}, 100%, 50%)`, duration: value, repeat: -1, ease: "none" });
  });
}

function updateTrailLength(value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    star.style.boxShadow = `0 0 ${value * 20}px rgba(255, 255, 255, ${value})`;
  });
}

function updateBounce(value) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    gsap.to(star, { y: `+=${value * 100}`, yoyo: true, repeat: -1, ease: "power1.inOut" });
  });
}

function updateStarCount(value) {
  const starsContainer = document.getElementById("stars-container");
  starsContainer.innerHTML = "";
  for (let i = 0; i < value; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    starsContainer.appendChild(star);

    gsap.set(star, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5,
    });

    animateStar(star);
  }
}

// Style for the control panel
const controlStyle = document.createElement("style");
controlStyle.textContent = `
  #control-panel {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 8px;
    z-index: 1000;
    color: white;
    font-family: "Astloch";
  }
  .control {
    margin-bottom: 10px;
  }
  .control label {
    display: block;
    margin-bottom: 5px;
  }
  .control input[type="range"] {
    width: 100%;
  }
`;
document.head.appendChild(controlStyle);



























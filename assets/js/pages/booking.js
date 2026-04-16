const data = [
  {id:1,name:"Ерөнхий үзлэг",price:30000,doctors:["Д.Бат","Д.Сараа"]},
  {id:2,name:"Вакцин",price:20000,doctors:["Д.Тэмүүжин","Д.Номин"]},
  {id:3,name:"Мэс засал",price:150000,doctors:["Д.Болд","Д.Ганаа"]},
  {id:4,name:"Лабораторийн шинжилгээ",price:20000,doctors:["Д.Болд","Д.Ганаа"]},
  {id:5,name:"Шүдний эмчилгээ",price:100000,doctors:["Д.Номин","Д.Бат"]},
  {id:6,name:"Арьс үсний арчилгаа",price:100000,doctors:["Д.Сараа","Д.Бат"]}
];

const times = ["09:00","11:00","14:00","17:00","19:00"];

let selectedService = null;
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;


// ===== SERVICE RENDER =====
const serviceList = document.getElementById("serviceList");

serviceList.innerHTML = data.map(s => `
  <div class="service-item">
    <h3>${s.name}</h3>
    <p>${s.price}₮</p>
    <button onclick="selectService(${s.id}, this.parentElement)">Сонгох</button>
  </div>
`).join("");


// ===== AUTO SELECT =====
const savedName = localStorage.getItem("serviceName");

if(savedName){
  const found = data.find(s => s.name === savedName);
  if(found){
    setTimeout(() => {
      const el = [...document.querySelectorAll(".service-item")]
        .find(e => e.querySelector("h3").innerText === savedName);

      if(el){
        selectService(found.id, el);
      }
    }, 100);
  }
}


// ===== SERVICE SELECT =====
window.selectService = (id, el) => {
  selectedService = data.find(s => s.id === id);

  // reset doctor & time
  selectedDoctor = null;
  selectedTime = null;
  document.getElementById("doctorList").innerHTML = "";
  document.getElementById("timeList").innerHTML = "";

  document.querySelectorAll(".service-item").forEach(e=>{
    e.classList.remove("active");
  });

  el.classList.add("active");

  loadDoctors();
};


// ===== DOCTOR =====
function loadDoctors(){
  const doctorList = document.getElementById("doctorList");

  doctorList.innerHTML = selectedService.doctors.map(d => `
    <button onclick="selectDoctor('${d}', this)">${d}</button>
  `).join("");
}


// ===== SELECT DOCTOR =====
window.selectDoctor = (doc, el) => {
  selectedDoctor = doc;

  document.querySelectorAll("#doctorList button").forEach(btn=>{
    btn.classList.remove("active");
  });

  el.classList.add("active");
};


// ===== DATE =====
document.getElementById("date").addEventListener("change", (e)=>{
  selectedDate = e.target.value;
  loadTimes();
});


// ===== TIME =====
function loadTimes(){
  const timeList = document.getElementById("timeList");

  timeList.innerHTML = times.map(t => `
    <button onclick="selectTime('${t}', this)">${t}</button>
  `).join("");
}


// ===== SELECT TIME =====
window.selectTime = (t, el)=>{
  selectedTime = t;

  document.querySelectorAll("#timeList button").forEach(btn=>{
    btn.classList.remove("active");
  });

  el.classList.add("active");
};


// ===== CONFIRM =====
document.getElementById("confirmBtn").onclick = () => {

  if(!selectedService || !selectedDoctor || !selectedDate || !selectedTime){
    alert("Бүгдийг сонгоно уу!");
    return;
  }

  // FORM нуух 
  document.querySelector("main > *:not(#successBox)").style.display = "none";

  // SUCCESS SHOW
  document.getElementById("successBox").style.display = "block";

  // DATA хийх
  document.getElementById("c-service").innerText = selectedService.name;
  document.getElementById("c-doctor").innerText = selectedDoctor;
  document.getElementById("c-date").innerText = selectedDate;
  document.getElementById("c-time").innerText = selectedTime;
  document.getElementById("c-price").innerText = selectedService.price + "₮";
};

import {
  findServiceById,
  findServiceByName,
  listServices,
  listTimeSlots
} from "../domain/services/appointService.js";
import { getServiceName } from "../domain/services/storageService.js";

const data = listServices();
const times = listTimeSlots();

let selectedService = null;
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;


// ===== SERVICE RENDER =====
const serviceList = document.getElementById("serviceList");
if (serviceList) {
  serviceList.innerHTML = data.map((s) => `
    <div class="service-item">
      <h3>${s.name}</h3>
      <p>${s.price}₮</p>
      <button onclick="selectService(${s.id}, this.parentElement)">Сонгох</button>
    </div>
  `).join("");
}


// ===== AUTO SELECT =====
const savedName = getServiceName();

if (savedName && serviceList) {
  const found = findServiceByName(savedName);
  if (found) {
    setTimeout(() => {
      const el = [...document.querySelectorAll(".service-item")]
        .find((element) => element.querySelector("h3").innerText === savedName);

      if (el) {
        selectService(found.id, el);
      }
    }, 100);
  }
}


// ===== SERVICE SELECT =====
window.selectService = (id, el) => {
  selectedService = findServiceById(id);

  // reset doctor & time
  selectedDoctor = null;
  selectedTime = null;
  const doctorList = document.getElementById("doctorList");
  const timeList = document.getElementById("timeList");
  if (doctorList) doctorList.innerHTML = "";
  if (timeList) timeList.innerHTML = "";

  document.querySelectorAll(".service-item").forEach(e=>{
    e.classList.remove("active");
  });

  el.classList.add("active");

  loadDoctors();
};


// ===== DOCTOR =====
function loadDoctors() {
  if (!selectedService) return;
  const doctorList = document.getElementById("doctorList");
  if (!doctorList) return;

  doctorList.innerHTML = selectedService.doctors.map((doctor) => `
    <button onclick="selectDoctor('${doctor}', this)">${doctor}</button>
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
const dateInput = document.getElementById("date");
if (dateInput) {
  dateInput.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadTimes();
  });
}


// ===== TIME =====
function loadTimes() {
  const timeList = document.getElementById("timeList");
  if (!timeList) return;

  timeList.innerHTML = times.map((time) => `
    <button onclick="selectTime('${time}', this)">${time}</button>
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
const confirmBtn = document.getElementById("confirmBtn");
if (confirmBtn) confirmBtn.onclick = () => {

  if(!selectedService || !selectedDoctor || !selectedDate || !selectedTime){
    alert("Бүгдийг сонгоно уу!");
    return;
  }

  // FORM нуух 
  const mainContent = document.querySelector("main > *:not(#successBox)");
  if (mainContent) mainContent.style.display = "none";

  // SUCCESS SHOW
  const successBox = document.getElementById("successBox");
  if (successBox) successBox.style.display = "block";

  // DATA хийх
  const cService = document.getElementById("c-service");
  const cDoctor = document.getElementById("c-doctor");
  const cDate = document.getElementById("c-date");
  const cTime = document.getElementById("c-time");
  const cPrice = document.getElementById("c-price");

  if (cService) cService.innerText = selectedService.name;
  if (cDoctor) cDoctor.innerText = selectedDoctor;
  if (cDate) cDate.innerText = selectedDate;
  if (cTime) cTime.innerText = selectedTime;
  if (cPrice) cPrice.innerText = selectedService.price + "₮";
};

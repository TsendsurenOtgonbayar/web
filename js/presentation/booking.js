import AppointmentService from "../domain/services/appointService.js";

document.addEventListener("DOMContentLoaded", () => {
  const serviceList = document.getElementById("serviceList");
  const doctorList = document.getElementById("doctorList");
  const timeList = document.getElementById("timeList");
  const doctorSchedule = document.getElementById("doctorSchedule");
  const dateInput = document.getElementById("date");
  const confirmButton = document.getElementById("confirmBtn");
  const summaryFields = {
    service: document.getElementById("c-service"),
    doctor: document.getElementById("c-doctor"),
    schedule: document.getElementById("c-schedule"),
    date: document.getElementById("c-date"),
    time: document.getElementById("c-time"),
    price: document.getElementById("c-price"),
  };
  const successFields = {
    service: document.getElementById("s-service"),
    doctor: document.getElementById("s-doctor"),
    schedule: document.getElementById("s-schedule"),
    date: document.getElementById("s-date"),
    time: document.getElementById("s-time"),
  };

  if (!serviceList || !doctorList || !timeList || !dateInput || !confirmButton) {
    return;
  }

  const state = {
    selectedService: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
  };

  function resetDependentSelections() {
    state.selectedDoctor = null;
    state.selectedTime = null;
    doctorList.innerHTML = "";
    timeList.innerHTML = "";
    syncSummary();
  }

  function formatDate(dateValue) {
    return dateValue || "Сонгоогүй";
  }

  function syncSummary() {
    if (summaryFields.service) summaryFields.service.innerText = state.selectedService?.name || "Сонгоогүй";
    if (summaryFields.doctor) summaryFields.doctor.innerText = state.selectedDoctor || "Сонгоогүй";
    if (summaryFields.schedule) {
      const schedule = state.selectedDoctor ? AppointmentService.getDoctorSchedule(state.selectedDoctor) : null;
      summaryFields.schedule.innerText = schedule ? `${schedule.workingDays}, ${schedule.workingHours}` : "Сонгоогүй";
    }
    if (summaryFields.date) summaryFields.date.innerText = formatDate(state.selectedDate);
    if (summaryFields.time) summaryFields.time.innerText = state.selectedTime || "Сонгоогүй";
    if (summaryFields.price) summaryFields.price.innerText = state.selectedService ? `${state.selectedService.price}₮` : "0₮";
  }

  function renderDoctorSchedule() {
    if (!doctorSchedule) {
      return;
    }

    if (!state.selectedDoctor) {
      doctorSchedule.innerHTML = "";
      return;
    }

    const schedule = AppointmentService.getDoctorSchedule(state.selectedDoctor);
    if (!schedule) {
      doctorSchedule.innerHTML = "";
      return;
    }

    doctorSchedule.innerHTML = `
      <div class="doctor-schedule-card">
        <span>Сонгосон эмчийн ажлын цаг</span>
        <strong>${state.selectedDoctor}</strong>
        <p>${schedule.workingDays}</p>
        <p>${schedule.workingHours}</p>
      </div>
    `;
  }

  function renderServiceOptions() {
    const services = AppointmentService.getServiceOptions();
    serviceList.innerHTML = services
      .map(
        (service) => `
          <div class="service-item" data-service-id="${service.id}">
            <h3>${service.name}</h3>
            <p>${service.price}₮</p>
            <button type="button">Сонгох</button>
          </div>
        `
      )
      .join("");

    serviceList.querySelectorAll(".service-item button").forEach((button) => {
      button.addEventListener("click", () => {
        const serviceItem = button.closest(".service-item");
        const serviceId = Number(serviceItem?.dataset.serviceId);
        const selected = AppointmentService.getServiceById(serviceId);
        if (!serviceItem || !selected) {
          return;
        }

        state.selectedService = selected;
        serviceList.querySelectorAll(".service-item").forEach((item) => item.classList.remove("active"));
        serviceItem.classList.add("active");
        resetDependentSelections();
        renderDoctorOptions();
        syncSummary();
      });
    });
  }

  function renderDoctorOptions() {
    if (!state.selectedService) {
      doctorList.innerHTML = "";
      return;
    }

    doctorList.innerHTML = state.selectedService.doctors
      .map((doctor) => `<button type="button" data-doctor="${doctor}">${doctor}</button>`)
      .join("");

    doctorList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedDoctor = button.dataset.doctor;
        doctorList.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderDoctorSchedule();
        syncSummary();
      });
    });
  }

  function renderTimeOptions() {
    const times = AppointmentService.getTimes();
    timeList.innerHTML = times
      .map((time) => `<button type="button" data-time="${time}">${time}</button>`)
      .join("");

    timeList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedTime = button.dataset.time;
        timeList.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        syncSummary();
      });
    });
  }

  function autoSelectServiceFromStorage() {
    const savedName = localStorage.getItem("serviceName");
    if (!savedName) {
      return;
    }
    const foundService = AppointmentService.getServiceByName(savedName);
    if (!foundService) {
      return;
    }

    const targetItem = serviceList.querySelector(`[data-service-id="${foundService.id}"]`);
    const targetButton = targetItem?.querySelector("button");
    if (targetButton) {
      targetButton.click();
    }
  }

  function showConfirmation() {
    if (!state.selectedService || !state.selectedDoctor || !state.selectedDate || !state.selectedTime) {
      alert("Бүгдийг сонгоно уу!");
      return;
    }

    const bookingSection = document.querySelector("main > *:not(#successBox)");
    const successBox = document.getElementById("successBox");
    if (bookingSection) {
      bookingSection.style.display = "none";
    }
    if (successBox) {
      successBox.hidden = false;
      successBox.style.display = "block";
    }

    document.getElementById("c-service").innerText = state.selectedService.name;
    document.getElementById("c-doctor").innerText = state.selectedDoctor;
    const schedule = AppointmentService.getDoctorSchedule(state.selectedDoctor);
    document.getElementById("c-schedule").innerText = schedule ? `${schedule.workingDays}, ${schedule.workingHours}` : "Сонгоогүй";
    document.getElementById("c-date").innerText = state.selectedDate;
    document.getElementById("c-time").innerText = state.selectedTime;
    document.getElementById("c-price").innerText = `${state.selectedService.price}₮`;

    if (successFields.service) successFields.service.innerText = state.selectedService.name;
    if (successFields.doctor) successFields.doctor.innerText = state.selectedDoctor;
    if (successFields.schedule) successFields.schedule.innerText = schedule ? `${schedule.workingDays}, ${schedule.workingHours}` : "Сонгоогүй";
    if (successFields.date) successFields.date.innerText = state.selectedDate;
    if (successFields.time) successFields.time.innerText = state.selectedTime;
  }

  dateInput.addEventListener("change", (event) => {
    state.selectedDate = event.target.value;
    renderTimeOptions();
    syncSummary();
  });

  confirmButton.addEventListener("click", showConfirmation);

  renderServiceOptions();
  autoSelectServiceFromStorage();
  renderTimeOptions();
  renderDoctorSchedule();
  syncSummary();
});

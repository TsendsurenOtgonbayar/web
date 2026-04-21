import AppointmentService from "../domain/services/appointService.js";

document.addEventListener("DOMContentLoaded", () => {
  const serviceList = document.getElementById("serviceList");
  const doctorList = document.getElementById("doctorList");
  const timeList = document.getElementById("timeList");
  const dateInput = document.getElementById("date");
  const confirmButton = document.getElementById("confirmBtn");

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
      successBox.style.display = "block";
    }

    document.getElementById("c-service").innerText = state.selectedService.name;
    document.getElementById("c-doctor").innerText = state.selectedDoctor;
    document.getElementById("c-date").innerText = state.selectedDate;
    document.getElementById("c-time").innerText = state.selectedTime;
    document.getElementById("c-price").innerText = `${state.selectedService.price}₮`;
  }

  dateInput.addEventListener("change", (event) => {
    state.selectedDate = event.target.value;
    renderTimeOptions();
  });

  confirmButton.addEventListener("click", showConfirmation);

  renderServiceOptions();
  autoSelectServiceFromStorage();
});

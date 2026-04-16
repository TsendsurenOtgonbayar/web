export class Appointment {
  constructor(userId, petId, service, appointmentDate) {
    // this.id = Date.now();
    this.userId = userId;
    this.petId = petId;
    this.service = service;
    this.appointmentDate = appointmentDate;
    this.status = "Хүлээгдэж байна";
    this.notes = "";
    this.createdAt = new Date().toISOString();
  }
}
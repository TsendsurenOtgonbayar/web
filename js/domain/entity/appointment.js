class Appointment {
  constructor(userId, petId, service, appointmentDate, id = null) {
    this.id = id || Date.now();
    this.userId = userId;
    this.petId = petId;
    this.service = service;
    this.appointmentDate = appointmentDate;
    this.status = "Хүлээгдэж байна";
    this.notes = "";
    this.createdAt = new Date().toISOString();
  }

  completeAppointment(notes = "") {
    this.status = "Болсон";
    this.notes = notes;
  }

  getInfo() {
    return {
      id: this.id,
      userId: this.userId,
      petId: this.petId,
      service: this.service,
      appointmentDate: this.appointmentDate,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt
    };
  }
}

export default Appointment;
import Appointment from "../../../domain/entity/appointment.js";

class BookAppointmentUseCase {
  execute(appointmentData) {
    if (!appointmentData.userId || !appointmentData.petId || !appointmentData.service || !appointmentData.appointmentDate) {
      return {
        success: false,
        message: "Та бүх шаардлагатай мэдээллийг оруулна уу"
      };
    }

    const appointment = new Appointment(
      appointmentData.userId,
      appointmentData.petId,
      appointmentData.service,
      appointmentData.appointmentDate
    );

    return {
      success: true,
      message: "Ээлжээр амжилттай сүүлжлээ",
      appointment: appointment
    };
  }
}

export default BookAppointmentUseCase;
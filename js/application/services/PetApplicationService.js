import AddPetUseCase from "../useCases/pet/AddPetUseCase.js";
import BookAppointmentUseCase from "../useCases/pet/BookAppointmentUseCase.js";
import UserRepository from "../../infrastructure/repositories/UserRepository.js";
import AuthTokenProvider from "../../infrastructure/auth/AuthTokenProvider.js";
import UserMapper from "../../infrastructure/mappers/UserMapper.js";

class PetApplicationService {
  constructor() {
    this.addPetUseCase = new AddPetUseCase();
    this.bookAppointmentUseCase = new BookAppointmentUseCase();
    this.userRepository = new UserRepository();
    this.tokenProvider = new AuthTokenProvider();
  }

  addPetToCurrentUser(petData) {
    const result = this.addPetUseCase.execute(petData);

    if (!result.success) {
      return result;
    }

    const currentUser = this.tokenProvider.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Та нэвтэрч ороогүй байна" };
    }

    if (!currentUser.pets) currentUser.pets = [];
    currentUser.pets.push(result.pet);

    this.tokenProvider.saveCurrentUser(currentUser);
    const userData = UserMapper.toDTO(currentUser);
    this.userRepository.updateUser(userData);

    return result;
  }

  bookAppointment(appointmentData) {
    const result = this.bookAppointmentUseCase.execute(appointmentData);

    if (!result.success) {
      return result;
    }

    const currentUser = this.tokenProvider.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "Та нэвтэрч ороогүй байна" };
    }

    if (!currentUser.appointments) currentUser.appointments = [];
    currentUser.appointments.push(result.appointment);

    this.tokenProvider.saveCurrentUser(currentUser);
    const userData = UserMapper.toDTO(currentUser);
    this.userRepository.updateUser(userData);

    return result;
  }
}

export default PetApplicationService;
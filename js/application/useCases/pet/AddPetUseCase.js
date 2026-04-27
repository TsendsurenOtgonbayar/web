import Pet from "../../../domain/entity/pet.js";

class AddPetUseCase {
  execute(petData) {
    if (!petData.name || !petData.birthYear || !petData.birthMonth || !petData.type || !petData.gender) {
      return {
        success: false,
        message: "Амьтны бүх мэдээллийг оруулна уу"
      };
    }

    const pet = new Pet(
      petData.name,
      parseInt(petData.birthYear),
      parseInt(petData.birthMonth),
      petData.type,
      petData.gender
    );

    return {
      success: true,
      message: "Амьтан амжилттай нэмэгдлээ",
      pet: pet
    };
  }
}

export default AddPetUseCase;
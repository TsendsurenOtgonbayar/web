import User from "../../domain/entity/user.js";

class UserMapper {
  static toDomain(userData) {
    const user = new User(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.id
    );
    user.currentRole = userData.currentRole || "User";
    user.pets = userData.pets || [];
    user.appointments = userData.appointments || [];
    user.comments = userData.comments || [];
    user.createdAt = userData.createdAt || new Date().toISOString();
    return user;
  }

  static toDTO(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      currentRole: user.currentRole,
      pets: user.pets,
      appointments: user.appointments,
      comments: user.comments,
      createdAt: user.createdAt
    };
  }
}

export default UserMapper;
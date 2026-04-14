export class user{
    constructor(name,email,password){
        this.id=10++;
        this.name=name;
        this.email=email;
        this.password=password;
        this.role={
            User:"User",
            Admin:"Admin"
        };
        this.pets=[];
        this.appointment=[];
    }
    addpet(petName,petAge,petType,petGender){
        const pet={
            id:Date.now(),
            Name:petName,
            Age:{
                age:petAge.age,
                month:petAge.month,
            },
            Type:petType,
            Gender:petGender
        }
        this.pets.push(pet);
        return;
    }
    addAppointment(petId,service,date){
    const appointment = {
      id: Date.now(),
      petId,
      service,
      date,
      userId: this.id,
      status: {
        Waiting:"Хүлээгдэж байна",
        Completed:"Болсон"
    }
    };
    this.appointments.push(appointment);
    return;
    }
    static fromJSON(json) {
    const user = new User(json.name, json.email);
        user.id = json.id;
        user.pets = json.pets || [];
        user.appointments = json.appointments || [];
        user.comments = json.comments || [];
        return user;
    }
    getProfile() {
        return {
          id: this.id,
          name: this.name,
          email: this.email,
          petsCount: this.pets.length,
          pets: this.pets,
          appointmentsCount: this.appointments.length,
          commentsCount: this.comments.length
        };
  }

}
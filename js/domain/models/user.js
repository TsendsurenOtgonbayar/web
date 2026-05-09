//энэ файл дотор User-тэй холбоотой бүх логик энд бичнэ
class User{
    constructor(name,email,password){
        this.id=Math.random();
        this.name=name;
        this.email=email;
        this.password=password;
        this.role={
            User:"User",
            Admin:"Admin"//ene hesegt admin panel garch ireh esehig shalgahin tuld nemsen
        };
        this.pets=[];
        this.appointments=[];
    }
    addpet(petOBJ){
        // const pet={
        //     id:Date.now(),
        //     Name:petName,
        //     Age:{
        //         age:petAge.age,
        //         month:petAge.month,
        //     },
        //     Type:petType,
        //     Gender:petGender
        // }
        this.pets.push(petOBJ);
    }
    addAppointment(BookingOBJ){
    // const appointment = {
    //   id: Date.now(),
    //   petId,
    //   service,
    //   date,
    //   userId: this.id,
    //   status: {
    //     Waiting:"Хүлээгдэж байна",
    //     Completed:"Болсон"
    // }
        this.appointments.push(BookingOBJ);
    }
    // static fromJSON(json) {
    // const user = new User(json.name, json.email);
    //     // user.id = json.id;
    //     // user.pets = json.pets || [];
    //     // user.appointments = json.appointments || [];
    //     // user.comments = json.comments || [];
    //     return user;
    // }
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
};
export default User;
//ene file dotor pet tei holbootoi buh logic iig bichne
import User from "../models/user.js"
import Pet from "../models/pet.js"
class petService{
    static addPetToUser(currentUser,NewPetOBJ){
        currentUser.addpet(NewPetOBJ);
        const allUser=JSON.parse(localStorage.getItem("isRegistered"));
        const updatedUsers = allUsers.map(u => {
            if (u.Email === currentUser.email) {
                return currentUser; 
            }
            return u;
        });
        localStorage.setItem("isRegisted", JSON.stringify(updatedUsers));
    // Хэрэв хүсвэл одоо нэвтэрсэн байгаа хэрэглэгчийн мэдээллийг бас шинэчлэх
        localStorage.setItem("LoggedIn", JSON.stringify(currentUser));
    }
}
export default petService;
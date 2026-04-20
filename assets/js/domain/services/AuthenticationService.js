//ene file dotor tanin batalgaajulah logiciig bichne
import { showNotification } from "../../utils.js";
import User from "../models/user.js"
//const serverURL="";//fetch hiihed heregleh url
class AuthService{
//hereglegch nevtersen uyd burtguuleh logic 
//comment bichih bolon busad ymar negen uildel hiisen uyd log shalgah
//
    static async logCheck(loginOBJ) {
        try{
            const response=await fetch(serverURL,{
                method:"POST",
                headers:{ "Content-Type": "application/json" },
                body:JSON.stringify(loginOBJ.Email,loginOBJ.Password)
            });
            const response=await fetch(serverURL);
            if(!response.ok){
                throw new Error(`HTTP алдаа : ${response.status}`);
            }
            const data =await response.json();
            if(data.success){
                localStorage.setItem("token",data.token);//ene hadgalsan token oo ashiglad serverees data dahiad avna
            }
            return data.success;
        }catch{
            showNotification("Интернет холболтоо шалгана уу","error");
        }
    };
    static enrollUser(enrollOBJ){
        if(this.logCheck(enrollOBJ)){
            return {
                message:"Аль хэдийн бүртгэгдсэн байна.",
                type:"error"
            }
        }

    }
}
export default AuthService;
import  {petCard}  from "../components/pet.js";
import {showNotification} from "../utils.js"
document.addEventListener("DOMContentLoaded", (event) => {
    
    const loggedUser_key="LoggedIn";
    const isLoggedIn = localStorage.getItem("isRegisted");
    const Name=document.querySelector(".user-info-mini h3");
    const email=document.querySelector(".user-info-mini p");
    const avatar=document.querySelector(".avatar");
    const addPet=document.getElementById("addPetForm");
    if(addPet) addPet.style.display="none";
    // 1. Хэрэглэгч нэвтрээгүй бол буцаагаад нэвтрэх хуудас руу шидэх (Хамгаалалт)
    if (!isLoggedIn) {
        showNotification("Та эхлээд нэвтэрч орно уу!","error");
        window.location.href = "logIn.html";
        return;
    }
    const UserData=JSON.parse(localStorage.getItem(loggedUser_key));
    Name.textContent=UserData.Name;
    email.textContent=UserData.Email;
    avatar.textContent=UserData.Name[0];


    // 2. Гарах (Logout) үйлдэл
    const logoutBtn = document.querySelector('a[href="index.html"][style*="color: #dc3545"]');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Та системээс гарахдаа итгэлтэй байна уу?");
            if (confirmLogout) {
                localStorage.removeItem("LoggedIn");
                window.location.href = "index.html";
            }
        });
    }

    // 3. Зүүн талын цэсээр агуулга солих (Tabs)
    const menuLinks = document.querySelectorAll(".profile-menu a:not(:last-child)");
    const contentSections = document.querySelectorAll(".profile-content > div, .profile-content > h2");

    // Одоогоор UI дээр бүх мэдээлэл нэг дор харагдаж байгаа. 
    // Хэрэв та цэс дарахад хэсгүүд нуугдаж, гарч ирдэг хийхийг хүсвэл энд логик нэмнэ.
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            // Хуучин active классыг устгах
            document.querySelector(".profile-menu a.active").classList.remove("active");
            // Дарсан линкэнд active өгөх
            link.classList.add("active");
        });
    });

    // 4. Амьтан шинээр нэмэх товч
    const addPetBtn = document.querySelector(".btn-outline");
    const SubBtn=document.querySelector(`button[type="submit"]`);
    const petList=document.querySelector(".card-grid");
    const PetName=document.getElementById("petName");
    const PetAge=document.getElementById("petAge");
    const PetMonth=document.getElementById("petMonth");
    const PetType=document.getElementById("petType");
    const PetGender=document.getElementById("selGender");
    if (addPetBtn) {
        addPetBtn.addEventListener("click", (event) => {
            event.preventDefault();
            addPet.style.display="";
            addPetBtn.style.display="none";
        });
    }
    if(addPet){
        addPet.addEventListener("submit",(e)=>{
            e.preventDefault();
        let NewAnimal={
            Name:PetName.value.trim(),
            Type:PetType.value,
            Age:{
                age:PetAge.value.trim(),
                month:PetMonth.value.trim(),
            },
            Gender:PetGender.value,
        }
        const newCard=petCard(NewAnimal);
        petList.appendChild(newCard);
        showNotification("Амжилттай бүртгэгдлээ!", "success");
        addPet.reset();
        addPet.style.display="none";
        addPetBtn.style.display="";
        });
        
    }
    const BtnCancel=document.getElementById("cancelPetFormBtn");
    function clrForm(){
        BtnCancel.addEventListener("click",()=>{
            addPet.reset();
            addPet.style.display="none";
            addPetBtn.style.display="";
        }); 
    };
});
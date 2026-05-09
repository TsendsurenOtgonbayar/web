class pet{
    constructor(petOBJ){
        this.Name=petOBJ.Name;
        this.Age={
            BAge:petOBJ.Age.Age,//torson on sar iig n hadgaladd nasig n tootsdog bolgohin tuld
            BMonth:petOBJ.Age.Month
        };
        this.type=petOBJ.Type;
        this.Gender=petOBJ.Gender;
    }
    getInfo(){
        return {
            Name:this.Name,
            Age: getAge(),
            Type:this.Type,
            Gender:this.Gender
        }
    }
    getAge(){
        const currentYear= new Date().getFullYear();
        const currentMonth=new Date().getFullMonth();
        const aliveYear= currentYear-this.Age.BAge;
        const aliveMonth=currentMonth-this.Age.BMonth;
        return {
            Age:aliveYear,
            Month:aliveMonth
        }
    }
    setName(PetName){
        this.Name=PetName;
    }
    setBirthAge(petBirthAge){
        this.Age.BAge=petBirthAge;
    }
    setBirthMonth(petBirthMonth){
        this.Age.BMonth=petBirthMonth;
    }
    setType(petType){
        this.Type=petType;
    }
    setGender(petGender){
        this.Gender=petGender;
    }
}
export default pet;
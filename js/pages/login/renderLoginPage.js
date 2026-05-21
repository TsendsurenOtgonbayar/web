import renderLoginForm from "./loginSection";
import renderRegisterForm from "./registerSection";
import renderSelect from "./selectSectionRender";
import cssChanger from "../../components/pagesCSS";

export default function renderLoginPage(){
    cssChanger(login);
    return `
    ${renderLoginForm()}
    ${renderRegisterForm()}
    ${renderSelect()}
    `;
}
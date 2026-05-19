import firstSection from "./firstSection.js";
import secondSection from "./secondSection.js";
import thirdSection from "./thirdSection.js";
import forthSection from "./forthSection.js";
import { scrollAnimationData } from "../../data/homePagesData/SDFA.js";
import {serviceDynamicData,serviceData} from "../../data/homePagesData/serviceData.js";
import cssChanger from "../../components/pagesCSS.js";
export default function homePage() {
    cssChanger('style');
    return `
        ${firstSection()}
        ${secondSection(scrollAnimationData)}
        ${thirdSection(serviceData,serviceDynamicData)}
        ${forthSection()}
    `
}
const msg: string="Hello!";
alert(msg);

const styles: { [key: string]: string }={
    "Styl 1": "labE1.css",
    "Styl 2": "labE2.css",
    "Styl 3": "labE3.css",
    "Styl 4": "labC.css"
};

let currentStyle: string=styles["Styl 1"];

function setStyle(styleName: string){
    const styleFile=styles[styleName];
    if(!styleFile) return;
    const currentLink=document.querySelector('link[data-style="dynamic"]');
    if(currentLink){
        currentLink.remove();
    }
    const linkElement=document.createElement("link");
    linkElement.rel="stylesheet";
    linkElement.type="text/css";
    linkElement.href=styleFile;
    linkElement.setAttribute("data-style", "dynamic");
    document.head.appendChild(linkElement);
    currentStyle=styleFile;
}

function generateStyleLinks(){
    const switchContainer=document.querySelector(".style-switch");
    if(!switchContainer) return;
    switchContainer.innerHTML="";
    Object.keys(styles).forEach((styleName)=>{
        const link=document.createElement("a");
        link.href="#";
        link.textContent=styleName;
        link.addEventListener("click", (e)=>{
            e.preventDefault();
            setStyle(styleName);
        });
        const listItem=document.createElement("li");
        listItem.appendChild(link);
        switchContainer.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", ()=>{
    generateStyleLinks();
    setStyle("Styl 1");
});

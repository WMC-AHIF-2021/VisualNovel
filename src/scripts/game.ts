import {HttpClient, Scene} from "./server-client";
import * as $ from "jquery";
// @ts-ignore
import images from "./../../images/backgrounds/*";
// @ts-ignore
import charImages from "./../../images/Characters/*";

let curScene: SceneManager;
let McName;//dbjson: [
let McPronouns1;//dbjson: {
let McPronouns2;//dbjson: }
let isBitten = false; //immer erste anweisung wenn true
const MAXSCENES = 50;
let nextScene = 0;
let buttonVisible = false;


class SceneManager {
    private readonly client: HttpClient;
    public headScene: Scene;
    public splitText;

    constructor() {
        this.client = new HttpClient();
        this.splitText = [];
    }

    public async readScene(): Promise<void> {
        if (this.headScene == null) {
            this.headScene = await this.client.getScene(0);
        } else {
            this.headScene = await this.client.getScene(nextScene);
        }
    }

    public ShowFirstTextAndSplit() {
        if (this.headScene.speakingPerson[0] == "Mc") {
            document.getElementById("SpeakingPerson").innerText = McName;
        } else {
            document.getElementById("SpeakingPerson").innerText = this.headScene.speakingPerson[0];
        }
        console.log('splitting :)');
        this.splitText = this.headScene.text.split(";");
    }

    ChangeScene() {
        $("#background").attr("src", images[this.headScene.background]);
        this.ShowFirstTextAndSplit();
        this.ShowCharacters(this.headScene,0);
    }

    DisplaySceneParts(i: number): number {

        function OptionClicked(opt1: JQuery, opt2: JQuery) {
            curScene.headScene.done = true;
            opt1.css('visibility', 'hidden');
            opt2.css('visibility', 'hidden');
            buttonVisible = false;
        }

        if (i < this.splitText.length) {
            this.PrintNameAndGender();
            document.getElementById("textbox").innerText = this.splitText[i];
            this.ShowCharacters(this.headScene,i);
            if (this.headScene.speakingPerson[i] == "Mc") {
                document.getElementById("SpeakingPerson").innerText = McName;
            } else {
                document.getElementById("SpeakingPerson").innerText = this.headScene.speakingPerson[i];
            }

            i++;
            return i;
        } else if (+this.headScene.next2 === -1) ///abprüfen ob es eine Verzweigung(Entscheidung) gibt
        {
            nextScene = +curScene.headScene.next1;
            curScene.headScene.done = true;
            return 1;
        } else if (this.headScene.biteImpact) {
            if (isBitten) {
                nextScene = +curScene.headScene.next1;
                curScene.headScene.done = true;
                return 1;
            }

            nextScene = +curScene.headScene.next2;
            curScene.headScene.done = true;
            return 1;
        } else {
            const opt1 = $('#opt1');
            const opt2 = $('#opt2');
            const splitter1 = this.headScene.next1.split(';');
            const splitter2 = this.headScene.next2.split(';');
            buttonVisible = true;
            console.log(splitter1[1]);
            opt1.text(splitter1[1]);
            opt2.text(splitter2[1]);
            opt1.css('visibility', 'visible');
            opt2.css('visibility', 'visible');


            opt1.on('click', () => {
                nextScene = +splitter1[0];
                OptionClicked(opt1, opt2);
                if (opt1.text() === "Communicate") {
                    isBitten = true;
                }
            });
            opt2.on('click', () => {
                nextScene = +splitter2[0];
                OptionClicked(opt1, opt2);
            });
            return 0;
        }
    }

    private PrintNameAndGender() {
        for (let i = 0; i < this.splitText.length; i++) {
            this.splitText[i] = this.splitText[i].replaceAll('{', McPronouns1);
            this.splitText[i] = this.splitText[i].replaceAll('}', McPronouns2);
            this.splitText[i] = this.splitText[i].replaceAll('[', McName);
        }
    }

    private ShowCharacters(headScene: Scene, i : number) {
        if (headScene.characterLeft[i] != '') {
            const charLeft = <HTMLImageElement>document.getElementById("charLeft");
            charLeft.src = charImages[headScene.characterLeft[i]];
            charLeft.style.height = "29em";
            charLeft.style.display = "inline-block";
            charLeft.style.width = "20em";
            charLeft.style.margin = "2em 0 0 15em";
            charLeft.style.position = "absolute";
        } else {
            const charLeft = <HTMLImageElement>document.getElementById("charLeft");
            charLeft.src = "";
            charLeft.style.display = "none";
        }
        if (headScene.characterRight[i] != '') {
            const charRight = <HTMLImageElement>document.getElementById("charRight");
            charRight.src = charImages[headScene.characterRight[i]];
            charRight.style.height = "29em";
            charRight.style.display = "inline-block";
            charRight.style.width = "20em";
            charRight.style.margin = "2rem 0 0 0";
            charRight.style.padding = "0 30rem 0 0";
            charRight.style.position = "absolute";
        } else {
            const charRight = <HTMLImageElement>document.getElementById("charRight");
            charRight.src = "";
            charRight.style.display = "none";
        }
    }
}


function HideGenderElements() {
    document.getElementById("gendertext").style.display = "none";
    document.getElementById("fembtn").style.display = "none";
    document.getElementById("malebtn").style.display = "none";
    document.getElementById("divbtn").style.display = "none";
    document.getElementById("textbox").style.display = "inline-block";
    document.getElementById("SpeakingPerson").style.display = "inline-block";
}

function ManageStart() {
    const enterButton = document.getElementById("EnterButton");
    enterButton.style.display = "none";
    const McName = document.getElementById("MCsName");
    McName.style.display = "none";
    document.getElementById("EnterText").style.display = "none";
    document.getElementById("gendertext").style.display = "none";
    document.getElementById("StartingBtn").addEventListener("click", () => {
        document.getElementById("StartingBtn").style.display = "none";
        enterButton.style.display = "inline-block";
        McName.style.display = "inline-block";
        document.getElementById("EnterText").style.display = "inline-block";
    });
}

/*An und Ausschalten der Sichtbarkeit
  je nach dem welchen genderButton man auswählt, wird dem gender dieses Zugeschrieben
 */
function ManageGender() {
    document.getElementById("gendertext").style.display = "block";
    document.getElementById("fembtn").style.display = "block";
    document.getElementById("malebtn").style.display = "block";
    document.getElementById("divbtn").style.display = "block";
    document.getElementById("fembtn").addEventListener("click", () => {
        McPronouns1 = "she";
        McPronouns2 = "her";
        HideGenderElements();
    });
    document.getElementById("malebtn").addEventListener("click", () => {
        McPronouns1 = "he";
        McPronouns2 = "him";
        HideGenderElements();
    });
    document.getElementById("divbtn").addEventListener("click", () => {
        McPronouns1 = "they";
        McPronouns2 = "them";
        HideGenderElements();
    });
}

async function ManageName() {

    const name = <HTMLInputElement>document.getElementById("MCsName");
    McName = name.value;
    if (McName == "") {
        alert("no Name entered");
    } else if (McName.length > 18) {
        alert("name too long");
    } else {
        document.getElementById("EnterButton").style.display = "none";
        document.getElementById("MCsName").style.display = "none";
        document.getElementById("EnterText").style.display = "none";
        ManageGender();
        await WorkOnScenes();
    }
}


async function WorkOnScenes() {
    const restart = $('#RestartBtn');
    curScene = new SceneManager();
    await curScene.readScene();
    curScene.ChangeScene();
    document.getElementById("textbox").innerText = curScene.splitText[0];
    let i = 1;
    const elementsOfClickable = document.getElementsByClassName("clickable");
    for (let count = 0; count < elementsOfClickable.length; count++) {
        elementsOfClickable[count].addEventListener("click", async () => {
            if (nextScene >= MAXSCENES) {
                const background = $("#background");
                background.attr("src", images['endScreen.png']);
                $("#textbox").css("visibility","hidden");
                $("#SpeakingPerson").css("visibility","hidden");
                background.removeClass('clickable');
                background.on('click', () => {
                    $("#background").attr("src", images['blackScreen.png']);
                    restart.css('visibility', 'visible');
                });
                restart.on('click', () => {
                    location.reload();
                });
            } else {
                if (!buttonVisible) {
                    i = curScene.DisplaySceneParts(i);
                }
                if (curScene.headScene.done == true && nextScene < MAXSCENES) {
                    await curScene.readScene();
                    await curScene.ChangeScene();
                    console.log('changed scene');
                    document.getElementById("textbox").innerText = curScene.splitText[0];
                }
            }
        });
    }

}

async function init() {
    ManageStart();
    document.getElementById("EnterButton").addEventListener("click", () => {
        ManageName();
    });

}

document.addEventListener("DOMContentLoaded", async () => {
    await init();
});


import {HttpClient, Scene} from "./server-client";
import * as $ from "jquery";
// @ts-ignore
import images from "./../../images/backgrounds/*";
// @ts-ignore
import charImages from "./../../images/Characters/*";

let curScene: SceneManager;
let McName;
let McGender;
const MAXSCENES = 6;
let ChosenOption = 0;
let buttonVisible = false;
let bitten = false;


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
            console.log("Changing Scene");
            console.log(`ChosenOption: ${ChosenOption}`);
            this.headScene = await this.client.getScene(ChosenOption);
        }
    }

    public HandleTextBox() {
        if(this.headScene.speakingPerson[0] == "Mc")
        {
            document.getElementById("SpeakingPerson").innerText = McName;
        }
        else
        {
            document.getElementById("SpeakingPerson").innerText = this.headScene.speakingPerson[0];
        }

            console.log("show first");
            this.splitText = this.headScene.text.split(";");
    }

    ChangeScene() {
        const start = <HTMLImageElement>document.getElementById("Start");
        start.src = images[this.headScene.background];
        this.HandleTextBox();
    }

    DisplayText(i: number): number {
        console.log(`ArrayLänge:${this.splitText.length}`);
        console.log(`headscene: ${curScene.headScene.text}`);
        console.log(`Done: ${curScene.headScene.done}`);
        console.log(this.splitText);
        console.log(`click i: ${i}`);

        function OptionClicked(opt1: JQuery<HTMLElement>, opt2: JQuery<HTMLElement>) {
            console.log("Button clicked");
            curScene.headScene.done = true;
            opt1.css('visibility', 'hidden');
            opt2.css('visibility', 'hidden');

            opt1.remove();
            opt2.remove();
            buttonVisible = false;
        }


        function ShowCharacters(headScene: Scene) {
            if(headScene.characterLeft[i] != '')
            {
                const charLeft = <HTMLImageElement>document.getElementById("charLeft");
                charLeft.src = charImages[headScene.characterLeft[i]];
                charLeft.style.height = "29em";
                charLeft.style.display = "inline-block";
                charLeft.style.width = "20em";
                charLeft.style.margin = "2em 0 0 15em";
                charLeft.style.position = "absolute";
            }
            else
            {
                const charLeft = <HTMLImageElement>document.getElementById("charLeft");
                charLeft.src = "";
                charLeft.style.display = "none";
            }
            if(headScene.characterRight[i] != '')
            {
                const charRight = <HTMLImageElement>document.getElementById("charRight");
                charRight.src = charImages[headScene.characterRight[i]];
                charRight.style.height = "29em";
                charRight.style.display = "inline-block";
                charRight.style.width = "20em";
                charRight.style.margin = "2em -15em";
                charRight.style.position = "absolute";
            }
            else
            {
                const charRight = <HTMLImageElement>document.getElementById("charRight");
                charRight.src = "";
                charRight.style.display = "none";
            }
        }

        if (i < this.splitText.length) {
            console.log("changing text");
            document.getElementById("textbox").innerText = this.splitText[i];
            console.log(i);
            console.log(this.headScene.characterLeft);
            console.log(this.headScene.characterLeft[i]);
            ShowCharacters(this.headScene);
            if(this.headScene.speakingPerson[i] == "Mc")
            {
                document.getElementById("SpeakingPerson").innerText = McName;
            }
            else
            {
                document.getElementById("SpeakingPerson").innerText = this.headScene.speakingPerson[i];
            }

            i++;
            console.log(i);
            return i;
        } else if (curScene.headScene.next2 === -1) ///abprüfen ob es eine Verzweigung(Entscheidung) gibt
        {
            console.log("no options => change");
            ChosenOption = curScene.headScene.next1;
            curScene.headScene.done = true;
            i = 1;
            return i;
        } else {
            const opt1 = $('#opt1');
            const opt2 = $('#opt2');
            console.log("make buttons visible");
            opt1.css('visibility', 'visible');
            opt2.css('visibility', 'visible');
            buttonVisible = true;

            opt1.on('click', () => {
                ChosenOption = curScene.headScene.next1;
                OptionClicked(opt1, opt2);
                console.log(`i after clickMethod : ${i}`);
                if(this.headScene.id == 1)
                {
                    bitten = true;
                }
            });
            opt2.on('click', () => {
                ChosenOption = curScene.headScene.next2;
                OptionClicked(opt1, opt2);
            });
            return 0;
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

function ManageName() {
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
        McGender = "female";
        HideGenderElements(); // stellt Sichtbarkeit aus
    });
    document.getElementById("malebtn").addEventListener("click", () => {
        McGender = "male";
        HideGenderElements();
    });
    document.getElementById("divbtn").addEventListener("click", () => {
        McGender = "divers";
        HideGenderElements();
    });
}

async function init() {
    const opt1 = $('#opt1');
    const opt2 = $('#opt2');
    opt1.css('visibility', 'hidden');
    opt2.css('visibility', 'hidden');
    ManageName();
    document.getElementById("EnterButton").addEventListener("click", async () => {
        const name = <HTMLInputElement>document.getElementById("MCsName");
        McName = name.value;
        if(McName == "")
        {
            alert("no Name entered");
        }
        else if(McName.length > 18)
        {
            alert("name too long");
        }
        else
        {
            document.getElementById("EnterButton").style.display = "none";
            document.getElementById("MCsName").style.display = "none";
            document.getElementById("EnterText").style.display = "none";
            ManageGender();

            curScene = new SceneManager();
            await curScene.readScene();
            await curScene.ChangeScene();
            document.getElementById("textbox").innerText = curScene.splitText[0];
            let i = 1;
            document.getElementById("Start").addEventListener("click", async () => {
                if (ChosenOption >= MAXSCENES) {
                    ///Ending
                    console.log("ending");
                    alert("to be continued soon");
                }
                else{
                    if(!buttonVisible)
                    {
                        i = curScene.DisplayText(i);
                    }
                    console.log(`Id: ${curScene.headScene.id}`);
                    console.log(`Done: ${curScene.headScene.done}`);
                    if (curScene.headScene.done == true && ChosenOption < MAXSCENES) {
                        console.log("in change");
                        await curScene.readScene();
                        await curScene.ChangeScene();
                        document.getElementById("textbox").innerText = curScene.splitText[0];
                    }
                }

            });
        }



    });
}

document.addEventListener("DOMContentLoaded", async event => {
    await init();
});


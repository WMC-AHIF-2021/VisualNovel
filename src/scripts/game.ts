import { readFileSync } from 'fs';

export class Scene{
    background: string;
    text: string;
    CharacterRight: string;
    Character2Left: string;
    McName : string;
    McGender : string;
    next: Scene;

    constructor(name:string,gender:string) {
        this.background = '../../images/background/SpawnPoint.png';
        this.CharacterRight = 'none';
        this.Character2Left = 'none';
        this.text =  "I slowly awoke from my sleep. I was still a little tired, but I had the feeling as if something was off.\n" +
            "Looking at my surroundings I realized that I wasn't in my Room, but in a rather weird one. The room was more or less\n" +
            "empty, the only furniture was the bed and a shelf beside the window. There is dust and spiderwebs everywhere and the\n" +
            "walls are dirty. A part of me thought that I was just imagining things, but after a while of getting fully awake I\n" +
            "started to become a bit worried. Is there nobody here? Suddenly I heard a strange noise coming from downstairs";
        this.McName = name;
        this.McGender = gender;
    }

    public BuildScene() {
        document.getElementById('SpeakingPerson').innerText = this.McName;
        document.getElementById('textbox').innerText = this.text;
    }


    ChangeScene() {
        const imageUrl = new URL(
            '../../images/backgrounds/kitchen.png',
            // @ts-ignore
            import.meta.url
        );
        (document.getElementById('Start') as HTMLImageElement).src = imageUrl.href;
    }
}


function HideGenderElements() {
    document.getElementById('gendertext').style.display = 'none';
    document.getElementById('fembtn').style.display = 'none';
    document.getElementById('malebtn').style.display = 'none';
    document.getElementById('divbtn').style.display = 'none';
    document.getElementById('textbox').style.display = 'inline-block';
    document.getElementById('SpeakingPerson').style.display = 'inline-block';
}




function ManageName() {
    const enterButton = document.getElementById('EnterButton');
    enterButton.style.display = 'none';
    const McName = document.getElementById('MCsName');
    McName.style.display = 'none';
    document.getElementById('EnterText').style.display = 'none';
    document.getElementById('gendertext').style.display = 'none';
    document.getElementById('StartingBtn').addEventListener('click', () => {
        document.getElementById('StartingBtn').style.display = 'none';
        enterButton.style.display = 'inline-block';
        McName.style.display = 'inline-block';
        document.getElementById('EnterText').style.display = 'inline-block';

    })


}
/*An und Ausschalten der Sichtbarkeit
  je nach dem welchen genderButton man auswählt, wird dem gender dieses Zugeschrieben
 */
function ManageGender(): string {
    document.getElementById('gendertext').style.display = 'inline-block';
    document.getElementById('fembtn').style.display = 'inline-block';
    document.getElementById('malebtn').style.display = 'inline-block';
    document.getElementById('divbtn').style.display = 'inline-block';
    let gender = '';
    document.getElementById('fembtn').addEventListener('click', () => {
        gender = 'female'
        HideGenderElements(); // stellt Sichtbarkeit aus
    })
    document.getElementById('malebtn').addEventListener('click', () => {
        gender = 'male'
        HideGenderElements();
    })
    document.getElementById('divbtn').addEventListener('click', () => {
        gender = 'divers';
        HideGenderElements();

    })
    return gender;
}

let currentScene : Scene = null;

function init() {

    ManageName();
    let Mcname;
    let McGender;
    document.getElementById('EnterButton').addEventListener('click', () => {
        const name = <HTMLInputElement>document.getElementById('MCsName');
        Mcname = name.value;
        document.getElementById('EnterButton').style.display = 'none';
        document.getElementById('MCsName').style.display = 'none';
        document.getElementById('EnterText').style.display = 'none';

        McGender = ManageGender();
        currentScene = new Scene(Mcname,McGender);

        currentScene.BuildScene();
        const playground = document.getElementById('Start');
        playground.addEventListener('click',() =>{
            currentScene.ChangeScene();
            //Todo: next block of text.If no text, then next Scene
        })


    })



}

document.addEventListener('DOMContentLoaded', (event) => {
    init();
});

function SetDisplay (element: HTMLElement, display: string):void {
    element.style.display = display;
}
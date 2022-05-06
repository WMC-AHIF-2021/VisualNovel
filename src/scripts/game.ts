
const scene = {
    background: '../../images/backgrounds/SpawnPoint.png',
    text: '.',
    CharacterRight: '.',
    Character2Left: '.',
};


function HideGenderElements() {
    document.getElementById('gendertext').style.display = 'none';
    document.getElementById('fembtn').style.display = 'none';
    document.getElementById('malebtn').style.display = 'none';
    document.getElementById('divbtn').style.display = 'none';
    document.getElementById('textbox').style.display = 'inline-block';
    document.getElementById('SpeakingPerson').style.display = 'inline-block';
}

function init() {
    SetDisplay(document.getElementById('EnterButton'), 'none');
    SetDisplay(document.getElementById('MCsName'), 'none');
    document.getElementById('EnterText').style.display = 'none';
    document.getElementById('gendertext').style.display = 'none';
    document.getElementById('StartingBtn').addEventListener('click', () => {
        document.getElementById('StartingBtn').style.display = 'none';
        document.getElementById('EnterButton').style.display = 'inline-block';
        document.getElementById('MCsName').style.display = 'inline-block';
        document.getElementById('EnterText').style.display = 'inline-block';
        document.getElementById('EnterButton').addEventListener('click', () => {
            const name = <HTMLInputElement>document.getElementById('MCsName');
            const McName = name.value;
            document.getElementById('EnterButton').style.display = 'none';
            document.getElementById('MCsName').style.display = 'none';
            document.getElementById('EnterText').style.display = 'none';
            document.getElementById('gendertext').style.display = 'inline-block';
            document.getElementById('fembtn').style.display = 'inline-block';
            document.getElementById('malebtn').style.display = 'inline-block';
            document.getElementById('divbtn').style.display = 'inline-block';
            let gender = '';

                document.getElementById('fembtn').addEventListener('click', () => {
                    gender = 'female'
                    HideGenderElements();
                })
                document.getElementById('malebtn').addEventListener('click', () => {
                    gender = 'male'
                    HideGenderElements();
                })
                document.getElementById('divbtn').addEventListener('click', () => {
                    gender = 'divers';
                    HideGenderElements();

                })

        })


    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    init();
});

function SetDisplay (element: HTMLElement, display: string):void {
    element.style.display = display;
}

const scene = {
    background: '../../images/backgrounds/SpawnPoint.png',
    text: '.',
    CharacterRight: '.',
    Character2Left: '.',
};


function init()
{
    SetDisplay(document.getElementById('EnterButton'),'none')
    SetDisplay(document.getElementById('MCsName'),'none');
    document.getElementById('StartingBtn').addEventListener('click', () => {
        document.getElementById('StartingBtn').style.display = 'none';
        document.getElementById('EnterButton').style.display = 'inline-block';
        document.getElementById('MCsName').style.display= 'inline-block';
        document.getElementById('EnterText').style.display= 'inline-block';
        document.getElementById('EnterButton').addEventListener('click', () =>{
            const name = <HTMLInputElement>document.getElementById('MCsName');
            const McName = name.value;
            document.getElementById('EnterButton').style.display = 'none';
            document.getElementById('MCsName').style.display= 'none';
            document.getElementById('EnterText').style.display= 'none';



        })



    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    init();
});

function SetDisplay (element: HTMLElement, display: string):void {
    element.style.display = display;
}
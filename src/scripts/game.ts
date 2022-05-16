import { HttpClient, Scene } from "./server-client";

let curScene: SceneManager;
let McName;
let McGender;
const MAXSCENES = 2;

class SceneManager {
  private readonly client: HttpClient;
  public headScene: Scene;

  constructor() {
    this.client = new HttpClient();
  }

  public async readScene(): Promise<void> {
    if (this.headScene == null) {
      this.headScene = await this.client.getScene(0);
    } else {
      if (this.headScene.next1 >= MAXSCENES) {
        // Remove all event listeners by deleting this item and replacing it
        /* const oldElement = document.getElementById('Start');
                const newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                //TODO: Redirect to other page ig*/
      } else {
        this.headScene = await this.client.getScene(this.headScene.next1);
      }
    }
  }

  public HandleTextBox() {
    document.getElementById("SpeakingPerson").innerText = McName;

    const splitText = this.headScene.text.split(";");
    document.getElementById("textbox").innerText = splitText[0];
    let i = 1;
    document.getElementById("Start").addEventListener("click", () => {
      if (i < splitText.length) {
        document.getElementById("textbox").innerText = splitText[i];
        i++;
      } else {
        this.headScene.done = true;
      }
    });
  }

  ChangeScene() {
    const imageUrl = new URL(
      this.headScene.background,
      // @ts-ignore
      import.meta.url
    );
    (document.getElementById("Start") as HTMLImageElement).src = imageUrl.href;
    console.log(imageUrl.href);
    console.log(this.headScene.background);
    this.HandleTextBox();
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
  document.getElementById("gendertext").style.display = "inline-block";
  document.getElementById("fembtn").style.display = "inline-block";
  document.getElementById("malebtn").style.display = "inline-block";
  document.getElementById("divbtn").style.display = "inline-block";
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
  ManageName();
  document.getElementById("EnterButton").addEventListener("click", async () => {
    const name = <HTMLInputElement>document.getElementById("MCsName");
    McName = name.value;
    document.getElementById("EnterButton").style.display = "none";
    document.getElementById("MCsName").style.display = "none";
    document.getElementById("EnterText").style.display = "none";
    ManageGender();

    curScene = new SceneManager();
    await curScene.readScene();
    await curScene.ChangeScene();
    document.getElementById("Start").addEventListener("click", async () => {
      if (curScene.headScene.done == true) {
        await curScene.readScene();
        await curScene.ChangeScene();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async event => {
  await init();
});

function SetDisplay(element: HTMLElement, display: string): void {
  element.style.display = display;
}

import * as $ from "jquery";
export interface Scene {
  id: number;
  background: string;
  characterLeft: string;
  characterRight: string;
  speakingPerson: string[];
  text: string;
  next1: string;
  next2: string;
  done: boolean;
  biteImpact: boolean;
}

export class HttpClient {
  private readonly baseUrl: string = "http://localhost:3000"; //http://10.9.15.18:5000
  private readonly sceneGeneralUrl: string = `${this.baseUrl}/scenes`;

  public async getScene(id: number): Promise<Scene> {
    const scene = <Scene>await $.get(`${this.sceneGeneralUrl}/${id}`);
    console.log(scene);
    return scene;
  }
}

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
  private readonly baseUrl: string = "https://10.9.15.18:5000"; //http://10.9.15.18:5000
  private readonly sceneGeneralUrl: string = `${this.baseUrl}/scenes`;

  public async getScene(id: number): Promise<Scene> {
    return <Scene>await $.get(`${this.sceneGeneralUrl}/${id}`);
  }
}

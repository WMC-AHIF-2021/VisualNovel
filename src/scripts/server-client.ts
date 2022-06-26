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
    private readonly baseUrl: string = "https://10.9.15.18:5000"; //http://10.9.15.18:5000 //http://localhost:3000
    private readonly sceneGeneralUrl: string = `${this.baseUrl}/scenes`;
    private readonly fallbackUrl: string = "https://raw.githubusercontent.com/WMC-AHIF-2021/VisualNovel/main/server/db.json";

    public async getScene(id: number): Promise<Scene> {
        try {
            return await $.ajax({
                url: `${this.sceneGeneralUrl}/${id}`,
                timeout: 500,
                dataType: "json"
            });
        } catch {
            return (await $.ajax({url: this.fallbackUrl, dataType: "json"}))["scenes"][id];
        }
    }
}

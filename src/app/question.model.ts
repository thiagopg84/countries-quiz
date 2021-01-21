import { Answer } from "./answer.model";

export class Question {
    questionAnswers: Answer[] = [];
    constructor(public questionType: number, public question: string, public countryName: string, public countryFlag: string, public numberOfTries: number) {

    }
}

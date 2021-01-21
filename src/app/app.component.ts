import { Component } from '@angular/core';
import { Answer } from './answer.model';
import { Country } from './country.model';
import { GetCountriesService } from './get-countries.service';
import { Question } from './question.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  questionsCount: number = 0; // counter to keep track of how many questions were answered & to define the current question
  questions: Question[] = [] // variable where the questions are stored
  countries: Country[] = []; // variable where the countries & their data are stored
  isItCorrect: boolean = null; // variable to keep track if the current question has been correctly answered
  correctAnswers: number = 0;

  constructor(private getCountriesService: GetCountriesService) {}

  ngOnInit(): void {
    this.getCountriesService.getCountries().subscribe(() => { // subscribing to the service which fetches data from API
      this.countries = this.getCountriesService.allCountries.value; // copying the API data to the component

      while (this.questions.length < 10) { // defining the maximum number of questions (10 in this case)
        let myNumber: number = this.getRandomNumber(); // random number to get a random country
        let otherNumbers: number[] = this.getRandomNumbersOtherThan(myNumber); // random numbers to get wrong answers from other countries
        let typeOfQuestion: number = +(Math.random()).toFixed(0) // random number to randomize the type of question
        let question: Question; // variable to store the question
        let answers: Answer[] = []; // variable to store all possible answers
        
        if (typeOfQuestion == 0) { // check to see the type of question and control the question title
          question = new Question(typeOfQuestion, this.countries[myNumber].countryCapital + 'is the capital of:', this.countries[myNumber].countryName, this.countries[myNumber].countryFlag, 0)
        } else {
          question = new Question(typeOfQuestion, 'Which country does this flag belong to?', this.countries[myNumber].countryName, this.countries[myNumber].countryFlag, 0);
        }

        answers.push(new Answer(this.countries[myNumber].countryName, true, false)) // adding the correct answer

        otherNumbers.forEach((number) => { // adding wrong answers
          const answer = new Answer(this.countries[number].countryName, false, false)
          answers.push(answer);
        })

        answers.sort((a,b) => (a.answer > b.answer) ? 1 : ((b.answer > a.answer) ? -1 : 0)); // sorting answers alphabetically
        question.questionAnswers = answers; // assigning value to this question's array of answers 
        this.questions.push(question); // pushing the all ready question to the global array of questions
      }
    });
  }

  getRandomNumber(): number {
    let number: number = +(Math.random() * this.getCountriesService.allCountries.value.length).toFixed(0);
    return number;
  }

  getRandomNumbersOtherThan(number: number): number[] {
    let arrayOfNumbers: number[] = [];
    // defining how many wrong answers the user will get (4 in this case)
    while(arrayOfNumbers.length < 4) {
      let newNumber: number = this.getRandomNumber();
      if (newNumber !== number && !arrayOfNumbers.includes(newNumber)) {
        arrayOfNumbers.push(newNumber)
      }
    }
    return arrayOfNumbers;
  }

  checkAnswer(question: Question, answer: Answer) {
    question.numberOfTries++;
    answer.isItAnswered = true;
    this.isItCorrect = answer.isCorrect;
    if (question.numberOfTries == 1 && this.isItCorrect) {
      this.correctAnswers++;
    }
  }

  nextQuestion() {
    this.questionsCount++;
    this.isItCorrect = null;
  }

  restartGame() {
    this.questionsCount = 0
    this.questions = [];
    this.countries = [];
    this.isItCorrect= null;
    this.correctAnswers = 0;
    this.ngOnInit();
  }
}
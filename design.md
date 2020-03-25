# Respon_sum

## Tech stack

MERN (MongoDB, Express, React, Node.js).

## Preserving locality (prevent answering from remote locations)

Take advantage of eduroam to ensure they're in the classroom.
Maybe if greater than 150 meters away, boolean inClass = false.
Could be an option enabled by professor. (Possible application: online lectures.)(work from home =))

Could do GPS via **mobile only** for now.

Can potentially host on Waterloo servers, avoid international data storage. 
We want to be generous to avoid false positives.
can be disabled per class/professor.

## Authentication

ADFS: https://uwaterloo.ca/information-systems-technology/services/web-based-central-authentication.
Could request access from UW, but until, then, let's roll our own.

## Student UI

Docker? Native app?

HTML, Javascript, React for webapp, eventually.
iclicker
potentially allow results to be shown to students (instructor's choice)

UI idea: auth screen, then 5 buttons, one per allowable answer.
(Customizable by instructor: change number of buttons per class.)
Above the 5 buttons is a dropdown for changing class (Select from a drop down menu, maybe option to add a class at the bottom of the drop down menu, then enter ID #)


Use mobile for GPS location services.
Quick android prototype, then port to Flutter.(Flutter supports both android and IOS, can convert to both)
Note: In future consider support for laptops

Have a drop-down for institution selection.

## Instructor UI

HTML/CSS/JS/React webapp.

Features:
* start a question, stop, start with timer
* view results in different formats per question for student(s) (graphs, export to excel) (correct, wrong, unanswered)
* how many students in location (if enabled)
* settings
* Contact for assistance -> to Ryan and Hank's email

* have option to store question and answers/correct answer (or at least identifying information), and option
  to make visible to students
* also have a popup UI to display the question so the instructor doesn't have to enter it twice

Design:
* single-page application (SPA)
* nice, smooth flow
* multiple tabs for options
* tabs: (Live Quiz) start/stop question + results of last question (for whole of question process, fade in each question and result for current session, whether results are displayed and in what form based on settings previously configured), (History) question history and breakdowns, (Data) data/export, (Settings) settings/contact

Later down the line: 
* Give chance to share and received shared results from past classes (in graphs and percent/line graphs) Opt-in feature
* Line graphs of class performance/participation over time
* Can tailor the difficulty and type of questions to best
* API for scraping powerpoints/google slides for questions

## Database

// login info omitted

Records: student, instructor, class, questions, responses

Terminology: response is the object generated when a student clicks e.g. A,
and "answer" is the option out of 5 or so they click.

Student:
{
  ID: UUID
  name: string
  email: string
  student number: const string ("anonymous")
  institution: string

  ( other identifying info we ask for on sign up )
  current classes: [ class ids ]
  prior classes: [ class ids ]  (Student inherits Class, vars questions right,wrong,unanswered,etc.)
  
  class id to performance: { map of class id to Stats }
  
  overall performance: Stats
  
  responses: [ response ids ]
}

Instructor:
{
  ID: UUID
  name: string
  email: string
  institution: string
  ( other identifying info )
  
  currently owned classes: [ class ids ]
  prior owned classes: [ class ids ]
  
  **(if question format, store question and possible reponses)
  questions: [ question ids ] (%correct, %answered,)
}

Class:
{
  ID: uuid
  name: string
  active: boolean
  instructors: [ instructor ids ]
  students: [ student ids ]
  questions: [ question ids ]
  all responses: [ response ids ]
  aggregate stats: QuestionStats
}

Question:
{
  ID: uuid
  class: class id
  
  asked: int
  
  timestamps: [ // length equal to asked
    {
      started timestamp: datetime
      stopped timestamp: datetime
    }
  ]
  
  responses: [ response ids ] (from id we can extract answer)
  
  viewableByStudents: boolean
  
  type: QuestionType
  
  stats: Stats[] // length equal to asked
  
  ( these fields appear if type == MULTIPLE_CHOICE )
  num answers: int
  ( these are optional )
  correct answer: int
  question text: string
  answer texts: [ string ] // order important
  
  ( these fields appear if type == SHORT_ANSWER )
  ( optional )
  correct answer: string
}

object Stats {
  num correct: int
  num incorrect: int
  num didn't answer: int
}

enum QuestionType {
  MULTIPLE_CHOICE, SHORT_ANSWER,
}

Response:
{
  ID: uuid
  timestamp: datetime
  student: student id
  class: class id
  question: question id
  
  ( optional )
  correct: boolean
  
  ( if the question's type is MULTIPLE_CHOICE )
  answer number: int
  
  ( if the question's type is SHORT_ANSWER )
  answer text: string
}

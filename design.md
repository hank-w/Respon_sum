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

HTML, Javascript, React for webapp, eventually.
iclicker
potentially allow results to be shown to students (instructor's choice)

UI idea: auth screen, then 5 buttons, one per allowable answer.
(Customizable by instructor: change number of buttons per class.)
Above the 5 buttons is a dropdown for changing class (Select from a drop down menu, maybe option to add a class at the bottom of the drop down menu, then enter ID #)


Use mobile for GPS location services.
Quick android prototype, then port to Flutter.(Flutter supports both android and IOS, can convert to both)
Note: In future consider support for laptops

## Instructor UI

HTML/CSS/JS/React webapp.

Features:
* start a question, stop, start with timer
* view results in different formats per question for student(s) (graphs, export to excel) (correct, wrong, unanswered)
* how many students in location (if enabled)
* settings
* Contact for assistance -> to Ryan and Hank's email

Design:
* single-page application (SPA)
* nice, smooth flow
* multiple tabs for options
* tabs: (Live Quiz) start/stop question + results of last question (for whole of question process, fade in each question and result for current session, whether results are displayed and in what form based on settings previously configured), (History) question history and breakdowns, (Data) data/export, (Settings) settings/contact

Later down the line: 
* Give chance to share and received shared results from past classes (in graphs and percent/line graphs) Opt-in feature
* Line graphs of class performance/participation over time
* Can tailor the difficulty and type of questions to best


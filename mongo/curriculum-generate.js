// Data Sources
// Curriculum: https://docs.google.com/spreadsheets/d/1pq0lgAcM1-yZHU5DwZQZjOk1DVlCSMim6csqdDB-3tk/edit#gid=616296061
// Names       http://deron.meranda.us/data/

//var _        = require('lodash');
var _        = require('lodash-contrib');
var async    = require("async");
var mongojs  = require("mongojs");
var exec     = require('child_process').exec;
var execSync = require("exec-sync");
var fs       = require('fs');
var uuid     = require('uuid');


var names = {
    first_male:   fs.readFileSync('data/popular-male-first.txt'  ).toString().toString().toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } ).split("\n"),
    first_female: fs.readFileSync('data/popular-female-first.txt').toString().toString().toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } ).split("\n"),
    last:         fs.readFileSync('data/popular-last.txt'        ).toString().toString().toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } ).split("\n"),
    generated:    []
};

// Code
process.chdir(__dirname);


var lookup = {
    title: {
        "male":   "Mr",
        "female": "Ms"
    },
    curriculum_years: [],
    teachers:         []
};
var db = mongojs('mongodb://localhost/curriculum');
async.waterfall([
    function(next) {
        db.dropDatabase("curriculum", function() {
            next();
        });
    },
    function(next) {
        // Import CSV file
        console.log('execSync("mongoimport -d curriculum -c curriculum --type csv --file data/curriculum.csv --headerline")');
        console.log( execSync("mongoimport -d curriculum -c curriculum --type csv --file data/curriculum.csv --headerline") );

        //> db.curriculum.find()[100]
        //{
        //    "_id" : ObjectId("54b57edcbe6082d34d1896e8"),
        //    "curriculum_id" : 101,
        //    "curriculum_date_created" : "11/21/2014",
        //    "curriculum_url" : "https://www.khanacademy.org/math/cc-third-grade-math/cc-3rd-mult-div-topic/cc-third-grade-applying-mult-div/e/solving-basic-multiplication-and-division-equations",
        //    "quiz_name" : "Solving basic multiplication and division equations",
        //    "subject" : "Math",
        //    "topic" : "Multiplication and division",
        //    "lesson" : "Applying multiplication and division",
        //    "quiz_id" : "solving-basic-multiplication-and-division-equations",
        //    "curriculum_year" : "3rd grade (U.S.)"
        //}

        next();
    },
    function(next) {
        db.collection('curriculum').distinct("curriculum_year", function(error, rows) {
            lookup.curriculum_years = rows;
            console.log("curriculum-generate.js:58:", "lookup.curriculum_years", lookup.curriculum_years);
            next();
        });
    },
    function(next) {
        db.collection('curriculum').find(function(error, rows) {
            lookup.curriculums = rows;
            console.log("curriculum-generate.js:64:", "lookup.curriculums = rows;lookup.curriculums;", lookup.curriculums);
            next();
        });
    },
    function(next) {
        // create 21 teachers - 3 per year
        lookup.teachers = [];
        _.forEach(lookup.curriculum_years, function(year) {
            for(var i=0; i<3; i++) {
                do {
                    var gender = _.sample(["male","female"]);
                    var name   = [lookup.title[gender], _.sample(names["first_"+gender]), _.sample(names.last)].join(" ");
                } while(names.generated.indexOf(name) !== -1 )

                var teacher = {
                    "teacher_name":    name,
                    "teacher_gender":  gender,
                    "curriculum_year": year
                };
                lookup.teachers.push(teacher);
                names.generated.push(name);

                console.log("curriculum-generate.js:87:", "teacher", teacher)
            }
        });
        db.collection('teachers').insert(lookup.teachers, function() {
            next();
        })
    },
    function(next) {
        // create 20 students per teacher
        lookup.students = [];
        _.forEach(lookup.teachers, function(teacher) {
            for(var i=0; i<20; i++) {
                do {
                    var gender = _.sample(["male","female"]);
                    var name   = [_.sample(names["first_"+gender]), _.sample(names.last)].join(" ");
                } while(names.generated.indexOf(name) !== -1 )

                var student = {
                    "student_name":    name,
                    "student_gender":  gender,
                    "curriculum_year": teacher.curriculum_year
                };
                lookup.students.push(student);
                names.generated.push(name);

                console.log("curriculum-generate.js:112:", "student", student)
            }
        });
        db.collection('students').insert(lookup.students, function() {
            next();
        })
    },
    function(next) {
        lookup.quizes = [];
        db.collection('curriculum').find(function(error, curriculums) {
            _.forEach(curriculums, function(curriculum) {
                var teacher = _(lookup.teachers).where({ curriculum_year: curriculum.curriculum_year }).sample();
                var quiz = {
                    "quiz_name":       curriculum.quiz_name,
                    "teacher_name":    teacher.teacher_name,
                    "curriculum_year": curriculum.curriculum_year,
                    "questions":       {}
                }

                for(var i=1; i<=10; i++) {
                    var question = {
                        uuid: uuid.v4(),
                        quiz_name:        quiz.quiz_name,
                        question_text:    "Q"+i,
                        question_options: ["A","B","C","D","E","F"],
                        question_answer:  _.sample(["A","B","C","D","E","F"])
                    }

                    quiz.questions[question.uuid] = question;
                }
                lookup.quizes.push(quiz);

                console.log("curriculum-generate.js:144:", "quiz", quiz)
            });
            db.collection('quizes').insert(lookup.quizes, function() {
                next();
            })
        })
    },
    function(next) {
        var answer_quiz_submission = function(quiz_submission, quiz) {
            _.forEach(quiz.questions, function(question) {
                if( Math.random() > 0.5 ) {
                    quiz_submission.submission_answers[question.uuid] = question.question_answer;
                } else {
                    quiz_submission.submission_answers[question.uuid] = _.sample(question.question_options);
                }
            })
        };
        var mark_quiz_submission = function(quiz_submission, quiz) {
            var marks_totals = 0;
            for( var uuid in quiz_submission.submission_answers ) {
                if( quiz_submission.submission_answers[uuid] === quiz.questions[uuid].question_answer) {
                    quiz_submission.submission_marks[uuid] =  1;
                } else {
                    quiz_submission.submission_marks[uuid] =  0;
                }
                marks_totals += quiz_submission.submission_marks[uuid];
            }
            quiz_submission.submission_score = marks_totals / _.values(quiz_submission.submission_marks).length;

            console.log("curriculum-generate.js:174:mark_quiz_submission", "quiz_submission.submission_score", quiz_submission.submission_score)
        };


        lookup.quiz_submissions = [];
        var dirty_inserts = 0;
        _.forEach(lookup.students, function(student) {
            _(lookup.quizes).where({ curriculum_year: student.curriculum_year }).forEach(function(quiz) {
                var quiz_submission = {
                    quiz_name:          quiz.quiz_name,
                    submission_answers: {},
                    submission_marks:   {},
                    submission_score:   0
                };
                answer_quiz_submission(quiz_submission, quiz);
                mark_quiz_submission(quiz_submission, quiz)

                lookup.quiz_submissions.push(quiz_submission)
                console.log("curriculum-generate.js:183:", "quiz_submission", quiz_submission)

                dirty_inserts++;
                db.collection('quiz_submissions').insert(quiz_submission, function() {
                    dirty_inserts--;
                });
            });
        });
        var setIntervalID = setInterval(function() {
            if( dirty_inserts === 0 ) {
                clearInterval(setIntervalID);
                next();
            }
        })
    }
], function() {
    process.exit();
})
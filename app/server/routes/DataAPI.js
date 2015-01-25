var _        = require('lodash-contrib');
var async    = require("async");
var mongojs  = require("mongojs");
var fs       = require('fs');
var uuid     = require('uuid');
var extend   = require('node.extend');
var config   = require('../config/config.js')[process.env.NODE_ENV];

var db_tables = ["curriculum","quiz_submissions","quiz_submissions_denormalized","quizes","students","teachers"];
var db = mongojs(config.db.data, db_tables);
module.exports = function(app) {

    app.get("/data/distinct/currculum_years", function(request, response) {
        db.curriculum.distinct("curriculum_year", function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/distinct/subjects", function(request, response) {
        db.curriculum.distinct("subject", function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/distinct/topics", function(request, response) {
        db.curriculum.distinct("topic", function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/distinct/teacher_names", function(request, response) {
        db.teachers.distinct("teacher_name", function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/distinct/student_genders", function(request, response) {
        //db.students.distinct("student_gender", function(error, rows) {
            response.write(JSON.stringify(["male","female"], null, 4));
            response.end();
        //});
    });


    app.get("/data/table/currculum", function(request, response) {
        db.curriculum.find(function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/table/students", function(request, response) {
        db.students.find(function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/table/teachers", function(request, response) {
        db.teachers.find(function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/table/quizes", function(request, response) {
        db.quizes.find(function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });
    app.get("/data/table/quiz_submissions", function(request, response) {
        db.quiz_submissions.find(function(error, rows) {
            response.write(JSON.stringify(rows, null, 4));
            response.end();
        });
    });

    app.get("/data/denormalized", function(request, response) {
        if( true ) {
            // 3342 ms
            db.collection('quiz_submissions_denormalized').find(function (error, denormalized) {
                response.write(JSON.stringify(denormalized, null, 4));
                response.end();
            });
        } else {
            // 23,447ms to calculate locally - hard coded cache generated in curriculum-generate.js
            db.collection('quiz_submissions').find(function (error, denormalized) {
                async.eachLimit(denormalized, 10, function (denormalized_row, denormalized_each_next) {
                    async.series([
                        function(series_next) {
                            db.collection('curriculum').findOne({quiz_name: denormalized_row.quiz_name}, function (error, curriculum) {
                                extend(denormalized_row, curriculum);
                                series_next();
                            });
                        },
                        function(series_next) {
                            db.collection('quizzes').findOne({quiz_name: denormalized_row.quiz_name}, function (error, quiz) {
                                extend(denormalized_row, quiz);
                                series_next();
                            });
                        },
                        function(series_next) {
                            db.collection('students').findOne({student_name: denormalized_row.student_name}, function (error, student) {
                                extend(denormalized_row, student);
                                series_next();
                            });
                        },
                        function(series_next) {
                            db.collection('teachers').findOne({teacher_name: denormalized_row.teacher_name}, function (error, teacher) {
                                extend(denormalized_row, teacher);
                                series_next();
                            });
                        }
                    ], function() {
                        // END async.parallel
                        delete denormalized_row._id;

                        denormalized_each_next();
                    });
                }, function() {
                    // END async.each(denormalized)
                    response.write(JSON.stringify(denormalized, null, 4));
                    response.end();
                });
            })
        }
    });


    app.get("/data/queries/league_table_students", function(request, response) {
        db.quiz_submissions.group({
            key: { student_name: 1 },
            initial: { total: 0, count: 0, min: Infinity, max: 0 },
            reduce: function( row, result ) {
                result.max = Math.max(result.max, row.submission_score);
                result.min = Math.min(result.min, row.submission_score);
                result.total += row.submission_score;
                result.count++;
            },
            finalize: function(result) {
                result.avg = result.total / result.count;
                result.avg = Math.round(result.avg * 100000) / 100000;
            }
        }, function(error, result) {
            var sort_by = "avg";
            result.sort(function(a,b) { return (a[sort_by] < b[sort_by]) ? -1 : ((a[sort_by] > b[sort_by]) ? 1 : 0); }).reverse();

            response.write(JSON.stringify(result, null, 4));
            response.end();
        });
    });

    app.get("/data/queries/league_table_teachers", function(request, response) {
        db.quiz_submissions_denormalized.group({
            key: { teacher_name: 1 },
            initial: { total: 0, count: 0, min: Infinity, max: 0 },
            reduce: function( row, result ) {
                result.max = Math.max(result.max, row.submission_score);
                result.min = Math.min(result.min, row.submission_score);
                result.total += row.submission_score;
                result.count++;
            },
            finalize: function(result) {
                result.avg = result.total / result.count;
                result.avg = Math.round(result.avg * 100000) / 100000;
            }
        }, function(error, result) {
            var sort_by = "avg";
            result.sort(function(a,b) { return (a[sort_by] < b[sort_by]) ? -1 : ((a[sort_by] > b[sort_by]) ? 1 : 0); }).reverse();

            response.write(JSON.stringify(result, null, 4));
            response.end();
        });
    });
}
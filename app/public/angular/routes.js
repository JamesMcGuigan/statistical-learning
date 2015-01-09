angular.module('statisticalLearningApp.routes',['ngRoute','angulartics','angulartics.google.analytics']).config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.otherwise({ redirectTo: "/login" });
        $routeProvider.when("/login",  { templateUrl: "html/login.html", controller: "LoginController" });


        $routeProvider.when("/student/",                                { redirectTo:  "/student/quiz" });
        $routeProvider.when("/student/quiz/list",                       { templateUrl: "html/quiz/list.html", controller: "StudentQuizListController" });
        $routeProvider.when("/student/quiz/take/:quizID/:submissionID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });

        $routeProvider.when("/teacher/quiz/",             { templateUrl: "html/quiz/list.html", controller: "StudentQuizListController" });
        $routeProvider.when("/teacher/quiz/view/:quizID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });
        $routeProvider.when("/teacher/quiz/mark/:id",     { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });
        $routeProvider.when("/teacher/quiz/edit/:quizID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });


        $routeProvider.when("/teacher/", { templateUrl: "html/quiz/list.html", controller: "QuizListController" });
        //$routeProvider.when("/edit/:id", { templateUrl: "html/edit.html", controller: "EditController" });
    }
]);
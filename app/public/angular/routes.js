angular.module('AngularApp.routes',['ngRoute']).config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.otherwise({ redirectTo: "/tables" });
        $routeProvider.when("/login",     { templateUrl: "html/login.html",    controller: "LoginController" });
        $routeProvider.when("/register",  { templateUrl: "html/register.html", controller: "LoginController" });

        //$routeProvider.when("/student/",                                { redirectTo:  "/student/quiz" });
        //$routeProvider.when("/student/quiz/list",                       { templateUrl: "html/quiz/list.html", controller: "StudentQuizListController" });
        //$routeProvider.when("/student/quiz/take/:quizID/:submissionID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });
        //
        //$routeProvider.when("/teacher/quiz/",             { templateUrl: "html/quiz/list.html", controller: "StudentQuizListController" });
        //$routeProvider.when("/teacher/quiz/view/:quizID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });
        //$routeProvider.when("/teacher/quiz/mark/:id",     { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });
        //$routeProvider.when("/teacher/quiz/edit/:quizID", { templateUrl: "html/quiz/take.html", controller: "StudentQuizTakeController" });

        //$routeProvider.when("/teacher/", { templateUrl: "html/quiz/list.html", controller: "QuizListController" });
        //$routeProvider.when("/edit/:id", { templateUrl: "html/edit.html", controller: "EditController" });

        //$routeProvider.when("/graphs", { templateUrl: "html/graphs.html", controller: "GraphController" });
        $routeProvider.when("/tables", { templateUrl: "html/tables.html", controller: "TableController" });
    }
]);
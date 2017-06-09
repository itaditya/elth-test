'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('ImdbCtrl', function ($scope, $position, $http) {
    var imdb_data = [];
    var genres = {};
    $scope.isLoading = true;
    $scope.displayForm = {};
    $scope.movieCount = 0;
    function processData() {
        imdb_data = imdb_data.map(function (movie) {
            movie.genres = movie.genres.split("|");
            movie.genres.map(function (genre) {
                if (genres[genre]) {
                    genres[genre] += 1;
                } else {
                    genres[genre] = 1
                }
            })
            return movie;
        })
        createGenreForm();
    }

    function createGenreForm() {
        console.log('test');
        $scope.genreFormOptions = Object.keys(genres);
    }
    $scope.findByGenre = function () {
        $scope.movieCount = 0;
        $scope.displayForm = {};
        $scope.displayForm["genre"] = true;
    }
    $scope.selectGenre = function (form) {
        if(form.$valid){
            $scope.movieCount = genres[$scope.selectedGenre];
            console.log(genres[$scope.selectedGenre]);
        }
    }
    $scope.findByImdbRating = function () {
        $scope.movieCount = 0;
        $scope.displayForm = {};
        $scope.displayForm["imdbRating"] = true;
    }
    $scope.setImdbRange = function (form) {
        var checkFn = {
            checkFn1 : function (movie){
                return movie.imdb_score >= 8;
            },
            checkFn2 : function (movie){
                return (movie.imdb_score >= 6 && movie.imdb_score < 8);
            },
            checkFn3 : function (movie){
                return movie.imdb_score < 6;
            }
        }
        if(form.$valid){
            $scope.movieCount = 0;
            var filterFn = checkFn[$scope.imdbRatingRange];
            $scope.movieCount = imdb_data.filter(filterFn).length;
        }
    }
    $scope.findByYear = function () {
        $scope.movieCount = 0;
        $scope.displayForm = {};
        $scope.displayForm["year"] = true;
    }
    $scope.selectYear = function (form) {
        function checkYear(movie){
            return movie.title_year == $scope.selectedYear;
        }
        if(form.$valid){
            $scope.movieCount = 0;
            $scope.movieCount = imdb_data.filter(checkYear).length;
        }
    }
    $scope.findByGross = function () {
        $scope.movieCount = 0;
        $scope.displayForm = {};
        $scope.displayForm["gross"] = true;
    }
    $scope.setGrossRange = function (form) {
        var checkFn = {
            checkFn1 : function (movie){
                return movie.gross >= 100000000;
            },
            checkFn2 : function (movie){
                return (movie.gross >= 10000000 && movie.gross < 100000000);
            },
            checkFn3 : function (movie){
                return movie.gross < 10000000;
            }
        }
        if(form.$valid){
            $scope.movieCount = 0;
            var filterFn = checkFn[$scope.grossRange];
            $scope.movieCount = imdb_data.filter(filterFn).length;
        }
    }
    $http.get("\imdb_data.json").then(function (res) {
        imdb_data = res.data;
        processData();
        var sorted_data = imdb_data;
        var sortFn = function(a,b){
            return b.imdb_score - a.imdb_score;
        }
        sorted_data.sort(sortFn);
        // $scope.imdbData = res.data;
        $scope.imdbData = sorted_data;
        $scope.isLoading = false;
    })
});

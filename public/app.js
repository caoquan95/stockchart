var app = angular.module('app', [])
    .controller('mainCtrl', function ($scope, $http) {
        $scope.isLoading = true;
        $scope.stocks = [];
        $scope.code = "";
        $scope.isSaving = false;
        $scope.error = '';
        $scope.dates = [];
        var ctx = $("#stockChart");

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        var updateChart = function (labels, stocks) {
            var data = {
                labels: labels,

                datasets: stocks.map(function (stock) {
                    var color = getRandomColor();
                    return {
                        fill: false,
                        backgroundColor: color,
                        borderColor: color,
                        label: stock.code,
                        data: stock.data
                    }
                })
            };
            new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    }
                }
            });
        };
        $scope.data = {
            labels: $scope.dates,
            datasets: $scope.stocks.map(function (stock) {
                return {
                    label: stock.code,
                    data: stock.data
                }
            })
        };
        $scope.addStock = function () {
            $scope.error = "";
            if ($scope.code == "") {
                $scope.error = "You have to fill in the input";
            } else {
                $scope.isSaving = true;
                $http.post("/api/stock/" + $scope.code)
                    .then(function (response) {
                        var data = response.data;
                        if (data.status == 0) {
                            $scope.error = data.message;
                        } else if (data.status == 1) {
                            $scope.stocks.push({
                                code: data.data.code,
                                name: data.data.name,
                                data: data.data.data
                            });
                            updateChart($scope.dates, $scope.stocks);
                            $scope.code = "";
                        } else {
                            $scope.error = "Unknow Error";
                        }
                        $scope.isSaving = false;
                    });
            }

        };
        $http.get("/api/stocks")
            .then(function (response) {
                $scope.stocks = response.data.stocks;
                $scope.dates = response.data.dates;
                $scope.isLoading = false;

                updateChart($scope.dates, $scope.stocks);
            });

    });
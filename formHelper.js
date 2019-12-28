
    var app = angular.module('form-helper', []);

    app.directive('generareFormular', function () {
        var controller = function ($scope) {
            $scope.intrebari = [];

            $scope.tipuri = [{
                tip: "Text lung",
                id: 0
            },
            {
                tip: "Text scurt",
                id: 1
            },
            {
                tip: "Number",
                id: 2
            },
            {
                tip: "Radio",
                id: 3
            },
            {
                tip: "CheckBox",
                id: 4
            },
            {
                tip: "Slider",
                id: 5
            }];

            function verificare() {
                var trimite = true;
                for (var i = 0; i < $scope.intrebari.length; ++i) {
                    delete $scope.intrebari[i].raspuns;

                    if (!$scope.intrebari[i].tip) {
                        $scope.intrebari[i].mesaj =
                            "Te rugam sa selectezi tipul de intrebare sau sa-l stergi";
                        trimite = false;
                    } else if (!$scope.intrebari[i].intrebare) {
                        $scope.intrebari[i].mesaj = "Te rugam sa introduci intrebarea";
                        trimite = false;
                    } else {
                        $scope.intrebari[i].mesaj = undefined;
                        if (
                            $scope.intrebari[i].tip.id > 2 &&
                            $scope.intrebari[i].tip.id < 5
                        ) {
                            if (
                                !$scope.intrebari[i].parametri ||
                                $scope.intrebari[i].parametri.length == 0
                            ) {
                                $scope.intrebari[i].mesaj =
                                    "Te rugam sa adaugi optiuni sau sa stergi intrebarea";
                                trimite = false;
                            } else if ($scope.intrebari[i].parametri.length > 0)
                                $scope.intrebari[i].mesaj = undefined;
                        } else if ($scope.intrebari[i].tip.id == 5) {
                            $scope.intrebari[i].raspuns = [];

                            if (!$scope.intrebari[i].parametri)
                                $scope.intrebari[i].parametri = [0, 0];
                            if (!$scope.intrebari[i].min) {
                                $scope.intrebari[i].mesaj =
                                    "Te rugam se selectezi valorile de min si max";
                                trimite = false;
                            } else $scope.intrebari[i].parametri[0] = $scope.intrebari[i].min;

                            if (!$scope.intrebari[i].max) {
                                $scope.intrebari[i].mesaj =
                                    "Te rugam se selectezi valorile de min si max";
                                trimite = false;
                            } else $scope.intrebari[i].parametri[1] = $scope.intrebari[i].max;

                            if ($scope.intrebari[i].parametri.length == 2)
                                $scope.intrebari[i].mesaj = undefined;
                        }
                    }
                }

                return trimite;
            }

            function parsare() {
                var ret = [];
                var k = 0;
                $scope.intrebari.forEach(i => {
                    var add = {};
                    add['intrebareTip'] = i.tip.id;
                    add['intrebareText'] = i.intrebare;
                    add['_id'] = k++;
                    if (add.intrebareTip > 2 && add.intrebareTip < 5)
                        add['parametri'] = i.parametri;
                    else if (add.intrebareTip == 5) {
                        add['parametri'] = [];
                        add.parametri.push(i.min);
                        add.parametri.push(i.max);
                    }
                    ret.push(add);
                });
                return ret;
            }

            $scope.trimite = function () {
                var trimite = verificare();
                if (trimite) {
                    $scope.salvare({ formular: parsare() });
                };
            }
        }

        return {
            restrict: 'E',
            templateUrl: 'htm/generareForm.htm',
            scope: {
                salvare: '&'
            },
            controller: controller
        }
    });

    app.directive('vizualizareFormular', function () {
        var controller = function ($scope) {
            console.log("sunt aici");
            $scope.trimite = function () {
                var raspunsuri = {};
                var itr = $scope.formular;
                for (var i = 0; i < itr.length; ++i) {
                    if (itr[i].intrebareTip < 4) raspunsuri[itr[i]._id] = itr[i].raspuns;
                    else if (itr[i].intrebareTip == 4) {
                        var rez = "";
                        for (var k in itr[i].raspuns) {
                            if (itr[i].raspuns[k] == true) rez += itr[i].parametri[k] + ", ";
                        }
                        raspunsuri[itr[i]._id] = rez.slice(0, -2);
                    } else if (itr[i].intrebareTip == 5)
                        raspunsuri[itr[i]._id] = itr[i].slider;
                }

                //console.log(raspunsuri);
                $scope.rezultat({ raspuns: raspunsuri });

            }
        };

        return {
            restrict: 'E',
            templateUrl: 'htm/vizualizareForm.htm',
            scope: {
                formular: '=',
                rezultat: '&'
            },
            controller: controller
        }
    });

    app.directive('raspunsuriFormular', function () {
        return {
            restrict: 'E',
            templateUrl: 'htm/vizualizareRaspunsuri.htm',
            scope: {
                formular: '=',
                raspunsuri: '='
            }
        }
    });

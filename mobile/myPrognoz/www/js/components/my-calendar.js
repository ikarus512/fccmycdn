/* file: my-calendar.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fccmycdn.git
 */

;( function() {
  'use strict';

  angular.module('components.my-calendar',[])

  .directive('myCalendar', function() {

    return {

      restrict: 'E',
      templateUrl: 'js/components/my-calendar.html',
      scope: {},

      link: function($scope, $element, $attrs) {

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var d = new Date();
        $scope.today = {
          month: monthNames[d.getMonth()],
          date : d.getDate(),
          day  : dayNames[d.getDay()],
          h    : ('0'+d.getHours()  ).substr(-2,2),
          m    : ('0'+d.getMinutes()).substr(-2,2),
        };

        var weeks = [], w, dates, i, d2;
        for(w=0; w<6; w++) {
          dates = [];
          for (i=0; i<7; i++) {
            var d2 = new Date(d);
            d2.setDate(1 - d2.getDay() + w*7 + i);
            dates.push({
              d: d2.getDate(),
              s1: d.getMonth()!==d2.getMonth() ? 'color:grey;' : '',
              s2: d.getDate()===d2.getDate() && d.getMonth()===d2.getMonth() ? 'color:red;' : '',
            });
          }
          weeks.push( dates );
        }
        $scope.weeks = weeks;

      },
    };
  }); // .directive('myCalendar', ...

})();

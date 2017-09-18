/* file: directive-chart1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('components.my-chart', [])

  .directive('myChart', [function() {

    return {

      restrict: 'E',

      scope: {
        data: '=',
      },

      link: function($scope, element, attrs) {


        var width = 600, height = 300;

        $scope.$watch('data', function(newData, oldData) {

          if (newData) {
            var chartUpdate = chartInit(element[0], newData);
            if (chartUpdate) chartUpdate(newData);
          }

        },true); // $scope.$watch('data',...)



        function chartInit(selector, data) {

          var chartAreaSz = {
            left:   Math.floor( width*0.05),
            top:    Math.floor(height*0.03),
            right:  Math.floor( width*(1-0.1)),
            bottom: Math.floor(height*(1-0.20)),
          };

          //
          //  container
          //    svg
          //      chart
          //
          var container = d3.select(selector)
            // .attr('class','chart1-container')

          container.selectAll('*').remove();

          var svg = container
          .append('svg')
            .attr('class', 'chart1-chart')
            .attr('width', width) // ie11
            .attr('height', height) // ie11
            .attr('viewBox', '0 0 '+width+' '+height) // chrome
            // .style('min-width', '300px');

          var chart = svg
          .append('g')
            .attr('class', 'chart1-chart');




          function chartUpdate(newData) {

            var ny = newData.x.length - 1;

            chart.selectAll('g').remove();

            var x = d3.scaleTime()
              .domain(d3.extent(newData.x))
              .range([chartAreaSz.left, chartAreaSz.right]);

            var stocksArray = [], key;
            for (key in newData.stocks) stocksArray.push(newData.stocks[key]);

            var y = d3.scaleLinear()
              .domain([
                d3.min(stocksArray, function(stock) {
                  return d3.min(stock.values, function(d) { return d.y; });
                }),
                d3.max(stocksArray, function(stock) {
                  return d3.max(stock.values, function(d) { return d.y; });
                })
              ])
              .range([chartAreaSz.bottom, chartAreaSz.top]);

            var z = d3.scaleOrdinal(d3.schemeCategory10)
              // .domain(Object.keys(newData.stocks)); // Random colors
              .domain(['stock1', 'stock2', 'stock3', 'stock4', 'stock5']); // Fix color to name


            var xAxis = d3.axisBottom(x)
              .tickSize(1,1)
              .ticks(newData.x.length)
              .tickFormat(d3.timeFormat('%d %H:00'));

            chart.append('g')
              .attr('id', 'xAxis')
              .attr('transform', 'translate(0,' + chartAreaSz.bottom + ')' )
            .call(xAxis)
              .selectAll('text')
              .attr('class', 'chart1-axis-x-text')
              .attr('text-anchor', 'end')
              .attr('transform', 'translate(-8,3) rotate(-90)' );

            chart.append('g')
              .attr('id', 'verticalGrid')
            .selectAll('line')
            .data(x.ticks(newData.x.length))
            .enter().append('line')
              .attr('class', 'vertical-grid-line')
              .attr('x1', function(d){ return Math.floor(x(d));})
              .attr('x2', function(d){ return Math.floor(x(d));})
              .attr('y1', chartAreaSz.top)
              .attr('y2', chartAreaSz.bottom)
              .attr('stroke', 'black')
              .attr('stroke-width', '1px');

            var yAxis = d3.axisLeft(y)
              .ticks(10)
              .tickFormat(d3.format('.0f'))
              .tickSize(1,1);

            chart.append('g')
              .attr('id', 'yAxis')
              .attr('transform', 'translate(' + chartAreaSz.left + ',0)')
            .call(yAxis)
              .selectAll('text')
              .attr('class', 'chart1-axis-y-text')
              .style('text-anchor', 'end');

            chart.append('g')
              .attr('id', 'horizontalGrid')
            .selectAll('line')
            .data(y.ticks(10))
            .enter().append('line')
              .attr('class', 'horizontal-grid-line')
              .attr('x1', chartAreaSz.left)
              .attr('x2', chartAreaSz.right)
              .attr('y1', function(d){ return Math.floor(y(d));})
              .attr('y2', function(d){ return Math.floor(y(d));})
              .attr('stroke', 'black')
              .attr('stroke-width', '1px');



            var lineGen = d3.line()
              .curve(d3.curveLinear)
              .x( function(d) { return x(d.x); })
              .y( function(d) { return y(d.y); });

            var stock = chart.selectAll('.stock')
            .data(stocksArray)
            .enter().append('g')
              .attr('class', 'stock');

            stock.append('path')
              .attr('class', 'chart1-line')
              .attr('d', function(d) { return lineGen(d.values); })
              .style('stroke', function(d) { return z(d.id); })
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('stroke-width', 3)
              .attr('fill', 'none');

            // Legend
            stock.append('text')
              .attr('class', 'chart1-label')
            .datum( function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr('x', 10)
              .attr('transform', function(d) {
               return 'translate(' + x(d.value.x) + ',' + y(d.value.y) + ')'; })
              .text( function(d) {
                if (d.id !== 'initialZeroLine') return d.id; // do not label initialZeroLine
              });

          } // function chartUpdate(...)

          return chartUpdate;

        } // function chartInit(...)

      } // function link(...)

    };

  }]); // .directive('chart1', ...

})();

/**
 * print all dots from json data 
 * @param {SVG element} svg 
 * @param {array} data 
 * @param {function} xScale 
 * @param {function} yScale 
 * @param {integer} radius 
 * @param {string} color 
 * @param {string} translate 
 * @param {string} stroke 
 * @param {integer} infinit 
 */
const printDot =
(svg, data, xScale, yScale, radius=1.5, color='black',translate="", stroke='none', infinit=50) =>{
    svg.append('g')
        .attr('transform', translate)
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d=>{
                return xScale(d.x)
            })
            .attr('cy', d=>{
                if(d.y == '-Infinity' || d.y == 'Infinity') {
                    return infinit
                }
                return yScale(d.y)
            })
            .attr('r', radius)
            .style('fill', color)
            .style('stroke', stroke)
            .on(
                "mouseover", 
                function(d) {
                    d3.select(this).attr('r', d3.select(this).attr('r')*2)
                    }
                )                  
            .on(
                "mouseout", 
                function(d) {
                    d3.select(this).attr('r', d3.select(this).attr('r')/2)
                    }
                )
}

/**
 * print all dots from json data as symbols
 * @param {SVG element} svg 
 * @param {array} data  
 * @param {integer} size 
 * @param {integer} newsize 
 * @param {string} color 
 * @param {d3 symbol} symbol 
 * @param {integer} rotate 
 * @param {string} translate 
 */
const printSymbol =
(svg, data, size=20, newsize=60, color='black', symbol=d3.symbolStar, rotate=0, translate="") =>{
    svg.append('g')
        .attr('transform', translate)
        .selectAll('dot')
        .data(data)
        .enter()
        .append('path')
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${rotate})`)
            .attr('d', d3.symbol().type(symbol).size(size))
            .style('fill', color)
            .on(
                "mouseover", 
                function(d) {
                    d3.select(this).attr('d', d3.symbol().type(symbol).size(newsize))
                    }
                )                  
            .on(
                "mouseout", 
                function(d) {
                    d3.select(this).attr('d', d3.symbol().type(symbol).size(size))
                    }
                )
}

/**
 * prints a line to the SVG
 * @param {SVG element} svg 
 * @param {function} xScale 
 * @param {function} yScale 
 * @param {array} x 
 * @param {array} y 
 * @param {string} translate 
 */
const printLine = 
(svg, xScale, yScale, x, y, translate="") =>
    svg
    .append('line')
        .attr('transform', translation)
        .attr('stroke', 'black')
        .attr('x1',xAxis(x[0]))
        .attr('x2',xAxis(x[1]))
        .attr('y1',yAxis(y[0]))
        .attr('y2',yAxis(y[1]))

/**
 * prints a rectangle to the SVG
 * @param {SVG element} svg 
 * @param {function} xScale 
 * @param {function} yScale 
 * @param {array} xIn 
 * @param {array} yIn 
 * @param {string} color 
 * @param {string} stroke 
 * @param {integer} infinit 
 */
const printRect = 
(svg, xScale, yScale, xIn, yIn, color, stroke='black', infinit=50) =>
{
    let x = xScale(xIn[0]),
        y = yScale(yIn[0]),
        w = xScale(xIn[1])-xScale(xIn[0]),
        h = yScale(yIn[1])-yScale(yIn[0])

    if(w == 'Infinity') w = infinit

    svg.append('rect')
        .attr('transform', translation)
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr('stroke', 'black')
        .attr('fill', `${color}`)
        .attr('stroke', stroke);
}

/**
 * prints a path on the chart svg
 * @param {SVG element} svg 
 * @param {array} data 
 * @param {function} xScale 
 * @param {function} yScale 
 * @param {integer} upper 
 * @param {integer} lower 
 * @param {function} clickFunc 
 * @param {integer} size 
 * @param {integer} newsize 
 * @param {string} color 
 * @param {string} translate 
 */
const printPath =
(svg, data, xScale, yScale, upper, lower, clickFunc, size=2, newsize=5, color='black', translate="") => {

    svg.append('path')
        .attr('transform', translate)
        .datum(data)
        .attr('class', 'input_line')
        .attr('d', d3.line().x(d=>xScale(d.x)).y(d=>yScale(d.y)))
        .style('stroke', color)
        .style('stroke-width', size)
        .attr('pointer-events', 'visibleStroke')
        .on(
            "mouseover", 
            function(d) {
                d3.select(this).style('stroke-width', newsize)
                }
            )                  
        .on(
            "mouseout", 
            function(d) {
                d3.select(this).style('stroke-width', size)
                }
            )
        .on(
            'click',
            clickFunc()
            )

    for(let j = 1; j < data.length; j++)
    {
        if(crosses_bounds(data, yScale, j, upper))
            {
                let intersect = simple_intersection(upper, data, xScale, yScale, j)
                printSymbol(svg, [intersect], color, d3.symbolTriangle, 0, translate)
            }
            
        if(crosses_bounds(data, yScale, j, lower))
            {
                let intersect = simple_intersection(lower, data, xScale, yScale, j)
                
                printSymbol(svg, [intersect], color, d3.symbolTriangle, 180, translate)
            }
    }

}
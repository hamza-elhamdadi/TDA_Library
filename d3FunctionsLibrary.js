/**
 * print all dots from json data 
 * with specifications
 * 
 */
const printDot =
(svg, xAxis, yAxis, data, radius, color='black',translate="", stroke='none') =>{
    svg.append('g')
        .attr('transform', translate)
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d=>{
                return xAxis(d.x)
            })
            .attr('cy', d=>{
                if(d.y == '-Infinity' || d.y == 'Infinity') {
                    return 50
                }
                return yAxis(d.y)
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
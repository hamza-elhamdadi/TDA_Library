/**
 * Linear Interpolation
 * @param {float} x1 
 * @param {float} x2 
 * @param {float} alpha 
 */
const lerp = 
    (x1, x2, alpha) => {

        if(alpha > 1 || alpha < 0)
            {
                console.error('alpha value in lerp not between 0 and 1')
                return NaN
            }

        let a = x1*(1-alpha),
            b = x2*alpha

        return a + b

    }

/**
 * calculates intersection point with top or bottom of SVG
 * @param {integer} f 
 * @param {array} data 
 * @param {function} xScale 
 * @param {function} yScale 
 * @param {integer} i 
 */
const simple_intersection = 
    (f, data, xScale, yScale, i) => {
        let numer = f - yScale(data[i-1].y),
            denom = yScale(data[i].y)-yScale(data[i-1].y)

        let alpha = numer/denom

        return {x:lerp(xScale(data[i-1].x), xScale(data[i].x), alpha), y:f}
    }

/**
 * check if path crosses f bounds
 * @param {array} data 
 * @param {function} yAxis 
 * @param {integer} i 
 * @param {integer} f 
 */
const crosses_bounds =
    (data, yScale, i, f) => {
        let check1 = yScale(data[i-1].y) > f && yScale(data[i].y) < f,
            check2 = yScale(data[i-1].y) < f && yScale(data[i].y) > f

        return check1 || check2
    }

/**
 * 2D line intersections
 * @param {object} p1 
 * @param {object} p2 
 * @param {object} p3 
 * @param {object} p4 
 */
const line_intersection = 
    (p1,p2,p3,p4) => {
        let ret = {}

        let denom = (p1.x-p2.x)*(p3.y - p4.y) - (p1.y-p2.y)*(p3.x-p4.x),
            first = p1.x*p2.y - p1.y*p2.x,
            second = p3.x*p4.y - p3.y*p4.x

        ret.x = (first*(p3.x - p4.x) - (p1.x-p2.x)*second) / denom
        ret.y = (first*(p3.y - p4.y) - (p1.y-p3.y)*second) / denom

        return ret
    }
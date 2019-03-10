
import { format } from 'd3-format'

const appendText = (
  area,
  choosenData,
  className,
  anchor,
  xValue,
  yValue,
  value,
  currency,
  formatting,
  textvalue
) => {
  area.selectAll('text')
        .data(choosenData)
        .enter()
        .append('text')
        .attr('class', className)
        .attr('text-anchor', anchor)
        .attr('x', xValue)
        .attr('y', yValue)
        .text(value === 'data' ? d => currency + format(formatting)(d[textvalue]) : textvalue)
},
appendArea = (
  area,
  className,
  left,
  top
) => {
  area.append('g')
    .attr('class', className)
    .attr('transform', `translate(${left}, ${top})`)
},
moveText = (
  area,
  className,
  position
) => {
  area.select(`.${className}`).attr('x', position)
}


export {appendText, appendArea, moveText}

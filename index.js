

  function stateNameFunc(nameData) {
    const stateName = nameData.reduce((accumulator, d) => {
        console.log(d.fips, d.state);
      accumulator[d.fips] = d.state;
      return accumulator;
    }, {});
    console.log(stateName); 
    return stateName;
  }
  
  const width = 1100;
  const height = 700;
  
  const choroplethMap = d3
    .select('body')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('class', 'choroplethMap');
  margin = {
    top: 60, right: 30, bottom: 0, left: 70,
  };
  const innerWidth = width - margin.right - margin.left;
  const subgroupForDrawing = choroplethMap
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  const pathGenerator = d3.geoPath();
  
  Promise.all([
    d3.json(
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
    ),
    d3.json(
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
    ),
  ]).then(([drawingData, nameData]) => {
    console.log('nameData length:', nameData.length); 
    console.log('nameData:', nameData); 
    const stateName = stateNameFunc(nameData);
    console.log('stateName:', stateName); 
  
    const states = topojson.feature(drawingData, drawingData.objects.states);
  
    const tooltipForData = d3
      .select('body')
      .append('div')
      //.attr('id', 'tooltip')
      .style('opacity', 0);

    subgroupForDrawing
      .selectAll('path')
      .data(states.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .style('fill', 'none')
      .style('stroke', 'black')
      .attr('data-fips', (d) => d.id)
      .attr('data-education', (d) => stateName[d.id])
      .style('fill', "yellow")
      .attr('class', 'stateName')
      .on('mouseover', function (event, d) {
        console.log(stateName[d.id]); 
        d3.select(this).style('fill', 'steelblue');
        tooltipForData.transition().style('opacity', 0.85);
        const stateData = stateName[d.id];
        if (stateData) { 
            const stateFullName = stateData.state || 'Unknown'; 
            tooltipForData
            .html(
                `${stateFullName}`,
            )
            .style('left', `${parseFloat(event.pageX) + 30}px`)
            .style('top', `${event.pageY - 30}px`);
        }
      })
      .on('mouseout', function () {
        tooltipForData.transition().style('opacity', 0);
        d3.select(this).style('fill', "green");
      });
    subgroupForDrawing
      .append('g')
      .selectAll('path')
      .data(states.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .style('fill', 'none')
      .attr('class', 'states');
    subgroupForDrawing
      .append('text')
      .text('United States Map')
      .attr('id', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -10);
    subgroupForDrawing
      .append('text')
      .text(
        "Made in D3.js",
      )
      .attr('id', 'description')
      .attr('x', innerWidth / 2)
      .attr('y', 20);
    
    const author = d3
      .select('svg')
      .append('g')
      .attr('transform', `translate(${60}, ${height - 200})`);
    author
      .append('text')
      .attr('class', 'nameAuthor')
      .text('Created by ')
      .append('a')
      .text('David Blanco');
  });
 
  
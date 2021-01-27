//--Where (url) to fetch the datasets from
const urlEdu = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const urlCounty = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
//--

//--datasets' variables
let countyData;
let eduData;
let colorData = ["20", "40", "60", "80", "100"]
//--

//--canva's dimensions
let width = 1200;
let height = 600;
let padding = 50;
//--

//--setting canvas and tooltip d3 selection
let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")

canvas.attr("width", width)
canvas.attr("height", height)
//--


//--the function that actually draws the map (canvas and tooltip) inside the body, when called on load.
let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', d => {
                let id = d.id;
                
                let countyid = eduData.find(d => {
                    return d.fips === id
                })
                                
                let percentage = countyid.bachelorsOrHigher;
                console.log(percentage)
                if (percentage <= 20){
                    return '#9999FF';
                }else if(percentage <= 40){
                    return '#6666FF'
                }else if(percentage <= 60){
                    return '#0000FF'
                }else if(percentage <= 80){
                    return '#000099'
                }else {
                    return '000066' 
                }
            })
            .attr('data-fips', d=> d.id)
            .attr('data-education', d=> {
                let id = d.id;
                
                let countyid = eduData.find(d => {
                    return d.fips === id
                })
                                
                return percentage = countyid.bachelorsOrHigher;
                
            })
            .on('mouseover', d=> {
                tooltip.transition()
                        .style('visibility', 'visible')
                
                let id=d.id;
                let countyid = eduData.find(d => {
                    return d.fips === id
                })

                tooltip.text(countyid.fips + "--state:" + countyid.state + "--Bachelors or Higher: " + countyid.bachelorsOrHigher + "%")
                tooltip.attr('data-education', countyid.bachelorsOrHigher)
            })
            .on('mouseout', d => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })

            let g = d3.select("#canvas")
                        .append('g')
                        .attr('class', 'key')
                        .attr('id', 'legend')
                        .attr('transform', 'translate(680,40)');

                   g.selectAll("rect")
                    .data(colorData)
                    .enter()
                    .append('rect')
                    .attr('height', 10)
                    .attr('width', 30)
                    .attr('x', d => d*1.5)
                    .attr('fill', d=>{
                        if(d==20){
                            return "#9999FF";
                        }else if(d==40){
                            return "#6666FF";
                        }else if(d==60){
                            return "#0000FF";
                        }else if(d==80){
                            return "#000099";
                        }else {
                            return "#000066"
                        }
                    })
                    
                    g.selectAll('text')
                        .data(colorData)
                        .enter()
                        .append('text')
                        .attr('class', 'caption')
                        .attr('x', d=> 21+(d*1.5))
                        .attr('y', -5)
                        .attr('fill', '#000')
                        .text(d=>d + "%")
                        .attr('font-size', 10)
                        

                    g.call(d3.axisBottom)
 

}
//--


//--I fetch the datasets and instruct what to execute on load.
const reqCounty = new XMLHttpRequest();
const reqEdu = new XMLHttpRequest();
reqCounty.open('GET', urlCounty, true);
reqEdu.open('GET', urlEdu, true);

reqCounty.onload = ()=> {
   
    let jsonCounty = JSON.parse(reqCounty.responseText)
    let jsonEdu = JSON.parse(reqEdu.responseText)
    
    countyData = topojson.feature(jsonCounty, jsonCounty.objects.counties).features
    eduData = jsonEdu
    
    drawMap()
        
};
reqCounty.send();
reqEdu.send();
//--
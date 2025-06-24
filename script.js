const baseUnit = 20;
const viewBoxWidth = 20 * baseUnit + 20;
const viewBoxHeight = 40 * baseUnit + 10;

const svg = d3.select("svg")
  .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .style("width", "130%")
  .style("height", "auto");

const unit = viewBoxWidth / 24; 

    const courtGroup = svg.append("g")
      .attr("transform", `translate(${unit * 1}, ${unit * 0.9})`);

    const colorScale = {
    kill: "#313B72",
    error: "#A31621",
    "dig/block": "#7CA982"
    };

    const courtLines = [
      { x1: 3, y1: 3, x2: 21, y2: 3, label: "Base" },
      { x1: 3, y1: 15, x2: 21, y2: 15, label: "10ft" },
      { x1: 3, y1: 21, x2: 21, y2: 21, label: "Net" },
      { x1: 3, y1: 27, x2: 21, y2: 27, label: "10ft" },
      { x1: 3, y1: 39, x2: 21, y2: 39, label: "End" },
      { x1: 3, y1: 3, x2: 3, y2: 39, label: "Left boundary" },
      { x1: 21, y1: 3, x2: 21, y2: 39, label: "Right boundary" }
    ];

    courtGroup.selectAll(".court-line")
        .data(courtLines)
        .enter()
        .append("line")
        .attr("class", "court-line")
        .attr("x1", d => d.x1 * unit)
        .attr("y1", d => d.y1 * unit)
        .attr("x2", d => d.x2 * unit)
        .attr("y2", d => d.y2 * unit)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    d3.csv("vb_hits.csv").then(data => {
      data.forEach(d => {
        d.ID = +d.ID;
        d.x = +d.x;
        d.y = +d.y;
        console.log("Parsed data:", data);
      });

    
    const origin = { x: 20, y: 19 };

    function animateHits(hits) {
        function shuffle(array) {
            for (let i =array.length -1; i > 0; i--) {
                const j =Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        
        function drawLoop() {
            shuffle(hits);
            const group = courtGroup.append("g").attr("class", "animation-round");

            courtGroup.append("circle")
              .attr("cx", origin.x * unit)
              .attr("cy", origin.y * unit)
              .attr("r", 6)
              .attr("fill", "black") // or any other color you want
              .attr("stroke-width", 1.5);

            hits.forEach((d, i) => {
                const line = group.append("line")
                  .attr("class", "hit-line")
                  .attr("x1", origin.x * unit)
                  .attr("y1", origin.y * unit)
                  .attr("x2", origin.x * unit)
                  .attr("y2", origin.y * unit)
                  .attr("stroke", colorScale[d.result] || "#999")
                  .attr("stroke-width", 3);
          
                const circle = group.append("circle")
                  .attr("class", "hit-circle")
                  .attr("cx", origin.x * unit)
                  .attr("cy", origin.y * unit)
                  .attr("r", 5)
                  .attr("fill", colorScale[d.result] || "#666")
                  .attr("stroke", "#FFFFFF")
                  .attr("stroke-width", 1);
          
                line.transition()
                  .delay(i * 800)
                  .duration(1000)
                  .attr("x2", d.x * unit)
                  .attr("y2", d.y * unit);
          
                circle.transition()
                  .delay(i * 800)
                  .duration(1000)
                  .attr("cx", d.x * unit)
                  .attr("cy", d.y * unit);
              });
          
              const totalDuration = (hits.length - 1) * 900 + 1000 + 100;
              setTimeout(() => {
                group.remove();   // clear all lines & circles from this round
                drawLoop();       // restart
              }, totalDuration);
            }
          
            drawLoop();
        }
        
            animateHits(data);

        });
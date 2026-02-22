interface lineGrapthModel {
    width:number
    height:number
    x:string
    y:string
    data:any[]
    verticals:number
    horizontals:number
    fontSize:number
}

export default function lineGrap(config:lineGrapthModel) {
    // Vertical grid lines
    /*/ Vertical lines every 5 minutes
    const fiveMin = 5 * 60 * 1000;
    const vLines = [];
    for (let t = start; t <= end; t += fiveMin) {
        vLines.push(((t - start) / (end - start)) * width);
    } */

    // Horizontal X grid lines
    for (let i:number = 0; i < config.height; i + config.height / (config.verticals + 1)) {
        // 
    }

    // Compute Y scaling
    const valuesY = config.data.map(d => d.value);
    const minY = Math.min(...valuesY);
    const maxY = Math.max(...valuesY);
    const rangeY = Math.floor(maxY - minY) + 2 || 1;

    // Compute X scaling
    const valuesX = config.data.map(d => d.value);
    const minX = Math.min(...valuesX);
    const maxX = Math.max(...valuesX);
    const rangeX = Math.floor(maxX - minX) || 1;

    const nameX = "time";
    const namey = "value";

    // Build data points and path
    let pathD = "";
    const points = config.data.map((d, i) => {
        const timestamp = new Date(d[nameX]).getTime();
        const x = ((timestamp - minX) / (maxX - minX)) * config.width;
        const y = config.height - ((d[namey] - minY) / rangeY) * config.height;

        if (i === 0) pathD += `M${x} ${y}`;
        else pathD += ` L${x} ${y}`;

        return { x, y };
    });

    return `
        <svg width="100%" height="100%" 
            viewbox="0 0 auto auto" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">

            <rect  width="${config.width}" height="${config.height}/">
        </svg>
    `;
};

/*
returns {
    grapth_width --> for graph vewbox
    graph_height --> for graph vewbox

    graph_line --> <path />
    graph_points --> [<circle />, ...]

    graph_verticals <g></g>
}
*/

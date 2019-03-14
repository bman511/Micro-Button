
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
 
  d3.json(`/metadata/${sample}`).then((metaInfo) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    metaData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaData.html("");
    let metaList = metaData.append("div");
    // Use `Object.entries` to add each key and value pair to the panel
    for(const [key,value] of Object.entries(metaInfo)){

      let metaItem = metaList.append("p");
      metaItem.text(key + ": " + value);
    }
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {

    // Use d3 to select the panel with id of `#bubble`
    metaData = d3.select("#bubble");
    // Use `.html("") to clear any existing metadata
    metaData.html("");
   
    let indexVals = sampleData.sample_values.map((item,index) => [item,index]);

    let topTen = indexVals.sort((a,b) => b[0] - a[0]).slice(0,10);
    
    let finalVals = topTen.map(x => x[0]);
  
    let finalIds = topTen.map(x => sampleData.otu_ids[x[1]]);
      
    let finalLabels = topTen.map(x => sampleData.otu_labels[x[1]]);
    
    let data = [{
      values: finalVals,
      labels: finalIds,
      type: 'pie',
      hovertext: finalLabels
    }];

    let layout = {

      title:'Top Ten Samples',
      height: 400,
      width: 600
    };

    Plotly.newPlot('pie',data,layout);

    let sortIDs = sampleData.otu_ids.map((item,index) => [item,index]).sort((a,b) => b[0] - a[0]);
    
    let IDsOnly = sortIDs.map(x => x[0]);

    let sortVals = sortIDs.map(id => sampleData.sample_values[id[1]]);

    let bubble = {
      x: IDsOnly,
      y: sortVals,
      mode: 'markers',
      marker: {
        size: sortVals,
        color: IDsOnly,
        colorscale: 'Viridis'
      },
      text: sortIDs.map(id => sampleData.otu_labels[id[1]])
    };
    
    let bubData = [bubble];
    
    let bubLayout = {
      title: 'Belly Micro Bubble',
      showlegend: false,
      height: 600,
      width: 1100
    };
    
    Plotly.newPlot('bubble', bubData, bubLayout);

  });
    // @TODO: Build a Bubble Chart using the sample data


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

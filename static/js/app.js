
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
 
  d3.json(`/metadata/${sample}`).then((metaInfo) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    metaData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaData.html("");
    let metaList = metaData.append("ul");
    // Use `Object.entries` to add each key and value pair to the panel
    for(const [key,value] of Object.entries(metaInfo)){

      let metaItem = metaList.append("li");
      metaItem.text(key + "-" + value);
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

      height: 400,
      width: 300
    }

    Plotly.newPlot('pie',data,layout);


  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
